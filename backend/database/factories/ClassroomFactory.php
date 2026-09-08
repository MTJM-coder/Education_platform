<?php

namespace Database\Factories;

use App\Models\ClassRoom;
use App\Models\Level;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClassRoomFactory extends Factory
{
    protected $model = ClassRoom::class;

    public function definition(): array
    {
        return [
            'name' => 'Class ' . $this->faker->unique()->numberBetween(1, 13),

            // Si aucun level_id n'est fourni explicitement lors de l'appel de la factory,
            // Laravel en crée un nouveau automatiquement (Level::factory() imbriquée).
            'level_id' => Level::factory(),
        ];
    }
}