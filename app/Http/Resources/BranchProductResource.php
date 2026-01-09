<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchProductResource extends JsonResource
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
            'branch_id' => $this->whenLoaded('branch', function() {
                return [new BranchResource($this->branch)];
            }, []),
            'product_id' => $this->whenLoaded('product', function() {
                return [new ProductResource($this->product)];
            }, []),
            'quantity' => $this->quantity,
            'total_stock' => $this->total_stock ?? $this->quantity,
            'serial_barcode' => $this->serial_barcode,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
        ];
    }
}
