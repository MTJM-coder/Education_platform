<?php

namespace Database\Factories;

use App\Models\MonthlyAward;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

class MonthlyAwardFactory extends Factory
{
    protected $model = MonthlyAward::class;

    public function definition(): array
    {
        return [
            'award_type' => 'teacher_of_month',
            'month'      => now()->month,
            'year'       => now()->year,
            'score'      => $this->faker->randomFloat(2, 3, 5),
            'teacher_id' => Teacher::factory()->approved(),
            'learner_id' => null,
        ];
    }
}