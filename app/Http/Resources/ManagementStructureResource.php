<?php

namespace App\Http\Resources;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;
use App\Models\UpdateManagementStructureHistory;
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
            'employee_id' => EmployeeResource::collection(Employee::where('id', $this->employee_id)->get()),
            'position_id' => PositionResource::collection(Position::where('id', $this->position_id)->get()),
            'branch_id' => BranchResource::collection(Branch::where('id', $this->branch_id)->get()),
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => UpdateManagementStructureHistory::with('user')->where('management_structure_id', $this->id)->latest()->first(),
        ];
    }
}
