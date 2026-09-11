<?php

namespace App\Http\Requests\Evaluation;

use Illuminate\Foundation\Http\FormRequest;

class AddQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // rôle déjà vérifié par le middleware 'role:super_admin,admin_staff'
    }

    public function rules(): array
    {
        return [
            'text'           => ['required', 'string'],
            'correct_answer' => ['nullable', 'string'],
        ];
    }
}