<?php

namespace App\Http\Requests\LectureNote;

use Illuminate\Foundation\Http\FormRequest;

class ValidateLectureNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // rôle déjà vérifié par le middleware 'role:super_admin,admin_staff'
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:approved,rejected'],
            'reason' => ['required_if:status,rejected', 'nullable', 'string', 'max:1000'],
        ];
    }
}