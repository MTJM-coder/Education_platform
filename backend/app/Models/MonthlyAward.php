<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonthlyAward extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'monthly_awards';
    public $timestamps = false;

    protected $fillable = [
        'award_type',
        'month',
        'year',
        'score',
        'prize_description',
        'teacher_id',
        'learner_id',
    ];

    protected $casts = [
        'score' => 'float',
        'month' => 'integer',
        'year'  => 'integer',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function learner()
    {
        return $this->belongsTo(Learner::class, 'learner_id');
    }
}