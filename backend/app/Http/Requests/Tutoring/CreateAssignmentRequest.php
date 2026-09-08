<?php

namespace App\Http\Requests\Tutoring;

use App\Models\TutoringRequest;
use Illuminate\Foundation\Http\FormRequest;

class CreateAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var TutoringRequest $tutoringRequest */
        $tutoringRequest = $this->route('tutoringRequest');

        if (! $tutoringRequest) {
            return true; // route model binding échouera avant, laissera un 404
        }

        $user = $this->user();

        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            return true;
        }

        // Seul le propriétaire de la demande (parent du learner, ou le learner
        // lui-même) peut sélectionner un enseignant — pas un tiers.
        return $tutoringRequest->learner->isOwnedBy($user);
    }

    public function rules(): array
    {
        return [
            'teacher_id' => ['required', 'uuid', 'exists:teachers,user_id'],
        ];
    }
}
