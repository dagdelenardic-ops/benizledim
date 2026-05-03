import { Node } from '@tiptap/core';

export const EmbedExtension = Node.create({
    name: 'embed',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            service: { default: 'youtube' },
            embedUrl: { default: '' },
            originalUrl: { default: '' },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-embed]',
                getAttrs: (element) => {
                    const embedUrl = element.getAttribute('data-embed-url') || '';
                    const service = element.getAttribute('data-embed-service') || 'youtube';
                    const originalUrl = element.getAttribute('data-embed-original-url') || '';
                    return { service, embedUrl, originalUrl };
                },
            },
        ];
    },

    renderHTML({ node }) {
        const { service, embedUrl, originalUrl } = node.attrs;
        const aspectRatio = service === 'spotify' ? '1 / 1' : '16 / 9';
        const height = service === 'spotify' ? '152' : '315';

        return [
            'div',
            {
                'data-embed': '',
                'data-embed-service': service,
                'data-embed-url': embedUrl,
                'data-embed-original-url': originalUrl,
                style: `position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin:1.5rem 0;`,
            },
            [
                'iframe',
                {
                    src: embedUrl,
                    style: 'position:absolute;top:0;left:0;width:100%;height:100%;',
                    frameborder: '0',
                    allow:
                        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                    allowfullscreen: 'true',
                },
            ],
        ];
    },

    addCommands() {
        return {
            setEmbed:
                (attrs) =>
                ({ commands }) =>
                    commands.insertContent({ type: this.name, attrs }),
        };
    },
});
