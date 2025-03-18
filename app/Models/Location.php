<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Location extends Model
{
    use HasFactory;

    protected $fillable = ['branch_id', 'coordinates'];

    protected $casts = [
        'coordinates' => 'array'
    ];

    public function branch(): BelongsTo {
        return $this->belongsTo(Branch::class, 'branch_id');
    }
}
