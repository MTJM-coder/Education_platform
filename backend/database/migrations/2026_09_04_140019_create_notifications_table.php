<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->string('notif_type');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestampTz('created_at')->useCurrent();

            $table->index(['user_id', 'is_read'], 'idx_notifications_user');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
