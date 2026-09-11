<?php

namespace Tests\Feature\Evaluations;

use App\Models\AcademicEvaluation;
use App\Models\Assignment;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class AcademicEvaluationTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function createActiveAssignmentOnSubject(): array
    {
        [$tutoringRequest, $learner, $subject, $teacher] = $this->createEligibleScenario();

        $assignment = Assignment::create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'active',
        ]);

        return [$assignment, $subject, $teacher, $learner];
    }

    public function test_admin_can_create_an_evaluation(): void
    {
        $subject = Subject::factory()->create();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/subjects/{$subject->id}/evaluations", [
                'title'     => 'Contrôle de Mathématiques',
                'eval_date' => now()->addWeek()->toDateString(),
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('academic_evaluations', [
            'subject_id' => $subject->id,
            'title'      => 'Contrôle de Mathématiques',
            'created_by' => $admin->id,
        ]);
    }

    public function test_non_admin_cannot_create_an_evaluation(): void
    {
        $subject = Subject::factory()->create();
        $teacher = Teacher::factory()->approved()->create();

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->postJson("/api/admin/subjects/{$subject->id}/evaluations", [
                'title' => 'Contrôle',
            ]);

        $response->assertStatus(403);
    }

    public function test_assigned_teacher_can_view_the_evaluation(): void
    {
        [, $subject, $teacher] = $this->createActiveAssignmentOnSubject();
        $evaluation = AcademicEvaluation::factory()->create(['subject_id' => $subject->id]);

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->getJson("/api/evaluations/{$evaluation->id}");

        $response->assertStatus(200);
    }

    public function test_unrelated_teacher_cannot_view_the_evaluation(): void
    {
        $subject = Subject::factory()->create();
        $evaluation = AcademicEvaluation::factory()->create(['subject_id' => $subject->id]);
        $otherTeacher = Teacher::factory()->approved()->create();

        $response = $this->actingAs($otherTeacher->user, 'sanctum')
            ->getJson("/api/evaluations/{$evaluation->id}");

        $response->assertStatus(403);
    }

    public function test_admin_can_add_a_question(): void
    {
        $subject = Subject::factory()->create();
        $evaluation = AcademicEvaluation::factory()->create(['subject_id' => $subject->id]);
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/evaluations/{$evaluation->id}/questions", [
                'text'           => 'Combien font 2 + 2 ?',
                'correct_answer' => '4',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('questions', [
            'evaluation_id' => $evaluation->id,
            'text'          => 'Combien font 2 + 2 ?',
        ]);
    }

    public function test_non_admin_cannot_add_a_question(): void
    {
        [, $subject, $teacher] = $this->createActiveAssignmentOnSubject();
        $evaluation = AcademicEvaluation::factory()->create(['subject_id' => $subject->id]);

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->postJson("/api/admin/evaluations/{$evaluation->id}/questions", [
                'text' => 'Une question ?',
            ]);

        $response->assertStatus(403);
    }

    public function test_assigned_teacher_can_list_questions(): void
    {
        [, $subject, $teacher] = $this->createActiveAssignmentOnSubject();
        $evaluation = AcademicEvaluation::factory()->create(['subject_id' => $subject->id]);
        $evaluation->questions()->create(['text' => 'Question 1 ?']);

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->getJson("/api/evaluations/{$evaluation->id}/questions");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }
}