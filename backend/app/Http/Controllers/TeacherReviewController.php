<?php

namespace App\Http\Controllers;

use App\Http\Requests\TeacherReview\CreateTeacherReviewRequest;
use App\Models\Assignment;
use App\Models\TeacherReview;
use Illuminate\Http\Request;

class TeacherReviewController extends Controller
{
    // PUT /assignments/{assignment}/review
    // Autorisation : propriétaire du learner (CreateTeacherReviewRequest::authorize()).
    // Verrouillé : un seul avis possible par affectation, non modifiable ensuite.
    public function store(CreateTeacherReviewRequest $request, Assignment $assignment)
    {
        $hasCompletedSession = $assignment->sessions()
            ->where('status', 'completed')
            ->exists();

        if (! $hasCompletedSession) {
            return response()->json([
                'message' => "Vous devez avoir eu au moins un cours terminé avec cet enseignant avant de pouvoir le noter.",
            ], 422);
        }

        if (TeacherReview::where('assignment_id', $assignment->id)->exists()) {
            return response()->json([
                'message' => 'Un avis a déjà été laissé pour cette affectation et ne peut plus être modifié.',
            ], 422);
        }

        $data = $request->validated();

        $review = TeacherReview::create([
            'assignment_id' => $assignment->id,
            'teacher_id'    => $assignment->teacher_id,
            'rating'        => $data['rating'],
            'comment'       => $data['comment'] ?? null,
        ]);

        return response()->json($review, 201);
    }

    // GET /assignments/{assignment}/review
    // Autorisation : propriétaire du learner, enseignant assigné, ou Admin.
    public function show(Request $request, Assignment $assignment)
    {
        $this->assertCanView($assignment, $request->user());

        $review = TeacherReview::where('assignment_id', $assignment->id)->first();

        if (! $review) {
            return response()->json([
                'message' => 'Aucun avis pour cette affectation.',
            ], 404);
        }

        return response()->json($review);
    }

    // GET /me/reviews
    
    public function index(Request $request)
    {
        $user = $request->user();

        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            $query = TeacherReview::with('assignment.teacher', 'assignment.tutoringRequest.learner');

            if ($request->filled('teacher_id')) {
                $query->where('teacher_id', $request->query('teacher_id'));
            }

            return response()->json(['data' => $query->latest('created_at')->get()]);
        }

        if ($user->role === 'teacher') {
            $reviews = TeacherReview::where('teacher_id', $user->id)
                ->latest('created_at')
                ->get();

            return response()->json(['data' => $reviews]);
        }

        $reviews = TeacherReview::with('assignment.tutoringRequest.learner')
            ->get()
            ->filter(fn (TeacherReview $review) => $review->assignment->tutoringRequest->learner->isOwnedBy($user))
            ->values();

        return response()->json(['data' => $reviews]);
    }

    private function assertCanView(Assignment $assignment, $user): void
    {
        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            return;
        }

        $isAssignedTeacher = $assignment->teacher_id === $user->id;
        $isOwner = $assignment->tutoringRequest->learner->isOwnedBy($user);

        if (! $isAssignedTeacher && ! $isOwner) {
            abort(403, "Vous n'avez pas accès à cet avis.");
        }
    }
}