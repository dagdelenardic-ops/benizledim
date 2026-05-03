import Image from '@tiptap/extension-image';
import { Plugin } from '@tiptap/pm/state';
import axios from 'axios';

const UPLOAD_URL = '/admin/posts/images';

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await axios.post(UPLOAD_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (data.error) throw new Error(data.error);
    return data.url;
}

async function uploadBase64(base64) {
    const { data } = await axios.post(UPLOAD_URL, { base64 });
    if (data.error) throw new Error(data.error);
    return data.url;
}

async function uploadRemoteUrl(url) {
    const { data } = await axios.post(UPLOAD_URL, { url });
    if (data.error) throw new Error(data.error);
    return data.url;
}

export const UploadImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            alt: {
                default: null,
                parseHTML: (element) => element.getAttribute('alt'),
                renderHTML: (attributes) => {
                    if (!attributes.alt) return {};
                    return { alt: attributes.alt };
                },
            },
            caption: {
                default: null,
                parseHTML: (element) => element.getAttribute('title'),
                renderHTML: (attributes) => {
                    if (!attributes.caption) return {};
                    return { title: attributes.caption };
                },
            },
        };
    },

    addProseMirrorPlugins() {
        const editorViewRef = { current: null };

        return [
            new Plugin({
                view() {
                    return {
                        update(view) {
                            editorViewRef.current = view;
                        },
                    };
                },
                props: {
                    handleDrop(view, event, slice, moved) {
                        if (moved) return false;
                        const files = [...(event.dataTransfer?.files ?? [])].filter((f) =>
                            f.type.startsWith('image/')
                        );
                        if (!files.length) return false;

                        event.preventDefault();
                        const coordinates = view.posAtCoords({
                            left: event.clientX,
                            top: event.clientY,
                        });
                        const pos = coordinates?.pos ?? view.state.selection.anchor;

                        files.forEach(async (file) => {
                            try {
                                const url = await uploadFile(file);
                                const alt = window.prompt('Alt metin (isteğe bağlı):', '')?.trim() || null;
                                const { schema } = view.state;
                                const node = schema.nodes.image.create({ src: url, alt });
                                const transaction = view.state.tr.insert(pos, node);
                                view.dispatch(transaction);
                            } catch (err) {
                                alert('Görsel yüklenemedi: ' + (err?.message || 'Bilinmeyen hata'));
                            }
                        });
                        return true;
                    },

                    handlePaste(view, event) {
                        const items = [...(event.clipboardData?.items ?? [])];

                        const imageItem = items.find((i) => i.type.startsWith('image/'));
                        if (imageItem) {
                            event.preventDefault();
                            const file = imageItem.getAsFile();
                            uploadFile(file)
                                .then((url) => {
                                    const alt = window.prompt('Alt metin (isteğe bağlı):', '')?.trim() || null;
                                    const { schema } = view.state;
                                    const node = schema.nodes.image.create({ src: url, alt });
                                    view.dispatch(view.state.tr.replaceSelectionWith(node));
                                })
                                .catch((err) => {
                                    alert('Görsel yüklenemedi: ' + (err?.message || 'Bilinmeyen hata'));
                                });
                            return true;
                        }

                        const textItem = items.find((i) => i.type === 'text/plain');
                        if (textItem) {
                            textItem.getAsString(async (text) => {
                                const trimmed = text.trim();
                                const isImageUrl =
                                    /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(trimmed);
                                if (isImageUrl) {
                                    event.preventDefault();
                                    try {
                                        const url = await uploadRemoteUrl(trimmed);
                                        const { schema } = view.state;
                                        const node = schema.nodes.image.create({ src: url });
                                        view.dispatch(view.state.tr.replaceSelectionWith(node));
                                    } catch (err) {
                                        alert('Görsel yüklenemedi: ' + (err?.message || 'Bilinmeyen hata'));
                                    }
                                }
                            });
                        }

                        return false;
                    },
                },
            }),
        ];
    },
});
