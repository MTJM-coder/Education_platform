<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $table = 'teachers';

    // Clé primaire = user_id (relation 1:1 stricte avec users), pas d'auto-incrément
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'id_card_url',
        'cv_url',
        'degrees_url',
        'location_plan_url',
        'bio',
        'experience_years',
        'teaching_radius_km',
        'location',
        'expected_rate',
        'section',
        'validation_status',
        'rank',
        'rank_points',
        'eligible_for_promotion',
        'stars',
        'balance',
    ];

    protected $casts = [
        'experience_years' => 'float',
        'teaching_radius_km' => 'float',
        'expected_rate' => 'float',
        'balance' => 'float',
        'eligible_for_promotion' => 'boolean',
        'stars' => 'integer',
        'rank_points' => 'integer',
    ];

    // --- Relations ---
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function availabilities()
    {
        return $this->hasMany(TeacherAvailability::class, 'teacher_id');
    }

    public function teacherSubjects()
    {
        return $this->hasMany(TeacherSubject::class, 'teacher_id');
    }

    public function departmentHead()
    {
        return $this->hasOne(DepartmentHead::class, 'teacher_id')->where('is_active', true);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'teacher_id');
    }

    // public function reviews()
    // {
    //     return $this->hasMany(TeacherReview::class, 'teacher_id');
    // }

    // --- Scopes ---
    public function scopeValidated($query)
    {
        return $query->where('validation_status', 'approved');
    }

    public function isHod(): bool
    {
        return $this->departmentHead()->exists();
    }

    // Utilisé par le module de validation Admin : un profil ne peut être approuvé
    // que s'il est complet (documents + au moins une matière déclarée).
    public function isProfileComplete(): bool
    {
        return ! empty($this->cv_url)
            && ! empty($this->degrees_url)
            && ! empty($this->bio)
            && $this->teacherSubjects()->exists();
    }
}
