<?php

namespace Tests\Feature\LectureNotes;

use App\Models\LectureNote;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LectureNoteValidationTest extends TestCase
{
    use RefreshDatabase;

    private function createPendingNote(): LectureNote
    {
        $teacher = Teacher::factory()->approved()->create();

        return LectureNote::create([
            'teacher_id' => $teacher->user_id,
            'title'      => 'Chapitre en attente',
            'file_url'   => 'lecture-notes/fake.pdf',
            'status'     => 'pending',
        ]);
    }

    public function test_admin_can_approve_a_pending_note(): void
    {
        $note = $this->createPendingNote();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/lecture-notes/{$note->id}/validate", ['status' => 'approved']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('lecture_notes', [
            'id'           => $note->id,
            'status'       => 'approved',
            'validated_by' => $admin->id,
        ]);
    }

    public function test_admin_can_reject_a_note_with_a_reason(): void
    {
        $note = $this->createPendingNote();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/lecture-notes/{$note->id}/validate", [
                'status' => 'rejected',
                'reason' => 'Contenu hors-programme.',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('lecture_notes', [
            'id'     => $note->id,
            'status' => 'rejected',
        ]);
    }

    public function test_reason_is_required_when_rejecting(): void
    {
        $note = $this->createPendingNote();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/lecture-notes/{$note->id}/validate", ['status' => 'rejected']);

        $response->assertStatus(422)->assertJsonValidationErrors('reason');
    }

    public function test_reason_is_not_required_when_approving(): void
    {
        $note = $this->createPendingNote();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/lecture-notes/{$note->id}/validate", ['status' => 'approved']);

        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_validate_a_note(): void
    {
        $note = $this->createPendingNote();
        $teacherUser = User::find($note->teacher_id);

        $response = $this->actingAs($teacherUser, 'sanctum')
            ->patchJson("/api/admin/lecture-notes/{$note->id}/validate", ['status' => 'approved']);

        $response->assertStatus(403);
    }

    public function test_status_must_be_approved_or_rejected(): void
    {
        $note = $this->createPendingNote();
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/lecture-notes/{$note->id}/validate", ['status' => 'pending']);

        $response->assertStatus(422)->assertJsonValidationErrors('status');
    }
}