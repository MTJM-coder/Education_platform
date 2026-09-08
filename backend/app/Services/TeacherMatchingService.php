<?php

namespace App\Services;

use App\Models\Teacher;
use App\Models\TutoringRequest;
use Illuminate\Database\Eloquent\Collection;

class TeacherMatchingService
{
    /**
     * Enseignants strictement éligibles pour cette demande : section, matière/classe
     * validées, profil approuvé. C'est la SEULE source de vérité pour "qui a le droit
     * d'être assigné à cette demande" — utilisée à la fois pour l'affichage (matches())
     * et pour la validation lors de la création d'une affectation (empêche de contourner
     * le matching en envoyant n'importe quel teacher_id).
     */
    public function eligibleTeachers(TutoringRequest $tutoringRequest): Collection
    {
        $learner = $tutoringRequest->learner;

        return Teacher::query()
            ->where('validation_status', 'approved')
            ->where(function ($query) use ($learner) {
                $query->where('section', $learner->section)
                    ->orWhere('section', 'bilingual');
            })
            ->whereHas('teacherSubjects', function ($query) use ($tutoringRequest, $learner) {
                $query->where('subject_id', $tutoringRequest->subject_id)
                    ->where('validated', true)
                    ->where(function ($q) use ($learner) {
                        $q->whereNull('class_id')
                            ->orWhere('class_id', $learner->class_id);
                    });
            })
            ->with('availabilities')
            ->get();
    }

    public function isEligible(TutoringRequest $tutoringRequest, string $teacherId): bool
    {
        return $this->eligibleTeachers($tutoringRequest)
            ->contains('user_id', $teacherId);
    }
}
