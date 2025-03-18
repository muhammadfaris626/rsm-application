<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MutationRequest extends FormRequest
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
            'employee_id' => ['required'],
            'to_branch_id' => ['required'],
            'transfer_date' => ['required'],
            'reason' => ['required']
        ];
    }

    public function messages(): array {
        return [
            'employee_id.required' => 'Kolom nama karyawan wajib diisi.',
            'to_branch_id.required' => 'Kolom mutasi ke cabang wajib diisi.',
            'transfer_date.required' => 'Kolom tanggal mutasi wajib diisi.',
            'reason.required' => 'Kolom alasan mutasi wajib diisi.'
        ];
    }
}
