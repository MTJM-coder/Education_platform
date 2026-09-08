<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('department_heads', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('teacher_id');
            $table->foreign('teacher_id')->references('user_id')->on('teachers')->onDelete('cascade');

            $table->uuid('subject_id');
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');

            $table->date('appointed_at')->useCurrent();
            $table->boolean('is_active')->default(true);
        });

        DB::statement("CREATE UNIQUE INDEX idx_one_active_hod_per_subject ON department_heads(subject_id) WHERE is_active");
    }

    public function down(): void
    {
        Schema::dropIfExists('department_heads');
    }
};
