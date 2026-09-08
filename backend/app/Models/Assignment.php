<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'assignments';
    public $timestamps = false;

    protected $fillable = [
        'request_id',
        'teacher_id',
        'status',
        'agreed_price',
        'validated_by_admin',
    ];

    protected $casts = [
        'agreed_price'       => 'float',
        'validated_by_admin' => 'boolean',
        'created_at'         => 'datetime',
    ];

    public function tutoringRequest()
    {
        return $this->belongsTo(TutoringRequest::class, 'request_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function sessions()
    {
        return $this->hasMany(Session::class, 'assignment_id');
    }

    // public function payments()
    // {
    //     return $this->hasMany(Payment::class, 'assignment_id');
    // }
}
