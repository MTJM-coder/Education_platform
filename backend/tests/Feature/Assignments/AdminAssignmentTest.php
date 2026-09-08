<?php

namespace Tests\Feature\Assignments;

use App\Models\Assignment;
use App\Models\ParentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class AdminAssignmentTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function createPendingAssignment(): Assignment
    {
        [$tutoringRequest, , , $teacher] = $this->createEligibleScenario();
        $tutoringRequest->update(['status' => 'matched']);

        return Assignment::create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'pending',
        ]);
    }

    public function test_admin_can_approve_an_assignment(): void
    {
        $assignment = $this->createPendingAssignment();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/assignments/{$assignment->id}/validate", [
                'validated' => true,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('assignments', [
            'id'                  => $assignment->id,
            'status'              => 'active',
            'validated_by_admin'  => true,
        ]);
    }

    public function test_admin_rejecting_an_assignment_reopens_the_request(): void
    {
        $assignment = $this->createPendingAssignment();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/assignments/{$assignment->id}/validate", [
                'validated' => false,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('assignments', ['id' => $assignment->id, 'status' => 'cancelled']);
        $this->assertDatabaseHas('tutoring_requests', [
            'id'     => $assignment->request_id,
            'status' => 'pending',
        ]);
    }

    public function test_non_admin_cannot_validate_an_assignment(): void
    {
        $assignment = $this->createPendingAssignment();
        $parent = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($parent, 'sanctum')
            ->patchJson("/api/admin/assignments/{$assignment->id}/validate", [
                'validated' => true,
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_set_the_agreed_price(): void
    {
        $assignment = $this->createPendingAssignment();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/assignments/{$assignment->id}/price", [
                'agreed_price' => 15000,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('assignments', [
            'id'           => $assignment->id,
            'agreed_price' => 15000,
        ]);
    }

    public function test_non_admin_cannot_set_the_price(): void
    {
        $assignment = $this->createPendingAssignment();
        $parent = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($parent, 'sanctum')
            ->patchJson("/api/admin/assignments/{$assignment->id}/price", [
                'agreed_price' => 15000,
            ]);

        $response->assertStatus(403);
    }
}