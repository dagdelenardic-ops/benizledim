<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

const props = defineProps({
    series: {
        type: Array,
        required: true,
    },
});

const formatLabel = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
};

const chartData = computed(() => ({
    labels: props.series.map((p) => formatLabel(p.date)),
    datasets: [
        {
            label: 'Görüntüleme',
            data: props.series.map((p) => p.total_pageviews),
            borderColor: '#dc2626',
            backgroundColor: 'rgba(220, 38, 38, 0.12)',
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
        },
        {
            label: 'Tekil Ziyaretçi',
            data: props.series.map((p) => p.unique_visitors),
            borderColor: '#101010',
            backgroundColor: 'rgba(16, 16, 16, 0.06)',
            borderWidth: 2,
            borderDash: [4, 4],
            fill: false,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
        },
    ],
}));

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11, weight: 'bold' } },
        },
        tooltip: {
            backgroundColor: '#101010',
            titleFont: { weight: 'bold' },
            padding: 10,
        },
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: '#525252' },
        },
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: { font: { size: 11 }, color: '#525252', precision: 0 },
        },
    },
    interaction: { mode: 'index', intersect: false },
};
</script>

<template>
    <div class="relative h-64">
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>
