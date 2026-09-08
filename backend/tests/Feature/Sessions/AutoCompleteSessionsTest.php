<?php

namespace Tests\Feature\Sessions;

use App\Models\Assignment;
use App\Models\Dispute;
use App\Models\Session;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\BuildsTutoringScenarios;
use Tests\TestCase;

class AutoCompleteSessionsTest extends TestCase
{
    use RefreshDatabase, BuildsTutoringScenarios;

    private function makeAssignment(): Assignment
    {
        [$tutoringRequest, , , $teacher] = $this->createEligibleScenario();

        return Assignment::create([
            'request_id' => $tutoringRequest->id,
            'teacher_id' => $teacher->user_id,
            'status'     => 'active',
        ]);
    }

    public function test_session_older_than_48h_with_no_confirmation_gets_auto_completed(): void
    {
        $assignment = $this->makeAssignment();

        $session = Session::create([
            'assignment_id' => $assignment->id,
            'session_date'  => now()->subDays(3)->toDateString(), // largement > 48h
            'start_time'    => '16:00',
            'end_time'      => '18:00',
            'status'        => 'scheduled',
        ]);

        $this->artisan('sessions:auto-complete')->assertExitCode(0);

        $this->assertDatabaseHas('sessions', [
            'id'     => $session->id,
            'status' => 'completed',
        ]);
    }

    public function test_recent_session_stays_scheduled(): void
    {
        $assignment = $this->makeAssignment();

        $session = Session::create([
            'assignment_id' => $assignment->id,
            'session_date'  => now()->toDateString(),
            'start_time'    => now()->subHour()->format('H:i'),
            'end_time'      => now()->addHour()->format('H:i'), // pas encore terminée
            'status'        => 'scheduled',
        ]);

        $this->artisan('sessions:auto-complete');

        $this->assertDatabaseHas('sessions', [
            'id'     => $session->id,
            'status' => 'scheduled',
        ]);
    }

    public function test_disputed_session_is_never_auto_completed(): void
    {
        $assignment = $this->makeAssignment();

        $session = Session::create([
            'assignment_id' => $assignment->id,
            'session_date'  => now()->subDays(3)->toDateString(),
            'start_time'    => '16:00',
            'end_time'      => '18:00',
            'status'        => 'scheduled',
        ]);

        Dispute::create([
            'session_id' => $session->id,
            'raised_by'  => $assignment->teacher_id,
            'reason'     => 'Durée incorrecte',
            'status'     => 'open',
        ]);

        $this->artisan('sessions:auto-complete');

        $this->assertDatabaseHas('sessions', [
            'id'     => $session->id,
            'status' => 'scheduled', // toujours en attente, litige en cours
        ]);
    }
}