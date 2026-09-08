<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('results', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('learner_id');
            $table->foreign('learner_id')->references('id')->on('learners')->onDelete('cascade');

            $table->uuid('evaluation_id')->nullable();
            $table->foreign('evaluation_id')->references('id')->on('academic_evaluations');

            $table->uuid('teacher_id')->nullable();
            $table->foreign('teacher_id')->references('user_id')->on('teachers');

            $table->decimal('score', 5, 2)->nullable();
            $table->string('grade')->nullable();
            $table->string('term')->nullable();
            $table->string('academic_year')->nullable();
            $table->text('comments')->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->index('learner_id', 'idx_results_learner');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};
