<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UpdatePositionHistory extends Model
{
    use HasFactory;

    protected $fillable = ['position_id', 'user_id'];

    public function position(): BelongsTo {
        return $this->belongsTo(Position::class, 'position_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
