<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_availabilities', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('teacher_id');
            $table->foreign('teacher_id')->references('user_id')->on('teachers')->onDelete('cascade');

            $table->string('day_of_week');
            $table->time('start_time');
            $table->time('end_time');

            $table->index('teacher_id', 'idx_availability_teacher');
        });

        DB::statement("
            ALTER TABLE teacher_availabilities
            ADD CONSTRAINT chk_availability_day
            CHECK (day_of_week IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
            ADD CONSTRAINT chk_availability_time
            CHECK (end_time > start_time)
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_availabilities');
    }
};
