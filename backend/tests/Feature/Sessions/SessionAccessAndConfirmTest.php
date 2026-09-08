<?php

namespace Tests\Feature\Sessions;

use App\Models\Assignment;
use App\Models\ParentProfile;
use App\Models\Session;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class SessionAccessAndConfirmTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function createAssignmentWithSession(): array
    {
        [$tutoringRequest, $learner, , $teacher] = $this->createEligibleScenario();

        $assignment = Assignment::create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'active',
        ]);

        $session = Session::create([
            'assignment_id' => $assignment->id,
            'session_date'  => now()->toDateString(),
            'start_time'    => '16:00',
            'end_time'      => '18:00',
            'status'        => 'scheduled',
        ]);

        return [$assignment, $session, $learner, $teacher];
    }

    public function test_owner_can_list_sessions(): void
    {
        [$assignment, , $learner] = $this->createAssignmentWithSession();
        $owner = $learner->parentProfile->user;

        $response = $this->actingAs($owner, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}/sessions");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }

    public function test_unrelated_user_cannot_list_sessions(): void
    {
        [$assignment] = $this->createAssignmentWithSession();
        $stranger = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($stranger, 'sanctum')
            ->getJson("/api/assignments/{$assignment->id}/sessions");

        $response->assertStatus(403);
    }

    public function test_teacher_confirmation_alone_does_not_complete_the_session(): void
    {
        [, $session, , $teacher] = $this->createAssignmentWithSession();

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->patchJson("/api/sessions/{$session->id}/confirm");

        $response->assertStatus(200);
        $this->assertDatabaseHas('sessions', [
            'id'     => $session->id,
            'status' => 'scheduled', // toujours en attente de l'autre confirmation
        ]);
        $this->assertNotNull($session->fresh()->confirmed_by_teacher_at);
        $this->assertNull($session->fresh()->confirmed_by_parent_at);
    }

    public function test_both_confirmations_complete_the_session_immediately(): void
    {
        [, $session, $learner, $teacher] = $this->createAssignmentWithSession();
        $owner = $learner->parentProfile->user;

        $this->actingAs($teacher->user, 'sanctum')
            ->patchJson("/api/sessions/{$session->id}/confirm");

        $response = $this->actingAs($owner, 'sanctum')
            ->patchJson("/api/sessions/{$session->id}/confirm");

        $response->assertStatus(200);
        $this->assertDatabaseHas('sessions', [
            'id'     => $session->id,
            'status' => 'completed',
        ]);
    }

    public function test_unrelated_user_cannot_confirm_a_session(): void
    {
        [, $session] = $this->createAssignmentWithSession();
        $stranger = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($stranger, 'sanctum')
            ->patchJson("/api/sessions/{$session->id}/confirm");

        $response->assertStatus(403);
    }
}