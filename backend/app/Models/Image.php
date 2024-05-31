<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Image
 *
 * @property int $id
 * @property string $filename
 * @property string $extension
 * @property int $size
 * @property int $width
 * @property int $height
 * @property string $name
 * @property string $email
 * @property float $temperature
 * @property array $exif
 *
 * @package App\Models
 */
class Image extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'images';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'filename',
        'extension',
        'size',
        'width',
        'height',
        'name',
        'email',
        'temperature',
        'exif',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'exif' => 'array',
        'temperature' => 'float',
    ];
}
