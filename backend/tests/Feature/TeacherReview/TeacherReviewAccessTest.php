<?php

namespace Tests\Feature\TeacherReviews;

use App\Models\Assignment;
use App\Models\Learner;
use App\Models\ParentProfile;
use App\Models\Session;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherReview;
use App\Models\TutoringRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherReviewAccessTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array{0: Assignment, 1: User, 2: User} [$assignment, $parentUser, $teacherUser]
     */
    private function buildReviewedScenario(): array
    {
        $parentProfile = ParentProfile::factory()->create();
        $parentUser = User::find($parentProfile->user_id);

        $learner = Learner::factory()->create([
            'type'      => 'child',
            'parent_id' => $parentProfile->user_id,
        ]);

        $subject = Subject::factory()->create();

        $tutoringRequest = TutoringRequest::factory()->create([
            'learner_id' => $learner->id,
            'subject_id' => $subject->id,
        ]);

        $teacher = Teacher::factory()->approved()->create();
        $teacherUser = User::find($teacher->user_id);

        $assignment = Assignment::factory()->create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'active',
        ]);

        Session::factory()->create(['assignment_id' => $assignment->id, 'status' => 'completed']);

        TeacherReview::create([
            'teacher_id'    => $teacher->user_id,
            'assignment_id' => $assignment->id,
            'rating'        => 4,
            'comment'       => 'Bonne pédagogie.',
        ]);

        return [$assignment, $parentUser, $teacherUser];
    }

    // ---------- show() ----------

    public function test_owner_can_view_the_review(): void
    {
        [$assignment, $parentUser] = $this->buildReviewedScenario();

        $response = $this->actingAs($parentUser, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}/review");

        $response->assertStatus(200)->assertJsonFragment(['rating' => 4]);
    }

    public function test_assigned_teacher_can_view_the_review(): void
    {
        [$assignment, , $teacherUser] = $this->buildReviewedScenario();

        $response = $this->actingAs($teacherUser, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}/review");

        $response->assertStatus(200)->assertJsonFragment(['rating' => 4]);
    }

    public function test_admin_can_view_the_review(): void
    {
        [$assignment] = $this->buildReviewedScenario();

        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}/review");

        $response->assertStatus(200);
    }

    public function test_unrelated_user_cannot_view_the_review(): void
    {
        [$assignment] = $this->buildReviewedScenario();

        $stranger = User::factory()->parent()->create();

        $response = $this->actingAs($stranger, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}/review");

        $response->assertStatus(403);
    }

    public function test_show_returns_404_when_no_review_exists_yet(): void
    {
        $parentProfile = ParentProfile::factory()->create();
        $parentUser = User::find($parentProfile->user_id);

        $learner = Learner::factory()->create([
            'type'      => 'child',
            'parent_id' => $parentProfile->user_id,
        ]);

        $subject = Subject::factory()->create();

        $tutoringRequest = TutoringRequest::factory()->create([
            'learner_id' => $learner->id,
            'subject_id' => $subject->id,
        ]);

        $teacher = Teacher::factory()->approved()->create();

        $assignment = Assignment::factory()->create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'active',
        ]);

        $response = $this->actingAs($parentUser, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}/review");

        $response->assertStatus(404);
    }

    // ---------- index() ----------

    public function test_teacher_sees_only_their_own_received_reviews(): void
    {
        [, , $teacherUser] = $this->buildReviewedScenario();
        // Un second scénario, avec un AUTRE enseignant, ne doit pas apparaître.
        $this->buildReviewedScenario();

        $response = $this->actingAs($teacherUser, 'sanctum')->getJson('/api/me/reviews');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals($teacherUser->id, $data[0]['teacher_id']);
    }

    public function test_parent_sees_only_the_reviews_they_wrote(): void
    {
        [, $parentUser] = $this->buildReviewedScenario();
        // Un second scénario, avec un AUTRE parent, ne doit pas apparaître.
        $this->buildReviewedScenario();

        $response = $this->actingAs($parentUser, 'sanctum')->getJson('/api/me/reviews');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_admin_sees_all_reviews_and_can_filter_by_teacher(): void
    {
        [, , $teacherUserA] = $this->buildReviewedScenario();
        $this->buildReviewedScenario();

        $admin = User::factory()->superAdmin()->create();

        $all = $this->actingAs($admin, 'sanctum')->getJson('/api/me/reviews');
        $all->assertStatus(200);
        $this->assertCount(2, $all->json('data'));

        $filtered = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/me/reviews?teacher_id={$teacherUserA->id}");
        $filtered->assertStatus(200);
        $this->assertCount(1, $filtered->json('data'));
        $this->assertEquals($teacherUserA->id, $filtered->json('data.0.teacher_id'));
    }
}