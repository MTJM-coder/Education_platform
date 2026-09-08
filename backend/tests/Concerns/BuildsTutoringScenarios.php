<?php

namespace Tests\Concerns;

use App\Models\Learner;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherSubject;
use App\Models\TutoringRequest;

trait BuildsTutoringScenarios
{
    /**
     * Construit une demande de tutorat avec un enseignant réellement éligible
     * (section, matière et classe validées, profil approuvé) — le scénario
     * "normal" de base pour la plupart des tests du module Assignment.
     */
    protected function createEligibleScenario(string $section = 'english'): array
    {
        $subject = Subject::factory()->create();
        $learner = Learner::factory()->create(['section' => $section]);

        $tutoringRequest = TutoringRequest::factory()->create([
            'learner_id' => $learner->id,
            'subject_id' => $subject->id,
        ]);

        $teacher = Teacher::factory()->approved()->create(['section' => $section]);

        TeacherSubject::create([
            'teacher_id' => $teacher->user_id,
            'subject_id' => $subject->id,
            'class_id'   => $learner->class_id,
            'validated'  => true,
        ]);

        return [$tutoringRequest, $learner, $subject, $teacher];
    }
}