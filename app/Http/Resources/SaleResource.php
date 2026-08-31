<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
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
            'invoice_number' => $this->invoice_number,
            'date' => $this->date,
            'management_structure_id' => $this->whenLoaded('managementStructure', function() {
                return [new ManagementStructureResource($this->managementStructure)];
            }, []),
            'listData' => $this->whenLoaded('listSale', function() {
                return $this->listSale;
            }, []),
            'list_sale_sum_total_price' => $this->list_sale_sum_total_price ?? null,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => $this->whenLoaded('latestUpdateSaleHistory'),
        ];
    }
}
