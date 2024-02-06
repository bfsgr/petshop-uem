<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Worker;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@petshop.uem.br',
            'phone' => '44999999999',
            'type' => Worker::class,
            'password' => bcrypt('password'),
        ]);

        $worker = new Worker([
            'id' => $admin->id,
            'role' => 'manager',
            'hired_at' => now(),
        ]);

        $worker->save();
    }
}
