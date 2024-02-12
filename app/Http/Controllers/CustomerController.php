<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $page = $request->input('page', 1);

        $customers = User::where('type', Customer::class)
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
}
