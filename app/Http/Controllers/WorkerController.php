<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Worker;
use Illuminate\Http\RedirectResponse;
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

        $page = $request->input('page', 1);

        $workers = User::where('type', Worker::class)
            ->with('subclass')
            ->orderBy('id', 'desc')
            ->paginate(10, ['*'], 'page', $page);


        return Inertia::render('Workers/List', [
            'workers' => $workers,
        ]);
    }

    public function create(Request $request): RedirectResponse
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
            'type' => Worker::class,
            'password' => Hash::make(Str::random()),
        ]);

        $user->subclass()->create([
            'role' => 'employee',
            'hired_at' => $validated['hired_at'],
        ]);

        Password::sendResetLink(['email' => $validated['email']]);

        return redirect()->route('workers')->with('status', 'success')->with('message', 'Funcionário criado!');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        if ($request->user()['is_admin'] === false) {
            abort(403, 'Unauthorized');
        }

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,'.$id,
            'phone' => 'required|min:10|max:11',
            'hired_at' => 'required|date|before_or_equal:today',
            'fired_at' => 'nullable|date|after:hired_at',
        ]);


        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        $user->subclass->update([
            'hired_at' => $validated['hired_at'],
            'fired_at' => $validated['fired_at'],
        ]);

        return redirect()->route('workers')->with('status', 'success')->with('message', 'Funcionário atualizado!');
    }
}
