<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;

trait WeatherTrait
{
    /**
     * @throws \Exception
     */
    public function getTemperature()
    {
        try {
            $response = Http::get('https://api.open-meteo.com/v1/forecast', [
                'latitude' => 50.25841,
                'longitude' => 19.02754,
                'hourly' => 'temperature_2m',
                'timezone' => 'Europe/Warsaw',
                'forecast_days' => 1,
            ]);

            date_default_timezone_set('Europe/Warsaw');
            $temperatureKey = array_search(date('Y-m-d\TH:00'), $response['hourly']['time']);
            return $response['hourly']['temperature_2m'][$temperatureKey];
        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch weather data');
        }
    }
}
