<?php

namespace Tests\Feature\Auth;

use App\Models\ClassRoom;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterStudentTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_student(): void
    {
 
        $classroom = ClassRoom::factory()->create();

        $payload = [
            'first_name' => 'jean',
            'last_name'  => 'paul',
            'email'      => 'jeanpaul@gmail.com',
            'phone'      => '654000000',
            'password'   => 'password',
            'password_confirmation' => 'password',

            // Champs obligatoires pour Student 
            'section'    => 'english',
            'level_id'   => $classroom->level_id,
            'class_id'   => $classroom->id,
        ];

        $response = $this->postJson('/api/auth/register/student', $payload);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email'      => 'jeanpaul@gmail.com',
            'first_name' => 'jean',
            'last_name'  => 'paul',
            'role'       => 'student',
        ]);

        // Colonnes réelles de la table "learners" 
        $user = User::where('email', 'jeanpaul@gmail.com')->first();

        $this->assertDatabaseHas('learners', [
            'type'      => 'self',
            'user_id'   => $user->id,
            'section'   => 'english',
            'level_id'  => $classroom->level_id,
            'class_id'  => $classroom->id,
            'school_name' => null,
            'location'    => null,
        ]);
    }
}