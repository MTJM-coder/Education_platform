<?php

namespace Tests\Feature\LectureNotes;

use App\Models\LectureNote;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class CreateLectureNoteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_teacher_can_create_a_lecture_note_for_themselves(): void
    {
        $teacher = Teacher::factory()->approved()->create();
        $teacherUser = User::find($teacher->user_id);
        $subject = Subject::factory()->create();

        $response = $this->actingAs($teacherUser, 'sanctum')
            ->postJson("/api/teachers/{$teacher->user_id}/lecture-notes", [
                'title'      => 'Chapitre 3 - Les fractions',
                'subject_id' => $subject->id,
                'file'       => UploadedFile::fake()->create('cours.pdf', 500, 'application/pdf'),
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('lecture_notes', [
            'teacher_id' => $teacher->user_id,
            'subject_id' => $subject->id,
            'title'      => 'Chapitre 3 - Les fractions',
            'status'     => 'pending',
        ]);

        $note = LectureNote::first();
        $this->assertTrue(Storage::disk('public')->exists($note->file_url));
    }

    public function test_teacher_cannot_create_a_note_for_another_teacher(): void
    {
        $teacherA = Teacher::factory()->approved()->create();
        $teacherB = Teacher::factory()->approved()->create();
        $teacherBUser = User::find($teacherB->user_id);

        $response = $this->actingAs($teacherBUser, 'sanctum')
            ->postJson("/api/teachers/{$teacherA->user_id}/lecture-notes", [
                'title' => 'Note usurpée',
                'file'  => UploadedFile::fake()->create('cours.pdf', 200, 'application/pdf'),
            ]);

        $response->assertStatus(403);
        $this->assertDatabaseCount('lecture_notes', 0);
    }

    public function test_admin_can_create_a_note_on_behalf_of_a_teacher(): void
    {
        $teacher = Teacher::factory()->approved()->create();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/teachers/{$teacher->user_id}/lecture-notes", [
                'title' => 'Ajoutée par admin',
                'file'  => UploadedFile::fake()->create('cours.docx', 300),
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('lecture_notes', ['teacher_id' => $teacher->user_id]);
    }

    public function test_parent_cannot_create_a_lecture_note(): void
    {
        $teacher = Teacher::factory()->approved()->create();
        $parent = User::factory()->parent()->create();

        $response = $this->actingAs($parent, 'sanctum')
            ->postJson("/api/teachers/{$teacher->user_id}/lecture-notes", [
                'title' => 'Intrusion',
                'file'  => UploadedFile::fake()->create('cours.pdf', 200, 'application/pdf'),
            ]);

        $response->assertStatus(403);
    }

    public function test_title_is_required(): void
    {
        $teacher = Teacher::factory()->approved()->create();
        $teacherUser = User::find($teacher->user_id);

        $response = $this->actingAs($teacherUser, 'sanctum')
            ->postJson("/api/teachers/{$teacher->user_id}/lecture-notes", [
                'file' => UploadedFile::fake()->create('cours.pdf', 200, 'application/pdf'),
            ]);

        $response->assertStatus(422)->assertJsonValidationErrors('title');
    }

    public function test_file_is_required(): void
    {
        $teacher = Teacher::factory()->approved()->create();
        $teacherUser = User::find($teacher->user_id);

        $response = $this->actingAs($teacherUser, 'sanctum')
            ->postJson("/api/teachers/{$teacher->user_id}/lecture-notes", [
                'title' => 'Sans fichier',
            ]);

        $response->assertStatus(422)->assertJsonValidationErrors('file');
    }

    public function test_file_must_have_an_allowed_mime_type(): void
    {
        $teacher = Teacher::factory()->approved()->create();
        $teacherUser = User::find($teacher->user_id);

        $response = $this->actingAs($teacherUser, 'sanctum')
            ->postJson("/api/teachers/{$teacher->user_id}/lecture-notes", [
                'title' => 'Mauvais format',
                'file'  => UploadedFile::fake()->create('cours.exe', 200, 'application/octet-stream'),
            ]);

        $response->assertStatus(422)->assertJsonValidationErrors('file');
    }

    public function test_subject_id_must_exist_if_provided(): void
    {
        $teacher = Teacher::factory()->approved()->create();
        $teacherUser = User::find($teacher->user_id);

        $response = $this->actingAs($teacherUser, 'sanctum')
            ->postJson("/api/teachers/{$teacher->user_id}/lecture-notes", [
                'title'      => 'Matière inconnue',
                'subject_id' => (string) Str::uuid(),
                'file'       => UploadedFile::fake()->create('cours.pdf', 200, 'application/pdf'),
            ]);

        $response->assertStatus(422)->assertJsonValidationErrors('subject_id');
    }
}