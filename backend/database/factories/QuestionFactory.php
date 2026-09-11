<?php

namespace Database\Factories;

use App\Models\AcademicEvaluation;
use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        return [
            'evaluation_id'  => AcademicEvaluation::factory(),
            'text'           => $this->faker->sentence() . ' ?',
            'correct_answer' => $this->faker->word(),
        ];
    }
}