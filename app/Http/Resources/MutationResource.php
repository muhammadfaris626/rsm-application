<?php

namespace App\Http\Resources;

use App\Models\Branch;
use App\Models\Employee;
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
            'employee_id' => Employee::where('id', $this->employee_id)->first(),
            'from_branch_id' => Branch::where('id', $this->from_branch_id)->first(),
            'to_branch_id' => Branch::where('id', $this->to_branch_id)->first(),
            'transfer_date' => $this->transfer_date,
            'reason' => $this->reason,
            'approved_by' => Employee::where('id', $this->approved_by)->first(),
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
