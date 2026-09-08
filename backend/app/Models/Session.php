<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'sessions';
    public $timestamps = false;

    protected $fillable = [
        'assignment_id',
        'session_date',
        'start_time',
        'end_time',
        'location',
        'status',
        'confirmed_by_teacher_at',
        'confirmed_by_parent_at',
    ];

    protected $casts = [
        'session_date'             => 'date',
        'confirmed_by_teacher_at'  => 'datetime',
        'confirmed_by_parent_at'   => 'datetime',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'assignment_id');
    }

    // public function dispute()
    // {
    //     return $this->hasOne(Dispute::class, 'session_id');
    // }

    // public function review()
    // {
    //     return $this->hasOne(TeacherReview::class, 'session_id');
    // }

    public function isConfirmedByBoth(): bool
    {
        return $this->confirmed_by_teacher_at !== null && $this->confirmed_by_parent_at !== null;
    }
}