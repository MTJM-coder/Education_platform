<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Nommé ParentProfile (et non "Parent") car "parent" est un mot réservé en PHP
class ParentProfile extends Model
{
    use HasFactory;

    protected $table = 'parents';

    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'address',
        'id_card_photo_url',
    ];

    // --- Relations ---
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function children()
    {
        return $this->hasMany(Learner::class, 'parent_id')->where('type', 'child');
    }

    // public function tutoringRequests()
    // {
    //     return $this->hasManyThrough(
    //         TutoringRequest::class,
    //         Learner::class,
    //         'parent_id', // clé étrangère sur learners
    //         'learner_id', // clé étrangère sur tutoring_requests
    //         'user_id',    // clé locale sur parents
    //         'id'          // clé locale sur learners
    //     );
    // }
}
