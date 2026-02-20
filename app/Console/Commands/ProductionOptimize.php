<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ProductionOptimize extends Command
{
    protected $signature = 'production:optimize';
    protected $description = 'Production için tüm optimizasyonları uygula';

    public function handle()
    {
        $this->info('🚀 Production optimizasyonları başlıyor...');

        $this->call('config:cache');
        $this->info('✅ Config cache oluşturuldu');

        $this->call('route:cache');
        $this->info('✅ Route cache oluşturuldu');

        $this->call('view:cache');
        $this->info('✅ View cache oluşturuldu');

        $this->call('event:cache');
        $this->info('✅ Event cache oluşturuldu');

        $this->info('');
        $this->info('🎉 Tüm optimizasyonlar tamamlandı!');
        $this->info('');
        $this->info('Yapılması gerekenler:');
        $this->info('  1. npm run build (Vite production build)');
        $this->info('  2. php artisan storage:link');
        $this->info('  3. php artisan migrate --force');

        return 0;
    }
}
