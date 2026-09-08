<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class ValidateTeacherSubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Vérification métier "est-ce le HOD de cette matière" faite dans le contrôleur,
        // car elle dépend à la fois de l'utilisateur connecté ET du paramètre {subject} de la route.
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:approved,rejected'],
            'reason' => ['required_if:status,rejected', 'nullable', 'string', 'max:1000'],
        ];
    }
}