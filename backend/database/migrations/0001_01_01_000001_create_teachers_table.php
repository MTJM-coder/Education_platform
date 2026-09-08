<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->uuid('user_id')->primary();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->string('id_card_url')->nullable();
            $table->string('cv_url')->nullable();
            $table->string('degrees_url')->nullable();
            $table->string('location_plan_url')->nullable();
            $table->text('bio')->nullable(); // présentation libre (remplace la lettre de motivation)
            $table->decimal('experience_years', 4, 1)->nullable();
            $table->decimal('teaching_radius_km', 5, 2)->nullable();
            $table->string('location')->nullable();
            $table->decimal('expected_rate', 10, 2)->nullable();
            $table->string('section')->nullable(); // english | french | bilingual
            $table->string('validation_status')->default('pending'); // pending | approved | rejected
            $table->string('rank')->default('teacher'); // teacher | senior_teacher | head_teacher | admin_staff
            $table->integer('rank_points')->default(0);
            $table->boolean('eligible_for_promotion')->default(false);
            $table->unsignedTinyInteger('stars')->default(0); // 0 à 5, impacte le tarif
            $table->decimal('balance', 12, 2)->default(0);
        });

        DB::statement("
            ALTER TABLE teachers
            ADD CONSTRAINT chk_teachers_validation_status
            CHECK (validation_status IN ('pending','approved','rejected')),
            ADD CONSTRAINT chk_teachers_rank
            CHECK (rank IN ('teacher','senior_teacher','head_teacher','admin_staff')),
            ADD CONSTRAINT chk_teachers_stars
            CHECK (stars BETWEEN 0 AND 5),
            ADD CONSTRAINT chk_teachers_section
            CHECK (section IN ('english','french','bilingual'))
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
