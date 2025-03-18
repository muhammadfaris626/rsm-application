<?php

namespace App\Http\Resources;

use App\Models\Branch;
use App\Models\Expenditure;
use App\Models\UpdateOperationalBranchHistory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OperationalBranchResource extends JsonResource
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
            'date' => $this->date,
            'expenditure_id' => ExpenditureResource::collection(Expenditure::where('id', $this->expenditure_id)->get()),
            'total_cost' => $this->total_cost,
            'description' => $this->description,
            'user_id' => User::where('id', $this->user_id)->first(),
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => UpdateOperationalBranchHistory::with('user')->where('op_branch_id', $this->id)->latest()->first(),
        ];
    }
}
