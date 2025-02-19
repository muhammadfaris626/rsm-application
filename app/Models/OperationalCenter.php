<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OperationalCenter extends Model
{
    use HasFactory;

    protected $fillable = ['date', 'expenditure_id', 'total_cost', 'description', 'user_id'];

    public function expenditure(): BelongsTo {
        return $this->belongsTo(Expenditure::class, 'expenditure_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function updateOperationalCenterHistory(): HasMany {
        return $this->hasMany(UpdateOperationalCenterHistory::class);
    }
}
