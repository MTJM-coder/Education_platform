<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartmentHead extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'department_heads';
    public $timestamps = false;

    protected $fillable = [
        'teacher_id',
        'subject_id',
        'appointed_at',
        'is_active',
    ];

    protected $casts = [
        'appointed_at' => 'date',
        'is_active'    => 'boolean',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    // public function subject()
    // {
    //     return $this->belongsTo(Subject::class, 'subject_id');
    // }
}