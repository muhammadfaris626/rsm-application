<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RequestReturnRequest extends FormRequest
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
            'request_order_id' => 'required',
            'branch_id' => 'required',
            'date' => 'required|date',
        ];
    }

    public function messages(): array
    {
        return [
            'request_order_id.required' => 'Kolom nomor ro wajib diisi.',
            'branch_id.required' => 'Kolom cabang wajib diisi.',
            'date.required' => 'Kolom tanggal wajib diisi.',
        ];
    }
}
