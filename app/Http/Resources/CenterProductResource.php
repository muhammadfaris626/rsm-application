<?php

namespace App\Http\Resources;

use App\Models\InventoryPurchase;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CenterProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return  [
            'id' => $this->id,
            'inventory_purchase_id' => InventoryPurchaseResource::collection(InventoryPurchase::where('id', $this->inventory_purchase_id)->get()),
            'product_id' => ProductResource::collection(Product::where('id', $this->product_id)->get()),
            'stock' => $this->stock,
            'serial_barcode' => $this->serial_barcode,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
        ];
    }
}
