<?php

namespace Database\Factories;

use App\Models\Dispute;
use App\Models\Session;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DisputeFactory extends Factory
{
    protected $model = Dispute::class;

    public function definition(): array
    {
        return [
            'session_id' => Session::factory(),
            'raised_by'  => User::factory(),
            'reason'     => $this->faker->sentence(),
            'status'     => 'open',
        ];
    }
}