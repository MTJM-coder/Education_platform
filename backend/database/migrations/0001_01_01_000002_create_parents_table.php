<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parents', function (Blueprint $table) {
            $table->uuid('user_id')->primary();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->text('address')->nullable();
            $table->string('id_card_photo_url')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parents');
    }
};
