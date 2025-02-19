<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UpdateSaleHistory extends Model
{
    use HasFactory;

    protected $fillable = ['sale_id', 'user_id'];

    public function sale(): BelongsTo {
        return $this->belongsTo(Sale::class, 'sale_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
