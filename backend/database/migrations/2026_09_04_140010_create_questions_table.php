<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('evaluation_id');
            $table->foreign('evaluation_id')->references('id')->on('academic_evaluations')->onDelete('cascade');

            $table->text('text');
            $table->text('correct_answer')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
