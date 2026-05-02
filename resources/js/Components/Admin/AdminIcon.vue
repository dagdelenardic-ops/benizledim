<script setup>
defineProps({
    name: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path v-if="name === 'dashboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z" />
        <path v-else-if="name === 'posts'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5h12M6 9h12M6 13h8M6 17h10" />
        <path v-else-if="name === 'folder'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h7l2 2h9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        <path v-else-if="name === 'tag'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13 13 20 4 11V4h7l9 9Z" />
        <path v-else-if="name === 'audio'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18V6l10-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3Zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3Z" />
        <path v-else-if="name === 'film'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16v14H4V5Zm4 0v14M16 5v14M4 9h4m8 0h4M4 15h4m8 0h4" />
        <path v-else-if="name === 'page'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 3h7l4 4v14H7V3Zm7 0v5h5" />
        <path v-else-if="name === 'comments'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 6h14v9H8l-3 3V6Z" />
        <path v-else-if="name === 'mail'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16v12H4V6Zm0 1 8 6 8-6" />
        <path v-else-if="name === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11a4 4 0 1 0-8 0m8 0a4 4 0 0 1-8 0m8 0c2.5.7 4 2.1 4 4v2H4v-2c0-1.9 1.5-3.3 4-4" />
        <path v-else-if="name === 'home'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z" />
        <path v-else-if="name === 'logout'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6v12h4m4-9 3 3-3 3m3-3H9" />
        <path v-else-if="name === 'menu'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h16" />
        <path v-else-if="name === 'check'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 13 4 4L19 7" />
        <path v-else-if="name === 'alert'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v5m0 4h.01M10.2 4.8 3 18h18L13.8 4.8a2 2 0 0 0-3.6 0Z" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14M5 12h14" />
    </svg>
</template>