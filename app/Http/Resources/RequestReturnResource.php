<?php

namespace App\Http\Resources;

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
            'request_order_id' => $this->whenLoaded('requestOrder', function() {
                return [new RequestOrderResource($this->requestOrder)];
            }, []),
            'branch_id' => $this->whenLoaded('branch', function() {
                return $this->branch;
            }),
            'request_number' => $this->request_number,
            'date' => $this->date,
            'status' => $this->status,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => $this->whenLoaded('updateRequestReturnHistory', function() {
                return $this->updateRequestReturnHistory->sortByDesc('id')->first();
            }),
            'listData' => $this->whenLoaded('listRequestReturn', function() {
                return $this->listRequestReturn;
            }, []),
            'log' => $this->whenLoaded('requestReturnLog', function() {
                return $this->requestReturnLog;
            }, []),
        ];
    }
}
