<?php

namespace Tests\Feature\Disputes;

use App\Models\Assignment;
use App\Models\Dispute;
use App\Models\ParentProfile;
use App\Models\Session;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class CreateDisputeTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function createSession(): array
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

        return [$session, $learner, $teacher];
    }

    public function test_owner_can_open_a_dispute(): void
    {
        [$session, $learner] = $this->createSession();
        $owner = $learner->parentProfile->user;

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/sessions/{$session->id}/dispute", [
                'reason' => "L'enseignant ne s'est pas présenté.",
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('disputes', [
            'session_id' => $session->id,
            'raised_by'  => $owner->id,
            'reason'     => "L'enseignant ne s'est pas présenté.",
            'status'     => 'open',
        ]);
        $this->assertDatabaseHas('sessions', ['id' => $session->id, 'status' => 'disputed']);
    }

    public function test_assigned_teacher_can_open_a_dispute(): void
    {
        [$session, , $teacher] = $this->createSession();

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->postJson("/api/sessions/{$session->id}/dispute", [
                'reason' => "Le paiement n'est jamais arrivé.",
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('disputes', [
            'session_id' => $session->id,
            'raised_by'  => $teacher->user_id,
        ]);
    }

    public function test_unrelated_user_cannot_open_a_dispute(): void
    {
        [$session] = $this->createSession();
        $stranger = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($stranger, 'sanctum')
            ->postJson("/api/sessions/{$session->id}/dispute", [
                'reason' => 'Peu importe.',
            ]);

        $response->assertStatus(403);
    }

    public function test_unrelated_teacher_cannot_open_a_dispute(): void
    {
        [$session] = $this->createSession();
        $otherTeacher = Teacher::factory()->approved()->create();

        $response = $this->actingAs($otherTeacher->user, 'sanctum')
            ->postJson("/api/sessions/{$session->id}/dispute", [
                'reason' => 'Peu importe.',
            ]);

        $response->assertStatus(403);
    }

    public function test_cannot_open_a_second_dispute_on_the_same_session(): void
    {
        [$session, $learner] = $this->createSession();
        $owner = $learner->parentProfile->user;

        Dispute::create([
            'session_id' => $session->id,
            'raised_by'  => $owner->id,
            'reason'     => 'Premier litige.',
            'status'     => 'open',
        ]);

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/sessions/{$session->id}/dispute", [
                'reason' => 'Deuxième tentative.',
            ]);

        $response->assertStatus(422);
    }
}