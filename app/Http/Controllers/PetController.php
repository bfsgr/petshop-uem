<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PetController extends Controller
{
    public function index(Request $request): Response
    {
        $page = $request->input('page', 1);

        $pets = Pet::query()
            ->with('user.subclass')
            ->orderBy('id', 'desc')
            ->paginate(10, ['*'], 'page', $page);


        return Inertia::render('Pets/List', [
            'pets' => $pets,
        ]);
    }
}
