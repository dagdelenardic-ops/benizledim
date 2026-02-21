<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;
use Symfony\Component\Process\Process;

class RunExternalScriptJob implements ShouldQueue
{
    use Queueable;

    public int $timeout = 3600;
    public int $tries = 1;

    /**
     * @param array<int, string> $arguments
     */
    public function __construct(
        public string $scriptPath,
        public array $arguments = [],
        public ?string $workingDirectory = null,
        public ?string $pythonBinary = null,
        public ?int $processTimeout = null,
    ) {
    }

    public function handle(): void
    {
        $pythonBinary = $this->pythonBinary ?: (string) env('SCRAPER_PYTHON_BINARY', 'python3');
        $workingDirectory = $this->workingDirectory ?: base_path();
        $processTimeout = $this->processTimeout ?: (int) env('SCRAPER_PROCESS_TIMEOUT', 1800);

        $command = array_merge([$pythonBinary, $this->scriptPath], $this->arguments);

        Log::info('External script job started.', [
            'script' => $this->scriptPath,
            'working_directory' => $workingDirectory,
            'timeout' => $processTimeout,
        ]);

        $process = new Process($command, $workingDirectory, timeout: $processTimeout);
        $process->run();

        $combinedOutput = trim($process->getOutput() . "\n" . $process->getErrorOutput());
        if ($combinedOutput !== '') {
            Log::info('External script job output.', [
                'script' => $this->scriptPath,
                'output' => Str::limit($combinedOutput, 4000),
            ]);
        }

        if (!$process->isSuccessful()) {
            throw new RuntimeException(
                sprintf(
                    'External script failed (%s): %s',
                    $this->scriptPath,
                    $process->getErrorOutput() ?: $process->getOutput()
                )
            );
        }

        Log::info('External script job finished successfully.', ['script' => $this->scriptPath]);
    }
}
