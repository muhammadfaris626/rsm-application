<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OperationalBranchRequest extends FormRequest
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
            'expenditure_id' => ['required'],
            'total_cost' => ['required'],
            'description' => ['required'],
        ];
    }

    public function messages(): array {
        return [
            'branch_id.required' => 'Kolom cabang wajib diisi.',
            'date.required' => 'Kolom tanggal wajib diisi.',
            'expenditure_id.required' => 'Kolom jenis biaya wajib diisi.',
            'total_cost.required' => 'Kolom total biaya wajib diisi.',
            'description.required' => 'Kolom keterangan wajib diisi.'
        ];
    }
}
