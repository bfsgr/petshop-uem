<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password as PasswordFacade;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /*
     * GET /login
     * */
    public function login(): Response
    {
        return Inertia::render('Login');
    }

    /*
     * POST /login
     * */
    public function authenticate(): RedirectResponse
    {
        $validated = request()->validate([
            'email' => ['required', 'email'],
            'password' => ['required', Password::min(8)],
        ]);

        if (! auth()->attempt($validated)) {
            return back()->with(['status' => 'error', 'message' => __('auth.password')]);
        }

        request()->session()->regenerate();

        return redirect()->intended('/home');
    }

    /*
     * GET /logout
     * */
    public function logout(): RedirectResponse
    {
        auth()->logout();

        request()->session()->invalidate();

        request()->session()->regenerateToken();

        return redirect('/login');
    }

    /*
     * GET /configurar-senha/{token}?email={email}
     * */
    public function reset_password(Request $request, string $token): Response
    {

        return Inertia::render('ResetPassword', ['token' => $token, 'email' => $request->query('email')]);
    }

    /*
     * POST /nova-senha
     * */
    public function update_password(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = PasswordFacade::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();
            }
        );

        return $status === PasswordFacade::PASSWORD_RESET
            ? redirect('/login')->with('message', __($status))->with('status', 'success')
            : back()->withErrors(['email' => [__($status)]]);
    }

    /*
     * GET /register
     * */
    public function register(): Response
    {
        return Inertia::render('Register');
    }

    /*
     * POST /register
     * */
    public function store(Request $request): RedirectResponse
    {
        return redirect('/register');
    }
}
