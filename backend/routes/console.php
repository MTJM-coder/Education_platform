<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::command('sessions:auto-complete')->hourly();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


// Le cron système doit exécuter le scheduler Laravel toutes les minutes
// (standard Laravel, à configurer une seule fois sur le serveur) :
// * * * * * php /path-to-project/artisan schedule:run >> /dev/null 2>&1