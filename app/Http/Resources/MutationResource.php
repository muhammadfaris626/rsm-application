<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MutationResource extends JsonResource
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
            'employee_id' => $this->whenLoaded('employee', function() {
                return $this->employee;
            }),
            'from_branch_id' => $this->whenLoaded('fromBranch', function() {
                return $this->fromBranch;
            }),
            'to_branch_id' => $this->whenLoaded('toBranch', function() {
                return $this->toBranch;
            }),
            'transfer_date' => $this->transfer_date,
            'reason' => $this->reason,
            'approved_by' => $this->whenLoaded('approvedBy', function() {
                return $this->approvedBy;
            }),
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
