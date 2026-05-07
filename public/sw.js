// Root-scope shim: imports the actual workbox-built service worker.
// Registered at /sw.js so the worker controls the entire origin (scope '/'),
// allowing pushManager.subscribe() and serviceWorker.ready to resolve on
// pages outside /build/.
importScripts('/build/sw.js');
