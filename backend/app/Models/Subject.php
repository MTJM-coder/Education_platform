<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'subjects';
    public $timestamps = false;

    protected $fillable = ['name'];

    public function teacherSubjects()
    {
        return $this->hasMany(TeacherSubject::class, 'subject_id');
    }

    public function departmentHead()
    {
        return $this->hasOne(DepartmentHead::class, 'subject_id')->where('is_active', true);
    }
}