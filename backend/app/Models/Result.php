<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'results';
    public $timestamps = false;

    protected $fillable = [
        'learner_id',
        'evaluation_id',
        'teacher_id',
        'score',
        'grade',
        'term',
        'academic_year',
        'comments',
    ];

    protected $casts = [
        'score'      => 'float',
        'created_at' => 'datetime',
    ];

    public function learner()
    {
        return $this->belongsTo(Learner::class, 'learner_id');
    }

    public function evaluation()
    {
        return $this->belongsTo(AcademicEvaluation::class, 'evaluation_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }
}