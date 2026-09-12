<?php

namespace Tests\Feature\LectureNotes;

use App\Models\LectureNote;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LectureNoteAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_index_only_returns_approved_notes(): void
    {
        $teacher = Teacher::factory()->approved()->create();

        LectureNote::create(['teacher_id' => $teacher->user_id, 'title' => 'Approuvée', 'file_url' => 'a.pdf', 'status' => 'approved']);
        LectureNote::create(['teacher_id' => $teacher->user_id, 'title' => 'En attente', 'file_url' => 'b.pdf', 'status' => 'pending']);
        LectureNote::create(['teacher_id' => $teacher->user_id, 'title' => 'Rejetée', 'file_url' => 'c.pdf', 'status' => 'rejected']);

        $response = $this->getJson('/api/lecture-notes');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('Approuvée', $data[0]['title']);
    }

    public function test_index_can_filter_by_subject(): void
    {
        $teacher = Teacher::factory()->approved()->create();
        $subjectA = Subject::factory()->create();
        $subjectB = Subject::factory()->create();

        LectureNote::create(['teacher_id' => $teacher->user_id, 'subject_id' => $subjectA->id, 'title' => 'A', 'file_url' => 'a.pdf', 'status' => 'approved']);
        LectureNote::create(['teacher_id' => $teacher->user_id, 'subject_id' => $subjectB->id, 'title' => 'B', 'file_url' => 'b.pdf', 'status' => 'approved']);

        $response = $this->getJson("/api/lecture-notes?subject_id={$subjectA->id}");

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('A', $response->json('data.0.title'));
    }

    public function test_teacher_can_view_all_their_own_notes_regardless_of_status(): void
    {
        $teacher = Teacher::factory()->approved()->create();
        $teacherUser = User::find($teacher->user_id);

        LectureNote::create(['teacher_id' => $teacher->user_id, 'title' => 'Approuvée', 'file_url' => 'a.pdf', 'status' => 'approved']);
        LectureNote::create(['teacher_id' => $teacher->user_id, 'title' => 'En attente', 'file_url' => 'b.pdf', 'status' => 'pending']);

        $response = $this->actingAs($teacherUser, 'sanctum')
            ->getJson("/api/teachers/{$teacher->user_id}/lecture-notes");

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_teacher_cannot_view_another_teachers_notes(): void
    {
        $teacherA = Teacher::factory()->approved()->create();
        $teacherB = Teacher::factory()->approved()->create();
        $teacherBUser = User::find($teacherB->user_id);

        LectureNote::create(['teacher_id' => $teacherA->user_id, 'title' => 'Privée', 'file_url' => 'a.pdf', 'status' => 'approved']);

        $response = $this->actingAs($teacherBUser, 'sanctum')
            ->getJson("/api/teachers/{$teacherA->user_id}/lecture-notes");

        $response->assertStatus(403);
    }

    public function test_admin_can_view_any_teachers_notes(): void
    {
        $teacher = Teacher::factory()->approved()->create();
        $admin = User::factory()->superAdmin()->create();

        LectureNote::create(['teacher_id' => $teacher->user_id, 'title' => 'Note', 'file_url' => 'a.pdf', 'status' => 'pending']);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/teachers/{$teacher->user_id}/lecture-notes");

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_admin_pending_lists_only_pending_notes(): void
    {
        $teacher = Teacher::factory()->approved()->create();
        $admin = User::factory()->superAdmin()->create();

        LectureNote::create(['teacher_id' => $teacher->user_id, 'title' => 'En attente', 'file_url' => 'a.pdf', 'status' => 'pending']);
        LectureNote::create(['teacher_id' => $teacher->user_id, 'title' => 'Approuvée', 'file_url' => 'b.pdf', 'status' => 'approved']);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/lecture-notes/pending');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('En attente', $response->json('data.0.title'));
    }

    public function test_non_admin_cannot_access_pending_list(): void
    {
        $teacherUser = User::factory()->teacher()->create();

        $response = $this->actingAs($teacherUser, 'sanctum')->getJson('/api/admin/lecture-notes/pending');

        $response->assertStatus(403);
    }
}