<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Learner extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'learners';
    public $timestamps = false; // seule created_at existe, pas updated_at

    protected $fillable = [
        'type', // self | child
        'parent_id',
        'user_id',
        'section', // english | french
        'level_id',
        'class_id',
        'school_name',
        'location',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // --- Relations ---
    public function parentProfile()
    {
        return $this->belongsTo(ParentProfile::class, 'parent_id', 'user_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function level()
    {
        return $this->belongsTo(Level::class, 'level_id');
    }

    public function classroom()
    {
        return $this->belongsTo(ClassRoom::class, 'class_id');
    }

    public function tutoringRequests()
    {
        return $this->hasMany(TutoringRequest::class, 'learner_id');
    }

    public function results()
    {
        return $this->hasMany(Result::class, 'learner_id');
    }

    // --- Distinction self / child (pas de sous-classes séparées) ---
    public function isSelfRegistered(): bool
    {
        return $this->type === 'self';
    }

    public function isChild(): bool
    {
        return $this->type === 'child';
    }

    public function scopeSelfRegistered($query)
    {
        return $query->where('type', 'self');
    }

    public function scopeChildren($query)
    {
        return $query->where('type', 'child');
    }

    /**
     * Centralise la règle "qui a le droit d'agir pour ce learner" — réutilisée par
     * TutoringRequest, Assignment, et tout futur module touchant à un learner.
     * Un Admin/Admin Staff n'est PAS inclus ici volontairement : c'est aux contrôleurs
     * de décider explicitement s'ils autorisent aussi les admins, au cas par cas.
     */
    public function isOwnedBy(User $user): bool
    {
        return ($this->type === 'self' && $this->user_id === $user->id)
            || ($this->type === 'child' && $this->parent_id === $user->id);
    }
}
