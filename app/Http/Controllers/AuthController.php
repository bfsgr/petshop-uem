<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function login(): Response
    {
        return Inertia::render('Login');
    }

    public function authenticate(): RedirectResponse
    {
        return redirect('/login');
    }

    public function register(): Response
    {
        return Inertia::render('Register');
    }

    public function store(Request $request): RedirectResponse
    {
        return redirect('/register');
    }
}
