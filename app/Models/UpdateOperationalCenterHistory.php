<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UpdateOperationalCenterHistory extends Model
{
    use HasFactory;

    protected $fillable = ['op_center_id', 'user_id'];

    public function operationalCenter(): BelongsTo {
        return $this->belongsTo(OperationalCenter::class, 'op_center_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
