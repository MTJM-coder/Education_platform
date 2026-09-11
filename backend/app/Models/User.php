<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password_hash',
        'role',
        'photo_url',
    ];

    protected $hidden = [
        'password_hash',
    ];

    // On utilise password_hash comme colonne d'authentification (au lieu de "password")
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    // --- Rôles ---
    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    public function isParent(): bool
    {
        return $this->role === 'parent';
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isAdminStaff(): bool
    {
        return $this->role === 'admin_staff';
    }

    // --- Relations 1:1 vers les profils étendus ---
    public function teacherProfile()
    {
        return $this->hasOne(Teacher::class, 'user_id');
    }

    public function parentProfile()
    {
        return $this->hasOne(ParentProfile::class, 'user_id');
    }

    // Learner rempli uniquement si ce User est un élève auto-inscrit (Learner.type = 'self')
    public function learnerProfile()
    {
        return $this->hasOne(Learner::class, 'user_id');
    }
    public function disputesRaised()
    {
        return $this->hasMany(Dispute::class, 'raised_by');
    }

    // public function notifications()
    // {
    //     return $this->hasMany(Notification::class, 'user_id');
    // }
}
