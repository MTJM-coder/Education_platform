<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_subjects', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('teacher_id');
            $table->foreign('teacher_id')->references('user_id')->on('teachers')->onDelete('cascade');

            $table->uuid('subject_id');
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');

            $table->uuid('class_id')->nullable();
            $table->foreign('class_id')->references('id')->on('classrooms');

            $table->boolean('validated')->default(false);

            $table->uuid('validated_by')->nullable(); // Admin pour l'instant ; HOD plus tard
            $table->foreign('validated_by')->references('id')->on('users');

            $table->timestamp('validated_at')->nullable();

            $table->unique(['teacher_id', 'subject_id', 'class_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_subjects');
    }
};