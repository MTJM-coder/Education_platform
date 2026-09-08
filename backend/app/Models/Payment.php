<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'payments';
    public $timestamps = false;

    protected $fillable = [
        'assignment_id',
        'amount',
        'currency',
        'method',
        'period',
        'status',
        'commission_amount',
        'teacher_amount',
        'escrow_status',
        'escrow_release_date',
    ];

    protected $casts = [
        'amount'              => 'float',
        'commission_amount'   => 'float',
        'teacher_amount'      => 'float',
        'escrow_release_date' => 'datetime',
        'created_at'          => 'datetime',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'assignment_id');
    }
}