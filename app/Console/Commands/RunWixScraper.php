<?php

namespace App\Console\Commands;

use App\Jobs\RunExternalScriptJob;
use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class RunWixScraper extends Command
{
    protected $signature = 'wix:scrape
        {--full : Full scrape (categories/users/pages/comments dahil)}
        {--queued : Scraper\'ı queue job olarak kuyruğa bırak}
        {--python= : Kullanılacak Python binary (varsayılan env: SCRAPER_PYTHON_BINARY)}
        {--timeout= : Process timeout saniye (varsayılan env: SCRAPER_PROCESS_TIMEOUT)}';

    protected $description = 'Wix scraper scriptlerini sync veya queue üzerinden çalıştır';

    public function handle(): int
    {
        $script = $this->option('full')
            ? base_path('scripts/scrape_full_wix.py')
            : base_path('scripts/scrape_wix.py');

        if (!is_file($script)) {
            $this->error("Script bulunamadı: {$script}");
            return self::FAILURE;
        }

        $pythonBinary = (string) ($this->option('python') ?: env('SCRAPER_PYTHON_BINARY', 'python3'));
        $timeout = (int) ($this->option('timeout') ?: env('SCRAPER_PROCESS_TIMEOUT', 1800));

        if ($this->option('queued')) {
            RunExternalScriptJob::dispatch(
                scriptPath: $script,
                arguments: [],
                workingDirectory: base_path(),
                pythonBinary: $pythonBinary,
                processTimeout: $timeout
            )->onQueue('scrapers');

            $this->info("Queue'ya eklendi: {$script}");
            return self::SUCCESS;
        }

        $this->info("Çalıştırılıyor: {$pythonBinary} {$script}");
        $process = new Process([$pythonBinary, $script], base_path(), timeout: $timeout);

        $exitCode = $process->run(function (string $type, string $buffer): void {
            if ($type === Process::ERR) {
                $this->error(rtrim($buffer));
                return;
            }

            $this->line(rtrim($buffer));
        });

        if ($exitCode !== 0) {
            $this->error("Scraper hata ile tamamlandı (exit code: {$exitCode}).");
            return self::FAILURE;
        }

        $this->info('Scraper başarıyla tamamlandı.');
        return self::SUCCESS;
    }
}
