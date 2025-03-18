<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CenterStock extends Model
{
    use HasFactory;

    protected $fillable = ['inventory_purchase_id', 'product_id', 'stock', 'serial_barcode'];

    public function inventoryPurchase(): BelongsTo {
        return $this->belongsTo(InventoryPurchase::class, 'inventory_purchase_id');
    }

    public function product(): BelongsTo {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function listRequestOrder(): HasMany {
        return $this->hasMany(ListRequestOrder::class);
    }
}
