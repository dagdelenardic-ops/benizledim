export function useDate() {
    const parseDate = (dateString) => {
        if (!dateString) {
            return null;
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return new Date(`${dateString}T00:00:00`);
        }

        return new Date(dateString);
    };

    const formatDate = (dateString) => {
        const date = parseDate(dateString);

        if (!date || Number.isNaN(date.getTime())) {
            return '';
        }

        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const timeAgo = (dateString) => {
        const date = parseDate(dateString);

        if (!date || Number.isNaN(date.getTime())) {
            return '';
        }

        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Bugün';
        if (diffDays === 1) return 'Dün';
        if (diffDays < 7) return `${diffDays} gün önce`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`;
        return `${Math.floor(diffDays / 365)} yıl önce`;
    };

    return { formatDate, timeAgo };
}
