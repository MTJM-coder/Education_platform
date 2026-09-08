<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterParentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route publique
    }

    public function rules(): array
    {
        return [
            'first_name'        => ['required', 'string', 'max:100'],
            'last_name'         => ['required', 'string', 'max:100'],
            'email'             => ['required', 'email', 'unique:users,email'],
            'phone'             => ['required', 'string', 'unique:users,phone'],
            'password'          => ['required', 'string', 'min:8', 'confirmed'],
            'photo'             => ['nullable', 'image', 'max:2048'],

            'address'           => ['nullable', 'string', 'max:255'],
            'id_card_photo'     => ['nullable', 'image', 'max:4096'],
        ];
    }
}