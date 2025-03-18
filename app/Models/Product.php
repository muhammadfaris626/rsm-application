<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['product_category_id', 'product_name'];

    public function productCategory(): BelongsTo {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function updateProductHistory(): HasMany {
        return $this->hasMany(UpdateProductHistory::class);
    }

    public function listInventoryPurchase(): HasMany {
        return $this->hasMany(ListInventoryPurchase::class);
    }

    public function branchProduct(): HasMany {
        return $this->hasMany(BranchProduct::class);
    }

    public function centerStock(): HasMany {
        return $this->hasMany(CenterStock::class);
    }
}
