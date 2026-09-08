<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('value');
        });

        // Valeur de départ, modifiable ensuite via l'admin
        \Illuminate\Support\Facades\DB::table('settings')->insert([
            'key' => 'commission_rate',
            'value' => '10', // en pourcentage
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
