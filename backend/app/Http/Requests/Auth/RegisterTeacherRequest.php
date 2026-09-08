<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route publique
    }

    public function rules(): array
    {
        return [
            // Compte
            'first_name'            => ['required', 'string', 'max:100'],
            'last_name'             => ['required', 'string', 'max:100'],
            'email'                 => ['required', 'email', 'unique:users,email'],
            'phone'                 => ['required', 'string', 'unique:users,phone'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
            'photo'                 => ['nullable', 'image', 'max:2048'],

            // Documents . Seule la pièce d'identité est obligatoire
            // à l'inscription : le reste peut être complété plus tard depuis le profil.
            'id_card'               => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:4096'],
            'cv'                    => ['nullable', 'file', 'mimes:pdf', 'max:4096'],
            'degrees'               => ['nullable', 'file', 'mimes:pdf', 'max:8192'],
            'location_plan'         => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:4096'],

            // Profil professionnel
            'bio'                   => ['nullable', 'string', 'max:2000'],
            'experience_years'      => ['nullable', 'numeric', 'min:0', 'max:60'],
            'teaching_radius_km'    => ['nullable', 'numeric', 'min:0'],
            'location'              => ['required', 'string', 'max:255'],
            'expected_rate'         => ['nullable', 'numeric', 'min:0'],
            'section'               => ['required', 'string', 'in:english,french,bilingual'],

            // Matières — facultatives à l'inscription, ajoutables ensuite via /teachers/{id}/subjects
            'subjects'                    => ['nullable', 'array'],
            'subjects.*.subject_id'       => ['required_with:subjects', 'uuid', 'exists:subjects,id'],
            'subjects.*.class_id'         => ['nullable', 'uuid', 'exists:classrooms,id'],

            // Disponibilités déclarées dès l'inscription
            'availability'                => ['nullable', 'array'],
            'availability.*.day_of_week'  => ['required_with:availability', 'string',
                                                'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'availability.*.start_time'   => ['required_with:availability', 'date_format:H:i'],
            'availability.*.end_time'     => ['required_with:availability', 'date_format:H:i', 'after:availability.*.start_time'],
        ];
    }
}
