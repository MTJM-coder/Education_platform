<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicEvaluation extends Model
{
    //
    use HasFactory,HasUuids;
    protected $table = 'academic_evaluations';
    public $timestamps = false;
    protected $fillable = [
        'subject_id',
        'title',
        'eval_date',
        'created_by',
    ];

    protected $casts = [
        'eval_date' => 'date',
    ];
    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function results()
    {
        return $this->hasMany(Result::class, 'evaluation_id');
    }
    public function questions()
    {
        return $this->hasMany(Question::class, 'evaluation_id');
    }
}
