<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'classrooms';
    public $timestamps = false;

    protected $fillable = ['name', 'level_id'];

    public function level()
    {
        return $this->belongsTo(Level::class, 'level_id');
    }
}