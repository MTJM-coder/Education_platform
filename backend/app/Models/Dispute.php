<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'disputes';
    public $timestamps = false;

    protected $fillable = [
        'session_id',
        'raised_by',
        'reason',
        'status',
        'resolution',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function session()
    {
        return $this->belongsTo(Session::class, 'session_id');
    }

    public function raisedBy()
    {
        return $this->belongsTo(User::class, 'raised_by');
    }
}