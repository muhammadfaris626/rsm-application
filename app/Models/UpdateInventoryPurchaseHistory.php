<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UpdateInventoryPurchaseHistory extends Model
{
    use HasFactory;

    protected $fillable = ['inventory_purchase_id', 'user_id'];

    public function inventoryPurchase(): BelongsTo {
        return $this->belongsTo(InventoryPurchase::class, 'inventory_purchase_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
