<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Format coordinates for display
        $formattedCoordinates = $this->coordinates;
        if (is_array($this->coordinates)) {
            $parts = [];
            if (isset($this->coordinates['address'])) {
                $parts[] = $this->coordinates['address'];
            }
            if (isset($this->coordinates['latitude']) && isset($this->coordinates['longitude'])) {
                $parts[] = "Lat: {$this->coordinates['latitude']}, Long: {$this->coordinates['longitude']}";
            }
            $formattedCoordinates = implode(' | ', $parts);
        }

        return [
            'id' => $this->id,
            'branch' => $this->whenLoaded('branch', function() {
                return [
                    'id' => $this->branch->id,
                    'name' => $this->branch->branch_name
                ];
            }, $this->branch ? [
                'id' => $this->branch->id,
                'name' => $this->branch->branch_name
            ] : null),
            'coordinates' => $formattedCoordinates,
            'coordinates_raw' => $this->coordinates
        ];
    }
}
