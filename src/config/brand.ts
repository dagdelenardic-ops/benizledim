export const BRAND = {
  name: "Ben İzledim",
  tagline: "Film & Dizi Haberleri",
  website: "www.benizledim.com",
  instagram: {
    handle: "@benizledimblog",
    post: { width: 1080, height: 1080 },
    story: { width: 1080, height: 1920 },
  },
  colors: {
    // Ana kırmızı - logo "BEN" kısmı ve etiketler
    primary: "#C62828",
    primaryDark: "#8E1C1C",
    // Yazı slaytları arka plan - koyu bej/haki
    textBg: "#8B7D6B",
    textBgLight: "#9E8E7C",
    // Yazar badge arka planı
    authorBadge: "#5D4037",
    // Koyu arka planlar
    dark: "#1a1a1a",
    darkOverlay: "rgba(0,0,0,0.6)",
    // Metin renkleri
    white: "#FFFFFF",
    whiteSubtle: "rgba(255,255,255,0.85)",
    whiteMuted: "rgba(255,255,255,0.6)",
    // Aksan renkleri
    gold: "#FFD700",
    amber: "#FFC107",
  },
  fonts: {
    heading: "Montserrat",
    body: "Open Sans",
  },
} as const;
