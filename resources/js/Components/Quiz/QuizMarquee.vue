<script setup>
</script>

<template>
    <div class="qz-marquee">
        <div class="qz-marquee__track">
            <span v-for="n in 2" :key="n">
                <slot />
            </span>
        </div>
    </div>
</template>
