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
            'branch_code' => ['required', \Illuminate\Validation\Rule::unique('branches', 'branch_code')->ignore($this->branch)],
            'branch_name' => ['required'],
            'branch_address' => ['required'],
            'description' => ['nullable'],
            'status' => ['required'],
            'open_time' => ['nullable', 'date_format:H:i,H:i:s'],
            'close_time' => ['nullable', 'date_format:H:i,H:i:s'],
            'late_tolerance_minutes' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array {
        return [
            'branch_code.required' => 'Kolom kode cabang wajib diisi.',
            'branch_code.unique' => 'Kode cabang sudah ada.',
            'branch_name.required' => 'Kolom nama cabang wajib diisi.',
            'branch_address.required' => 'Kolom alamat cabang wajib diisi.',
            'description.required' => 'Kolom profil cabang wajib diisi.',
            'status.required' => 'Kolom status cabang wajib diisi.',
            'open_time.date_format' => 'Format jam buka tidak valid.',
            'close_time.date_format' => 'Format jam tutup tidak valid.',
            'late_tolerance_minutes.integer' => 'Toleransi keterlambatan harus berupa angka.',
            'late_tolerance_minutes.min' => 'Toleransi keterlambatan tidak boleh kurang dari 0 menit.',
        ];
    }
}
