<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tutoring\CreateSessionRequest;
use App\Models\Assignment;
use App\Models\Session;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    // POST /assignments/{assignment}/sessions
    // Autorisation : l'enseignant assigné, ou Admin (CreateSessionRequest::authorize()).
    public function store(CreateSessionRequest $request, Assignment $assignment)
    {
        $data = $request->validated();

        if ($data['mode'] === 'single') {
            $session = Session::create([
                'assignment_id' => $assignment->id,
                'session_date'  => $data['session_date'],
                'start_time'    => $data['start_time'],
                'end_time'      => $data['end_time'],
                'location'      => $data['location'] ?? null,
                'status'        => 'scheduled',
            ]);

            return response()->json($session, 201);
        }

        // Mode récurrent : génère une séance par semaine, du prochain jour
        // correspondant jusqu'à until_date inclus.
        $sessions = [];
        $cursor = Carbon::now()->next($data['day_of_week']);
        $until = Carbon::parse($data['until_date'])->endOfDay();

        while ($cursor->lte($until)) {
            $sessions[] = Session::create([
                'assignment_id' => $assignment->id,
                'session_date'  => $cursor->toDateString(),
                'start_time'    => $data['start_time'],
                'end_time'      => $data['end_time'],
                'location'      => $data['location'] ?? null,
                'status'        => 'scheduled',
            ]);
            $cursor = $cursor->copy()->addWeek();
        }

        return response()->json(['data' => $sessions], 201);
    }

    // GET /assignments/{assignment}/sessions
    // Autorisation : propriétaire de la demande, enseignant assigné, ou Admin.
    public function index(Request $request, Assignment $assignment)
    {
        $this->assertCanAccess($assignment, $request->user());

        return response()->json([
            'data' => $assignment->sessions()->orderBy('session_date')->get(),
        ]);
    }

    // PATCH /sessions/{session}/confirm
    public function confirm(Request $request, Session $session)
    {
        $assignment = $session->assignment;
        $user = $request->user();

        $isTeacher = $assignment->teacher_id === $user->id;
        $isOwner = $assignment->tutoringRequest->learner->isOwnedBy($user);

        if (! $isTeacher && ! $isOwner && ! in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            abort(403, "Vous n'avez pas accès à cette séance.");
        }

        if ($isTeacher) {
            $session->confirmed_by_teacher_at = $session->confirmed_by_teacher_at ?? now();
        }
        if ($isOwner) {
            $session->confirmed_by_parent_at = $session->confirmed_by_parent_at ?? now();
        }

        // Double confirmation = complétion immédiate, sans attendre les 48h.
        if ($session->isConfirmedByBoth() && $session->status === 'scheduled') {
            $session->status = 'completed';
        }

        $session->save();

        return response()->json($session->fresh());
    }

    
    private function assertCanAccess(Assignment $assignment, User $user): void
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