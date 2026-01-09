<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'product_category_id' => $this->whenLoaded('productCategory', function() {
                return [new ProductCategoryResource($this->productCategory)];
            }, []),
            'product_name' => $this->product_name,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => $this->whenLoaded('updateProductHistory', function() {
                return $this->updateProductHistory->sortByDesc('id')->first();
            }),
        ];
    }
}
