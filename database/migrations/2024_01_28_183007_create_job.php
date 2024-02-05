<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->boolean('bath');
            $table->boolean('groom');
            $table->datetime('date');
            $table->foreignId('pet_id')->constrained('pet');
            $table->foreignId('worker_id')->constrained('worker');
            $table->dateTime('accepted_at')->nullable();
            $table->dateTime('rejected_at')->nullable();
            $table->dateTime('preparing_at')->nullable();
            $table->dateTime('bath_started_at')->nullable();
            $table->dateTime('groom_started_at')->nullable();
            $table->dateTime('finished_at')->nullable();
            $table->dateTime('notified_at')->nullable();
            $table->dateTime('delivered_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
