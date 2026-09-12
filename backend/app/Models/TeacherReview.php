<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherReview extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'teacher_reviews';
    public $timestamps = false; // seule created_at existe (défaut DB useCurrent())

    protected $fillable = [
        'teacher_id',
        'assignment_id',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating'     => 'integer',
        'created_at' => 'datetime',
    ];

    // Teacher::user_id est la clé primaire (relation 1:1 avec User).
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'user_id');
    }

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'assignment_id');
    }
}