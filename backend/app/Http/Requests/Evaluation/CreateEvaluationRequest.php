<?php

namespace App\Http\Requests\Evaluation;

use Illuminate\Foundation\Http\FormRequest;

class CreateEvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // rôle déjà vérifié par le middleware 'role:super_admin,admin_staff'
    }

    public function rules(): array
    {
        return [
            'title'     => ['required', 'string', 'max:255'],
            'eval_date' => ['nullable', 'date'],
        ];
    }
}