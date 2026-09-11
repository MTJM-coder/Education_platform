<?php

namespace App\Http\Controllers;

use App\Http\Requests\Evaluation\CreateResultRequest;
use App\Models\AcademicEvaluation;
use App\Models\Learner;
use App\Models\Result;
use App\Models\User;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    // POST /evaluations/{evaluation}/results
    // Autorisation : l'enseignant assigné activement à ce learner sur cette matière, ou Admin
    // (CreateResultRequest::authorize()).
    public function store(CreateResultRequest $request, AcademicEvaluation $evaluation)
    {
        $data = $request->validated();

        $result = Result::create([
            'learner_id'    => $data['learner_id'],
            'evaluation_id' => $evaluation->id,
            'teacher_id'    => $request->user()->role === 'teacher' ? $request->user()->id : null,
            'score'         => $data['score'] ?? null,
            'grade'         => $data['grade'] ?? null,
            'term'          => $data['term'] ?? null,
            'academic_year' => $data['academic_year'] ?? null,
            'comments'      => $data['comments'] ?? null,
        ]);

        return response()->json($result, 201);
    }

    // GET /learners/{learner}/results
    // Autorisation : le learner lui-même, son parent, l'enseignant assigné, ou Admin.
    public function learnerResults(Request $request, Learner $learner)
    {
        $user = $request->user();

        $isOwner = $learner->isOwnedBy($user);
        $isAssignedTeacher = $user->role === 'teacher' && \App\Models\Assignment::where('teacher_id', $user->id)
            ->whereHas('tutoringRequest', fn ($q) => $q->where('learner_id', $learner->id))
            ->exists();

        if (! $isOwner && ! $isAssignedTeacher && ! in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            abort(403, "Vous n'avez pas accès aux résultats de cet élève.");
        }

        return response()->json([
            'data' => $learner->results()->with('evaluation')->latest('created_at')->get(),
        ]);
    }

    // GET /admin/evaluations/{evaluation}/results
    // Autorisation : Admin uniquement (vue d'ensemble de la classe/matière).
    public function evaluationResults(AcademicEvaluation $evaluation)
    {
        return response()->json([
            'data' => $evaluation->results()->with('learner')->get(),
        ]);
    }
}