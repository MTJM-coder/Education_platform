<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_preparation_tracks', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('exam_id');
            $table->foreign('exam_id')->references('id')->on('competitive_exams')->onDelete('cascade');

            $table->uuid('learner_id')->nullable();
            $table->foreign('learner_id')->references('id')->on('learners')->onDelete('cascade');

            $table->uuid('teacher_id')->nullable();
            $table->foreign('teacher_id')->references('user_id')->on('teachers');

            $table->text('subjects_covered')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_preparation_tracks');
    }
};
