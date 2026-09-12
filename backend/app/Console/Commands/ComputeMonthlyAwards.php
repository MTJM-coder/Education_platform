<?php

namespace App\Console\Commands;

use App\Services\AwardComputationService;
use Illuminate\Console\Command;

class ComputeMonthlyAwards extends Command
{
    protected $signature = 'awards:compute {--month=} {--year=}';
    protected $description = "Calcule les récompenses du mois (Teacher/Student of the Month, Most Progressive Student). Par défaut, le mois précédent.";

    public function handle(AwardComputationService $service): int
    {
        $now = now();
        $month = (int) ($this->option('month') ?: $now->copy()->subMonth()->month);
        $year = (int) ($this->option('year') ?: $now->copy()->subMonth()->year);

        $created = $service->computeForPeriod($month, $year);

        $this->info(count($created) . " récompense(s) calculée(s) pour {$month}/{$year}.");

        return self::SUCCESS;
    }
}