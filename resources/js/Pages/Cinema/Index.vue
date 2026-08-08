<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';

const props = defineProps({
    cinemas: { type: Array, default: () => [] },
    districts: { type: Array, default: () => [] },
    filters: { type: Object, default: () => ({}) },
});

const selectedDistrict = ref(props.filters.district || '');
const mapContainer = ref(null);
let map = null;
let markersLayer = null;

const filteredCinemas = computed(() => {
    if (!selectedDistrict.value) return props.cinemas;
    return props.cinemas.filter(c => c.district === selectedDistrict.value);
});

const filterByDistrict = (district) => {
    selectedDistrict.value = district;
    router.get('/sinemalar', district ? { district } : {}, {
        preserveState: true,
        preserveScroll: true,
    });
};

const syncSelectedDistrict = (district) => {
    selectedDistrict.value = district || '';
};

const renderMarkers = async () => {
    if (!map) return;

    const L = await import('leaflet');

    if (markersLayer) {
        markersLayer.clearLayers();
    } else {
        markersLayer = L.layerGroup().addTo(map);
    }

    const redIcon = L.divIcon({
        html: '<div style="background:#DC2626;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>',
        className: '',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });

    const cinemasWithCoordinates = filteredCinemas.value.filter(
        (cinema) => cinema.latitude && cinema.longitude,
    );

    cinemasWithCoordinates.forEach((cinema) => {
        L.marker([cinema.latitude, cinema.longitude], { icon: redIcon })
            .addTo(markersLayer)
            .bindPopup(`
                <strong>${cinema.name}</strong><br>
                <small>${cinema.district}</small><br>
                <a href="/sinema/${cinema.slug}" style="color:#DC2626">Detay</a>
            `);
    });

    if (cinemasWithCoordinates.length === 0) {
        map.setView([41.0082, 28.9784], 12);
        return;
    }

    if (cinemasWithCoordinates.length === 1) {
        map.setView([cinemasWithCoordinates[0].latitude, cinemasWithCoordinates[0].longitude], 14);
        return;
    }

    map.fitBounds(markersLayer.getBounds(), { padding: [32, 32] });
};

onMounted(async () => {
    if (!mapContainer.value) return;

    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');

    map = L.map(mapContainer.value).setView([41.0082, 28.9784], 12); // Istanbul center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    await renderMarkers();
});

watch(() => props.filters.district, syncSelectedDistrict);
watch(filteredCinemas, () => {
    renderMarkers();
});

onBeforeUnmount(() => {
    if (map) {
        map.remove();
        map = null;
        markersLayer = null;
    }
});
</script>

<template>
    <AppLayout>
        <div class="min-h-screen bg-gray-50">
            <!-- Header -->
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 py-8">
                    <h1 class="text-3xl font-bold text-gray-900">Sinema Haritası</h1>
                    <p class="mt-2 text-gray-600">İstanbul'daki bağımsız sinemalar, gösterimdeki filmler ve kullanıcı yorumları</p>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 py-8">
                <!-- Map -->
                <div ref="mapContainer" class="w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-sm mb-8 bg-gray-200"></div>

                <!-- District Filter -->
                <div class="flex flex-wrap gap-2 mb-6">
                    <button
                        @click="filterByDistrict('')"
                        class="px-4 py-1.5 text-sm font-medium rounded-full transition-colors"
                        :class="!selectedDistrict ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
                    >
                        Tumu
                    </button>
                    <button
                        v-for="district in districts"
                        :key="district"
                        @click="filterByDistrict(district)"
                        class="px-4 py-1.5 text-sm font-medium rounded-full transition-colors"
                        :class="selectedDistrict === district ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
                    >
                        {{ district }}
                    </button>
                </div>

                <!-- Cinema Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        v-for="cinema in filteredCinemas"
                        :key="cinema.id"
                        :href="`/sinema/${cinema.slug}`"
                        class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <img
                            v-if="cinema.photo"
                            :src="cinema.photo"
                            :alt="cinema.name"
                            class="w-full h-48 object-cover"
                        />
                        <div v-else class="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <div class="p-4">
                            <h3 class="font-bold text-gray-900">{{ cinema.name }}</h3>
                            <p class="text-sm text-gray-500 mt-1">{{ cinema.district }} &middot; {{ cinema.address }}</p>
                            <div class="flex items-center gap-3 mt-3 text-sm text-gray-500">
                                <span v-if="cinema.current_screenings?.length">
                                    {{ cinema.current_screenings.length }} film gosterimde
                                </span>
                                <span v-if="cinema.reviews_count">
                                    {{ cinema.reviews_count }} yorum
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div v-if="filteredCinemas.length === 0" class="text-center py-16 text-gray-400">
                    Bu bolgede sinema bulunamadi.
                </div>
            </div>
        </div>
    </AppLayout>
</template>
