<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ApiLoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ApiAuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'username' => 'required|exists:users',
            'password' => 'required'
        ], [
            'username.required' => 'Username tidak boleh kosong',
            'username.exists' => 'Username tidak ditemukan',
            'password.required' => 'Password tidak boleh kosong',
        ]);
        $user = User::where('username', $request->username)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return [
                'message' => 'Password salah.'
            ];
        }
        $token = $user->createToken($user->name);
        return [
            'user' => $user,
            'token' => $token->plainTextToken
        ];
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return [
            'message' => 'Berhasil logout'
        ];
    }
}
