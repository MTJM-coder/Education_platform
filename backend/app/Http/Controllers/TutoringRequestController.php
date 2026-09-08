<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tutoring\CreateTutoringRequestRequest;
use App\Models\TutoringRequest;
use App\Models\User;
use App\Services\TeacherMatchingService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TutoringRequestController extends Controller
{
    public function __construct(private readonly TeacherMatchingService $matchingService)
    {
    }

    // POST /tutoring-requests
    public function store(CreateTutoringRequestRequest $request)
    {
        $tutoringRequest = TutoringRequest::create($request->validated());

        return response()->json($tutoringRequest, 201);
    }

    // GET /tutoring-requests/{tutoringRequest}/matches
    public function matches(Request $request, TutoringRequest $tutoringRequest)
    {
        $this->assertCanView($tutoringRequest, $request->user());

        $eligibleTeachers = $this->matchingService->eligibleTeachers($tutoringRequest);

        $ranked = $eligibleTeachers->map(function ($teacher) use ($tutoringRequest) {
            $score = 0;

            if ($tutoringRequest->location && $teacher->location) {
                $requestLoc = Str::lower($tutoringRequest->location);
                $teacherLoc = Str::lower($teacher->location);
                if (str_contains($teacherLoc, $requestLoc) || str_contains($requestLoc, $teacherLoc)) {
                    $score += 100;
                }
            }

            if ($tutoringRequest->preferred_day) {
                $covers = $teacher->availabilities->contains(function ($slot) use ($tutoringRequest) {
                    return $slot->day_of_week === $tutoringRequest->preferred_day
                        && $slot->start_time <= $tutoringRequest->preferred_start_time
                        && $slot->end_time >= $tutoringRequest->preferred_end_time;
                });

                if ($covers) {
                    $score += 50;
                } elseif ($teacher->availabilities->where('day_of_week', $tutoringRequest->preferred_day)->isNotEmpty()) {
                    $score += 20;
                }
            }

            $score += ($teacher->stars * 10) + $teacher->rank_points + (float) $teacher->experience_years;

            return [
                'teacher_id'       => $teacher->user_id,
                'location'         => $teacher->location,
                'stars'            => $teacher->stars,
                'experience_years' => $teacher->experience_years,
                'expected_rate'    => $teacher->expected_rate,
                'match_score'      => $score,
            ];
        })->sortByDesc('match_score')->values();

        return response()->json(['data' => $ranked]);
    }

    private function assertCanView(TutoringRequest $tutoringRequest, User $user): void
    {
        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            return;
        }

        if (! $tutoringRequest->learner->isOwnedBy($user)) {
            abort(403, "Vous n'avez pas accès à cette demande de tutorat.");
        }
    }
}