<?php

namespace Database\Factories;

use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubjectFactory extends Factory
{
    protected $model = Subject::class;

    public function definition(): array
    {
        // On pioche dans une vraie liste de matières plutôt que du texte aléatoire,
        // pour que les données de test restent lisibles et réalistes.
        return [
            'name' => $this->faker->unique()->randomElement([
                'Mathematics',
                'Physics',
                'Chemistry',
                'Biology',
                'English',
                'French',
                'History',
                'Geography',
                'Computer Science',
                'Economics',
            ]),
        ];
    }
}