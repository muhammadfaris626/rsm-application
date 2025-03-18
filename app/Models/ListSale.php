<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListSale extends Model
{
    use HasFactory;

    protected $fillable = ['sale_id', 'branch_product_id', 'price', 'quantity', 'total_price'];

    public function sale(): BelongsTo {
        return $this->belongsTo(Sale::class, 'sale_id');
    }

    public function branchProduct(): BelongsTo {
        return $this->belongsTo(BranchProduct::class, 'branch_product_id');
    }
}
