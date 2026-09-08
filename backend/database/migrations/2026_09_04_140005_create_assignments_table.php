<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('request_id');
            $table->foreign('request_id')->references('id')->on('tutoring_requests')->onDelete('cascade');

            $table->uuid('teacher_id');
            $table->foreign('teacher_id')->references('user_id')->on('teachers');

            $table->string('status')->default('pending');
            $table->decimal('agreed_price', 10, 2)->nullable();
            $table->boolean('validated_by_admin')->default(false);
            $table->timestampTz('created_at')->useCurrent();

            $table->index('teacher_id', 'idx_assignments_teacher');
            $table->index('request_id', 'idx_assignments_request');
        });

        DB::statement("
            ALTER TABLE assignments
            ADD CONSTRAINT chk_assignments_status
            CHECK (status IN ('pending','active','completed','cancelled'))
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
