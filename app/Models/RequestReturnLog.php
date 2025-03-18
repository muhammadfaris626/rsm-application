<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestReturnLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_return_id',
        'user_id',
        'status',
        'description',
    ];

    public function requestReturn(): BelongsTo {
        return $this->belongsTo(RequestReturn::class, 'request_return_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
