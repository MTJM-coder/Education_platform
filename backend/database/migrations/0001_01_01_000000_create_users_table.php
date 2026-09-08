<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Extension nécessaire pour gen_random_uuid() sur PostgreSQL
        DB::statement('CREATE EXTENSION IF NOT EXISTS pgcrypto');

        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable()->unique();
            $table->string('password_hash');
            $table->string('role'); // super_admin | admin_staff | teacher | parent | student
            $table->string('photo_url')->nullable();
            $table->timestamps(); 
        });

        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT chk_users_role
            CHECK (role IN ('super_admin','admin_staff','teacher','parent','student'))
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
