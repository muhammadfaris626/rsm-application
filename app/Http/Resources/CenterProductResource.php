<?php

namespace App\Http\Resources;

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
            'inventory_purchase_id' => $this->whenLoaded('inventoryPurchase', function() {
                return [new InventoryPurchaseResource($this->inventoryPurchase)];
            }, []),
            'product_id' => $this->whenLoaded('product', function() {
                return [new ProductResource($this->product)];
            }, []),
            'stock' => $this->stock,
            'serial_barcode' => $this->serial_barcode,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
        ];
    }
}
