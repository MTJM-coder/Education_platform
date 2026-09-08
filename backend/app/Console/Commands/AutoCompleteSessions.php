<?php

namespace App\Console\Commands;

use App\Models\Session;
use Carbon\Carbon;
use Illuminate\Console\Command;

class AutoCompleteSessions extends Command
{
    protected $signature = 'sessions:auto-complete';
    protected $description = "Passe en 'completed' les séances planifiées dont l'heure de fin remonte à plus de 48h, sauf litige signalé.";

    public function handle(): int
    {
        $cutoff = Carbon::now()->subHours(48);
        $count = 0;

        Session::query()
            ->where('status', 'scheduled')
            ->whereDoesntHave('dispute')
            ->chunkById(200, function ($sessions) use ($cutoff, &$count) {
                foreach ($sessions as $session) {
                    $sessionEndsAt = Carbon::parse($session->session_date->toDateString() . ' ' . $session->end_time);

                    if ($sessionEndsAt->lte($cutoff)) {
                        $session->update(['status' => 'completed']);
                        $count++;
                    }
                }
            });

        $this->info("{$count} séance(s) marquée(s) comme complétée(s) automatiquement.");

        return self::SUCCESS;
    }
}