<?php

namespace App\Services;

use App\Models\MonthlyAward;
use App\Models\Result;
use App\Models\TeacherReview;
use Illuminate\Support\Facades\DB;

class AwardComputationService
{
    private const MIN_REVIEWS_FOR_TEACHER_OF_MONTH = 3;

    /**
     * Calcule et enregistre les 3 récompenses du mois. Retourne les MonthlyAward
     * créés (un type peut être absent si aucun candidat n'est éligible).
     */
    public function computeForPeriod(int $month, int $year): array
    {
        $created = [];

        if ($teacherAward = $this->computeTeacherOfMonth($month, $year)) {
            $created[] = $teacherAward;
        }

        if ($studentAward = $this->computeStudentOfMonth($month, $year)) {
            $created[] = $studentAward;
        }

        if ($progressAward = $this->computeMostProgressiveStudent($month, $year)) {
            $created[] = $progressAward;
        }

        return $created;
    }

    public function computeTeacherOfMonth(int $month, int $year): ?MonthlyAward
    {
        $winner = TeacherReview::query()
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->select('teacher_id', DB::raw('AVG(rating) as avg_rating'), DB::raw('COUNT(*) as review_count'))
            ->groupBy('teacher_id')
            ->havingRaw('COUNT(*) >= ?', [self::MIN_REVIEWS_FOR_TEACHER_OF_MONTH])
            ->orderByDesc('avg_rating')
            ->first();

        if (! $winner) {
            return null;
        }

        return MonthlyAward::updateOrCreate(
            ['award_type' => 'teacher_of_month', 'month' => $month, 'year' => $year],
            ['teacher_id' => $winner->teacher_id, 'learner_id' => null, 'score' => round($winner->avg_rating, 2)]
        );
    }

    public function computeStudentOfMonth(int $month, int $year): ?MonthlyAward
    {
        $winner = Result::query()
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->whereNotNull('score')
            ->select('learner_id', DB::raw('AVG(score) as avg_score'))
            ->groupBy('learner_id')
            ->orderByDesc('avg_score')
            ->first();

        if (! $winner) {
            return null;
        }

        return MonthlyAward::updateOrCreate(
            ['award_type' => 'student_of_month', 'month' => $month, 'year' => $year],
            ['learner_id' => $winner->learner_id, 'teacher_id' => null, 'score' => round($winner->avg_score, 2)]
        );
    }

    public function computeMostProgressiveStudent(int $month, int $year): ?MonthlyAward
    {
        $prevMonth = $month === 1 ? 12 : $month - 1;
        $prevYear = $month === 1 ? $year - 1 : $year;

        $currentAverages = $this->averageScoresByLearner($month, $year);
        $previousAverages = $this->averageScoresByLearner($prevMonth, $prevYear);

        $bestLearnerId = null;
        $bestDelta = null;

        foreach ($currentAverages as $learnerId => $currentAvg) {
            if (! isset($previousAverages[$learnerId])) {
                continue; // pas de donnée le mois précédent, pas de progression calculable
            }

            $delta = $currentAvg - $previousAverages[$learnerId];

            if ($delta > 0 && ($bestDelta === null || $delta > $bestDelta)) {
                $bestDelta = $delta;
                $bestLearnerId = $learnerId;
            }
        }

        if (! $bestLearnerId) {
            return null;
        }

        return MonthlyAward::updateOrCreate(
            ['award_type' => 'most_progressive_student', 'month' => $month, 'year' => $year],
            ['learner_id' => $bestLearnerId, 'teacher_id' => null, 'score' => round($bestDelta, 2)]
        );
    }

    private function averageScoresByLearner(int $month, int $year): array
    {
        return Result::query()
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->whereNotNull('score')
            ->select('learner_id', DB::raw('AVG(score) as avg_score'))
            ->groupBy('learner_id')
            ->pluck('avg_score', 'learner_id')
            ->toArray();
    }
}