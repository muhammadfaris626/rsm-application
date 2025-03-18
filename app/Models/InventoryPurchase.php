<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryPurchase extends Model
{
    use HasFactory;

    protected $fillable = ['invoice_number', 'date', 'supplier_id'];

    public function supplier(): BelongsTo {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function updateInventoryPurchaseHistory(): HasMany {
        return $this->hasMany(UpdateInventoryPurchaseHistory::class);
    }

    public function listInventoryPurchase(): HasMany {
        return $this->hasMany(ListInventoryPurchase::class);
    }

    public function centerStock(): HasMany {
        return $this->hasMany(CenterStock::class);
    }
}
