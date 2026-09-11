<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'questions';
    public $timestamps = false;

    protected $fillable = [
        'evaluation_id',
        'text',
        'correct_answer',
    ];

    public function evaluation()
    {
        return $this->belongsTo(AcademicEvaluation::class, 'evaluation_id');
    }
}