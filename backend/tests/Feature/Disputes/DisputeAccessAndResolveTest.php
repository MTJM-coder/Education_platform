<?php

namespace Tests\Feature\Disputes;

use App\Models\Assignment;
use App\Models\Dispute;
use App\Models\ParentProfile;
use App\Models\Session;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class DisputeAccessAndResolveTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function createOpenDispute(): array
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
            'status'        => 'disputed',
        ]);

        $owner = $learner->parentProfile->user;

        $dispute = Dispute::create([
            'session_id' => $session->id,
            'raised_by'  => $owner->id,
            'reason'     => "L'enseignant ne s'est pas présenté.",
            'status'     => 'open',
        ]);

        return [$dispute, $owner, $teacher];
    }

    public function test_raiser_can_view_their_dispute(): void
    {
        [$dispute, $owner] = $this->createOpenDispute();

        $response = $this->actingAs($owner, 'sanctum')
            ->getJson("/api/disputes/{$dispute->id}");

        $response->assertStatus(200);
    }

    public function test_assigned_teacher_can_view_the_dispute(): void
    {
        [$dispute, , $teacher] = $this->createOpenDispute();

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->getJson("/api/disputes/{$dispute->id}");

        $response->assertStatus(200);
    }

    public function test_unrelated_user_cannot_view_the_dispute(): void
    {
        [$dispute] = $this->createOpenDispute();
        $stranger = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($stranger, 'sanctum')
            ->getJson("/api/disputes/{$dispute->id}");

        $response->assertStatus(403);
    }

    public function test_admin_can_view_any_dispute(): void
    {
        [$dispute] = $this->createOpenDispute();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/disputes/{$dispute->id}");

        $response->assertStatus(200);
    }

    public function test_admin_can_resolve_a_dispute(): void
    {
        [$dispute] = $this->createOpenDispute();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/disputes/{$dispute->id}/resolve", [
                'resolution' => "Absence confirmée, remboursement du parent décidé séparément.",
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('disputes', [
            'id'          => $dispute->id,
            'status'      => 'resolved',
            'resolved_by' => $admin->id,
        ]);
    }

    public function test_non_admin_cannot_resolve_a_dispute(): void
    {
        [$dispute, $owner] = $this->createOpenDispute();

        $response = $this->actingAs($owner, 'sanctum')
            ->patchJson("/api/admin/disputes/{$dispute->id}/resolve", [
                'resolution' => 'Peu importe.',
            ]);

        $response->assertStatus(403);
    }
}