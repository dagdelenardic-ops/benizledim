<script setup>
const props = defineProps({
    name: { type: String, required: true },
    size: { type: Number, default: 24 },
    stroke: { type: String, default: 'currentColor' },
    fill: { type: String, default: 'none' },
});
</script>

<template>
    <svg
        :width="size"
        :height="size"
        :viewBox="'0 0 24 24'"
        :stroke="stroke"
        :fill="fill"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="display: inline-block; flex: none;"
    >
        <template v-if="name === 'play'">
            <path d="M7 5l12 7-12 7V5z" :fill="stroke" />
        </template>
        <template v-else-if="name === 'arrow-left'">
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </template>
        <template v-else-if="name === 'arrow-right'">
            <path d="M5 12h14M12 5l7 7-7 7" />
        </template>
        <template v-else-if="name === 'sound-on'">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.5 8.5a5 5 0 010 7" />
            <path d="M19 5a9 9 0 010 14" />
        </template>
        <template v-else-if="name === 'sound-off'">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M22 9l-6 6M16 9l6 6" />
        </template>
        <template v-else-if="name === 'share'">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </template>
        <template v-else-if="name === 'refresh'">
            <path d="M3 12a9 9 0 0115.2-6.5L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 01-15.2 6.5L3 16" />
            <path d="M3 21v-5h5" />
        </template>
        <template v-else-if="name === 'twitter'">
            <path :fill="stroke" stroke="none" d="M18.244 2H21l-6.523 7.452L22 22h-6.842l-4.79-6.26L4.8 22H2.044l6.99-7.987L2 2h6.91l4.34 5.74L18.244 2zm-1.166 18h1.832L7.04 4H5.062l12.016 16z" />
        </template>
        <template v-else-if="name === 'link'">
            <path d="M10 14a4 4 0 005.6.6l3-3a4 4 0 00-5.6-5.6L11 8" />
            <path d="M14 10a4 4 0 00-5.6-.6l-3 3a4 4 0 005.6 5.6L13 16" />
        </template>
        <template v-else>
            <circle cx="12" cy="12" r="9" />
        </template>
    </svg>
</template>
