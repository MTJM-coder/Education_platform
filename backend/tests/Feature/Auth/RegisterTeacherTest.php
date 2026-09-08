<?php

namespace Tests\Feature\Auth;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RegisterTeacherTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_register(): void
    {
        Storage::fake('public');

        $payload = [
            'first_name' => 'junior',
            'last_name'  => 'toto',
            'email'      => 'teacher@gmail.com',
            'phone'      => '650000000',
            'password'   => 'password',
            'password_confirmation' => 'password',
            'location'   => 'doualayassa',
            'bio'        => null,
            'section'    => 'english',
            'id_card'    => UploadedFile::fake()->create('id_card.pdf', 100, 'application/pdf'),
        ];

        $response = $this->post('/api/auth/register/teacher', $payload);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email'      => 'teacher@gmail.com',
            'first_name' => 'junior',
            'last_name'  => 'toto',
            'role'       => 'teacher',
        ]);

        $this->assertDatabaseHas('teachers', [
            'location'               => 'doualayassa',
            'bio'                    => null,
            'cv_url'                 => null,
            'validation_status'      => 'pending',
            'rank'                   => 'teacher',
            'rank_points'            => 0,
            'eligible_for_promotion' => false,
            'stars'                  => 0,
            'balance'                => 0,
        ]);

        $teacher = User::where('email', 'teacher@gmail.com')->first()->teacherProfile;
        $this->assertNotNull($teacher->id_card_url);
        $this->assertTrue(Storage::disk('public')->exists($teacher->id_card_url));
    }

    public function test_registration_fails_with_email_already_used(): void
    {
        Storage::fake('public');

        User::factory()->create([
            'email' => 'deja_utilise@gmail.com',
        ]);

        $payload = [
            'first_name' => 'junior',
            'last_name'  => 'toto',
            'email'      => 'deja_utilise@gmail.com',
            'phone'      => '650000000',
            'password'   => 'password',
            'password_confirmation' => 'password',
            'location'   => 'doualayassa',
            'section'    => 'english',
            'id_card'    => UploadedFile::fake()->create('id_card.pdf', 100, 'application/pdf'),
        ];

        $response = $this->post('/api/auth/register/teacher', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_teacher_registration_creates_declared_subjects(): void
    {
        Storage::fake('public');

        // On crée d'abord une vraie matière en base, grâce à la SubjectFactory
        $subject = Subject::factory()->create();

        $payload = [
            'first_name' => 'junior',
            'last_name'  => 'toto',
            'email'      => 'teacher.subjects@gmail.com',
            'phone'      => '650000001',
            'password'   => 'password',
            'password_confirmation' => 'password',
            'location'   => 'doualayassa',
            'section'    => 'french',
            'id_card'    => UploadedFile::fake()->create('id_card.pdf', 100, 'application/pdf'),

            // Tableau imbriqué : en multipart, on utilise la notation subjects[0][subject_id]
            'subjects'   => [
                ['subject_id' => $subject->id],
            ],
        ];

        $response = $this->post('/api/auth/register/teacher', $payload);

        $response->assertStatus(201);

        $teacher = User::where('email', 'teacher.subjects@gmail.com')->first()->teacherProfile;

        $this->assertDatabaseHas('teacher_subjects', [
            'teacher_id' => $teacher->user_id,
            'subject_id' => $subject->id,
            'validated'  => false, // pas encore validé par l'admin
        ]);
    }
}