<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class RequestReturn extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_order_id',
        'branch_id',
        'request_number',
        'date',
        'status',
    ];

    protected static function boot() {
        parent::boot();

        static::updated(function ($model) {
            // Hapus cache notifikasi saat ada perubahan status
            $user = Auth::user();
            $roleName = $user?->roles->first()?->name;
            if ($user && $roleName) {
                Cache::forget("notification_count_{$user->id}_{$roleName}");
            }
        });
    }

    public function requestOrder(): BelongsTo {
        return $this->belongsTo(RequestOrder::class, 'request_order_id');
    }

    public function branch(): BelongsTo {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function updateRequestReturnHistory(): HasMany {
        return $this->hasMany(UpdateRequestReturnHistory::class);
    }

    public function latestUpdateRequestReturnHistory(): HasOne {
        return $this->hasOne(UpdateRequestReturnHistory::class)->latestOfMany();
    }

    public function listRequestReturn(): HasMany {
        return $this->hasMany(ListRequestReturn::class);
    }

    public function requestReturnLog(): HasMany {
        return $this->hasMany(RequestReturnLog::class);
    }
}
