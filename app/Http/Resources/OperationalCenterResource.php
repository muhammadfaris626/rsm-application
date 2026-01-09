<?php

namespace App\Http\Resources;

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
            'expenditure_id' => $this->whenLoaded('expenditure', function() {
                return [new ExpenditureResource($this->expenditure)];
            }, []),
            'total_cost' => $this->total_cost,
            'description' => $this->description,
            'user_id' => $this->whenLoaded('user', function() {
                return $this->user;
            }),
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => $this->whenLoaded('updateOperationalCenterHistory', function() {
                return $this->updateOperationalCenterHistory->sortByDesc('id')->first();
            }),
        ];
    }
}
