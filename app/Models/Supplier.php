<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'phone', 'address'];

    public function updateSupplierHistory(): HasMany {
        return $this->hasMany(UpdateSupplierHistory::class);
    }

    public function latestUpdateSupplierHistory(): HasOne {
        return $this->hasOne(UpdateSupplierHistory::class)->latestOfMany();
    }

    public function inventoryPurchase(): HasMany {
        return $this->hasMany(InventoryPurchase::class);
    }
}
