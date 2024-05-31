<?php

namespace App\Http\Requests;

use App\Rules\MinimumResolution;
use Illuminate\Foundation\Http\FormRequest;

class ImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp,tiff,bmp', 'max:5120', new MinimumResolution(500, 500)],
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'Pole obrazu jest wymagane.',
            'image.image' => 'Pole obrazu musi być obrazem.',
            'image.mimes' => 'Pole obrazu musi być plikiem typu: jpeg, png, jpg, webp, tiff, bmp.',
            'image.max' => 'Pole obrazu nie może być większy niż 5 MB.',
            'name.required' => 'Pole imię jest wymagane.',
            'name.string' => 'Pole imię musi być ciągiem znaków.',
            'name.max' => 'Pole imię nie może być dłuższe niż 255 znaków.',
            'email.required' => 'Pole email jest wymagane.',
            'email.email' => 'Pole email musi być prawidłowym adresem email.',
            'email.max' => 'Pole email nie może być dłuższe niż 255 znaków.',
        ];
    }
}
