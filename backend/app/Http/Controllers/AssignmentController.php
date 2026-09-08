<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tutoring\CreateAssignmentRequest;
use App\Models\Assignment;
use App\Models\Teacher;
use App\Models\TutoringRequest;
use App\Models\User;
use App\Services\TeacherMatchingService;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function __construct(private readonly TeacherMatchingService $matchingService)
    {
    }

    // POST /tutoring-requests/{tutoringRequest}/assignments
    // Autorisation : propriétaire de la demande (via CreateAssignmentRequest::authorize()) ou Admin.
    public function store(CreateAssignmentRequest $request, TutoringRequest $tutoringRequest)
    {
        if ($tutoringRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Cette demande a déjà été affectée ou annulée.',
            ], 422);
        }

        $teacherId = $request->validated()['teacher_id'];
        if (! $this->matchingService->isEligible($tutoringRequest, $teacherId)) {
            return response()->json([
                'message' => "Cet enseignant n'est pas éligible pour cette demande.",
            ], 422);
        }

        $assignment = Assignment::create([
            'request_id'          => $tutoringRequest->id,
            'teacher_id'          => $teacherId,
            'status'              => 'pending',
            'validated_by_admin'  => false,
        ]);

        $tutoringRequest->update(['status' => 'matched']);

        return response()->json($assignment, 201);
    }
    public function show(Request $request, Assignment $assignment)
    {
        $this->assertCanView($assignment, $request->user());

        return response()->json($assignment->load(['tutoringRequest.learner', 'teacher.user']));
    }

    // PATCH /admin/assignments/{assignment}/validate
    // Autorisation : Admin uniquement (déjà filtré par le middleware 'role' sur la route).
    public function validateAssignment(Request $request, Assignment $assignment)
    {
        $data = $request->validate([
            'validated' => ['required', 'boolean'],
        ]);

        $assignment->update([
            'validated_by_admin' => $data['validated'],
            'status'             => $data['validated'] ? 'active' : 'cancelled',
        ]);

        if (! $data['validated']) {
            // Affectation refusée par l'admin : la demande redevient disponible
            $assignment->tutoringRequest->update(['status' => 'pending']);
        }

        return response()->json($assignment->fresh());
    }

    public function setPrice(Request $request, Assignment $assignment)
    {
        $data = $request->validate([
            'agreed_price' => ['required', 'numeric', 'min:0'],
        ]);

        $assignment->update(['agreed_price' => $data['agreed_price']]);

        return response()->json($assignment->fresh());
    }


    public function cancel(Request $request, Assignment $assignment)
    {
        $this->assertCanView($assignment, $request->user());

        $assignment->update(['status' => 'cancelled']);
        $assignment->tutoringRequest->update(['status' => 'pending']);

        return response()->json($assignment->fresh());
    }

    // GET /teachers/{teacher}/assignments
    // Autorisation : l'enseignant concerné (lui-même) ou Admin.
    public function teacherAssignments(Request $request, Teacher $teacher)
    {
        $user = $request->user();

        if ($user->id !== $teacher->user_id && ! in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            abort(403, "Vous n'avez pas accès aux affectations de cet enseignant.");
        }

        return response()->json([
            'data' => $teacher->assignments()->with('tutoringRequest.learner')->get(),
        ]);
    }

    
    private function assertCanView(Assignment $assignment, User $user): void
    {
        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            return;
        }

        $isOwner = $assignment->tutoringRequest->learner->isOwnedBy($user);
        $isAssignedTeacher = $assignment->teacher_id === $user->id;

        if (! $isOwner && ! $isAssignedTeacher) {
            abort(403, "Vous n'avez pas accès à cette affectation.");
        }
    }
}
