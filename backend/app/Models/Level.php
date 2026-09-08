<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'levels';
    public $timestamps = false;

    protected $fillable = ['name'];

    public function classrooms()
    {
        return $this->hasMany(ClassRoom::class, 'level_id');
    }
}