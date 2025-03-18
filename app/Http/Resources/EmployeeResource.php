<?php

namespace App\Http\Resources;

use App\Models\Branch;
use App\Models\UpdateEmployeeHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
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
            'employee_number' => $this->employee_number,
            'name' => $this->name,
            'address' => $this->address,
            'place_of_birth' => $this->place_of_birth,
            'date_of_birth' => $this->date_of_birth,
            'phone' => $this->phone,
            'branch_id' => BranchResource::collection(Branch::where('id', $this->branch_id)->get()),
            'status' => $this->status,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => UpdateEmployeeHistory::with('user')->where('employee_id', $this->id)->latest()->first(),
        ];
    }
}
