<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\ValidateTeacherRequest;
use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherValidationController extends Controller
{
    // GET /admin/teachers/pending
    public function pending()
    {
        $teachers = Teacher::with('user')
            ->where('validation_status', 'pending')
            ->get();

        return response()->json([
            'data' => $teachers->map(fn (Teacher $t) => [
                'user_id'          => $t->user_id,
                'name'             => $t->user->first_name . ' ' . $t->user->last_name,
                'location'         => $t->location,
                'profile_complete' => $t->isProfileComplete(),
            ]),
        ]);
    }

    // PATCH /admin/teachers/{teacher}/validate
    public function validateProfile(ValidateTeacherRequest $request, Teacher $teacher)
    {
        $data = $request->validated();

        if ($data['status'] === 'approved' && ! $teacher->isProfileComplete()) {
            return response()->json([
                'message' => 'Profil incomplet : CV, diplômes, bio et au moins une matière sont requis avant validation.',
            ], 422);
        }

        $teacher->update([
            'validation_status' => $data['status'],
        ]);

        //notifier l'enseignant du résultat, avec $data['reason'] si rejeté.

        return response()->json([
            'user_id'           => $teacher->user_id,
            'validation_status' => $teacher->validation_status,
        ]);
    }
}