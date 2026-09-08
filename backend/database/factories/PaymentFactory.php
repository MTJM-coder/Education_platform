<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'assignment_id' => Assignment::factory(),
            'amount'        => 20000,
            'currency'      => 'XAF',
            'method'        => 'mobile_money',
            'period'        => 'monthly',
            'status'        => 'pending',
            'escrow_status' => 'held',
        ];
    }
}