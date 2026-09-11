<?php

namespace App\Http\Requests\Evaluation;

use App\Models\AcademicEvaluation;
use App\Models\Assignment;
use Illuminate\Foundation\Http\FormRequest;

class CreateResultRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var AcademicEvaluation $evaluation */
        $evaluation = $this->route('evaluation');
        $learnerId = $this->input('learner_id');

        if (! $evaluation || ! $learnerId) {
            return true; // laisse la validation des champs le signaler
        }

        $user = $this->user();

        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            return true;
        }

        // Le teacher doit avoir une affectation active pour CE learner sur LA matière de l'évaluation.
        return Assignment::where('teacher_id', $user->id)
            ->where('status', 'active')
            ->whereHas('tutoringRequest', function ($query) use ($learnerId, $evaluation) {
                $query->where('learner_id', $learnerId)
                    ->where('subject_id', $evaluation->subject_id);
            })
            ->exists();
    }

    public function rules(): array
    {
        return [
            'learner_id'    => ['required', 'uuid', 'exists:learners,id'],
            'score'         => ['nullable', 'numeric', 'min:0', 'max:20'],
            'grade'         => ['nullable', 'string', 'max:10'],
            'term'          => ['nullable', 'string', 'max:50'],
            'academic_year' => ['nullable', 'string', 'max:20'],
            'comments'      => ['nullable', 'string', 'max:1000'],
        ];
    }
}