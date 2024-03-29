<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use App\Rules\CpfRule;
use ErrorException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $page = $request->input('page', 1);
        $search = $request->input('search', '');

        $customers = User::where('type', Customer::class)
            ->where('name', 'like', "%$search%")
            ->with('subclass')
            ->orderBy('id', 'desc')
            ->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Customers/List', [
            'customers' => $customers,
        ]);
    }

    public function form(): Response
    {
        return Inertia::render('Customers/Create');
    }

    public function edit_form(Request $request, int $id): Response|RedirectResponse
    {
        $user = $request->user();

        if (\Gate::denies('edit-customers') && $user->id !== $id) {
            return redirect()->route('customers')->with('status', 'error')->with('message',
                'Você não tem permissão para editar clientes.');
        }

        $customer = User::where('type', Customer::class)->with('subclass')->find($id);

        if (! $customer) {
            return redirect()->route('customers')->with('status', 'error')->with('message', 'Cliente não encontrado.');
        }

        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    public function create(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required',
            'birthdate' => 'required|date|before:today',
            'cpf' => ['required', 'digits:11', 'unique:customers', new CpfRule],
            'cep' => 'required|digits:8',
            'number' => 'required',
            'address_info' => 'nullable',
            'password' => 'nullable|confirmed|min:8',
        ]);

        try {
            $cepInfo = json_decode(file_get_contents("https://brasilapi.com.br/api/cep/v1/$validated[cep]"), true);
        } catch (ErrorException $e) {
            return back()->withErrors(['cep' => 'CEP inválido.']);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'type' => Customer::class,
            'password' => Hash::make($validated['password'] ?? Str::random()),
        ]);

        $user->subclass()->create([
            'id' => $user->id,
            'cpf' => $validated['cpf'],
            'birthdate' => $validated['birthdate'],
            'cep' => $validated['cep'],
            'street' => $cepInfo['street'],
            'number' => $validated['number'],
            'district' => $cepInfo['neighborhood'],
            'city' => $cepInfo['city'],
            'state' => $cepInfo['state'],
            'address_info' => $validated['address_info'],
        ]);

        if (! $validated['password']) {
            Password::sendResetLink(['email' => $validated['email']]);

            return redirect()->route('customers')->with('status', 'success')->with('message', 'Cliente criado!');
        }

        auth()->login($user);

        return redirect()->route('home')->with('status', 'success')->with('message', 'Conta criada com sucesso!');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        if (\Gate::denies('edit-customers') && $request->user()->id !== $id) {
            return redirect()->route('customers')->with('status', 'error')->with('message',
                'Você não tem permissão para editar clientes.');
        }

        $user = User::where('type', Customer::class)->with('subclass')->find($id);

        $validated = $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'birthdate' => 'required|date|before:today',
            'cep' => 'required|digits:8',
            'number' => 'required',
            'address_info' => 'nullable',
        ]);

        try {
            $cepInfo = json_decode(file_get_contents("https://brasilapi.com.br/api/cep/v1/$validated[cep]"), true);
        } catch (ErrorException $e) {
            return back()->withErrors(['cep' => 'CEP inválido.']);
        }

        $user->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
        ]);

        $user->subclass()->update([
            'birthdate' => $validated['birthdate'],
            'cep' => $validated['cep'],
            'street' => $cepInfo['street'],
            'number' => $validated['number'],
            'district' => $cepInfo['neighborhood'],
            'city' => $cepInfo['city'],
            'state' => $cepInfo['state'],
            'address_info' => $validated['address_info'],
        ]);

        if ($request->user()->id === $id) {
            return redirect()->route('home')->with('status', 'success')->with('message', 'Perfil atualizado!');
        }

        return redirect()->route('customers')->with('status', 'success')->with('message', 'Cliente atualizado!');
    }
}
