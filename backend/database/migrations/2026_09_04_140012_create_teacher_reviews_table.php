<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_reviews', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('teacher_id');
            $table->foreign('teacher_id')->references('user_id')->on('teachers')->onDelete('cascade');

            $table->uuid('assignment_id')->unique(); // un seul avis par affectation (upsert via PUT)
            $table->foreign('assignment_id')->references('id')->on('assignments')->onDelete('cascade');

            $table->unsignedTinyInteger('rating'); // 1 à 5
            $table->text('comment')->nullable();

            $table->timestamp('created_at')->useCurrent();
        });

        DB::statement("
            ALTER TABLE teacher_reviews
            ADD CONSTRAINT chk_teacher_reviews_rating
            CHECK (rating BETWEEN 1 AND 5)
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_reviews');
    }
};