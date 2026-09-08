<?php

namespace Tests\Feature\Assignments;

use App\Models\ParentProfile;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class CreateAssignmentTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    public function test_owner_can_create_an_assignment_with_an_eligible_teacher(): void
    {
        [$tutoringRequest, $learner, $subject, $teacher] = $this->createEligibleScenario();
        $owner = $learner->parentProfile->user;

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/tutoring-requests/{$tutoringRequest->id}/assignments", [
                'teacher_id' => $teacher->user_id,
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('assignments', [
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'pending',
        ]);
        $this->assertDatabaseHas('tutoring_requests', [
            'id'     => $tutoringRequest->id,
            'status' => 'matched',
        ]);
    }

    public function test_non_owner_cannot_create_an_assignment(): void
    {
        [$tutoringRequest, , , $teacher] = $this->createEligibleScenario();
        $stranger = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($stranger, 'sanctum')
            ->postJson("/api/tutoring-requests/{$tutoringRequest->id}/assignments", [
                'teacher_id' => $teacher->user_id,
            ]);

        $response->assertStatus(403);
    }

    public function test_ineligible_teacher_is_rejected(): void
    {
        [$tutoringRequest, $learner] = $this->createEligibleScenario('english');
        $owner = $learner->parentProfile->user;

        // Un enseignant qui existe, mais qui n'est éligible pour RIEN sur cette demande
        // (mauvaise section, aucune matière validée en commun).
        $ineligibleTeacher = Teacher::factory()->approved()->create(['section' => 'french']);

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/tutoring-requests/{$tutoringRequest->id}/assignments", [
                'teacher_id' => $ineligibleTeacher->user_id,
            ]);

        $response->assertStatus(422);
    }

    public function test_cannot_create_assignment_for_a_request_already_matched(): void
    {
        [$tutoringRequest, $learner, , $teacher] = $this->createEligibleScenario();
        $owner = $learner->parentProfile->user;

        $tutoringRequest->update(['status' => 'matched']);

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/tutoring-requests/{$tutoringRequest->id}/assignments", [
                'teacher_id' => $teacher->user_id,
            ]);

        $response->assertStatus(422);
    }

    public function test_admin_can_create_an_assignment_on_behalf_of_a_parent(): void
    {
        [$tutoringRequest, , , $teacher] = $this->createEligibleScenario();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/tutoring-requests/{$tutoringRequest->id}/assignments", [
                'teacher_id' => $teacher->user_id,
            ]);

        $response->assertStatus(201);
    }
}