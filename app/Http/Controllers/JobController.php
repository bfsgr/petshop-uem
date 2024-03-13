<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Job;
use App\Models\Pet;
use App\Models\User;
use App\Models\Worker;
use Carbon\Carbon;
use DateTimeZone;
use Illuminate\Http\RedirectResponse;
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

        return Inertia::render('Home/List', [
            'jobs' => $jobs,
        ]);
    }

    public function form(Request $request): Response
    {
        $search = $request->input('search', '');
        $customer_id = $request->input('customer_id', '');

        return Inertia::render('Home/Create', [
            'pets' => Inertia::lazy(
                fn () => Pet::where('customer_id', $customer_id)
                    ->where('name', 'like', "%$search%")
                    ->with('user')
                    ->take(10)
                    ->get(['id', 'name', 'customer_id'])
            ),
            'customers' => Inertia::lazy(
                fn () => User::where('type', Customer::class)
                    ->where('name', 'like', "%$search%")
                    ->take(10)
                    ->get(['id', 'name'])
            ),
            'workers' => Inertia::lazy(
                fn () => User::where('type', Worker::class)
                    ->where('name', 'like', "%$search%")
                    ->take(10)
                    ->get(['id', 'name'])
            ),
        ]);
    }

    public function create(Request $request): RedirectResponse
    {
        $request->validate([
            'date' => [
                'required', 'date', 'after:now', function ($attribute, $value, $fail) {
                    $date = Carbon::parse($value);

                    if ($date->isWeekend()) {
                        $fail('Não é possível agendar para finais de semana.');

                        return;
                    }

                    $start = Carbon::create($date->year, $date->month, $date->day, 8, 0, 0,
                        new DateTimeZone('America/Sao_Paulo'));
                    $end = Carbon::create($date->year, $date->month, $date->day, 18, 0, 0,
                        new DateTimeZone('America/Sao_Paulo'));

                    if (! $date->betweenIncluded($start, $end)) {
                        $fail('Não é possível agendar para este horário.');
                    }
                },
            ],
            'groom' => 'required|boolean',
            'bath' => 'required|boolean',
            'pet' => 'required|exists:pets,id',
            'worker' => [
                'required', 'exists:users,id', function ($attribute, $value, $fail) {
                    $user = User::findOrFail($value);
                    if ($user->type !== Worker::class) {
                        $fail('O usuário selecionado não é um funcionário.');
                    }
                },
            ],
        ]);

        Job::create([
            'date' => $request->input('date'),
            'groom' => $request->input('groom'),
            'bath' => $request->input('bath'),
            'pet_id' => $request->input('pet'),
            'worker_id' => $request->input('worker'),
        ]);

        return redirect()->route('home')->with('status', 'success')->with('message',
            'Agendamento cadastrado com sucesso.');
    }
}
