<?php

namespace App\Http\Controllers;

use App\Http\Requests\Dispute\CreateDisputeRequest;
use App\Models\Dispute;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;

class DisputeController extends Controller
{
    // GET /me/disputes
    // Litiges dans lesquels l'utilisateur est impliqué (les a ouverts, ou concerné
    // en tant qu'enseignant assigné/propriétaire de la séance). L'Admin voit tout.
    public function index(Request $request)
    {
        $user = $request->user();

        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            $disputes = Dispute::with('session.assignment')->latest('created_at')->get();

            return response()->json(['data' => $disputes]);
        }

        $disputes = Dispute::with('session.assignment')
            ->where('raised_by', $user->id)
            ->orWhereHas('session.assignment', function ($query) use ($user) {
                $query->where('teacher_id', $user->id);
            })
            ->get()
            // Filtre supplémentaire côté application pour le cas "propriétaire du learner"
            // (relation trop indirecte pour whereHas simplement).
            ->filter(function (Dispute $dispute) use ($user) {
                $assignment = $dispute->session->assignment;

                return $dispute->raised_by === $user->id
                    || $assignment->teacher_id === $user->id
                    || $assignment->tutoringRequest->learner->isOwnedBy($user);
            })
            ->values();

        return response()->json(['data' => $disputes]);
    }

    // GET /disputes/{dispute}
    public function show(Request $request, Dispute $dispute)
    {
        $this->assertCanView($dispute, $request->user());

        return response()->json($dispute->load('session.assignment', 'raisedBy', 'resolvedBy'));
    }

    // POST /sessions/{session}/dispute
    // Autorisation : enseignant assigné, ou propriétaire (parent/learner) de la séance,
    // ou Admin (CreateDisputeRequest::authorize()).
    public function store(CreateDisputeRequest $request, Session $session)
    {
        if (Dispute::where('session_id', $session->id)->exists()) {
            return response()->json([
                'message' => 'Un litige existe déjà pour cette séance.',
            ], 422);
        }

        $dispute = Dispute::create([
            'session_id' => $session->id,
            'raised_by'  => $request->user()->id,
            'reason'     => $request->validated()['reason'],
            'status'     => 'open',
        ]);

        // La séance passe en "disputed" pour refléter l'état en cours.
        $session->update(['status' => 'disputed']);

        return response()->json($dispute, 201);
    }

    // PATCH /admin/disputes/{dispute}/resolve
    // Autorisation : Admin uniquement (middleware 'role' sur la route).
    // Ne déclenche PAS automatiquement release/refund du paiement — décision
    // volontairement séparée, l'Admin agit ensuite explicitement sur le paiement.
    public function resolve(Request $request, Dispute $dispute)
    {
        $data = $request->validate([
            'resolution' => ['required', 'string', 'max:1000'],
        ]);

        $dispute->update([
            'status'      => 'resolved',
            'resolution'  => $data['resolution'],
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        return response()->json($dispute->fresh());
    }

    /**
     * Règle d'accès partagée : celui qui a ouvert le litige, l'enseignant assigné,
     * le propriétaire (parent/learner) de la séance concernée, ou un Admin.
     */
    private function assertCanView(Dispute $dispute, User $user): void
    {
        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            return;
        }

        $assignment = $dispute->session->assignment;

        $isRaiser = $dispute->raised_by === $user->id;
        $isAssignedTeacher = $assignment->teacher_id === $user->id;
        $isOwner = $assignment->tutoringRequest->learner->isOwnedBy($user);

        if (! $isRaiser && ! $isAssignedTeacher && ! $isOwner) {
            abort(403, "Vous n'avez pas accès à ce litige.");
        }
    }
}