<?php

namespace Database\Factories;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherFactory extends Factory
{
    protected $model = Teacher::class;

    public function definition(): array
    {
        return [
            // Comme "user_id" EST la clé primaire (relation 1:1 stricte), on lui passe
            // directement une nouvelle instance de User::factory() : Laravel la crée
            // d'abord, récupère son id, puis l'utilise ici.
            'user_id'            => User::factory()->teacher(),

            'id_card_url'        => 'teachers/id_cards/fake.pdf',
            'cv_url'             => 'teachers/cv/fake.pdf',
            'degrees_url'        => 'teachers/degrees/fake.pdf',
            'bio'                => $this->faker->paragraph(),
            'experience_years'   => $this->faker->randomFloat(1, 0, 20),
            'location'           => $this->faker->city(),
            'expected_rate'      => $this->faker->randomFloat(2, 2000, 10000),
            'section'            => $this->faker->randomElement(['english', 'french', 'bilingual']),
            'validation_status'  => 'pending',
            'rank'               => 'teacher',
            'rank_points'        => 0,
            'eligible_for_promotion' => false,
            'stars'              => 0,
            'balance'            => 0,
        ];
    }

    // --- States utiles pour les tests ---

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'validation_status' => 'approved',
        ]);
    }

    // Profil volontairement incomplet (pour tester le rejet 422 "profil incomplet")
    public function incomplete(): static
    {
        return $this->state(fn (array $attributes) => [
            'cv_url'      => null,
            'degrees_url' => null,
            'bio'         => null,
        ]);
    }
}
