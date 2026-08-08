<script setup>
import { ref } from 'vue';
import { useForm, usePage } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import LoginModal from '../../Components/Auth/LoginModal.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    cinema: { type: Object, required: true },
    averageRating: { type: Number, default: null },
    userReview: { type: Object, default: null },
});

const page = usePage();
const authUser = page.props.auth?.user;
const { formatDate } = useDate();
const showLoginModal = ref(false);

const reviewForm = useForm({
    rating: props.userReview?.rating || 0,
    content: props.userReview?.content || '',
});

const submitReview = () => {
    if (!authUser) {
        showLoginModal.value = true;
        return;
    }
    reviewForm.post(`/sinema/${props.cinema.slug}/yorum`, {
        preserveScroll: true,
    });
};

const hoverRating = ref(0);

const stars = [1, 2, 3, 4, 5];
</script>

<template>
    <AppLayout>
        <div class="min-h-screen bg-white">
            <!-- Header -->
            <div class="bg-gray-900 text-white">
                <div class="max-w-4xl mx-auto px-4 py-12">
                    <h1 class="text-3xl font-bold">{{ cinema.name }}</h1>
                    <p class="mt-2 text-gray-300">{{ cinema.district }} &middot; {{ cinema.address }}</p>
                    <div class="flex items-center gap-4 mt-4 text-sm text-gray-400">
                        <a v-if="cinema.website" :href="cinema.website" target="_blank" class="hover:text-white">Web sitesi</a>
                        <span v-if="cinema.phone">{{ cinema.phone }}</span>
                        <span v-if="averageRating" class="flex items-center gap-1">
                            <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {{ averageRating }}/5 ({{ cinema.reviews_count }} yorum)
                        </span>
                    </div>
                </div>
            </div>

            <div class="max-w-4xl mx-auto px-4 py-8">
                <!-- Description -->
                <div v-if="cinema.description" class="prose prose-lg max-w-none mb-8">
                    <p>{{ cinema.description }}</p>
                </div>

                <!-- Current Screenings -->
                <section v-if="cinema.screenings?.length > 0" class="mb-10">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">Gosterimdeki Filmler</h2>
                    <div class="space-y-3">
                        <div
                            v-for="screening in cinema.screenings"
                            :key="screening.id"
                            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div>
                                <h3 class="font-semibold text-gray-900">{{ screening.title }}</h3>
                                <p v-if="screening.original_title" class="text-sm text-gray-500">{{ screening.original_title }}</p>
                                <p v-if="screening.notes" class="text-sm text-gray-500 mt-1">{{ screening.notes }}</p>
                            </div>
                            <div class="text-right text-sm text-gray-500">
                                <p>{{ formatDate(screening.starts_at) }}</p>
                                <p v-if="screening.ends_at">- {{ formatDate(screening.ends_at) }}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Reviews -->
                <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-4">Yorumlar</h2>

                    <!-- Review Form -->
                    <div class="bg-gray-50 rounded-xl p-6 mb-6">
                        <h3 class="text-sm font-semibold text-gray-700 mb-3">
                            {{ userReview ? 'Yorumunuzu guncelleyin' : 'Yorum yapin' }}
                        </h3>
                        <form @submit.prevent="submitReview">
                            <!-- Star Rating -->
                            <div class="flex items-center gap-1 mb-3">
                                <button
                                    v-for="star in stars"
                                    :key="star"
                                    type="button"
                                    @click="reviewForm.rating = star"
                                    @mouseenter="hoverRating = star"
                                    @mouseleave="hoverRating = 0"
                                    class="focus:outline-none"
                                >
                                    <svg
                                        class="w-7 h-7 transition-colors"
                                        :class="(hoverRating || reviewForm.rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            </div>

                            <textarea
                                v-model="reviewForm.content"
                                rows="3"
                                placeholder="Bu sinema hakkinda ne dusunuyorsunuz?"
                                maxlength="500"
                                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                            ></textarea>
                            <p v-if="reviewForm.errors.content" class="mt-1 text-xs text-red-600">{{ reviewForm.errors.content }}</p>

                            <div class="mt-3 flex justify-end">
                                <button
                                    type="submit"
                                    :disabled="reviewForm.processing || !reviewForm.rating || !reviewForm.content.trim()"
                                    class="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {{ userReview ? 'Guncelle' : 'Gonder' }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Review List -->
                    <div v-if="cinema.reviews?.length > 0" class="space-y-4">
                        <div
                            v-for="review in cinema.reviews"
                            :key="review.id"
                            class="p-4 border border-gray-100 rounded-lg"
                        >
                            <div class="flex items-center gap-2 mb-2">
                                <img
                                    v-if="review.user?.avatar"
                                    :src="review.user.avatar"
                                    class="w-8 h-8 rounded-full"
                                />
                                <div v-else class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                    {{ review.user?.name?.charAt(0)?.toUpperCase() }}
                                </div>
                                <span class="text-sm font-medium text-gray-700">{{ review.user?.name }}</span>
                                <div class="flex items-center gap-0.5 ml-auto">
                                    <svg v-for="s in 5" :key="s" class="w-4 h-4" :class="s <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            </div>
                            <p class="text-sm text-gray-700">{{ review.content }}</p>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-gray-400 text-sm">
                        Henuz yorum yok. Ilk siz yazin!
                    </div>
                </section>
            </div>
        </div>

        <LoginModal :show="showLoginModal" @close="showLoginModal = false" />
    </AppLayout>
</template>
