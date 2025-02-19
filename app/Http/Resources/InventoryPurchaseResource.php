<?php

namespace App\Http\Resources;

use App\Models\CenterStock;
use App\Models\ListInventoryPurchase;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\UpdateInventoryPurchaseHistory;
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
            'supplier_id' => SupplierResource::collection(Supplier::where('id', $this->supplier_id)->get()),
            'listData' => ListInventoryPurchase::with('product')->where('inventory_purchase_id', $this->id)->get(),
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => UpdateInventoryPurchaseHistory::with('user')->where('inventory_purchase_id', $this->id)->latest()->first(),
            'stock' => CenterStock::where('inventory_purchase_id', $this->id)->get(),
        ];
    }
}
