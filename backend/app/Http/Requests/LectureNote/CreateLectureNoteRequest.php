<?php

namespace App\Http\Requests\LectureNote;

use App\Models\Teacher;
use Illuminate\Foundation\Http\FormRequest;

class CreateLectureNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Teacher $teacher */
        $teacher = $this->route('teacher');

        if (! $teacher) {
            return true;
        }

        $user = $this->user();

        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            return true;
        }

        // Un enseignant ne peut soumettre une note que pour lui-même.
        return $teacher->user_id === $user->id;
    }

    public function rules(): array
    {
        return [
            'title'      => ['required', 'string', 'max:255'],
            'subject_id' => ['nullable', 'uuid', 'exists:subjects,id'],
            'file'       => ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx', 'max:10240'],
        ];
    }
}