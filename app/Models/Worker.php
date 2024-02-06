<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * App\Models\Worker
 *
 * @property int $id
 * @property string $role
 * @property string $hired_at
 * @property string|null $fired_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Worker newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Worker newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Worker query()
 * @method static \Illuminate\Database\Eloquent\Builder|Worker whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Worker whereFiredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Worker whereHiredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Worker whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Worker whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Worker whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class Worker extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fired_at',
        'hired_at',
        'role',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'hired_at' => 'date',
        'fired_at' => 'date',
    ];


    public function getHiredAtAttribute($value)
    {
        return $this->asDateTime($value)->format('Y-m-d');
    }


    public function getFiredAtAttribute($value)
    {
        if ($value !== null) {
            return $this->asDateTime($value)->format('Y-m-d');
        }
    }

    public function user(): MorphOne
    {
        return $this->morphOne(User::class, 'subclass', 'type', 'id');
    }
}
