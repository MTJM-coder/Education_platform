<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route publique
    }

    public function rules(): array
    {
        return [
            'first_name'    => ['required', 'string', 'max:100'],
            'last_name'     => ['required', 'string', 'max:100'],
            'email'         => ['nullable', 'email', 'unique:users,email'],
            'phone'         => ['required', 'string', 'unique:users,phone'],
            'password'      => ['required', 'string', 'min:8', 'confirmed'],
            'photo'         => ['nullable', 'image', 'max:2048'],

            'section'       => ['required', 'string', 'in:english,french'],
            'level_id'      => ['required', 'uuid', 'exists:levels,id'],
            'class_id'      => ['required', 'uuid', 'exists:classrooms,id'],
            'school_name'   => ['nullable', 'string', 'max:255'],
            'location'      => ['nullable', 'string', 'max:255'],
        ];
    }
}