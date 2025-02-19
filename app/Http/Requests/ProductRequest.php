<?php

namespace App\Http\Requests;

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
            'product_category_id' => ['required'],
            'product_name' => ['required'],
        ];
    }

    public function messages(): array {
        return [
            'prodct_category_id.required' => 'Kolom kategori produk wajib diisi.',
            'product_name.required' => 'Kolom nama produk wajib diisi.',
        ];
    }
}
