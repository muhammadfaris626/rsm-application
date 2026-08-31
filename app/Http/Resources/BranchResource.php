<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchResource extends JsonResource
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
            'branch_code' => $this->branch_code,
            'branch_name' => $this->branch_name,
            'branch_address' => $this->branch_address,
            'description' => $this->description,
            'status' => $this->status,
            'open_time' => $this->open_time,
            'close_time' => $this->close_time,
            'late_tolerance_minutes' => $this->late_tolerance_minutes,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => $this->whenLoaded('latestUpdateBranchHistory'),
        ];
    }
}
