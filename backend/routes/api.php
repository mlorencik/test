<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImageController;

Route::apiResource('images', ImageController::class);
