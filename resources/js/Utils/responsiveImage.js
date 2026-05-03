const LOCAL_STORAGE_PREFIX = '/storage/';

export const buildResponsiveImage = (path, options = {}) => {
    if (!path) {
        return {
            src: '',
            srcset: '',
            sizes: options.sizes || '',
        };
    }

    if (!path.startsWith(LOCAL_STORAGE_PREFIX)) {
        return {
            src: path,
            srcset: '',
            sizes: options.sizes || '',
        };
    }

    const widths = options.widths || [480, 768, 960, 1280];
    const fallbackWidth = options.fallbackWidth || widths[widths.length - 1];
    const buildVariantUrl = (width) => `/img/variant?path=${encodeURIComponent(path)}&w=${width}`;

    return {
        src: buildVariantUrl(fallbackWidth),
        srcset: widths.map((width) => `${buildVariantUrl(width)} ${width}w`).join(', '),
        sizes: options.sizes || '',
    };
};