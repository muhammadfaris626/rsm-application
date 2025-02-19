<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
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
            'employee_number' => ['required'],
            'name' => ['required'],
            'place_of_birth' => ['required'],
            'date_of_birth' => ['required'],
            'phone' => ['required'],
            'branch_id' => ['required'],
            'status' => ['required']
        ];
    }

    public function messages(): array {
        return [
            'employee_number.required' => 'Kolom nomor karyawan wajib diisi.',
            'name.required' => 'Kolom nama wajib diisi.',
            'address.required' => 'Kolom alamat wajib diisi.',
            'place_of_birth.required' => 'Kolom tempat lahir wajib diisi.',
            'date_of_birth.required' => 'Kolom tanggal lahir wajib diisi.',
            'phone.required' => 'Kolom nomor telepon wajib diisi.',
            'branch_id.required' => 'Kolom cabang wajib diisi.',
            'status.required' => 'Kolom status karyawan wajib diisi.'
        ];
    }
}
