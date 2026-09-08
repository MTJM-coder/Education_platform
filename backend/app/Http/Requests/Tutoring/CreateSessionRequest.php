<?php

namespace App\Http\Requests\Tutoring;

use App\Models\Assignment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Assignment $assignment */
        $assignment = $this->route('assignment');

        if (! $assignment) {
            return true; // route model binding échouera avant, laissera un 404
        }

        $user = $this->user();

        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            return true;
        }

        // Seul l'enseignant assigné peut planifier des séances — pas le parent,
        // et pas un autre enseignant.
        return $assignment->teacher_id === $user->id;
    }

    public function rules(): array
    {
        return [
            'mode' => ['required', Rule::in(['single', 'recurring'])],

            // mode une seule seance
            'session_date' => ['required_if:mode,single', 'date', 'after_or_equal:today'],

            // mode récurrent
            'day_of_week' => [
                'required_if:mode,recurring',
                Rule::in(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
            ],
            'until_date' => ['required_if:mode,recurring', 'date', 'after:today'],

            // champs communs aux deux modes
            'start_time' => ['required', 'date_format:H:i'],
            'end_time'   => ['required', 'date_format:H:i', 'after:start_time'],
            'location'   => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'session_date.required_if' => "La date de séance est requise en mode 'single'.",
            'day_of_week.required_if'  => "Le jour de la semaine est requis en mode 'recurring'.",
            'until_date.required_if'   => "La date de fin de récurrence est requise en mode 'recurring'.",
            'end_time.after'           => "L'heure de fin doit être après l'heure de début.",
        ];
    }
}