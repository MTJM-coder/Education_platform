<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\ValidateTeacherSubjectRequest;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherSubject;

class TeacherSubjectValidationController extends Controller
{
    // GET /admin/subjects/{subject}/pending-teachers
    // Liste des matières déclarées par des enseignants, en attente de validation par l'Admin
    public function pending(Subject $subject)
    {
        $pending = TeacherSubject::with('teacher.user')
            ->where('subject_id', $subject->id)
            ->where('validated', false)
            ->get();

        return response()->json(['data' => $pending]);
    }

    // PATCH /admin/teachers/{teacher}/subjects/{subject}/validate
    public function validateSubject(ValidateTeacherSubjectRequest $request, Teacher $teacher, Subject $subject)
    {
        $teacherSubject = TeacherSubject::where('teacher_id', $teacher->user_id)
            ->where('subject_id', $subject->id)
            ->firstOrFail();

        $data = $request->validated();

        /** @var \App\Models\User $adminUser */
        $adminUser = $request->user();

        $teacherSubject->update([
            'validated'    => $data['status'] === 'approved',
            'validated_by' => $adminUser->id,
            'validated_at' => now(),
        ]);

        //notifier l'enseignanr

        return response()->json($teacherSubject->fresh());
    }
}