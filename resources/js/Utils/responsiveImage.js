const LOCAL_STORAGE_PREFIX = '/storage/';
const WIX_CDN_PREFIX = 'https://static.wixstatic.com/';

const buildWixVariantUrl = (path, width) => {
    const match = path.match(/w_(\d+),h_(\d+)/);

    if (!match) {
        return path;
    }

    const sourceWidth = Number(match[1]);
    const sourceHeight = Number(match[2]);

    if (!sourceWidth || !sourceHeight) {
        return path;
    }

    const targetWidth = Math.min(width, sourceWidth);
    const targetHeight = Math.max(1, Math.round((sourceHeight / sourceWidth) * targetWidth));

    return path
        .replace(/w_\d+/, `w_${targetWidth}`)
        .replace(/h_\d+/, `h_${targetHeight}`);
};

export const buildResponsiveImage = (path, options = {}) => {
    if (!path) {
        return {
            src: '',
            srcset: '',
            sizes: options.sizes || '',
        };
    }

    if (!path.startsWith(LOCAL_STORAGE_PREFIX)) {
        if (path.startsWith(WIX_CDN_PREFIX)) {
            const widths = options.widths || [480, 768, 960, 1280];
            const fallbackWidth = options.fallbackWidth || widths[widths.length - 1];

            return {
                src: buildWixVariantUrl(path, fallbackWidth),
                srcset: widths.map((width) => `${buildWixVariantUrl(path, width)} ${width}w`).join(', '),
                sizes: options.sizes || '',
            };
        }

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