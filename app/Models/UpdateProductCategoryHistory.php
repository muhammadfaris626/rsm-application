<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UpdateProductCategoryHistory extends Model
{
    use HasFactory;

    protected $fillable = ['product_category_id', 'user_id'];

    public function productCategory(): BelongsTo {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
