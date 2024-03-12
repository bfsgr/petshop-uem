<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $page = $request->input('page', 1);

        $search = $request->input('search', '');

        $jobs = Job::query()
            ->with('pet.user.subclass')
            ->with('worker.subclass')
            ->whereHas('pet.user', function ($query) use ($user) {
                if ($user->type === Customer::class) {
                    $query->where('id', $user->id);
                }
            })
            ->whereHas('pet.user', fn ($query) => $query->where('name', 'like', "%$search%"))
            ->orderBy('id', 'desc')
            ->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Home', [
            'jobs' => $jobs,
        ]);
    }
}
