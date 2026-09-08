<?php

namespace Tests\Feature\Assignments;

use App\Models\Assignment;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class TeacherAssignmentsListTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    public function test_teacher_can_list_their_own_assignments(): void
    {
        [$tutoringRequest, , , $teacher] = $this->createEligibleScenario();
        Assignment::create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'active',
        ]);

        $response = $this->actingAs($teacher->user, 'sanctum')
            ->getJson("/api/teachers/{$teacher->user_id}/assignments");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }

    public function test_teacher_cannot_list_another_teachers_assignments(): void
    {
        [$tutoringRequest, , , $teacher] = $this->createEligibleScenario();
        Assignment::create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'active',
        ]);

        $otherTeacher = Teacher::factory()->approved()->create();

        $response = $this->actingAs($otherTeacher->user, 'sanctum')
            ->getJson("/api/teachers/{$teacher->user_id}/assignments");

        $response->assertStatus(403);
    }

    public function test_admin_can_list_any_teachers_assignments(): void
    {
        [$tutoringRequest, , , $teacher] = $this->createEligibleScenario();
        Assignment::create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'active',
        ]);

        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/teachers/{$teacher->user_id}/assignments");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }
}