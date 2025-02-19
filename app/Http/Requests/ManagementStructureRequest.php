<?php

namespace App\Http\Requests;

use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use Illuminate\Foundation\Http\FormRequest;

class ManagementStructureRequest extends FormRequest
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
            'position_id' => ['required'],
            'branch_id' => ['required']
        ];
    }

    public function messages(): array {
        return [
            'employee_id.required' => 'Kolom nama karyawan wajib diisi.',
            'position_id.required' => 'Kolom jabatan wajib diisi.',
            'branch_id.required' => 'Kolom cabang wajib diisi.'
        ];
    }
}
