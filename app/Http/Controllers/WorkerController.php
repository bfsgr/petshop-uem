<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class WorkerController extends Controller
{
    public function index(Request $request): Response
    {
        if ($request->user()['is_admin'] === false) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Workers/List');
    }

    public function create(Request $request): Response
    {
        if ($request->user()['is_admin'] === false) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'phone' => 'required|min:10|max:11',
            'hired_at' => 'required|date|before_or_equal:today',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'type' => 'worker',
            'password' => Hash::make(Str::random()),
        ]);

        $user->subclass()->create([
            'role' => 'employee',
            'hired_at' => $validated['hired_at'],
        ]);

        Password::sendResetLink(['email' => $validated['email']]);

        return Inertia::render('Workers/List')->with('flash',
            ['status' => 'success', 'message' => 'Funcionário criado!']);
    }
}
