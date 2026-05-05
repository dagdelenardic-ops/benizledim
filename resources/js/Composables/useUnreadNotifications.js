import { ref, onMounted } from 'vue';

export function useUnreadNotifications() {
    const unread = ref(0);

    const load = () => {
        try { unread.value = parseInt(localStorage.getItem('unread_count') || '0', 10); } catch { unread.value = 0; }
    };

    onMounted(load);

    const increment = () => { unread.value++; localStorage.setItem('unread_count', String(unread.value)); };
    const clear = () => { unread.value = 0; localStorage.removeItem('unread_count'); };

    return { unread, increment, clear, load };
}
