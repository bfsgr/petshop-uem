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
        $page = $request->input('page', 1);

        $search = $request->input('search', '');

        $workers = User::where('type', Worker::class)
            ->where('id', '!=', $request->user()->id)
            ->where('name', 'like', "%$search%")
            ->with('subclass')
            ->orderBy('id', 'desc')
            ->paginate(10, ['*'], 'page', $page);


        return Inertia::render('Workers/List', [
            'workers' => $workers,
        ]);
    }

    public function create(Request $request): RedirectResponse
    {
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
            'id' => $user->id,
            'role' => 'employee',
            'hired_at' => $validated['hired_at'],
        ]);

        Password::sendResetLink(['email' => $validated['email']]);

        return redirect()->route('workers')->with('status', 'success')->with('message', 'Funcionário criado!');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        if ($user->type !== Worker::class) {
            abort(404, 'Not Found');
        }

        $validated = $request->validate([
            'name' => 'required',
            'phone' => 'required|min:10|max:11',
            'hired_at' => 'required|date|before_or_equal:today',
            'fired_at' => 'nullable|date|after:hired_at',
        ]);


        $user->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
        ]);

        $user->subclass->update([
            'hired_at' => $validated['hired_at'],
            'fired_at' => $validated['fired_at'],
        ]);

        return redirect()->route('workers')->with('status', 'success')->with('message', 'Funcionário atualizado!');
    }
}
