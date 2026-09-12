<?php

namespace Tests\Feature\TeacherReviews;

use App\Models\Assignment;
use App\Models\Learner;
use App\Models\ParentProfile;
use App\Models\Session;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TutoringRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateTeacherReviewTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array{0: Assignment, 1: User, 2: User} [$assignment, $parentUser, $teacherUser]
     */
    private function buildScenario(bool $withCompletedSession = true): array
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

        if ($withCompletedSession) {
            Session::factory()->create([
                'assignment_id' => $assignment->id,
                'status'        => 'completed',
            ]);
        }

        return [$assignment, $parentUser, $teacherUser];
    }

    public function test_owner_can_create_a_review_after_a_completed_session(): void
    {
        [$assignment, $parentUser, $teacherUser] = $this->buildScenario();

        $response = $this->actingAs($parentUser, 'sanctum')
            ->putJson("/api/assignments/{$assignment->id}/review", [
                'rating'  => 5,
                'comment' => 'Excellent enseignant, très ponctuel.',
            ]);

        // 201 : le contrôleur verrouillé crée toujours une nouvelle ressource, jamais une mise à jour.
        $response->assertStatus(201);
        $this->assertDatabaseHas('teacher_reviews', [
            'assignment_id' => $assignment->id,
            'teacher_id'    => $teacherUser->id,
            'rating'        => 5,
            'comment'       => 'Excellent enseignant, très ponctuel.',
        ]);
        $this->assertDatabaseCount('teacher_reviews', 1);
    }

    public function test_second_attempt_is_rejected_once_a_review_already_exists(): void
    {
        [$assignment, $parentUser] = $this->buildScenario();

        $this->actingAs($parentUser, 'sanctum')
            ->putJson("/api/assignments/{$assignment->id}/review", ['rating' => 3, 'comment' => 'Correct.']);

        // Deuxième tentative : doit être bloquée, l'avis initial ne doit pas changer.
        $response = $this->actingAs($parentUser, 'sanctum')
            ->putJson("/api/assignments/{$assignment->id}/review", ['rating' => 5, 'comment' => 'En fait, très bien.']);

        $response->assertStatus(422);
        $this->assertDatabaseCount('teacher_reviews', 1);
        $this->assertDatabaseHas('teacher_reviews', [
            'assignment_id' => $assignment->id,
            'rating'        => 3, // inchangé
            'comment'       => 'Correct.',
        ]);
    }

    public function test_cannot_review_without_a_completed_session(): void
    {
        [$assignment, $parentUser] = $this->buildScenario(withCompletedSession: false);

        $response = $this->actingAs($parentUser, 'sanctum')
            ->putJson("/api/assignments/{$assignment->id}/review", ['rating' => 4]);

        $response->assertStatus(422);
        $this->assertDatabaseCount('teacher_reviews', 0);
    }

    public function test_a_scheduled_session_alone_is_not_enough(): void
    {
        [$assignment, $parentUser] = $this->buildScenario(withCompletedSession: false);

        Session::factory()->create([
            'assignment_id' => $assignment->id,
            'status'        => 'scheduled',
        ]);

        $response = $this->actingAs($parentUser, 'sanctum')
            ->putJson("/api/assignments/{$assignment->id}/review", ['rating' => 4]);

        $response->assertStatus(422);
        $this->assertDatabaseCount('teacher_reviews', 0);
    }

    public function test_unrelated_user_cannot_review(): void
    {
        [$assignment] = $this->buildScenario();

        $stranger = User::factory()->parent()->create();

        $response = $this->actingAs($stranger, 'sanctum')
            ->putJson("/api/assignments/{$assignment->id}/review", ['rating' => 4]);

        $response->assertStatus(403);
    }

    public function test_the_assigned_teacher_cannot_review_themselves(): void
    {
        [$assignment, , $teacherUser] = $this->buildScenario();

        $response = $this->actingAs($teacherUser, 'sanctum')
            ->putJson("/api/assignments/{$assignment->id}/review", ['rating' => 5]);

        $response->assertStatus(403);
    }

    public function test_admin_cannot_write_a_review(): void
    {
        [$assignment] = $this->buildScenario();

        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson("/api/assignments/{$assignment->id}/review", ['rating' => 5]);

        $response->assertStatus(403);
    }

    public function test_rating_is_required(): void
    {
        [$assignment, $parentUser] = $this->buildScenario();

        $response = $this->actingAs($parentUser, 'sanctum')
            ->putJson("/api/assignments/{$assignment->id}/review", ['comment' => 'Sans note.']);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('rating');
    }

    public function test_rating_must_be_between_1_and_5(): void
    {
        [$assignment, $parentUser] = $this->buildScenario();

        $response = $this->actingAs($parentUser, 'sanctum')
            ->putJson("/api/assignments/{$assignment->id}/review", ['rating' => 6]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('rating');
    }

    public function test_self_registered_student_can_review_their_own_teacher(): void
    {
        $studentUser = User::factory()->student()->create();

        $learner = Learner::factory()->create([
            'type'    => 'self',
            'user_id' => $studentUser->id,
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

        Session::factory()->create(['assignment_id' => $assignment->id, 'status' => 'completed']);

        $response = $this->actingAs($studentUser, 'sanctum')
            ->putJson("/api/assignments/{$assignment->id}/review", ['rating' => 4]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('teacher_reviews', ['assignment_id' => $assignment->id, 'rating' => 4]);
    }
}