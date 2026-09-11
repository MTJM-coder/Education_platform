    <?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disputes', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('gen_random_uuid()'))->primary();

            $table->uuid('session_id');
            $table->foreign('session_id')->references('id')->on('sessions')->onDelete('cascade');

            $table->uuid('raised_by');
            $table->foreign('raised_by')->references('id')->on('users');

            $table->uuid('resolved_by')->nullable();
            $table->foreign('resolved_by')->references('id')->on('users');

            $table->text('reason');
            $table->string('status')->default('open');
            $table->text('resolution')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('resolved_at')->nullable();
        });
                                                          
        DB::statement("
            ALTER TABLE disputes
            ADD CONSTRAINT chk_disputes_status
            CHECK (status IN ('open','under_review','resolved'))
        ");

        DB::statement("CREATE UNIQUE INDEX idx_one_dispute_per_session ON disputes(session_id)");
    }

    public function down(): void
    {
        Schema::dropIfExists('disputes');
    }
};
