<?php

namespace App\Http\Resources;

use App\Models\Expenditure;
use App\Models\UpdateOperationalCenterHistory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OperationalCenterResource extends JsonResource
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
            'date' => $this->date,
            'expenditure_id' => ExpenditureResource::collection(Expenditure::where('id', $this->expenditure_id)->get()),
            'total_cost' => $this->total_cost,
            'description' => $this->description,
            'user_id' => User::where('id', $this->user_id)->first(),
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => UpdateOperationalCenterHistory::with('user')->where('op_center_id', $this->id)->latest()->first(),
        ];
    }
}
