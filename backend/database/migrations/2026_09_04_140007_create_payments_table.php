<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('assignment_id');
            $table->foreign('assignment_id')->references('id')->on('assignments')->onDelete('cascade');

            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('XAF');
            $table->string('method');
            $table->string('period');
            $table->string('status')->default('pending');
            $table->decimal('commission_amount', 10, 2)->nullable();
            $table->decimal('teacher_amount', 10, 2)->nullable();
            $table->string('escrow_status')->default('held');
            $table->timestampTz('escrow_release_date')->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->index('assignment_id', 'idx_payments_assignment');
        });

        DB::statement("
            ALTER TABLE payments
            ADD CONSTRAINT chk_payments_method
            CHECK (method IN ('mobile_money','bank_transfer','other')),
            ADD CONSTRAINT chk_payments_period
            CHECK (period IN ('hourly','weekly','monthly')),
            ADD CONSTRAINT chk_payments_status
            CHECK (status IN ('pending','paid','failed','refunded')),
            ADD CONSTRAINT chk_payments_escrow_status
            CHECK (escrow_status IN ('held','released','refunded'))
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
