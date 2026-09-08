<?php

namespace Tests\Feature\Admin;

use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherSubject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherSubjectValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_approve_a_declared_subject(): void
    {
        $admin = User::factory()->superAdmin()->create();
        $teacher = Teacher::factory()->create();
        $subject = Subject::factory()->create();

        $teacherSubject = TeacherSubject::create([
            'teacher_id' => $teacher->user_id,
            'subject_id' => $subject->id,
            'validated'  => false,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/teachers/{$teacher->user_id}/subjects/{$subject->id}/validate", [
                'status' => 'approved',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('teacher_subjects', [
            'id'           => $teacherSubject->id,
            'validated'    => true,
            'validated_by' => $admin->id,
        ]);
    }

    public function test_admin_can_reject_a_declared_subject(): void
    {
        $admin = User::factory()->superAdmin()->create();
        $teacher = Teacher::factory()->create();
        $subject = Subject::factory()->create();

        $teacherSubject = TeacherSubject::create([
            'teacher_id' => $teacher->user_id,
            'subject_id' => $subject->id,
            'validated'  => false,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/teachers/{$teacher->user_id}/subjects/{$subject->id}/validate", [
                'status' => 'rejected',
                'reason' => 'Matière non couverte par les diplômes fournis.',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('teacher_subjects', [
            'id'        => $teacherSubject->id,
            'validated' => false,
        ]);
    }

    public function test_non_admin_cannot_validate_a_subject(): void
    {
        $otherTeacher = User::factory()->teacher()->create();
        $teacher = Teacher::factory()->create();
        $subject = Subject::factory()->create();

        TeacherSubject::create([
            'teacher_id' => $teacher->user_id,
            'subject_id' => $subject->id,
            'validated'  => false,
        ]);

        $response = $this->actingAs($otherTeacher, 'sanctum')
            ->patchJson("/api/admin/teachers/{$teacher->user_id}/subjects/{$subject->id}/validate", [
                'status' => 'approved',
            ]);

        $response->assertStatus(403);
    }
}