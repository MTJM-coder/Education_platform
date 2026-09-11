<?php

namespace App\Http\Requests\Dispute;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateDisputeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var \App\Models\Session $session */
        $session = $this->route('session');
        if (!$session) {
            return false;
        }
        $user = $this->user();
        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {

            return true;
        }

        $assignment = $session->assignment;

        $isAssignedTeacher = $assignment->teacher_id === $user->id;
        $isOwner = $assignment->tutoringRequest->learner->isOwnedBy($user);
        return $isAssignedTeacher || $isOwner;
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:1000'],
        ];
    }
}
