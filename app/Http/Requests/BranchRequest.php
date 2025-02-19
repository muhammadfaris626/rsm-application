<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BranchRequest extends FormRequest
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
            'branch_code' => ['required'],
            'branch_name' => ['required'],
            'branch_address' => ['required'],
            'description' => ['required'],
            'status' => ['required']
        ];
    }

    public function messages(): array {
        return [
            'branch_code.required' => 'Kolom kode cabang wajib diisi.',
            'branch_name.required' => 'Kolom nama cabang wajib diisi.',
            'branch_address.required' => 'Kolom alamat cabang wajib diisi.',
            'description.required' => 'Kolom profil cabang wajib diisi.',
            'status.required' => 'Kolom status cabang wajib diisi.'
        ];
    }
}
