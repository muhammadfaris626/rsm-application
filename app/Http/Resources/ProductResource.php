<?php

namespace App\Http\Resources;

use App\Models\ProductCategory;
use App\Models\UpdateProductHistory;
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
            'product_category_id' => ProductCategoryResource::collection(ProductCategory::where('id', $this->product_category_id)->get()),
            'product_name' => $this->product_name,
            'created_at' => Carbon::parse($this->created_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'updated_at' => Carbon::parse($this->updated_at)->isoFormat('D MMMM YYYY HH:mm:ss'),
            'last_update' => UpdateProductHistory::with('user')->where('product_id', $this->id)->latest()->first(),
        ];
    }
}
