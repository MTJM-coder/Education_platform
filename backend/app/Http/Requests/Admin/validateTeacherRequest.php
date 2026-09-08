<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class ValidateTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Le rôle est déjà vérifié par le middleware 'role:super_admin,admin_staff'
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