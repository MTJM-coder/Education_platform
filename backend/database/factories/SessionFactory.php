<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\Session;
use Illuminate\Database\Eloquent\Factories\Factory;

class SessionFactory extends Factory
{
    protected $model = Session::class;

    public function definition(): array
    {
        return [
            'assignment_id' => Assignment::factory(),
            'session_date'  => $this->faker->dateTimeBetween('-1 week', '+1 week')->format('Y-m-d'),
            'start_time'    => '16:00',
            'end_time'      => '18:00',
            'location'      => $this->faker->city(),
            'status'        => 'scheduled',
        ];
    }
}