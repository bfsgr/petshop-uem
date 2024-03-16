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
            ->orderByRaw('
                CASE 
                    WHEN accepted_at IS NULL AND rejected_at IS NULL THEN 0
                    WHEN rejected_at IS NULL THEN 1
                    WHEN delivered_at IS NOT NULL THEN 2
                    ELSE 3
                END,
                COALESCE(accepted_at, rejected_at) DESC NULLS FIRST,
                notified_at, 
                finished_at, 
                groom_started_at, 
                bath_started_at, 
                preparing_at,
                delivered_at NULLS LAST'
            )
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

    public function edit_form(Request $request, int $id): Response
    {
        $job = Job::with('pet.user.subclass')->with('worker')->findOrFail($id);

        $search = $request->input('search', '');

        $customer_id = $request->input('customer_id', '');

        return Inertia::render('Home/Edit', [
            'job' => $job,
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

        $user = $request->user();

        if ($user->type === Customer::class && Pet::with('user')->findOrFail($request->input('pet'))['user']['id'] !== $user->id) {
            return redirect()->route('home')->with('status', 'error')->with('message',
                'Você não tem permissão para criar um agendamento para esse pet.');
        }

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

    public function update(Request $request, int $id): RedirectResponse
    {
        $user = $request->user();

        $job = Job::with('pet.user.subclass')->with('worker')->findOrFail($id);

        if ($user->type === Customer::class && $job->pet->user->id !== $user->id) {
            return redirect()->route('home')->with('status', 'error')->with('message',
                'Você não tem permissão para editar este agendamento.');
        }

        if ($user->type === Customer::class && ($job->accepted_at != null || $job['rejected_at'] != null)) {
            return redirect()->route('home')->with('status', 'error')->with('message',
                'Não é possível editar um agendamento já aceito ou rejeitado.');
        }

        if ($job['delivered_at'] != null) {
            return redirect()->route('home')->with('status', 'error')->with('message',
                'Não é possível editar um agendamento já finalizado.');
        }

        $request->validate([
            'date' => [
                'required', 'date', function ($attribute, $value, $fail) {
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
            'accepted_at' => 'date|nullable',
            'rejected_at' => 'date|nullable',
            'preparing_at' => 'date|nullable',
            'bath_started_at' => 'date|nullable',
            'groom_started_at' => 'date|nullable',
            'finished_at' => 'date|nullable',
            'notified_at' => 'date|nullable',
            'delivered_at' => 'date|nullable',
        ]);

        if ($user->type === Worker::class) {
            $job->update([
                'date' => $request->input('date'),
                'groom' => $request->input('groom'),
                'bath' => $request->input('bath'),
                'pet_id' => $request->input('pet'),
                'worker_id' => $request->input('worker'),
                'accepted_at' => $request->input('accepted_at'),
                'rejected_at' => $request->input('rejected_at'),
                'preparing_at' => $request->input('preparing_at'),
                'bath_started_at' => $request->input('bath_started_at'),
                'groom_started_at' => $request->input('groom_started_at'),
                'finished_at' => $request->input('finished_at'),
                'notified_at' => $request->input('notified_at'),
                'delivered_at' => $request->input('delivered_at'),
            ]);
        } else {
            $job->update([
                'date' => $request->input('date'),
                'groom' => $request->input('groom'),
                'bath' => $request->input('bath'),
                'pet_id' => $request->input('pet'),
                'worker_id' => $request->input('worker'),
            ]);
        }

        return redirect()->route('home')->with('status', 'success')->with('message',
            'Agendamento atualizado com sucesso.');
    }
}
