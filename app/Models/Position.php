<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Position extends Model
{
    use HasFactory;

    protected $fillable = ['position_name'];

    public function updatePositionHistory(): HasMany {
        return $this->hasMany(UpdatePositionHistory::class);
    }

    public function managementStructure(): HasMany {
        return $this->hasMany(ManagementStructure::class);
    }
}
