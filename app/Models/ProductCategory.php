<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProductCategory extends Model
{
    use HasFactory;

    protected $fillable = ['product_category_code', 'product_category_name'];

    public function updateProductCategoryHistory(): HasMany {
        return $this->hasMany(UpdateProductCategoryHistory::class);
    }

    public function latestUpdateProductCategoryHistory(): HasOne {
        return $this->hasOne(UpdateProductCategoryHistory::class)->latestOfMany();
    }

    public function product(): HasMany {
        return $this->hasMany(Product::class);
    }
}
