<?php

namespace App\Http\Resources;

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
            'branch_id' => $this->whenLoaded('branch', function() {
                return [new BranchResource($this->branch)];
            }, []),
            'date' => $this->date,
            'status' => $this->status,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => $this->whenLoaded('updateRequestOrderHistory', function() {
                return $this->updateRequestOrderHistory->sortByDesc('id')->first();
            }),
            'listData' => $this->whenLoaded('listRequestOrder', function() {
                return $this->listRequestOrder;
            }, []),
            'log' => $this->whenLoaded('requestOrderLog', function() {
                return $this->requestOrderLog;
            }, []),
            'branch_product' => $this->whenLoaded('branchProduct', function() {
                return $this->branchProduct;
            }, []),
        ];
    }
}
