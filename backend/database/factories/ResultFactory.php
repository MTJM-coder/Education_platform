<?php

namespace Database\Factories;

use App\Models\AcademicEvaluation;
use App\Models\Learner;
use App\Models\Result;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResultFactory extends Factory
{
    protected $model = Result::class;

    public function definition(): array
    {
        return [
            'learner_id'    => Learner::factory(),
            'evaluation_id' => AcademicEvaluation::factory(),
            'teacher_id'    => null,
            'score'         => $this->faker->randomFloat(2, 0, 20),
            'grade'         => $this->faker->randomElement(['A', 'B', 'C', 'D']),
            'term'          => 'Term 1',
            'academic_year' => '2025-2026',
        ];
    }
}