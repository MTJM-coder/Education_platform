<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monthly_awards', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->string('award_type');
            $table->integer('month');
            $table->integer('year');
            $table->decimal('score', 6, 2)->nullable();
            $table->text('prize_description')->nullable();

            $table->uuid('teacher_id')->nullable();
            $table->foreign('teacher_id')->references('user_id')->on('teachers');

            $table->uuid('learner_id')->nullable();
            $table->foreign('learner_id')->references('id')->on('learners');
        });

        DB::statement("
            ALTER TABLE monthly_awards
            ADD CONSTRAINT chk_awards_type
            CHECK (award_type IN ('teacher_of_month','student_of_month','most_progressive_student')),
            ADD CONSTRAINT chk_awards_month
            CHECK (month BETWEEN 1 AND 12),
            ADD CONSTRAINT chk_award_target
            CHECK (
                (teacher_id IS NOT NULL AND learner_id IS NULL) OR
                (teacher_id IS NULL AND learner_id IS NOT NULL)
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('monthly_awards');
    }
};
