<?php

namespace App\Http\Requests\Tutoring;

use App\Models\Learner;
use Illuminate\Foundation\Http\FormRequest;

class CreateTutoringRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        $learner = Learner::find($this->input('learner_id'));

        // Si le learner n'existe pas, on laisse la règle 'exists' du champ le signaler.
        if (! $learner) {
            return true;
        }

        $user = $this->user();

        // Learner auto-inscrit : seul lui-même peut faire la demande.
        if ($learner->type === 'self') {
            return $learner->user_id === $user->id;
        }

        // Enfant : seul le parent qui le gère peut faire la demande.
        return $learner->parent_id === $user->id;
    }

    public function rules(): array
    {
        return [
            'learner_id'            => ['required', 'uuid', 'exists:learners,id'],
            'subject_id'            => ['required', 'uuid', 'exists:subjects,id'],
            'location'              => ['required', 'string', 'max:255'],
            'preferred_day'         => ['nullable', 'string',
                'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'preferred_start_time'  => ['nullable', 'date_format:H:i', 'required_with:preferred_day'],
            'preferred_end_time'    => ['nullable', 'date_format:H:i', 'after:preferred_start_time',
                'required_with:preferred_day'],
        ];
    }
}
