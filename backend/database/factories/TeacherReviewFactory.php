<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\TeacherReview;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherReviewFactory extends Factory
{
    protected $model = TeacherReview::class;

    public function definition(): array
    {
        $assignment = Assignment::factory()->create();

        return [
            'teacher_id'    => $assignment->teacher_id,
            'assignment_id' => $assignment->id,
            'rating'        => $this->faker->numberBetween(1, 5),
            'comment'       => $this->faker->optional(0.7)->sentence(12),
        ];
    }

    /**
     * Attache l'avis à une affectation déjà existante plutôt que d'en créer une.
     * Usage : TeacherReview::factory()->forAssignment($assignment)->create();
     */
    public function forAssignment(Assignment $assignment): static
    {
        return $this->state(fn (array $attributes) => [
            'teacher_id'    => $assignment->teacher_id,
            'assignment_id' => $assignment->id,
        ]);
    }
}