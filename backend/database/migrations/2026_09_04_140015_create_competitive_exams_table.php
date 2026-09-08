<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('competitive_exams', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->string('name');
            $table->string('institution')->nullable();
            $table->string('city')->nullable();
            $table->string('field')->nullable();
            $table->date('exam_date')->nullable();
            $table->text('admission_requirements')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('competitive_exams');
    }
};
