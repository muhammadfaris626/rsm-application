<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListInventoryPurchase extends Model
{
    use HasFactory;

    protected $fillable = ['inventory_purchase_id', 'product_id', 'price', 'quantity', 'total_price'];

    public function inventoryPurchase(): BelongsTo {
        return $this->belongsTo(InventoryPurchase::class, 'inventory_purchase_id');
    }
    public function product(): BelongsTo {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
