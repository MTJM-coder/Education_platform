<?php

namespace App\Http\Controllers;

use App\Models\MonthlyAward;
use App\Services\AwardComputationService;
use Illuminate\Http\Request;

class AwardController extends Controller
{
    public function __construct(private readonly AwardComputationService $service)
    {
    }

    // POST /admin/awards/compute
    // Autorisation : Admin uniquement (middleware 'role' sur la route).
    public function compute(Request $request)
    {
        $data = $request->validate([
            'month' => ['required', 'integer', 'between:1,12'],
            'year'  => ['required', 'integer', 'min:2020', 'max:2100'],
        ]);

        $created = $this->service->computeForPeriod($data['month'], $data['year']);

        return response()->json([
            'data'    => $created,
            'message' => count($created) . ' récompense(s) calculée(s) pour cette période.',
        ]);
    }

    // GET /awards/monthly?month=9&year=2026
    // Public — visible par tous.
    public function index(Request $request)
    {
        $data = $request->validate([
            'month' => ['required', 'integer', 'between:1,12'],
            'year'  => ['required', 'integer', 'min:2020', 'max:2100'],
        ]);

        $awards = MonthlyAward::with(['teacher.user', 'learner'])
            ->where('month', $data['month'])
            ->where('year', $data['year'])
            ->get();

        return response()->json(['data' => $awards]);
    }

    // PATCH /admin/awards/{award}/prize
    // Autorisation : Admin uniquement.
    public function setPrize(Request $request, MonthlyAward $award)
    {
        $data = $request->validate([
            'prize_description' => ['required', 'string', 'max:500'],
        ]);

        $award->update(['prize_description' => $data['prize_description']]);

        return response()->json($award->fresh());
    }
}