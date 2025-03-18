<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaleRequest extends FormRequest
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
            'branch_id' => ['required'],
            'date' => ['required'],
            'management_structure_id' => ['required']
        ];
    }

    public function messages(): array
    {
        return [
            'branch_id.required' => 'Kolom cabang wajib diisi.',
            'date.required' => 'Kolom tanggal wajib diisi.',
            'management_structure_id.required' => 'Kolom nama teknisi wajib diisi.'
        ];
    }
}
