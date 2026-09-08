<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_reviews', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('teacher_id');
            $table->foreign('teacher_id')->references('user_id')->on('teachers')->onDelete('cascade');

            $table->uuid('session_id')->nullable();
            $table->foreign('session_id')->references('id')->on('sessions');

            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->jsonb('criteria')->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->index('teacher_id', 'idx_reviews_teacher');
        });

        DB::statement("
            ALTER TABLE teacher_reviews
            ADD CONSTRAINT chk_reviews_rating
            CHECK (rating BETWEEN 1 AND 5)
        ");

        DB::statement("CREATE UNIQUE INDEX idx_one_review_per_session ON teacher_reviews(session_id) WHERE session_id IS NOT NULL");
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_reviews');
    }
};
