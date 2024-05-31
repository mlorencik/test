<?php

namespace App\Traits;

use App\Models\Image;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

trait ImageTrait
{
    /**
     * @param UploadedFile $file
     * @return array
     */
    public function saveImage(UploadedFile $file): array
    {
        $extension = $file->getClientOriginalExtension();
        $size = $file->getSize();

        $manager = new ImageManager(
            new Driver()
        );
        $image = $manager->read($file);
        $width = $image->width();
        $height = $image->height();
        $exif = $image->exif() ? json_encode($image->exif()) : null;
        $newFileName = time();

        Storage::disk('public')->put("images/{$newFileName}.{$extension}", (string)$image->encode());
        $thumbnail = $image->scale(height: 100);
        Storage::disk('public')->put("images/{$newFileName}_thumb.{$extension}", (string)$thumbnail->encode());

        return [
            'extension' => $extension,
            'size' => $size,
            'width' => $width,
            'height' => $height,
            'exif' => $exif,
            'newFileName' => $newFileName
        ];
    }

    /**
     * @param Image $image
     * @return Application|Response|JsonResponse|\Illuminate\Contracts\Foundation\Application|ResponseFactory
     */
    public function download(Image $image): Application|Response|JsonResponse|\Illuminate\Contracts\Foundation\Application|ResponseFactory
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
}
