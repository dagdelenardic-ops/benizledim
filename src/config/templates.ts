import type { ContentType } from "@/types/content";

export interface TemplateVariable {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "color" | "number";
  required: boolean;
  maxLength?: number;
  placeholder?: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  htmlFile: string;
  contentTypes: ContentType[];
  dimensions: { width: number; height: number };
  variables: TemplateVariable[];
}

export const TEMPLATES: TemplateConfig[] = [
  // ─── Tek Görsel Şablonları ─────────────────
  {
    id: "haber-tek",
    name: "Haber Görseli",
    description: "Film/dizi haberleri için poster arka planlı tek görsel",
    htmlFile: "templates/haber-tek.html",
    contentTypes: ["single", "carousel"],
    dimensions: { width: 1080, height: 1080 },
    variables: [
      { key: "title", label: "Başlık", type: "text", required: true, maxLength: 80 },
      { key: "subtitle", label: "Alt Başlık", type: "text", required: false, maxLength: 120 },
      { key: "badgeText", label: "Etiket (sol üst)", type: "text", required: false, maxLength: 20, placeholder: "HABER" },
      { key: "posterUrl", label: "Afiş Görseli", type: "image", required: true },
      { key: "rating", label: "IMDB Puanı", type: "number", required: false },
      { key: "year", label: "Yıl", type: "text", required: false },
    ],
  },
  {
    id: "yeni-icerik",
    name: "Yeni İçerik Duyurusu",
    description: "Yeni film/dizi duyuruları, poster çerçeveli",
    htmlFile: "templates/yeni-icerik.html",
    contentTypes: ["single", "carousel"],
    dimensions: { width: 1080, height: 1080 },
    variables: [
      { key: "title", label: "Başlık", type: "text", required: true, maxLength: 80 },
      { key: "subtitle", label: "Alt Başlık", type: "text", required: false, maxLength: 120 },
      { key: "posterUrl", label: "Afiş Görseli", type: "image", required: true },
      { key: "releaseInfo", label: "Yayın Bilgisi", type: "text", required: false, maxLength: 60, placeholder: "Netflix'te yayında" },
    ],
  },
  {
    id: "oneri",
    name: "Öneri Görseli",
    description: "Film/dizi önerileri, IMDB puanı vurgulu",
    htmlFile: "templates/oneri.html",
    contentTypes: ["single", "carousel"],
    dimensions: { width: 1080, height: 1080 },
    variables: [
      { key: "title", label: "Başlık", type: "text", required: true, maxLength: 80 },
      { key: "subtitle", label: "Açıklama", type: "text", required: false, maxLength: 150 },
      { key: "posterUrl", label: "Afiş Görseli", type: "image", required: true },
      { key: "rating", label: "IMDB Puanı", type: "number", required: false },
      { key: "year", label: "Yıl", type: "text", required: false },
    ],
  },

  // ─── Carousel Şablonları ─────────────────
  {
    id: "haber-carousel",
    name: "Carousel Haberi",
    description: "Çoklu slayt haber görseli, poster + metin yan yana",
    htmlFile: "templates/haber-carousel.html",
    contentTypes: ["carousel"],
    dimensions: { width: 1080, height: 1080 },
    variables: [
      { key: "title", label: "Başlık", type: "text", required: true, maxLength: 80 },
      { key: "subtitle", label: "Alt Başlık", type: "text", required: false, maxLength: 120 },
      { key: "posterUrl", label: "Afiş Görseli", type: "image", required: true },
    ],
  },

  // ─── Yazı/Makale Carousel Şablonları ─────────────────
  {
    id: "yazi-kapak",
    name: "Yazı Kapak Slaydı",
    description: "Makale/yazı serisi kapak görseli (poster arka plan + kırmızı etiket)",
    htmlFile: "templates/yazi-kapak.html",
    contentTypes: ["single", "carousel"],
    dimensions: { width: 1080, height: 1080 },
    variables: [
      { key: "title", label: "Film/Dizi Adı", type: "text", required: true, maxLength: 60 },
      { key: "subtitle", label: "Orijinal Adı", type: "text", required: false, maxLength: 80, placeholder: "Poesía sin fin" },
      { key: "badgeText", label: "Etiket", type: "text", required: false, maxLength: 20, placeholder: "yazı" },
      { key: "posterUrl", label: "Afiş/Sahne Görseli", type: "image", required: true },
    ],
  },
  {
    id: "yazi-metin",
    name: "Yazı Metin Slaydı",
    description: "Bej arka plan üzerine beyaz metin (makale paragrafı)",
    htmlFile: "templates/yazi-metin.html",
    contentTypes: ["carousel"],
    dimensions: { width: 1080, height: 1080 },
    variables: [
      { key: "bodyText", label: "Metin İçeriği", type: "textarea", required: true, maxLength: 600, placeholder: "Makale paragrafınızı buraya yazın... <b>kalın</b> ve <i>italik</i> desteklenir." },
      { key: "isQuote", label: "Alıntı mı?", type: "text", required: false, placeholder: "Evet ise 'true' yazın" },
    ],
  },
  {
    id: "yazi-gorsel",
    name: "Yazı Görsel Slaydı",
    description: "Tam kaplama film karesi (metin yok)",
    htmlFile: "templates/yazi-gorsel.html",
    contentTypes: ["carousel"],
    dimensions: { width: 1080, height: 1080 },
    variables: [
      { key: "posterUrl", label: "Sahne/Film Karesi", type: "image", required: true },
    ],
  },
  {
    id: "yazi-kapanis",
    name: "Yazı Kapanış Slaydı",
    description: "Bej arka plan, son paragraf + yazar adı badge",
    htmlFile: "templates/yazi-kapanis.html",
    contentTypes: ["carousel"],
    dimensions: { width: 1080, height: 1080 },
    variables: [
      { key: "bodyText", label: "Kapanış Metni", type: "textarea", required: false, maxLength: 600 },
      { key: "authorName", label: "Yazar Adı", type: "text", required: false, maxLength: 40, placeholder: "Hümeyra Fidan" },
    ],
  },
  {
    id: "kapak-final",
    name: "Kapanış Logosu",
    description: "BEN İZLEDİM logosu + website (son slayt)",
    htmlFile: "templates/kapak-final.html",
    contentTypes: ["single", "carousel"],
    dimensions: { width: 1080, height: 1080 },
    variables: [],
  },

  // ─── Replik ─────────────────
  {
    id: "replik",
    name: "Film Repliği",
    description: "Sinematik film karesi üzerine Türkçe replik (letterbox efekti)",
    htmlFile: "templates/replik.html",
    contentTypes: ["single", "carousel"],
    dimensions: { width: 1080, height: 1080 },
    variables: [
      { key: "title", label: "Film/Dizi Adı", type: "text", required: true, maxLength: 60 },
      { key: "subtitle", label: "Karakter Adı", type: "text", required: false, maxLength: 60, placeholder: "Tyler Durden" },
      { key: "bodyText", label: "Replik", type: "textarea", required: true, maxLength: 300, placeholder: "İlk kuralı: Dövüş Kulübü hakkında konuşmayacaksın." },
      { key: "posterUrl", label: "Film Karesi / Sahne Görseli", type: "image", required: true },
      { key: "year", label: "Yıl", type: "text", required: false },
    ],
  },

  // ─── Story ─────────────────
  {
    id: "story",
    name: "Story Görseli",
    description: "Instagram story formatı (9:16), poster arka plan",
    htmlFile: "templates/story.html",
    contentTypes: ["story"],
    dimensions: { width: 1080, height: 1920 },
    variables: [
      { key: "title", label: "Başlık", type: "text", required: true, maxLength: 60 },
      { key: "subtitle", label: "Alt Başlık", type: "text", required: false, maxLength: 80 },
      { key: "badgeText", label: "Etiket", type: "text", required: false, maxLength: 20, placeholder: "YENİ" },
      { key: "posterUrl", label: "Afiş Görseli", type: "image", required: true },
    ],
  },
];

export function getTemplateById(id: string): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesForContentType(contentType: ContentType): TemplateConfig[] {
  return TEMPLATES.filter((t) => t.contentTypes.includes(contentType));
}
