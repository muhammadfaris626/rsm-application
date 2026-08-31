<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Position extends Model
{
    use HasFactory;

    protected $fillable = ['position_name'];

    public function updatePositionHistory(): HasMany {
        return $this->hasMany(UpdatePositionHistory::class);
    }

    public function latestUpdatePositionHistory(): HasOne {
        return $this->hasOne(UpdatePositionHistory::class)->latestOfMany();
    }

    public function managementStructure(): HasMany {
        return $this->hasMany(ManagementStructure::class);
    }
}
