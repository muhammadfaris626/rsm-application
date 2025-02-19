<?php

namespace App\Http\Resources;

use App\Models\Branch;
use App\Models\RequestOrder;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestReturnResource extends JsonResource
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
            'request_order_id' => RequestOrderResource::collection(RequestOrder::where('id', $this->request_order_id)->get()),
            'branch_id' => Branch::where('id', $this->branch_id)->first(),
            'request_number' => $this->request_number,
            'date' => $this->date,
            'status' => $this->status,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => $this->updateRequestReturnHistory()->with('user')->latest()->first(),
            'listData' => $this->listRequestReturn()->with(['branchProduct', 'branchProduct.product', 'branchProduct.branch'])->get(),
            'log' => $this->requestReturnLog()->get(),
        ];
    }
}
