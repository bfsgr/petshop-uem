<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Pet
 *
 * @property int $id
 * @property string $name
 * @property string $breed
 * @property string $type
 * @property string $birthdate
 * @property string $history
 * @property int $status
 * @property int $customer_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Pet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Pet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Pet query()
 * @method static \Illuminate\Database\Eloquent\Builder|Pet whereBirthdate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pet whereBreed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pet whereCustomerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pet whereHistory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pet whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pet whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pet whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pet whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class Pet extends Model
{
    use HasFactory;

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'birthdate' => 'date',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function getBirthdateAttribute($value)
    {
        return $this->asDateTime($value)->format('Y-m-d');
    }
}
