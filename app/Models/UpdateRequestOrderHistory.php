<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UpdateRequestOrderHistory extends Model
{
    use HasFactory;

    protected $fillable = ['request_order_id', 'user_id'];

    public function requestOrder(): BelongsTo {
        return $this->belongsTo(RequestOrder::class, 'request_order_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
