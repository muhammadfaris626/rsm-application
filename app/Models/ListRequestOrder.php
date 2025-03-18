<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ListRequestOrder extends Model
{
    use HasFactory;

    protected $fillable = ['request_order_id', 'center_stock_id', 'quantity', 'approved_quantity', 'serial_barcode', 'status'];

    public function requestOrder(): BelongsTo {
        return $this->belongsTo(RequestOrder::class, 'request_order_id');
    }

    public function centerStock(): BelongsTo {
        return $this->belongsTo(CenterStock::class, 'center_stock_id');
    }
}
