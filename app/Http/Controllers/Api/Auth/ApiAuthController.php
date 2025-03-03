<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ApiAuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'username' => 'required|exists:users,username',
            'password' => 'required'
        ], [
            'username.required' => 'Username tidak boleh kosong',
            'username.exists' => 'Username tidak ditemukan',
            'password.required' => 'Password tidak boleh kosong',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Username atau password salah.'
            ], 401);
        }

        $token = $user->createToken($user->name)->plainTextToken;
        $employee = Employee::where('employee_number', $user->username)->first();
        $location = $employee ? Location::where('branch_id', $employee->branch_id)->first() : null;

        return response()->json([
            'message' => 'Login berhasil.',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'name' => $user->name,
                'branch_id' => $location->branch_id ?? "",
                'coordinates' => $location->coordinates ?? ""
            ],
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Berhasil logout'
        ], 200);
    }
}
