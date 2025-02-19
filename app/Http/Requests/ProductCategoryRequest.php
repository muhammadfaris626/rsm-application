<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductCategoryRequest extends FormRequest
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
            'product_category_code' => ['required'],
            'product_category_name' => ['required']
        ];
    }

    public function messages(): array {
        return [
            'product_category_code.required' => 'Kolom kode kategori produk wajib diisi.',
            'product_category_name.required' => 'Kolom nama kategori produk wajib diisi.'
        ];
    }
}
