<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\SocialAuthController;
use Illuminate\Support\Facades\Route;

// Login page route for auth redirects
Route::get('/login', fn () => redirect('/'))->name('login');

// Email/Password auth
Route::post('/login', [AuthController::class, 'login'])->middleware('guest')->name('login.attempt');

// Social Auth
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
Route::get('/auth/facebook', [SocialAuthController::class, 'redirectToFacebook'])->name('auth.facebook');
Route::get('/auth/facebook/callback', [SocialAuthController::class, 'handleFacebookCallback'])->name('auth.facebook.callback');

// Logout
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');
