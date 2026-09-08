<?php

namespace Tests\Feature\Admin;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_approve_a_complete_teacher_profile(): void
    {
        $admin = User::factory()->superAdmin()->create();
        $teacher = Teacher::factory()->create(); // profil complet par défaut (voir factory)

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/teachers/{$teacher->user_id}/validate", [
                'status' => 'approved',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('teachers', [
            'user_id'           => $teacher->user_id,
            'validation_status' => 'approved',
        ]);
    }

    public function test_admin_cannot_approve_an_incomplete_teacher_profile(): void
    {
        $admin = User::factory()->superAdmin()->create();
        $teacher = Teacher::factory()->incomplete()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/teachers/{$teacher->user_id}/validate", [
                'status' => 'approved',
            ]);

        $response->assertStatus(422);
        $this->assertDatabaseHas('teachers', [
            'user_id'           => $teacher->user_id,
            'validation_status' => 'pending', // inchangé
        ]);
    }

    public function test_admin_can_reject_a_teacher_profile_with_a_reason(): void
    {
        $admin = User::factory()->superAdmin()->create();
        $teacher = Teacher::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/teachers/{$teacher->user_id}/validate", [
                'status' => 'rejected',
                'reason' => 'Diplôme illisible, merci de le renvoyer.',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('teachers', [
            'user_id'           => $teacher->user_id,
            'validation_status' => 'rejected',
        ]);
    }

    public function test_rejection_requires_a_reason(): void
    {
        $admin = User::factory()->superAdmin()->create();
        $teacher = Teacher::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/teachers/{$teacher->user_id}/validate", [
                'status' => 'rejected',
                // 'reason' volontairement omis
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['reason']);
    }

    public function test_non_admin_cannot_validate_a_teacher(): void
    {
        $parent = User::factory()->parent()->create();
        $teacher = Teacher::factory()->create();

        $response = $this->actingAs($parent, 'sanctum')
            ->patchJson("/api/admin/teachers/{$teacher->user_id}/validate", [
                'status' => 'approved',
            ]);

        $response->assertStatus(403);
    }
}