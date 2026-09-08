<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tutoring_requests', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('learner_id');
            $table->foreign('learner_id')->references('id')->on('learners')->onDelete('cascade');

            $table->uuid('subject_id');
            $table->foreign('subject_id')->references('id')->on('subjects');

            $table->string('location')->nullable();
            $table->string('preferred_day')->nullable(); // même format que teacher_availabilities.day_of_week
            $table->time('preferred_start_time')->nullable();
            $table->time('preferred_end_time')->nullable();
            $table->string('status')->default('pending'); // pending | matched | cancelled
            $table->timestamp('created_at')->useCurrent();

            $table->index('learner_id');
        });

        DB::statement("
            ALTER TABLE tutoring_requests
            ADD CONSTRAINT chk_request_status
            CHECK (status IN ('pending','matched','cancelled')),
            ADD CONSTRAINT chk_request_day
            CHECK (preferred_day IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
            ADD CONSTRAINT chk_request_time_order
            CHECK (preferred_end_time > preferred_start_time)
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('tutoring_requests');
    }
};
