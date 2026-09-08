<?php

namespace Tests\Feature\Sessions;

use App\Models\Assignment;
use App\Models\ParentProfile;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class CreateSessionTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function createAssignment(): array
    {
        [$tutoringRequest, $learner, , $teacher] = $this->createEligibleScenario();

        $assignment = Assignment::create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'active',
        ]);

        return [$assignment, $learner, $teacher];
    }

    public function test_assigned_teacher_can_create_a_single_session(): void
    {
        [$assignment, , $teacher] = $this->createAssignment();

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->postJson("/api/assignments/{$assignment->id}/sessions", [
                'mode'         => 'single',
                'session_date' => now()->addDays(3)->toDateString(),
                'start_time'   => '16:00',
                'end_time'     => '18:00',
                'location'     => 'Bastos',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('sessions', [
            'assignment_id' => $assignment->id,
            'status'        => 'scheduled',
        ]);
    }

    public function test_assigned_teacher_can_create_recurring_sessions(): void
    {
        [$assignment, , $teacher] = $this->createAssignment();

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->postJson("/api/assignments/{$assignment->id}/sessions", [
                'mode'        => 'recurring',
                'day_of_week' => now()->addDay()->format('l') === 'Monday' ? 'monday' : 'monday',
                'until_date'  => now()->addWeeks(3)->toDateString(),
                'start_time'  => '16:00',
                'end_time'    => '18:00',
            ]);

        $response->assertStatus(201);
        $count = $response->json('data');
        $this->assertGreaterThanOrEqual(1, count($count));

        foreach ($count as $session) {
            $this->assertDatabaseHas('sessions', ['id' => $session['id'], 'status' => 'scheduled']);
        }
    }

    public function test_non_assigned_teacher_cannot_create_sessions(): void
    {
        [$assignment] = $this->createAssignment();
        $otherTeacher = Teacher::factory()->approved()->create();

        $response = $this->actingAs($otherTeacher->user, 'sanctum')
            ->postJson("/api/assignments/{$assignment->id}/sessions", [
                'mode'         => 'single',
                'session_date' => now()->addDays(3)->toDateString(),
                'start_time'   => '16:00',
                'end_time'     => '18:00',
            ]);

        $response->assertStatus(403);
    }

    public function test_parent_cannot_create_sessions(): void
    {
        [$assignment, $learner] = $this->createAssignment();
        $owner = $learner->parentProfile->user;

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson("/api/assignments/{$assignment->id}/sessions", [
                'mode'         => 'single',
                'session_date' => now()->addDays(3)->toDateString(),
                'start_time'   => '16:00',
                'end_time'     => '18:00',
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_sessions_on_behalf_of_a_teacher(): void
    {
        [$assignment] = $this->createAssignment();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/assignments/{$assignment->id}/sessions", [
                'mode'         => 'single',
                'session_date' => now()->addDays(3)->toDateString(),
                'start_time'   => '16:00',
                'end_time'     => '18:00',
            ]);

        $response->assertStatus(201);
    }
}