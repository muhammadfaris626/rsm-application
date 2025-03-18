<?php

namespace App\Http\Resources;

use App\Models\Branch;
use App\Models\ListRequestOrder;
use App\Models\RequestOrderLog;
use App\Models\UpdateRequestOrderHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestOrderResource extends JsonResource
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
            'ro_number' => $this->ro_number,
            'branch_id' => BranchResource::collection(Branch::where('id', $this->branch_id)->get()),
            'date' => $this->date,
            'status' => $this->status,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => UpdateRequestOrderHistory::with('user')->where('request_order_id', $this->id)->latest()->first(),
            'listData' => ListRequestOrder::with(['centerStock', 'centerStock.product'])->where('request_order_id', $this->id)->get(),
            'log' => RequestOrderLog::where('request_order_id', $this->id)->get(),
            'branch_product' => $this->branchProduct()->with('product')->get(),
        ];
    }
}
