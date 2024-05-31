<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImageRequest;
use App\Models\Image;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImageController extends Controller
{
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
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $size = $file->getSize();

            $manager = new ImageManager(
                new Driver()
            );;
            $image = $manager->read($file);
            $width = $image->width();
            $height = $image->height();
            $exif = $image->exif() ? json_encode($image->exif()) : null;
            $newFileName = time();

            $response = Http::get('https://api.open-meteo.com/v1/forecast', [
                'latitude' => 50.25841,
                'longitude' => 19.02754,
                'hourly' => 'temperature_2m',
                'timezone' => 'Europe/Warsaw',
                'forecast_days' => 1,
            ]);
            if ($response->successful()) {
                Storage::disk('public')->put("images/{$newFileName}.{$extension}", (string)$image->encode());
                $thumbnail = $image->scale(height: 100);
                Storage::disk('public')->put("images/{$newFileName}_thumb.{$extension}", (string)$thumbnail->encode());

                date_default_timezone_set('Europe/Warsaw');
                $temperatureKey = array_search(date('Y-m-d\TH:00'), $response['hourly']['time']);

                $imageModel = Image::create([
                    'filename' => $newFileName,
                    'extension' => $extension,
                    'size' => $size,
                    'width' => $width,
                    'height' => $height,
                    'name' => $request->input('name'),
                    'email' => $request->input('email'),
                    'temperature' => $response['hourly']['temperature_2m'][$temperatureKey],
                    'exif' => $exif,
                ]);

                return response()->json($imageModel, 201);
            } else {
                throw new \Exception('Failed to fetch weather data');
            }

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
        $imagePath = "images/{$image->filename}.{$image->extension}";
        if (Storage::disk('public')->exists($imagePath)) {
            $fileContent = Storage::disk('public')->get($imagePath);
            $mimeType = Storage::disk('public')->mimeType($imagePath);

            $response = response($fileContent);
            $response->header('Content-Type', $mimeType);
            $response->header('Content-Disposition', "attachment; filename={$image->filename}.{$image->extension}");
            return $response;
        }

        return response()->json(['error' => 'File not found'], 404);
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
