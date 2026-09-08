<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('assignment_id');
            $table->foreign('assignment_id')->references('id')->on('assignments')->onDelete('cascade');

            $table->date('session_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('location')->nullable();
            $table->string('status')->default('scheduled');
            $table->timestamp('confirmed_by_teacher_at')->nullable();
            $table->timestamp('confirmed_by_parent_at')->nullable();
 
            $table->index('assignment_id', 'idx_sessions_assignment');
        });

        DB::statement("
            ALTER TABLE sessions
            ADD CONSTRAINT chk_sessions_status
            CHECK (status IN ('scheduled','completed','cancelled','disputed')),
            ADD CONSTRAINT chk_sessions_time
            CHECK (end_time > start_time)
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
