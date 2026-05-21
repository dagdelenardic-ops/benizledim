<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
    ],

    'facebook' => [
        'client_id' => env('FACEBOOK_CLIENT_ID'),
        'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
        'redirect' => env('FACEBOOK_REDIRECT_URI'),
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'text_model' => env('GEMINI_TEXT_MODEL', 'gemini-2.5-flash'),
    ],

    'anthropic' => [
        'api_key' => env('ANTHROPIC_API_KEY'),
        'model' => env('ANTHROPIC_MODEL', 'claude-sonnet-4-5-20250514'),
    ],

    'flashnews' => [
        'token' => env('FLASHNEWS_TOKEN'),
    ],

    'tmdb' => [
        'access_token' => env('TMDB_ACCESS_TOKEN'),
        'api_key' => env('TMDB_API_KEY'),
        'base' => env('TMDB_BASE_URL', 'https://api.themoviedb.org/3'),
        'image_base' => env('TMDB_IMAGE_BASE_URL', 'https://image.tmdb.org/t/p'),
    ],

    'webpush' => [
        'vapid_public' => env('VAPID_PUBLIC_KEY'),
        'vapid_private' => env('VAPID_PRIVATE_KEY'),
        'vapid_subject' => env('VAPID_SUBJECT', 'mailto:gurursonmez@gmail.com'),
    ],

    'letterboxd' => [
        'sync_throttle_minutes' => (int) env('LETTERBOXD_SYNC_THROTTLE', 60),
        'base' => env('LETTERBOXD_BASE_URL', 'https://letterboxd.com'),
    ],

    'xai' => [
        'api_key' => env('XAI_API_KEY'),
        'image_model' => env('XAI_IMAGE_MODEL', 'grok-imagine-image-pro'),
    ],

    'gcp' => [
        'project_id' => env('GCP_PROJECT_ID'),
        'location' => env('GCP_LOCATION', 'global'),
        'datastore_id' => env('GCP_DATASTORE_ID'),
        'serving_config_id' => env('GCP_SERVING_CONFIG_ID', 'default_serving_config'),
        'search_enabled' => filter_var(env('GCP_SEARCH_ENABLED', false), FILTER_VALIDATE_BOOLEAN),
    ],

];
