<?php
namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Http\UploadedFile;

class MinimumResolution implements Rule
{
    protected $minWidth;
    protected $minHeight;

    public function __construct($minWidth = 500, $minHeight = 500)
    {
        $this->minWidth = $minWidth;
        $this->minHeight = $minHeight;
    }

    public function passes($attribute, $value)
    {
        if ($value instanceof UploadedFile) {
            $imageSize = getimagesize($value);
            if ($imageSize) {
                $width = $imageSize[0];
                $height = $imageSize[1];
                return $width >= $this->minWidth && $height >= $this->minHeight;
            }
        }
        return false;
    }

    public function message()
    {
        return "Obraz musi mieć co najmniej {$this->minWidth} x {$this->minHeight} pikseli.";
    }
}
