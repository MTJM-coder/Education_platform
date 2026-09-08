<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lecture_notes', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('teacher_id');
            $table->foreign('teacher_id')->references('user_id')->on('teachers')->onDelete('cascade');

            $table->uuid('subject_id')->nullable();
            $table->foreign('subject_id')->references('id')->on('subjects');

            $table->string('title');
            $table->string('file_url');
            $table->string('status')->default('pending');

            $table->uuid('validated_by')->nullable();
            $table->foreign('validated_by')->references('user_id')->on('teachers');

            $table->timestampTz('validated_at')->nullable();
            $table->timestampTz('created_at')->useCurrent();
        });

        DB::statement("
            ALTER TABLE lecture_notes
            ADD CONSTRAINT chk_lecture_notes_status
            CHECK (status IN ('pending','approved','rejected'))
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('lecture_notes');
    }
};
