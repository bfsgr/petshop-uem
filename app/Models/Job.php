<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Job
 *
 * @property int $id
 * @property int $bath
 * @property int $groom
 * @property string $date
 * @property int $pet_id
 * @property int $worker_id
 * @property string|null $accepted_at
 * @property string|null $rejected_at
 * @property string|null $preparing_at
 * @property string|null $bath_started_at
 * @property string|null $groom_started_at
 * @property string|null $finished_at
 * @property string|null $notified_at
 * @property string|null $delivered_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Job newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Job newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Job query()
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereAcceptedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereBath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereBathStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereDeliveredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereFinishedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereGroom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereGroomStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereNotifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job wherePetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job wherePreparingAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereRejectedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Job whereWorkerId($value)
 *
 * @mixin \Eloquent
 */
class Job extends Model
{
    use HasFactory;

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'bath' => 'boolean',
        'groom' => 'boolean',
        'date' => 'datetime',
        'accepted_at' => 'datetime',
        'rejected_at' => 'datetime',
        'preparing_at' => 'datetime',
        'bath_started_at' => 'datetime',
        'groom_started_at' => 'datetime',
        'finished_at' => 'datetime',
        'notified_at' => 'datetime',
        'delivered_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class, 'pet_id');
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'worker_id');
    }
}
