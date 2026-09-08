<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TutoringRequest extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'tutoring_requests';
    public $timestamps = false; // seule created_at existe

    protected $fillable = [
        'learner_id',
        'subject_id',
        'location',
        'preferred_day',
        'preferred_start_time',
        'preferred_end_time',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function learner()
    {
        return $this->belongsTo(Learner::class, 'learner_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    // public function assignments()
    // {
    //     return $this->hasMany(Assignment::class, 'request_id');
    // }
}
