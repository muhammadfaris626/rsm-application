<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Testing\Fluent\Concerns\Has;

class ListRequestReturn extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_return_id',
        'branch_product_id',
        'quantity',
        'serial_barcode',
    ];

    public function requestReturn(): BelongsTo {
        return $this->belongsTo(RequestReturn::class, 'request_return_id');
    }

    public function branchProduct(): BelongsTo {
        return $this->belongsTo(BranchProduct::class, 'branch_product_id');
    }
}
