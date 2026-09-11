<?php

namespace Database\Factories;

use App\Models\AcademicEvaluation;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AcademicEvaluationFactory extends Factory
{
    protected $model = AcademicEvaluation::class;

    public function definition(): array
    {
        return [
            'subject_id' => Subject::factory(),
            'title'      => $this->faker->sentence(3),
            'eval_date'  => $this->faker->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d'),
            'created_by' => User::factory()->superAdmin(),
        ];
    }
}