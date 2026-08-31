<?php

namespace App\Http\Requests;

use App\Models\Product;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_category_id' => ['required', 'integer', 'exists:product_categories,id'],
            'product_name' => [
                'required',
                'string',
                'max:255',
                function (string $attribute, mixed $value, Closure $fail): void {
                    $query = Product::query()
                        ->where('product_category_id', $this->integer('product_category_id'))
                        ->whereRaw('LOWER(TRIM(product_name)) = ?', [mb_strtolower(trim((string) $value))]);

                    $product = $this->route('product');
                    if ($product instanceof Product) {
                        $query->whereKeyNot($product->id);
                    }

                    if ($query->exists()) {
                        $fail('Nama barang tersebut sudah digunakan pada kategori yang dipilih.');
                    }
                },
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $category = $this->input('product_category_id');
        if (is_array($category)) {
            $category = $category['id'] ?? $category[0]['id'] ?? null;
        } elseif (is_object($category)) {
            $category = $category->id ?? null;
        }

        $name = preg_replace('/\s+/u', ' ', trim((string) $this->input('product_name')));

        $this->merge([
            'product_category_id' => $category,
            'product_name' => $name ?? '',
        ]);
    }

    public function messages(): array {
        return [
            'product_category_id.required' => 'Kolom kategori produk wajib diisi.',
            'product_category_id.exists' => 'Kategori produk yang dipilih tidak ditemukan.',
            'product_name.required' => 'Kolom nama produk wajib diisi.',
            'product_name.max' => 'Nama produk maksimal 255 karakter.',
        ];
    }
}
