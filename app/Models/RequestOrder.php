<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RequestOrder extends Model
{
    use HasFactory;

    protected $fillable = ['ro_number', 'branch_id', 'date', 'status'];

    public function branch(): BelongsTo {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function updateRequestOrderHistory(): HasMany {
        return $this->hasMany(UpdateRequestOrderHistory::class);
    }

    public function listRequestOrder(): HasMany {
        return $this->hasMany(ListRequestOrder::class);
    }

    public function requestOrderLog(): HasMany {
        return $this->hasMany(RequestOrderLog::class);
    }

    public function requestReturn(): HasMany {
        return $this->hasMany(RequestReturn::class);
    }

    public function branchProduct(): HasMany {
        return $this->hasMany(BranchProduct::class);
    }
}
