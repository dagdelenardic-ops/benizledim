<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import RelatedPosts from '../../Components/Post/RelatedPosts.vue';
import CommentForm from '../../Components/Comment/CommentForm.vue';
import CommentList from '../../Components/Comment/CommentList.vue';
import WixComments from '../../Components/Comment/WixComments.vue';
import LikeButton from '../../Components/UI/LikeButton.vue';
import ShareButtons from '../../Components/Post/ShareButtons.vue';
import LoginModal from '../../Components/Auth/LoginModal.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
    relatedPosts: {
        type: Array,
        default: () => [],
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
});

const { formatDate, timeAgo } = useDate();
const showLoginModal = ref(false);

const formatReadingTime = (minutes) => {
    if (!minutes) return '2 dk okuma';
    return `${minutes} dk okuma`;
};

const openLoginModal = () => {
    showLoginModal.value = true;
};

const closeLoginModal = () => {
    showLoginModal.value = false;
};
</script>

<template>
    <AppLayout
        :title="post.title"
        :description="post.excerpt || 'Film, Dizi ve Belgesel eleştirileri - Ben İzledim'"
        :og-image="post.cover_image || '/images/og-default.jpg'"
    >
        <article class="min-h-screen bg-white">
            <!-- Cover Image -->
            <div class="w-full h-64 md:h-96 lg:h-[500px] bg-gray-900 relative overflow-hidden">
                <img
                    v-if="post.cover_image"
                    :src="post.cover_image"
                    :alt="post.title"
                    class="w-full h-full object-cover opacity-90"
                />
                <div
                    v-else
                    class="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center"
                >
                    <span class="text-white text-6xl font-bold">Bİ</span>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            </div>

            <!-- Content Container -->
            <div class="max-w-4xl mx-auto px-4 -mt-32 relative z-10">
                <div class="bg-white rounded-t-2xl md:rounded-2xl shadow-sm p-6 md:p-10">
                    <!-- Categories -->
                    <div class="flex flex-wrap gap-2 mb-4">
                        <Link
                            v-for="category in post.categories"
                            :key="category.id"
                            :href="`/yazilar?category=${category.slug}`"
                            class="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors"
                        >
                            {{ category.name }}
                        </Link>
                    </div>

                    <!-- Title -->
                    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {{ post.title }}
                    </h1>

                    <!-- Meta -->
                    <div class="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
                        <!-- Author -->
                        <Link
                            v-if="post.user"
                            :href="`/profile/${post.user.id}`"
                            class="flex items-center gap-2 hover:text-red-600 transition-colors"
                        >
                            <img
                                v-if="post.user.avatar"
                                :src="post.user.avatar"
                                :alt="post.user.name"
                                class="w-10 h-10 rounded-full object-cover"
                            />
                            <div
                                v-else
                                class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold"
                            >
                                {{ post.user.name?.charAt(0)?.toUpperCase() }}
                            </div>
                            <div>
                                <span class="block font-medium text-gray-900">{{ post.user.name }}</span>
                                <span class="text-gray-500">Yazar</span>
                            </div>
                        </Link>

                        <!-- Date -->
                        <div class="flex items-center gap-1">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{{ formatDate(post.published_at) }}</span>
                        </div>

                        <!-- Reading Time -->
                        <div class="flex items-center gap-1">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{{ formatReadingTime(post.reading_time_minutes) }}</span>
                        </div>

                        <!-- Views -->
                        <div class="flex items-center gap-1">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{{ post.view_count?.toLocaleString('tr-TR') }} görüntülenme</span>
                        </div>
                    </div>

                    <!-- Excerpt -->
                    <div v-if="post.excerpt" class="text-xl text-gray-600 italic mb-8 leading-relaxed">
                        {{ post.excerpt }}
                    </div>

                    <!-- Content -->
                    <div class="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:hover:text-red-700">
                        <div v-html="post.content"></div>
                    </div>

                    <!-- Tags -->
                    <div v-if="post.tags?.length > 0" class="mt-10 pt-8 border-t border-gray-200">
                        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Etiketler</h3>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="tag in post.tags"
                                :key="tag.id"
                                class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                                #{{ tag.name }}
                            </span>
                        </div>
                    </div>

                    <!-- Engagement Stats -->
                    <div class="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t border-gray-200">
                        <LikeButton
                            :post-slug="post.slug"
                            :likes-count="post.likes?.length || 0"
                            :is-liked="isLiked"
                            @open-login="openLoginModal"
                        />
                        <ShareButtons
                            :title="post.title"
                            :url="typeof window !== 'undefined' ? window.location.href : ''"
                        />
                    </div>
                </div>
            </div>

            <!-- Comments Section -->
            <div class="max-w-4xl mx-auto px-4 py-8">
                <CommentForm
                    :post-slug="post.slug"
                    @open-login="openLoginModal"
                />
                <CommentList :comments="post.comments || []" />
                
                <!-- Wix Legacy Comments -->
                <WixComments :comments="post.wix_comments || []" />
            </div>

            <!-- Related Posts -->
            <div class="max-w-7xl mx-auto px-4 py-12">
                <RelatedPosts :posts="relatedPosts" />
            </div>
        </article>

        <!-- Login Modal -->
        <LoginModal :show="showLoginModal" @close="closeLoginModal" />
    </AppLayout>
</template>
