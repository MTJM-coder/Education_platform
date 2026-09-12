<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LectureNote extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'lecture_notes';
    public $timestamps = false;

    protected $fillable = [
        'teacher_id',
        'subject_id',
        'title',
        'file_url',
        'status',
        'validated_by',
        'validated_at',
    ];

    protected $casts = [
        'created_at'   => 'datetime',
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

    public function validatedBy()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }
}