<?php

namespace App\Http\Resources;

use App\Models\Branch;
use App\Models\ListSale;
use App\Models\ManagementStructure;
use App\Models\UpdateSaleHistory;
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
            'branch_id' => BranchResource::collection(Branch::where('id', $this->branch_id)->get()),
            'invoice_number' => $this->invoice_number,
            'date' => $this->date,
            'management_structure_id' => ManagementStructureResource::collection(ManagementStructure::where('id', $this->management_structure_id)->get()),
            'listData' => ListSale::with(['branchProduct', 'branchProduct.product'])->where('sale_id', $this->id)->get(),
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => UpdateSaleHistory::with('user')->where('sale_id', $this->id)->latest()->first(),
        ];
    }
}
