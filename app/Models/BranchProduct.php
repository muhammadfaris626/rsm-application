<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BranchProduct extends Model
{
    use HasFactory;

    protected $fillable = ['branch_id', 'product_id', 'quantity', 'serial_barcode', 'request_order_id', 'total_return'];

    public function branch(): BelongsTo {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function product(): BelongsTo {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function listSale(): HasMany {
        return $this->hasMany(ListSale::class);
    }

    public function listRequestReturn(): HasMany {
        return $this->hasMany(ListRequestReturn::class);
    }

    public function requestOrder(): BelongsTo {
        return $this->belongsTo(RequestOrder::class, 'request_order_id');
    }
}
