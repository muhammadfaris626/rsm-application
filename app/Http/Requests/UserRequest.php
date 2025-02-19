<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
            'name'  => ['required', 'string', 'max:255', 'min:6'],
            'username' => [
                'required','string', 'max:255',
                Rule::unique('users', 'username')->ignore($this->id),
            ],
            'email' => [
                'required','string', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($this->id),
            ],
            'password' => [
                Rule::excludeIf((!empty($this->id) && empty($this->password))),
                'required', 'min:8', 'confirmed'
            ],
            'roles' => ['']
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'username.required' => 'The username field is required.',
            'username.unique' => 'Username has been used',
            'email.required' => 'The email field is required.',
            'email.unique' => 'Email has been used',
            'password.required' => 'The password field is required',
            'password.min' => 'Minimum password :min characters.',
            'password.confirmed' => 'Password dan konfirmasi password tidak cocok.'
        ];
    }
}
