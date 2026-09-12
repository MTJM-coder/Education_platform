<?php

namespace App\Http\Controllers;

use App\Http\Requests\LectureNote\CreateLectureNoteRequest;
use App\Http\Requests\LectureNote\ValidateLectureNoteRequest;
use App\Models\LectureNote;
use App\Models\Teacher;
use Illuminate\Http\Request;

class LectureNoteController extends Controller
{
    // POST /teachers/{teacher}/lecture-notes
    // Autorisation : l'enseignant lui-même, ou Admin (CreateLectureNoteRequest::authorize()).
    public function store(CreateLectureNoteRequest $request, Teacher $teacher)
    {
        $data = $request->validated();

        $note = LectureNote::create([
            'teacher_id' => $teacher->user_id,
            'subject_id' => $data['subject_id'] ?? null,
            'title'      => $data['title'],
            'file_url'   => $request->file('file')->store('lecture-notes', 'public'),
            'status'     => 'pending',
        ]);

        return response()->json($note, 201);
    }

    // GET /lecture-notes?subject_id=...
    // Public — uniquement les notes approuvées (visibles par élèves/parents/tous).
    public function index(Request $request)
    {
        $query = LectureNote::with('teacher.user', 'subject')
            ->where('status', 'approved');

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->query('subject_id'));
        }

        return response()->json(['data' => $query->latest('created_at')->get()]);
    }

    // GET /teachers/{teacher}/lecture-notes
    // Les propres notes d'un enseignant, tous statuts confondus.
    // Autorisation : l'enseignant lui-même, ou Admin.
    public function myNotes(Request $request, Teacher $teacher)
    {
        $user = $request->user();

        if ($user->id !== $teacher->user_id && ! in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            abort(403, "Vous n'avez pas accès aux notes de cet enseignant.");
        }

        return response()->json([
            'data' => $teacher->lectureNotes()->latest('created_at')->get(),
        ]);
    }

    // GET /admin/lecture-notes/pending
    // Autorisation : Admin uniquement (middleware 'role' sur la route).
    public function pending()
    {
        return response()->json([
            'data' => LectureNote::with('teacher.user', 'subject')
                ->where('status', 'pending')
                ->latest('created_at')
                ->get(),
        ]);
    }

    // PATCH /admin/lecture-notes/{lectureNote}/validate
    // Autorisation : Admin uniquement.
    public function validateNote(ValidateLectureNoteRequest $request, LectureNote $lectureNote)
    {
        $data = $request->validated();

        $lectureNote->update([
            'status'       => $data['status'],
            'validated_by' => $request->user()->id,
            'validated_at' => now(),
        ]);

        // TODO (module Notifications) : notifier l'enseignant, avec $data['reason'] si rejeté.

        return response()->json($lectureNote->fresh());
    }
}