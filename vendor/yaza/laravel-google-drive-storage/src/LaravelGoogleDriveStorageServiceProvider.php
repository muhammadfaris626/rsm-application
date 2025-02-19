<?php

namespace Yaza\LaravelGoogleDriveStorage;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;
use Yaza\LaravelGoogleDriveStorage\Commands\LaravelGoogleDriveStorageCommand;

class LaravelGoogleDriveStorageServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        /*
         * This class is a Package Service Provider
         *
         * More info: https://github.com/spatie/laravel-package-tools
         */
        $package
            ->name('laravel-google-drive-storage')
            ->hasConfigFile()
            ->hasViews()
            ->hasMigration('create_laravel-google-drive-storage_table')
            ->hasCommand(LaravelGoogleDriveStorageCommand::class);
    }

    public function bootingPackage()
    {
        try {
            Storage::extend('google', function ($app, $config) {
                $options = [];

                if (! empty($config['teamDriveId'] ?? null)) {
                    $options['teamDriveId'] = $config['teamDriveId'];
                }

                $client = new \Google\Client();
                $client->setClientId($config['clientId']);
                $client->setClientSecret($config['clientSecret']);
                $client->refreshToken($config['refreshToken']);

                $service = new \Google\Service\Drive($client);
                $adapter = new \Masbug\Flysystem\GoogleDriveAdapter($service, $config['folder'] ?? '/', $options);
                $driver = new \League\Flysystem\Filesystem($adapter);

                return new \Illuminate\Filesystem\FilesystemAdapter($driver, $adapter);
            });
        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}
