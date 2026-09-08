<?php

namespace Database\Factories;

use App\Models\Learner;
use App\Models\Subject;
use App\Models\TutoringRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class TutoringRequestFactory extends Factory
{
    protected $model = TutoringRequest::class;

    public function definition(): array
    {
        return [
            'learner_id' => Learner::factory(),
            'subject_id' => Subject::factory(),
            'location'   => $this->faker->city(),
            'status'     => 'pending',
        ];
    }
}
