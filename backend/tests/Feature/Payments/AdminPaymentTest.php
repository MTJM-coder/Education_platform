<?php

namespace Tests\Feature\Payments;

use App\Models\Assignment;
use App\Models\ParentProfile;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class AdminPaymentTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function createPaidPayment(): Payment
    {
        [$tutoringRequest, , , $teacher] = $this->createEligibleScenario();

        $assignment = Assignment::create([
            'request_id'   => $tutoringRequest->id,
            'teacher_id'   => $teacher->user_id,
            'status'       => 'active',
            'agreed_price' => 20000,
        ]);

        return Payment::create([
            'assignment_id'     => $assignment->id,
            'amount'            => 20000,
            'currency'          => 'XAF',
            'method'            => 'mobile_money',
            'period'            => 'monthly',
            'status'            => 'paid',
            'commission_amount' => 2000,
            'teacher_amount'    => 18000,
            'escrow_status'     => 'held',
        ]);
    }

    public function test_admin_can_release_a_paid_payment(): void
    {
        $payment = $this->createPaidPayment();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/payments/{$payment->id}/release");

        $response->assertStatus(200);
        $this->assertDatabaseHas('payments', ['id' => $payment->id, 'escrow_status' => 'released']);
    }

    public function test_cannot_release_a_payment_not_yet_paid(): void
    {
        $payment = $this->createPaidPayment();
        $payment->update(['status' => 'pending']);
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/payments/{$payment->id}/release");

        $response->assertStatus(422);
    }

    public function test_non_admin_cannot_release_a_payment(): void
    {
        $payment = $this->createPaidPayment();
        $parent = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($parent, 'sanctum')
            ->patchJson("/api/admin/payments/{$payment->id}/release");

        $response->assertStatus(403);
    }

    public function test_admin_can_refund_a_payment(): void
    {
        $payment = $this->createPaidPayment();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/payments/{$payment->id}/refund");

        $response->assertStatus(200);
        $this->assertDatabaseHas('payments', [
            'id'            => $payment->id,
            'status'        => 'refunded',
            'escrow_status' => 'refunded',
        ]);
    }

    public function test_cannot_refund_an_already_released_payment(): void
    {
        $payment = $this->createPaidPayment();
        $payment->update(['escrow_status' => 'released']);
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/payments/{$payment->id}/refund");

        $response->assertStatus(422);
    }

    public function test_non_admin_cannot_refund_a_payment(): void
    {
        $payment = $this->createPaidPayment();
        $parent = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($parent, 'sanctum')
            ->patchJson("/api/admin/payments/{$payment->id}/refund");

        $response->assertStatus(403);
    }

    public function test_admin_can_get_commission_rate(): void
    {
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/settings/commission-rate');

        $response->assertStatus(200);
        $response->assertJsonStructure(['commission_rate']);
    }

    public function test_admin_can_set_commission_rate(): void
    {
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson('/api/admin/settings/commission-rate', ['commission_rate' => 15]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('settings', ['key' => 'commission_rate', 'value' => '15']);
    }

    public function test_non_admin_cannot_set_commission_rate(): void
    {
        $parent = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($parent, 'sanctum')
            ->patchJson('/api/admin/settings/commission-rate', ['commission_rate' => 15]);

        $response->assertStatus(403);
    }
}