<?php

namespace Tests\Feature\Disputes;

use App\Models\Assignment;
use App\Models\Dispute;
use App\Models\Payment;
use App\Models\Session;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class DisputeBlocksPaymentReleaseTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    public function test_open_dispute_blocks_payment_release(): void
    {
        [$tutoringRequest, $learner, , $teacher] = $this->createEligibleScenario();

        $assignment = Assignment::create([
            'request_id'   => $tutoringRequest->id,
            'teacher_id'   => $teacher->user_id,
            'status'       => 'active',
            'agreed_price' => 20000,
        ]);

        $session = Session::create([
            'assignment_id' => $assignment->id,
            'session_date'  => now()->toDateString(),
            'start_time'    => '16:00',
            'end_time'      => '18:00',
            'status'        => 'disputed',
        ]);

        Dispute::create([
            'session_id' => $session->id,
            'raised_by'  => $learner->parentProfile->user->id,
            'reason'     => "L'enseignant ne s'est pas présenté.",
            'status'     => 'open',
        ]);

        $payment = Payment::create([
            'assignment_id' => $assignment->id,
            'amount'        => 20000,
            'currency'      => 'XAF',
            'method'        => 'mobile_money',
            'period'        => 'monthly',
            'status'        => 'paid',
            'escrow_status' => 'held',
        ]);

        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/payments/{$payment->id}/release");

        $response->assertStatus(422);
        $this->assertDatabaseHas('payments', ['id' => $payment->id, 'escrow_status' => 'held']);
    }

    public function test_resolved_dispute_no_longer_blocks_release(): void
    {
        [$tutoringRequest, $learner, , $teacher] = $this->createEligibleScenario();

        $assignment = Assignment::create([
            'request_id'   => $tutoringRequest->id,
            'teacher_id'   => $teacher->user_id,
            'status'       => 'active',
            'agreed_price' => 20000,
        ]);

        $session = Session::create([
            'assignment_id' => $assignment->id,
            'session_date'  => now()->toDateString(),
            'start_time'    => '16:00',
            'end_time'      => '18:00',
            'status'        => 'disputed',
        ]);

        Dispute::create([
            'session_id'  => $session->id,
            'raised_by'   => $learner->parentProfile->user->id,
            'reason'      => "L'enseignant ne s'est pas présenté.",
            'status'      => 'resolved', // déjà tranché
            'resolution'  => 'Retard justifié, séance validée.',
        ]);

        $payment = Payment::create([
            'assignment_id' => $assignment->id,
            'amount'        => 20000,
            'currency'      => 'XAF',
            'method'        => 'mobile_money',
            'period'        => 'monthly',
            'status'        => 'paid',
            'escrow_status' => 'held',
        ]);

        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/payments/{$payment->id}/release");

        $response->assertStatus(200);
        $this->assertDatabaseHas('payments', ['id' => $payment->id, 'escrow_status' => 'released']);
    }
}