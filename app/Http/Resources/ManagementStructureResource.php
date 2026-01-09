<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ManagementStructureResource extends JsonResource
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
                return [new EmployeeResource($this->employee)];
            }, []),
            'position_id' => $this->whenLoaded('position', function() {
                return [new PositionResource($this->position)];
            }, []),
            'branch_id' => $this->whenLoaded('branch', function() {
                return [new BranchResource($this->branch)];
            }, []),
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => $this->whenLoaded('updateManagementStructureHistory', function() {
                return $this->updateManagementStructureHistory->sortByDesc('id')->first();
            }),
        ];
    }
}
