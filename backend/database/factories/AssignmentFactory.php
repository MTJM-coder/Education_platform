<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\Teacher;
use App\Models\TutoringRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssignmentFactory extends Factory
{
    protected $model = Assignment::class;

    public function definition(): array
    {
        return [
            'request_id'         => TutoringRequest::factory(),
            'teacher_id'         => Teacher::factory()->approved(),
            'status'             => 'pending',
            'agreed_price'       => null,
            'validated_by_admin' => false,
        ];
    }
}