<?php

namespace Tests\Feature\Payments;

use App\Models\Assignment;
use App\Models\ParentProfile;
use App\Models\Payment;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class SimulatePaymentTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function createPendingPayment(float $amount = 20000): array
    {
        [$tutoringRequest, $learner, , $teacher] = $this->createEligibleScenario();

        $assignment = Assignment::create([
            'request_id'   => $tutoringRequest->id,
            'teacher_id'   => $teacher->user_id,
            'status'       => 'active',
            'agreed_price' => $amount,
        ]);

        $payment = Payment::create([
            'assignment_id' => $assignment->id,
            'amount'        => $amount,
            'currency'      => 'XAF',
            'method'        => 'mobile_money',
            'period'        => 'monthly',
            'status'        => 'pending',
            'escrow_status' => 'held',
        ]);

        return [$payment, $learner];
    }

    public function test_simulated_success_marks_paid_and_computes_commission(): void
    {
        Setting::set('commission_rate', 10);
        [$payment, $learner] = $this->createPendingPayment(20000);
        $owner = $learner->parentProfile->user;

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/payments/{$payment->id}/simulate", ['result' => 'success']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('payments', [
            'id'                => $payment->id,
            'status'            => 'paid',
            'commission_amount' => 2000,
            'teacher_amount'    => 18000,
        ]);
    }

    public function test_simulated_failure_marks_failed(): void
    {
        [$payment, $learner] = $this->createPendingPayment();
        $owner = $learner->parentProfile->user;

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/payments/{$payment->id}/simulate", ['result' => 'failure']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('payments', ['id' => $payment->id, 'status' => 'failed']);
    }

    public function test_cannot_simulate_an_already_processed_payment(): void
    {
        [$payment, $learner] = $this->createPendingPayment();
        $owner = $learner->parentProfile->user;

        $payment->update(['status' => 'paid']);

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/payments/{$payment->id}/simulate", ['result' => 'success']);

        $response->assertStatus(422);
    }

    public function test_unrelated_user_cannot_simulate_a_payment(): void
    {
        [$payment] = $this->createPendingPayment();
        $stranger = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($stranger, 'sanctum')
            ->postJson("/api/payments/{$payment->id}/simulate", ['result' => 'success']);

        $response->assertStatus(403);
    }
}