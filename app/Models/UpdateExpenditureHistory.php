<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UpdateExpenditureHistory extends Model
{
    use HasFactory;

    protected $fillable = ['expenditure_id', 'user_id'];

    public function expenditure(): BelongsTo {
        return $this->belongsTo(Expenditure::class, 'expenditure_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
