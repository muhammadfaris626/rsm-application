<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryPurchaseRequest extends FormRequest
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
            'date' => ['required'],
            'supplier_id' => ['required'],
        ];
    }

    public function messages(): array {
        return [
            'date.required' => 'Kolom tanggal pembelian wajib diisi.',
            'supplier_id.required' => 'Kolom supplier wajib diisi.',
        ];
    }
}
