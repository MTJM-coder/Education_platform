<?php

namespace Tests\Feature\Tutoring;

use App\Models\User;
use App\Models\Learner;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherSubject;
use App\Models\TutoringRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TutoringMatchesTest extends TestCase
{
    use RefreshDatabase;

    private function makeRequestWithLearner(string $section, string $location = 'Bastos'): array
    {
        $subject = Subject::factory()->create();
        $learner = Learner::factory()->create(['section' => $section]);

        $tutoringRequest = TutoringRequest::factory()->create([
            'learner_id' => $learner->id,
            'subject_id' => $subject->id,
            'location'   => $location,
        ]);

        return [$tutoringRequest, $learner, $subject];
    }

    private function attachValidatedSubject(Teacher $teacher, Subject $subject, ?string $classId = null): void
    {
        TeacherSubject::create([
            'teacher_id' => $teacher->user_id,
            'subject_id' => $subject->id,
            'class_id'   => $classId,
            'validated'  => true,
        ]);
    }

    public function test_teacher_with_matching_section_and_subject_appears_in_results(): void
    {
        [$tutoringRequest, $learner, $subject] = $this->makeRequestWithLearner('english');

        $teacher = Teacher::factory()->approved()->create(['section' => 'english']);
        $this->attachValidatedSubject($teacher, $subject, $learner->class_id);

        $caller = User::factory()->superAdmin()->create();

        $response = $this->actingAs($caller, 'sanctum')
            ->getJson("/api/tutoring-requests/{$tutoringRequest->id}/matches");

        $response->assertStatus(200);
        $response->assertJsonFragment(['teacher_id' => $teacher->user_id]);
    }

    public function test_teacher_with_different_section_is_excluded(): void
    {
        [$tutoringRequest, $learner, $subject] = $this->makeRequestWithLearner('english');

        $teacher = Teacher::factory()->approved()->create(['section' => 'french']);
        $this->attachValidatedSubject($teacher, $subject, $learner->class_id);

        $caller = User::factory()->superAdmin()->create();

        $response = $this->actingAs($caller, 'sanctum')
            ->getJson("/api/tutoring-requests/{$tutoringRequest->id}/matches");

        $response->assertStatus(200);
        $response->assertJsonMissing(['teacher_id' => $teacher->user_id]);
    }

    public function test_bilingual_teacher_appears_regardless_of_requested_section(): void
    {
        [$tutoringRequest, $learner, $subject] = $this->makeRequestWithLearner('french');

        $teacher = Teacher::factory()->approved()->create(['section' => 'bilingual']);
        $this->attachValidatedSubject($teacher, $subject, $learner->class_id);

        $caller = User::factory()->superAdmin()->create();

        $response = $this->actingAs($caller, 'sanctum')
            ->getJson("/api/tutoring-requests/{$tutoringRequest->id}/matches");

        $response->assertStatus(200);
        $response->assertJsonFragment(['teacher_id' => $teacher->user_id]);
    }

    public function test_unapproved_teacher_is_excluded(): void
    {
        [$tutoringRequest, $learner, $subject] = $this->makeRequestWithLearner('english');

        // validation_status par défaut de la factory = 'pending', pas approved
        $teacher = Teacher::factory()->create(['section' => 'english']);
        $this->attachValidatedSubject($teacher, $subject, $learner->class_id);

        $caller = User::factory()->superAdmin()->create();

        $response = $this->actingAs($caller, 'sanctum')
            ->getJson("/api/tutoring-requests/{$tutoringRequest->id}/matches");

        $response->assertStatus(200);
        $response->assertJsonMissing(['teacher_id' => $teacher->user_id]);
    }

    public function test_teacher_with_unvalidated_subject_is_excluded(): void
    {
        [$tutoringRequest, $learner, $subject] = $this->makeRequestWithLearner('english');

        $teacher = Teacher::factory()->approved()->create(['section' => 'english']);
        TeacherSubject::create([
            'teacher_id' => $teacher->user_id,
            'subject_id' => $subject->id,
            'class_id'   => $learner->class_id,
            'validated'  => false, // pas encore validé
        ]);

        $caller = User::factory()->superAdmin()->create();

        $response = $this->actingAs($caller, 'sanctum')
            ->getJson("/api/tutoring-requests/{$tutoringRequest->id}/matches");

        $response->assertStatus(200);
        $response->assertJsonMissing(['teacher_id' => $teacher->user_id]);
    }

    public function test_teacher_with_matching_location_is_ranked_first(): void
    {
        [$tutoringRequest, $learner, $subject] = $this->makeRequestWithLearner('english', 'Bastos');

        $farTeacher = Teacher::factory()->approved()->create([
            'section'  => 'english',
            'location' => 'Douala',
        ]);
        $this->attachValidatedSubject($farTeacher, $subject, $learner->class_id);

        $nearTeacher = Teacher::factory()->approved()->create([
            'section'  => 'english',
            'location' => 'Bastos',
        ]);
        $this->attachValidatedSubject($nearTeacher, $subject, $learner->class_id);

        $caller = User::factory()->superAdmin()->create();

        $response = $this->actingAs($caller, 'sanctum')
            ->getJson("/api/tutoring-requests/{$tutoringRequest->id}/matches");

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertSame($nearTeacher->user_id, $data[0]['teacher_id']);
    }
}