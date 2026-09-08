<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learners', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();
            $table->string('type'); // self | child

            $table->uuid('parent_id')->nullable();
            $table->foreign('parent_id')->references('user_id')->on('parents')->onDelete('cascade');

            $table->uuid('user_id')->nullable()->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->string('section')->nullable(); // english | french
            $table->uuid('level_id')->nullable();
            $table->foreign('level_id')->references('id')->on('levels');

            $table->uuid('class_id')->nullable();
            $table->foreign('class_id')->references('id')->on('classrooms');

            $table->string('school_name')->nullable();
            $table->string('location')->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->index('parent_id', 'idx_learners_parent');
            $table->index('user_id', 'idx_learners_user');
        });

        DB::statement("
            ALTER TABLE learners
            ADD CONSTRAINT chk_learners_type
            CHECK (type IN ('self','child')),
            ADD CONSTRAINT chk_learners_section
            CHECK (section IN ('english','french')),
            ADD CONSTRAINT chk_learner_owner
            CHECK (
                (type = 'child' AND parent_id IS NOT NULL) OR
                (type = 'self'  AND user_id  IS NOT NULL)
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('learners');
    }
};
