<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class LoginTest extends TestCase
{
    use RefreshDatabase;
    public function test_login_with_email(){
        $user = User::Factory()->create([
            'email' => 'test@email.com']
            );
        
            $response = $this->postJson('/api/auth/login',[
                'login'=>$user->email,
                'password'=>'password'
            ]);

            $response->assertStatus(200);
        
    }

    public function test_login_fail_with_invalid_email(){
         $user = User::Factory()->create([
            'email' => 'test@email.com']
            );
        
            $response = $this->postJson('/api/auth/login',[
                'login'=>'mauvaismail@gmail.com',
                'password'=>'password'
            ]);

            $response->assertStatus(401);
    }

     public function test_login_with_phone(){
         $user = User::Factory()->create([
            'phone' => '650090589']
            );
        
            $response = $this->postJson('/api/auth/login',[
                'login'=>$user->phone,
                'password'=>'password'
            ]);

            $response->assertStatus(200);
    }

     public function test_login_fail_with_invalid_password(){
         $user = User::Factory()->create([
            'email' => 'test@email.com']
            );
        
            $response = $this->postJson('/api/auth/login',[
                'login'=>$user->email,
                'password'=>'badpassword'
            ]);

            $response->assertStatus(401);
    }
}
