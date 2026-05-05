# Deployment Runbook (cPanel / Shared Hosting)

## GitHub Secrets
Set these in repository secrets:

- `FTP_SERVER` (required)
- `FTP_USERNAME` (required)
- `FTP_PASSWORD` (required)
- `DEPLOY_HEALTHCHECK_URL` (optional, e.g. `https://benizledim.com/up`)
- `SSH_HOST` / `SSH_USERNAME` / `SSH_PRIVATE_KEY` (optional, enables post-deploy optimize+migrate)
- `SSH_PASSPHRASE` (optional, required if your SSH private key is encrypted)
- `SSH_APP_PATH` (optional, default: `$HOME/public_html`)

## SSH Setup (Recommended)
For agent-friendly operations, prefer SSH over manual cPanel edits.

1. In cPanel, open `SSH Access` and authorize your public key.
2. Download the matching private key from cPanel.
3. Save these GitHub secrets:
   - `SSH_HOST`
   - `SSH_USERNAME`
   - `SSH_PRIVATE_KEY`
   - `SSH_PASSPHRASE` if the key has a passphrase
   - `SSH_APP_PATH=/home/<cpanel_user>/public_html`

With these set, the deploy workflow can run post-deploy Laravel commands and the `Remote Artisan` workflow can run one-off commands such as:

```bash
wix:apply-author-report output/spreadsheet/wix-author-resolution.csv --dry-run
```

Post-deploy command order is:

```bash
php artisan optimize:clear
php artisan migrate --force
php artisan config:cache
php artisan view:cache
php artisan event:cache
```

Do not run `route:cache` until closure routes are removed.

Temporary public maintenance endpoints such as `public/recache.php` and
`/_ops/*` must stay removed. Use SSH post-deploy commands above, or run the same
Artisan commands manually from cPanel Terminal when SSH automation is not
configured.

## Faz A Production Checklist

Set or verify these production environment values before final smoke testing:

```env
TMDB_API_KEY=<user-provided key>
VAPID_PUBLIC_KEY=<local generated public key>
VAPID_PRIVATE_KEY=<local generated private key>
VAPID_SUBJECT=mailto:gurursonmez@gmail.com
LETTERBOXD_SYNC_THROTTLE=60
```

Then run:

```bash
php -m | grep -i gmp
php artisan optimize:clear
php artisan migrate --force
php artisan config:cache
php artisan view:cache
php artisan event:cache
```

If `gmp` is missing, enable it from cPanel PHP Selector before relying on web
push.

## Optional Inertia SSR
The repository now builds both client and SSR bundles with:

```bash
npm run build
```

This produces the server bundle under `bootstrap/ssr/`.

If the host supports a persistent Node.js process, start SSR with:

```bash
php artisan inertia:start-ssr
```

On shared hosting where a long-running Node.js process is not available, the app safely falls back to client rendering while keeping the SSR bundle ready for compatible environments.

## Production Domain Baseline
Use these production values when the canonical host is `https://benizledim.com`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://benizledim.com
FRONTEND_URL=https://benizledim.com
GOOGLE_REDIRECT_URI=https://benizledim.com/auth/google/callback
CANONICAL_REDIRECT_HOSTS=www.benizledim.com,benizledim.store,www.benizledim.store
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=true
```

Expected host behavior:

- `https://benizledim.com/*` serves the app
- `https://www.benizledim.com/*` returns `301` to `https://benizledim.com/*`
- `https://benizledim.store/*` returns `301` to `https://benizledim.com/*`
- `https://www.benizledim.store/*` returns `301` to `https://benizledim.com/*`

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
