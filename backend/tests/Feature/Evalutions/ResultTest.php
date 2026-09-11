<?php

namespace Tests\Feature\Evaluations;

use App\Models\AcademicEvaluation;
use App\Models\Assignment;
use App\Models\ParentProfile;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class ResultTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function createActiveAssignment(): array
    {
        [$tutoringRequest, $learner, $subject, $teacher] = $this->createEligibleScenario();

        $assignment = Assignment::create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'active',
        ]);

        $evaluation = AcademicEvaluation::factory()->create(['subject_id' => $subject->id]);

        return [$assignment, $learner, $teacher, $evaluation];
    }

    public function test_assigned_teacher_can_submit_a_result(): void
    {
        [, $learner, $teacher, $evaluation] = $this->createActiveAssignment();

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->postJson("/api/evaluations/{$evaluation->id}/results", [
                'learner_id' => $learner->id,
                'score'      => 15.5,
                'grade'      => 'B',
                'term'       => 'Term 1',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('results', [
            'learner_id'    => $learner->id,
            'evaluation_id' => $evaluation->id,
            'teacher_id'    => $teacher->user_id,
            'grade'         => 'B',
        ]);
    }

    public function test_unassigned_teacher_cannot_submit_a_result(): void
    {
        [, $learner, , $evaluation] = $this->createActiveAssignment();
        $otherTeacher = Teacher::factory()->approved()->create();

        $response = $this->actingAs($otherTeacher->user, 'sanctum')
            ->postJson("/api/evaluations/{$evaluation->id}/results", [
                'learner_id' => $learner->id,
                'score'      => 10,
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_submit_a_result(): void
    {
        [, $learner, , $evaluation] = $this->createActiveAssignment();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/evaluations/{$evaluation->id}/results", [
                'learner_id' => $learner->id,
                'score'      => 18,
            ]);

        $response->assertStatus(201);
    }

    public function test_owner_can_view_learners_results(): void
    {
        [, $learner, $teacher, $evaluation] = $this->createActiveAssignment();
        $owner = $learner->parentProfile->user;

        $this->actingAs($teacher->user, 'sanctum')
            ->postJson("/api/evaluations/{$evaluation->id}/results", [
                'learner_id' => $learner->id,
                'score'      => 14,
            ]);

        $response = $this->actingAs($owner, 'sanctum')
            ->getJson("/api/learners/{$learner->id}/results");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }

    public function test_assigned_teacher_can_view_learners_results(): void
    {
        [, $learner, $teacher, $evaluation] = $this->createActiveAssignment();

        $this->actingAs($teacher->user, 'sanctum')
            ->postJson("/api/evaluations/{$evaluation->id}/results", [
                'learner_id' => $learner->id,
                'score'      => 14,
            ]);

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->getJson("/api/learners/{$learner->id}/results");

        $response->assertStatus(200);
    }

    public function test_unrelated_user_cannot_view_learners_results(): void
    {
        [, $learner] = $this->createActiveAssignment();
        $stranger = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($stranger, 'sanctum')
            ->getJson("/api/learners/{$learner->id}/results");

        $response->assertStatus(403);
    }

    public function test_admin_can_view_evaluation_results_overview(): void
    {
        [, $learner, $teacher, $evaluation] = $this->createActiveAssignment();

        $this->actingAs($teacher->user, 'sanctum')
            ->postJson("/api/evaluations/{$evaluation->id}/results", [
                'learner_id' => $learner->id,
                'score'      => 12,
            ]);

        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/admin/evaluations/{$evaluation->id}/results");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }

    public function test_non_admin_cannot_access_evaluation_results_overview(): void
    {
        [, , $teacher, $evaluation] = $this->createActiveAssignment();

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->getJson("/api/admin/evaluations/{$evaluation->id}/results");

        $response->assertStatus(403);
    }
}