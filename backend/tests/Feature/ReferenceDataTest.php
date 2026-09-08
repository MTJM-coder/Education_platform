<?php

namespace Tests\Feature\Admin;

use App\Models\Level;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReferenceDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_list_subjects(): void
    {
        Subject::factory()->count(3)->create();

        $response = $this->getJson('/api/subjects');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_admin_can_create_a_subject(): void
    {
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/admin/subjects', ['name' => 'Philosophy']);

        $response->assertStatus(201);
        $this->assertDatabaseHas('subjects', ['name' => 'Philosophy']);
    }

    public function test_creating_a_duplicate_subject_name_fails(): void
    {
        $admin = User::factory()->superAdmin()->create();
        Subject::factory()->create(['name' => 'Philosophy']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/admin/subjects', ['name' => 'Philosophy']);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    public function test_non_admin_cannot_create_a_subject(): void
    {
        $parent = User::factory()->parent()->create();

        $response = $this->actingAs($parent, 'sanctum')
            ->postJson('/api/admin/subjects', ['name' => 'Philosophy']);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_a_classroom_under_a_level(): void
    {
        $admin = User::factory()->superAdmin()->create();
        $level = Level::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/levels/{$level->id}/classes", ['name' => 'Class 6']);

        $response->assertStatus(201);
        $this->assertDatabaseHas('classrooms', [
            'name'     => 'Class 6',
            'level_id' => $level->id,
        ]);
    }

    public function test_anyone_can_list_classrooms_for_a_level(): void
    {
        $level = Level::factory()->create();
        \App\Models\ClassRoom::factory()->count(2)->create(['level_id' => $level->id]);

        $response = $this->getJson("/api/levels/{$level->id}/classes");

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    }
}