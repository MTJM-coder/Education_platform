<?php

namespace Database\Factories;

use App\Models\ClassRoom;
use App\Models\Learner;
use App\Models\ParentProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LearnerFactory extends Factory
{
    protected $model = Learner::class;

    public function definition(): array
    {
        // Par défaut : un enfant géré par un parent (cas le plus fréquent dans les tests)
        $classroom = ClassRoom::factory()->create();

        return [
            'type'        => 'child',
            'parent_id'   => ParentProfile::factory(),
            'user_id'     => null,
            'section'     => $this->faker->randomElement(['english', 'french']),
            'level_id'    => $classroom->level_id,
            'class_id'    => $classroom->id,
            'school_name' => $this->faker->company() . ' School',
            'location'    => $this->faker->city(),
        ];
    }

    // Élève auto-inscrit : a un compte User, pas de parent
    public function selfRegistered(): static
    {
        return $this->state(fn (array $attributes) => [
            'type'      => 'self',
            'parent_id' => null,
            'user_id'   => User::factory()->student(),
        ]);
    }
}
