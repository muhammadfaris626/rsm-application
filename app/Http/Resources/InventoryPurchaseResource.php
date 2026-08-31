<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryPurchaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'date' => $this->date,
            'supplier_id' => $this->whenLoaded('supplier', function() {
                return [new SupplierResource($this->supplier)];
            }, []),
            'listData' => $this->whenLoaded('listInventoryPurchase', function() {
                return $this->listInventoryPurchase;
            }, []),
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => $this->whenLoaded('latestUpdateInventoryPurchaseHistory'),
            'stock' => $this->whenLoaded('centerStock', function() {
                return $this->centerStock;
            }, []),
        ];
    }
}
