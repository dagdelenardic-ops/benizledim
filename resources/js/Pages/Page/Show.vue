<script setup>
import { Link } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';

const props = defineProps({
    page: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <AppLayout :title="page.title">
        <div class="min-h-screen bg-gray-50">
            <!-- Hero Section -->
            <div class="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-16">
                <div class="max-w-7xl mx-auto px-4 text-center">
                    <h1 class="text-4xl md:text-5xl font-bold">{{ page.title }}</h1>
                </div>
            </div>

            <!-- Content Section -->
            <div class="max-w-4xl mx-auto px-4 py-12">
                <!-- Breadcrumb -->
                <div class="mb-8">
                    <Link href="/" class="text-gray-500 hover:text-red-600">Ana Sayfa</Link>
                    <span class="mx-2 text-gray-400">/</span>
                    <span class="text-gray-900 font-medium">{{ page.title }}</span>
                </div>

                <!-- Page Content -->
                <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <div 
                        class="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:hover:text-red-700 prose-strong:text-gray-900 prose-blockquote:border-l-red-500 prose-blockquote:bg-red-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                        v-html="page.content"
                    ></div>
                </div>

                <!-- Back to Home -->
                <div class="mt-12 text-center">
                    <Link 
                        href="/" 
                        class="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
/* Tailwind Typography ek stiller */
:deep(.prose) {
    max-width: none;
}

:deep(.prose img) {
    border-radius: 0.75rem;
    margin: 1.5rem 0;
}

:deep(.prose h2) {
    font-size: 1.875rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

:deep(.prose h3) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

:deep(.prose ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 1rem 0;
}

:deep(.prose ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin: 1rem 0;
}

:deep(.prose li) {
    margin: 0.5rem 0;
}
</style>
