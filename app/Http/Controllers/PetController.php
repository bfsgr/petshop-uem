<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PetController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $page = $request->input('page', 1);

        $search = $request->input('search', '');

        $pets = Pet::query()
            ->with('user.subclass')
            ->when($user->type === Customer::class, fn ($query) => $query->where('customer_id', $user->id))
            ->where('name', 'like', "%$search%")
            ->orderBy('id', 'desc')
            ->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Pets/List', [
            'pets' => $pets,
        ]);
    }

    public function form(Request $request): Response
    {
        $search = $request->input('search', '');

        return Inertia::render('Pets/Create', [
            'customers' => Inertia::lazy(
                fn () => User::where('type', Customer::class)
                    ->where('name', 'like', "%$search%")
                    ->take(10)
                    ->get(['id', 'name'])
            ),
        ]);
    }

    public function create(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required',
            'breed' => 'required',
            'birthdate' => 'required|date|before:today',
            'type' => 'required|in:dog,cat',
            'history' => 'string|nullable',
            'customer' => [
                'required', 'exists:users,id', function ($attribute, $value, $fail) {
                    $user = User::findOrFail($value);
                    if ($user->type !== Customer::class) {
                        $fail('O usuário selecionado não é um cliente.');
                    }
                },
            ],
        ]);

        Pet::create([
            'name' => $validated['name'],
            'breed' => $validated['breed'],
            'birthdate' => $validated['birthdate'],
            'type' => $validated['type'],
            'history' => $validated['history'],
            'customer_id' => $validated['customer'],
        ]);

        return redirect()->route('pets')->with('status', 'success')->with('message', 'Pet cadastrado com sucesso.');
    }
}
