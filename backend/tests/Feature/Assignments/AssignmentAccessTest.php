<?php

namespace Tests\Feature\Assignments;

use App\Models\Assignment;
use App\Models\ParentProfile;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class AssignmentAccessTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function createAssignment(): array
    {
        [$tutoringRequest, $learner, , $teacher] = $this->createEligibleScenario();

        $assignment = Assignment::create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'pending',
        ]);

        return [$assignment, $tutoringRequest, $learner, $teacher];
    }

    public function test_owner_can_view_the_assignment(): void
    {
        [$assignment, , $learner] = $this->createAssignment();
        $owner = $learner->parentProfile->user;

        $response = $this->actingAs($owner, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}");

        $response->assertStatus(200);
    }

    public function test_assigned_teacher_can_view_the_assignment(): void
    {
        [$assignment, , , $teacher] = $this->createAssignment();

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}");

        $response->assertStatus(200);
    }

    public function test_unrelated_user_cannot_view_the_assignment(): void
    {
        [$assignment] = $this->createAssignment();
        $stranger = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($stranger, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}");

        $response->assertStatus(403);
    }

    public function test_unrelated_teacher_cannot_view_the_assignment(): void
    {
        [$assignment] = $this->createAssignment();
        $otherTeacher = Teacher::factory()->approved()->create();

        $response = $this->actingAs($otherTeacher->user, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}");

        $response->assertStatus(403);
    }

    public function test_admin_can_view_any_assignment(): void
    {
        [$assignment] = $this->createAssignment();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}");

        $response->assertStatus(200);
    }

    public function test_owner_can_cancel_and_request_reopens(): void
    {
        [$assignment, $tutoringRequest, $learner] = $this->createAssignment();
        $tutoringRequest->update(['status' => 'matched']);
        $owner = $learner->parentProfile->user;

        $response = $this->actingAs($owner, 'sanctum')
            ->patchJson("/api/assignments/{$assignment->id}/cancel");

        $response->assertStatus(200);
        $this->assertDatabaseHas('assignments', ['id' => $assignment->id, 'status' => 'cancelled']);
        $this->assertDatabaseHas('tutoring_requests', ['id' => $tutoringRequest->id, 'status' => 'pending']);
    }

    public function test_assigned_teacher_can_cancel(): void
    {
        [$assignment, , , $teacher] = $this->createAssignment();

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->patchJson("/api/assignments/{$assignment->id}/cancel");

        $response->assertStatus(200);
    }

    public function test_unrelated_user_cannot_cancel(): void
    {
        [$assignment] = $this->createAssignment();
        $stranger = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($stranger, 'sanctum')
            ->patchJson("/api/assignments/{$assignment->id}/cancel");

        $response->assertStatus(403);
    }
}