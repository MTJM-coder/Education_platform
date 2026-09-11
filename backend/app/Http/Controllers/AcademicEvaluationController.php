<?php

namespace App\Http\Controllers;

use App\Http\Requests\Evaluation\AddQuestionRequest;
use App\Http\Requests\Evaluation\CreateEvaluationRequest;
use App\Models\AcademicEvaluation;
use App\Models\Assignment;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;

class AcademicEvaluationController extends Controller
{
    // POST /admin/subjects/{subject}/evaluations
    // Autorisation : Admin uniquement (middleware 'role' sur la route).
    public function store(CreateEvaluationRequest $request, Subject $subject)
    {
        $evaluation = AcademicEvaluation::create([
            'subject_id' => $subject->id,
            'title'      => $request->validated()['title'],
            'eval_date'  => $request->validated()['eval_date'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($evaluation, 201);
    }

    // GET /evaluations/{evaluation}
    // Autorisation : Admin, ou tout enseignant ayant une affectation active sur cette matière.
    public function show(Request $request, AcademicEvaluation $evaluation)
    {
        $this->assertCanAccess($evaluation, $request->user());

        return response()->json($evaluation->load('subject', 'questions'));
    }

    // POST /admin/evaluations/{evaluation}/questions
    // Autorisation : Admin uniquement.
    public function addQuestion(AddQuestionRequest $request, AcademicEvaluation $evaluation)
    {
        $question = $evaluation->questions()->create($request->validated());

        return response()->json($question, 201);
    }

    // GET /evaluations/{evaluation}/questions
    public function listQuestions(Request $request, AcademicEvaluation $evaluation)
    {
        $this->assertCanAccess($evaluation, $request->user());

        return response()->json(['data' => $evaluation->questions]);
    }

    /**
     * Admin, ou enseignant ayant une affectation active sur la matière de l'évaluation
     * (peu importe le learner précis — l'accès est au niveau de la matière ici).
     */
    private function assertCanAccess(AcademicEvaluation $evaluation, User $user): void
    {
        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            return;
        }

        $hasActiveAssignmentOnSubject = Assignment::where('teacher_id', $user->id)
            ->where('status', 'active')
            ->whereHas('tutoringRequest', function ($query) use ($evaluation) {
                $query->where('subject_id', $evaluation->subject_id);
            })
            ->exists();

        if (! $hasActiveAssignmentOnSubject) {
            abort(403, "Vous n'avez pas accès à cette évaluation.");
        }
    }
}