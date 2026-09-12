<?php

namespace Tests\Feature\Awards;

use App\Models\Assignment;
use App\Models\Learner;
use App\Models\Result;
use App\Models\Teacher;
use App\Models\TeacherReview;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AwardComputationTest extends TestCase
{
    use RefreshDatabase;

    private function createReviewWithDate(Teacher $teacher, int $rating, Carbon $date): TeacherReview
    {
        $assignment = Assignment::factory()->create(['teacher_id' => $teacher->user_id]);

        $review = TeacherReview::create([
            'teacher_id'    => $teacher->user_id,
            'assignment_id' => $assignment->id,
            'rating'        => $rating,
        ]);

        DB::table('teacher_reviews')->where('id', $review->id)->update(['created_at' => $date]);

        return $review->fresh();
    }

    private function createResultWithDate(Learner $learner, float $score, Carbon $date): Result
    {
        $result = Result::create([
            'learner_id' => $learner->id,
            'score'      => $score,
        ]);

        DB::table('results')->where('id', $result->id)->update(['created_at' => $date]);

        return $result->fresh();
    }

    public function test_teacher_with_at_least_3_reviews_and_best_average_wins(): void
    {
        $september = Carbon::create(2026, 9, 15);

        $strongTeacher = Teacher::factory()->approved()->create();
        $this->createReviewWithDate($strongTeacher, 5, $september);
        $this->createReviewWithDate($strongTeacher, 5, $september);
        $this->createReviewWithDate($strongTeacher, 4, $september);

        // Un seul avis à 5/5 : ne doit PAS gagner malgré une moyenne parfaite (< 3 avis).
        $oneReviewTeacher = Teacher::factory()->approved()->create();
        $this->createReviewWithDate($oneReviewTeacher, 5, $september);

        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/admin/awards/compute', ['month' => 9, 'year' => 2026]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('monthly_awards', [
            'award_type' => 'teacher_of_month',
            'teacher_id' => $strongTeacher->user_id,
            'month'      => 9,
            'year'       => 2026,
        ]);
        $this->assertDatabaseMissing('monthly_awards', [
            'award_type' => 'teacher_of_month',
            'teacher_id' => $oneReviewTeacher->user_id,
        ]);
    }

    public function test_student_with_best_average_score_wins(): void
    {
        $september = Carbon::create(2026, 9, 10);

        $topLearner = Learner::factory()->create();
        $this->createResultWithDate($topLearner, 18, $september);
        $this->createResultWithDate($topLearner, 16, $september);

        $otherLearner = Learner::factory()->create();
        $this->createResultWithDate($otherLearner, 10, $september);

        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/admin/awards/compute', ['month' => 9, 'year' => 2026]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('monthly_awards', [
            'award_type' => 'student_of_month',
            'learner_id' => $topLearner->id,
            'score'      => 17, // moyenne de 18 et 16
        ]);
    }

    public function test_most_improved_learner_wins_progression_award(): void
    {
        $august = Carbon::create(2026, 8, 15);
        $september = Carbon::create(2026, 9, 15);

        // Grosse progression : 8 -> 16
        $improvedLearner = Learner::factory()->create();
        $this->createResultWithDate($improvedLearner, 8, $august);
        $this->createResultWithDate($improvedLearner, 16, $september);

        // Stable : 15 -> 15 (aucune progression, ne doit pas gagner)
        $stableLearner = Learner::factory()->create();
        $this->createResultWithDate($stableLearner, 15, $august);
        $this->createResultWithDate($stableLearner, 15, $september);

        // Aucune donnée en août : ne peut pas être calculé comme "progressif"
        $newLearner = Learner::factory()->create();
        $this->createResultWithDate($newLearner, 19, $september);

        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/admin/awards/compute', ['month' => 9, 'year' => 2026]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('monthly_awards', [
            'award_type' => 'most_progressive_student',
            'learner_id' => $improvedLearner->id,
            'score'      => 8, // delta 16 - 8
        ]);
    }

    public function test_recomputing_the_same_period_updates_instead_of_duplicating(): void
    {
        $september = Carbon::create(2026, 9, 15);
        $learner = Learner::factory()->create();
        $this->createResultWithDate($learner, 10, $september);

        $admin = User::factory()->superAdmin()->create();

        $this->actingAs($admin, 'sanctum')->postJson('/api/admin/awards/compute', ['month' => 9, 'year' => 2026]);

        // Nouveau résultat qui change la donne
        $this->createResultWithDate($learner, 20, $september);

        $this->actingAs($admin, 'sanctum')->postJson('/api/admin/awards/compute', ['month' => 9, 'year' => 2026]);

        $this->assertDatabaseCount('monthly_awards', 1); // pas de doublon, mis à jour
        $this->assertDatabaseHas('monthly_awards', [
            'award_type' => 'student_of_month',
            'score'      => 15, // moyenne de 10 et 20
        ]);
    }

    public function test_non_admin_cannot_trigger_computation(): void
    {
        $parent = \App\Models\ParentProfile::factory()->create()->user;

        $response = $this->actingAs($parent, 'sanctum')
            ->postJson('/api/admin/awards/compute', ['month' => 9, 'year' => 2026]);

        $response->assertStatus(403);
    }

    public function test_anyone_can_view_awards_for_a_period(): void
    {
        \App\Models\MonthlyAward::factory()->create(['month' => 9, 'year' => 2026]);

        $response = $this->getJson('/api/awards/monthly?month=9&year=2026');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }

    public function test_admin_can_set_the_prize(): void
    {
        $award = \App\Models\MonthlyAward::factory()->create();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/awards/{$award->id}/prize", [
                'prize_description' => 'Manuel scolaire + sac à dos',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('monthly_awards', [
            'id'                => $award->id,
            'prize_description' => 'Manuel scolaire + sac à dos',
        ]);
    }

    public function test_non_admin_cannot_set_the_prize(): void
    {
        $award = \App\Models\MonthlyAward::factory()->create();
        $parent = \App\Models\ParentProfile::factory()->create()->user;

        $response = $this->actingAs($parent, 'sanctum')
            ->patchJson("/api/admin/awards/{$award->id}/prize", [
                'prize_description' => 'Peu importe',
            ]);

        $response->assertStatus(403);
    }
}