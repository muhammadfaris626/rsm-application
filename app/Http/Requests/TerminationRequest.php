<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TerminationRequest extends FormRequest
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
            'termination_date' => ['required'],
            'reason' => ['required']
        ];
    }

    public function messages(): array {
        return [
            'employee_id.required' => 'Kolom karyawan wajib diisi.',
            'termination_date,required' => 'Kolom tanggal pemberhentian wajib diisi.',
            'reason.required' => 'Kolom alasan pemberhentian wajib diisi.'
        ];
    }
}
