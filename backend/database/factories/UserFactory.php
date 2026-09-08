<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'first_name'    => $this->faker->firstName(),
            'last_name'     => $this->faker->lastName(),
            'email'         => $this->faker->unique()->safeEmail(),
            'phone'         => $this->faker->unique()->numerify('6#########'), 
            'password_hash' => Hash::make('password'), // mot de passe par défaut pour tous les users de test
            'role'          => 'parent', // rôle par défaut, surchageable 
            'photo_url'     => null,
        ];
    }

    // --- "States" : des variantes réutilisables de la factory ---

    public function teacher(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'teacher',
        ]);
    }

    public function parent(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'parent',
        ]);
    }

    public function student(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'student',
        ]);
    }

    public function superAdmin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'super_admin',
        ]);
    }
}