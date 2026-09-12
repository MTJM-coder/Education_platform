<?php

namespace App\Http\Requests\TeacherReview;

use App\Models\Assignment;
use Illuminate\Foundation\Http\FormRequest;

class CreateTeacherReviewRequest extends FormRequest
{
    
  
    
    public function authorize(): bool
    {
        /** @var Assignment $assignment */
        $assignment = $this->route('assignment');

        if (! $assignment) {
            return true; // le 404 sur le binding se déclenchera avant
        }

        return $assignment->tutoringRequest->learner->isOwnedBy($this->user());
    }

    public function rules(): array
    {
        return [
            'rating'  => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'rating.between' => 'La note doit être comprise entre 1 et 5.',
        ];
    }
}