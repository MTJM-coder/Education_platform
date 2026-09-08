<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherSubject extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'teacher_subjects';
    public $timestamps = false;

    protected $fillable = [
        'teacher_id',
        'subject_id',
        'class_id',
        'validated',
        'validated_by',
        'validated_at',
    ];

    protected $casts = [
        'validated'    => 'boolean',
        'validated_at' => 'datetime',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    // public function classroom()
    // {
    //     return $this->belongsTo(ClassRoom::class, 'class_id');
    // }

    public function validatedBy()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }
}