<?php

namespace Tests\Feature\Tutoring;

use App\Models\Learner;
use App\Models\ParentProfile;
use App\Models\Subject;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateTutoringRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_parent_can_create_a_request_for_their_child(): void
    {
        $parent = ParentProfile::factory()->create();
        $learner = Learner::factory()->create(['parent_id' => $parent->user_id]);
        $subject = Subject::factory()->create();

        $response = $this->actingAs($parent->user, 'sanctum')
            ->postJson('/api/tutoring-requests', [
                'learner_id' => $learner->id,
                'subject_id' => $subject->id,
                'location'   => 'Bastos',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('tutoring_requests', [
            'learner_id' => $learner->id,
            'subject_id' => $subject->id,
            'status'     => 'pending',
        ]);
    }

    public function test_self_registered_student_can_create_a_request_for_themselves(): void
    {
        $learner = Learner::factory()->selfRegistered()->create();
        $subject = Subject::factory()->create();

        $response = $this->actingAs($learner->user, 'sanctum')
            ->postJson('/api/tutoring-requests', [
                'learner_id' => $learner->id,
                'subject_id' => $subject->id,
                'location'   => 'Akwa',
            ]);

        $response->assertStatus(201);
    }

    public function test_parent_cannot_create_a_request_for_a_child_that_is_not_theirs(): void
    {
        $parent = ParentProfile::factory()->create();
        $otherParent = ParentProfile::factory()->create();
        $someoneElsesChild = Learner::factory()->create(['parent_id' => $otherParent->user_id]);
        $subject = Subject::factory()->create();

        $response = $this->actingAs($parent->user, 'sanctum')
            ->postJson('/api/tutoring-requests', [
                'learner_id' => $someoneElsesChild->id,
                'subject_id' => $subject->id,
                'location'   => 'Bastos',
            ]);

        $response->assertStatus(403);
    }

    public function test_request_fails_with_invalid_subject(): void
    {
        $parent = ParentProfile::factory()->create();
        $learner = Learner::factory()->create(['parent_id' => $parent->user_id]);

        $response = $this->actingAs($parent->user, 'sanctum')
            ->postJson('/api/tutoring-requests', [
                'learner_id' => $learner->id,
                'subject_id' => '00000000-0000-0000-0000-000000000000', // n'existe pas
                'location'   => 'Bastos',
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['subject_id']);
    }
}
