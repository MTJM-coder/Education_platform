<?php

namespace Tests\Feature\Payments;

use App\Models\Assignment;
use App\Models\ParentProfile;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class CreatePaymentTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function createPricedAssignment(?float $price = 20000): array
    {
        [$tutoringRequest, $learner, , $teacher] = $this->createEligibleScenario();

        $assignment = Assignment::create([
            'request_id'   => $tutoringRequest->id,
            'teacher_id'   => $teacher->user_id,
            'status'       => 'active',
            'agreed_price' => $price,
        ]);

        return [$assignment, $learner, $teacher];
    }

    public function test_owner_can_initiate_a_payment(): void
    {
        [$assignment, $learner] = $this->createPricedAssignment();
        $owner = $learner->parentProfile->user;

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/assignments/{$assignment->id}/payments", [
                'method' => 'mobile_money',
                'period' => 'monthly',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('payments', [
            'assignment_id' => $assignment->id,
            'amount'        => 20000,
            'status'        => 'pending',
            'escrow_status' => 'held',
        ]);
    }

    public function test_cannot_initiate_payment_without_an_agreed_price(): void
    {
        [$assignment, $learner] = $this->createPricedAssignment(null);
        $owner = $learner->parentProfile->user;

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/assignments/{$assignment->id}/payments", [
                'method' => 'mobile_money',
                'period' => 'monthly',
            ]);

        $response->assertStatus(422);
    }

    public function test_non_owner_cannot_initiate_a_payment(): void
    {
        [$assignment] = $this->createPricedAssignment();
        $stranger = ParentProfile::factory()->create()->user;

        $response = $this->actingAs($stranger, 'sanctum')
            ->postJson("/api/assignments/{$assignment->id}/payments", [
                'method' => 'mobile_money',
                'period' => 'monthly',
            ]);

        $response->assertStatus(403);
    }

    public function test_assigned_teacher_cannot_initiate_a_payment(): void
    {
        [$assignment, , $teacher] = $this->createPricedAssignment();

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->postJson("/api/assignments/{$assignment->id}/payments", [
                'method' => 'mobile_money',
                'period' => 'monthly',
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_initiate_a_payment_on_behalf_of_a_parent(): void
    {
        [$assignment] = $this->createPricedAssignment();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/assignments/{$assignment->id}/payments", [
                'method' => 'mobile_money',
                'period' => 'monthly',
            ]);

        $response->assertStatus(201);
    }
}