<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImageRequest;
use App\Models\Image;
use App\Traits\ImageTrait;
use App\Traits\WeatherTrait;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ImageController extends Controller
{
    use WeatherTrait, ImageTrait;

    /**
     * @return LengthAwarePaginator
     */
    public function index(): LengthAwarePaginator
    {
        return Image::query()->orderBy('id', 'desc')->paginate(10);
    }

    /**
     * @param ImageRequest $request
     * @return JsonResponse
     */
    public function store(ImageRequest $request): JsonResponse
    {
        try {
            $image = $this->saveImage($request->file('image'));
            $imageModel = Image::create([
                'filename' => $image['newFileName'],
                'extension' => $image['extension'],
                'size' => $image['size'],
                'width' => $image['width'],
                'height' => $image['height'],
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'temperature' => $this->getTemperature(),
                'exif' => $image['exif'],
            ]);

            return response()->json($imageModel, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * @param Image $image
     * @return Application|Response|JsonResponse|\Illuminate\Contracts\Foundation\Application|ResponseFactory
     */
    public function show(Image $image): Application|Response|JsonResponse|\Illuminate\Contracts\Foundation\Application|ResponseFactory
    {
        return $this->download($image);
    }

    /**
     * @param ImageRequest $request
     * @param Image $image
     * @return JsonResponse
     */
    public function update(ImageRequest $request, Image $image): JsonResponse
    {
        $image->update($request->validated());

        return response()->json($image, 200);
    }

    /**
     * @param Image $image
     * @return JsonResponse
     */
    public function destroy(Image $image): JsonResponse
    {
        $image->delete();

        return response()->json(null, 204);
    }
}
