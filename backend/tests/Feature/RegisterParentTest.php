<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterParentTest extends TestCase
{
    // Recrée une base de test vierge avant CHAQUE test de cette classe.
    // Sans ça, les tests se pollueraient entre eux (ex. un email créé au test 1
    // existerait encore au test 2, faussant le résultat).
    use RefreshDatabase;

    public function test_it_registers_a_parent_successfully(): void
    {
        // ARRANGE — préparer les données envoyées par le "faux" formulaire
        $payload = [
            'first_name' => 'Awa',
            'last_name'  => 'Mballa',
            'email'      => 'awa.mballa@example.com',
            'phone'      => '653111222',
            'password'   => 'password123',
            'password_confirmation' => 'password123',
            'address'    => 'Bastos, Yaoundé',
        ];

        // ACT — appeler réellement l'endpoint, comme le ferait React
        $response = $this->postJson('/api/auth/register/parent', $payload);

        // ASSERT — vérifier que le résultat est celui attendu
        $response->assertStatus(201);
        $response->assertJsonStructure(['user', 'token']);

        // Vérifie aussi directement en base que l'utilisateur a bien été créé
        $this->assertDatabaseHas('users', [
            'email' => 'awa.mballa@example.com',
            'role'  => 'parent',
        ]);

        $this->assertDatabaseHas('parents', [
            'address' => 'Bastos, Yaoundé',
        ]);
    }

    public function test_it_rejects_registration_with_duplicate_email(): void
    {
        // ARRANGE — on crée D'ABORD un utilisateur existant avec cet email,
        // grâce à la factory (une seule ligne, au lieu de remplir 7 champs à la main)
        User::factory()->create([
            'email' => 'deja.utilise@example.com',
        ]);

        $payload = [
            'first_name' => 'Paul',
            'last_name'  => 'Ekotto',
            'email'      => 'deja.utilise@example.com', // même email que ci-dessus
            'phone'      => '653333444',
            'password'   => 'password123',
            'password_confirmation' => 'password123',
        ];

        // ACT
        $response = $this->postJson('/api/auth/register/parent', $payload);

        // ASSERT — 422 = erreur de validation (email déjà pris)
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }
}