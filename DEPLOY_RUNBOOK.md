# Deployment Runbook (cPanel / Shared Hosting)

## GitHub Secrets
Set these in repository secrets:

- `FTP_SERVER` (required)
- `FTP_USERNAME` (required)
- `FTP_PASSWORD` (required)
- `DEPLOY_HEALTHCHECK_URL` (optional, e.g. `https://benizledim.store/up`)
- `SSH_HOST` / `SSH_USERNAME` / `SSH_PRIVATE_KEY` (optional, enables post-deploy optimize+migrate)
- `SSH_APP_PATH` (optional, default: `$HOME/public_html`)

## cPanel Cron (Required)
Add one cron for Laravel scheduler:

```bash
* * * * * /usr/local/bin/php /home/<cpanel_user>/public_html/artisan schedule:run >> /home/<cpanel_user>/logs/scheduler.log 2>&1
```

If you prefer queue worker via scheduler, set:

```env
RUN_QUEUE_WORKER_VIA_SCHEDULER=true
```

Then scheduler will run:

- `queue:work --stop-when-empty --queue=default,scrapers --tries=1 --timeout=120`

## Optional Scheduled Scraper
Enable in `.env`:

```env
RUN_WIX_SCRAPER_SCHEDULED=true
WIX_SCRAPER_DAILY_AT=03:00
SCRAPER_PYTHON_BINARY=python3
SCRAPER_PROCESS_TIMEOUT=1800
SCRAPER_TIMEOUT_MS=60000
SCRAPER_DELAY_SECONDS=1.5
SCRAPER_MAX_RETRIES=3
WIX_BASE_URL=https://www.benizledim.com
```

This schedules:

- `php artisan wix:scrape --queued`

Queue name used: `scrapers`.

## Manual Scraper Commands

```bash
php artisan wix:scrape
php artisan wix:scrape --full
php artisan wix:scrape --queued
```

## Notes

- Keep `APP_DEBUG=false` in production.
- Do not keep operational debug probes under `public/`.
- Do not commit real `.env` files; use `.env.example` as template.
