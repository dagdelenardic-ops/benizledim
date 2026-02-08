"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCcw,
  ExternalLink,
  Instagram,
  Film,
  Cloud,
  ChevronDown,
  ChevronUp,
  Copy,
  Rss,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { FeedSource } from "@/types/feed";

interface ServiceStatus {
  ok: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export default function AyarlarPage() {
  const [statuses, setStatuses] = useState<Record<string, ServiceStatus>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [feedSources, setFeedSources] = useState<FeedSource[]>([]);
  const [newFeedName, setNewFeedName] = useState("");
  const [newFeedUrl, setNewFeedUrl] = useState("");

  const checkAll = async () => {
    setIsChecking(true);
    try {
      const res = await fetch("/api/settings/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "all" }),
      });
      const data = await res.json();
      setStatuses(data);
    } catch {
      toast.error("Bağlantı kontrolü başarısız");
    } finally {
      setIsChecking(false);
    }
  };

  const fetchFeedSources = async () => {
    try {
      const res = await fetch("/api/feeds/sources");
      const data = await res.json();
      if (data.sources) setFeedSources(data.sources);
    } catch {
      // ignore
    }
  };

  const handleToggleFeed = async (sourceId: string) => {
    try {
      const res = await fetch("/api/feeds/sources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", sourceId }),
      });
      const data = await res.json();
      if (data.sources) setFeedSources(data.sources);
    } catch {
      toast.error("Kaynak guncellenemedi");
    }
  };

  const handleDeleteFeed = async (sourceId: string) => {
    try {
      const res = await fetch("/api/feeds/sources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", sourceId }),
      });
      const data = await res.json();
      if (data.sources) setFeedSources(data.sources);
      toast.success("Kaynak silindi");
    } catch {
      toast.error("Kaynak silinemedi");
    }
  };

  const handleAddFeed = async () => {
    if (!newFeedName.trim() || !newFeedUrl.trim()) {
      toast.error("Isim ve URL gerekli");
      return;
    }
    try {
      const res = await fetch("/api/feeds/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFeedName.trim(), url: newFeedUrl.trim() }),
      });
      const data = await res.json();
      if (data.sources) setFeedSources(data.sources);
      setNewFeedName("");
      setNewFeedUrl("");
      toast.success("Kaynak eklendi");
    } catch {
      toast.error("Kaynak eklenemedi");
    }
  };

  useEffect(() => {
    checkAll();
    fetchFeedSources();
  }, []);

  const toggleGuide = (id: string) => {
    setExpandedGuide(expandedGuide === id ? null : id);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Panoya kopyalandı");
  };

  const StatusIcon = ({ status }: { status?: ServiceStatus }) => {
    if (!status) return <div className="h-5 w-5 rounded-full bg-muted" />;
    return status.ok ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ayarlar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            API bağlantılarını yapılandırın ve Instagram hesabınızı bağlayın.
          </p>
        </div>
        <Button onClick={checkAll} disabled={isChecking} variant="outline" className="gap-2">
          {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          Bağlantıları Test Et
        </Button>
      </div>

      {/* Durum Özeti */}
      <div className="grid gap-3 md:grid-cols-3 mb-8">
        {[
          { key: "tmdb", label: "TMDB", icon: Film },
          { key: "instagram", label: "Instagram", icon: Instagram },
          { key: "cloudinary", label: "Cloudinary", icon: Cloud },
        ].map(({ key, label, icon: Icon }) => (
          <Card key={key} className={statuses[key]?.ok ? "border-green-200 bg-green-50/50" : ""}>
            <CardContent className="flex items-center gap-3 p-4">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {statuses[key]?.message || "Kontrol edilmedi"}
                </p>
              </div>
              <StatusIcon status={statuses[key]} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="mb-8" />

      {/* ─── 1. Instagram Bağlama Rehberi ─── */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleGuide("instagram")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Instagram Hesap Bağlama</CardTitle>
                <CardDescription>
                  {statuses.instagram?.ok
                    ? `@${statuses.instagram.data?.username} bağlı`
                    : "Adım adım kurulum rehberi"}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {statuses.instagram?.ok ? (
                <Badge className="bg-green-600">Bağlı</Badge>
              ) : (
                <Badge variant="destructive">Bağlı Değil</Badge>
              )}
              {expandedGuide === "instagram" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>

        {expandedGuide === "instagram" && (
          <CardContent className="pt-0 space-y-6">
            {statuses.instagram?.ok && statuses.instagram.data && (
              <div className="flex items-center gap-4 rounded-lg bg-green-50 p-4 border border-green-200">
                <div className="flex-1">
                  <p className="font-medium text-green-800">@{String(statuses.instagram.data.username)}</p>
                  <p className="text-sm text-green-700">
                    {String(statuses.instagram.data.followers)} takipci &bull; {String(statuses.instagram.data.mediaCount)} paylaşım
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            )}

            {/* Adım 1 */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">1</div>
                <h3 className="font-semibold">Instagram Hesabını Creator/Business Yap</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Instagram uygulamasında: <strong>Ayarlar &rarr; Hesap &rarr; Profesyonel hesaba geç &rarr; Creator</strong> seçin.
              </p>
              <p className="text-xs text-green-700 bg-green-50 p-2 rounded">
                Zaten Creator hesabınız var ise bu adımı atlayabilirsiniz.
              </p>
            </div>

            {/* Adım 2 */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">2</div>
                <h3 className="font-semibold">Facebook Sayfası Oluştur & Instagram&apos;ı Bağla</h3>
              </div>
              <ol className="text-sm text-muted-foreground space-y-2 ml-2">
                <li>
                  <strong>a)</strong>{" "}
                  <a href="https://www.facebook.com/pages/create" target="_blank" rel="noopener" className="text-blue-600 underline inline-flex items-center gap-1">
                    facebook.com/pages/create <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  adresinden yeni bir Facebook Sayfası oluşturun.
                </li>
                <li>
                  <strong>b)</strong> Sayfa oluşturulduktan sonra: <strong>Sayfa Ayarları &rarr; Bağlı Hesaplar &rarr; Instagram</strong> yolunu izleyip Instagram hesabınızı bağlayın.
                </li>
              </ol>
            </div>

            {/* Adım 3 */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">3</div>
                <h3 className="font-semibold">Facebook Developer Uygulaması Oluştur</h3>
              </div>
              <ol className="text-sm text-muted-foreground space-y-2 ml-2">
                <li>
                  <strong>a)</strong>{" "}
                  <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener" className="text-blue-600 underline inline-flex items-center gap-1">
                    developers.facebook.com <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  adresine gidin.
                </li>
                <li>
                  <strong>b)</strong> <strong>&quot;Uygulama Oluştur&quot;</strong> butonuna tıklayın &rarr; Tip: <strong>&quot;İşletme&quot;</strong> veya <strong>&quot;Diğer&quot;</strong> seçin.
                </li>
                <li>
                  <strong>c)</strong> Uygulama adı: <strong>&quot;Benizledim&quot;</strong> yazın, oluşturun.
                </li>
                <li>
                  <strong>d)</strong> Sol menüden <strong>&quot;Ürün Ekle&quot;</strong> &rarr; <strong>&quot;Instagram Graph API&quot;</strong> ekleyin.
                </li>
              </ol>
            </div>

            {/* Adım 4 */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">4</div>
                <h3 className="font-semibold">Access Token Al</h3>
              </div>
              <ol className="text-sm text-muted-foreground space-y-2 ml-2">
                <li>
                  <strong>a)</strong>{" "}
                  <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener" className="text-blue-600 underline inline-flex items-center gap-1">
                    Graph API Explorer <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  sayfasını açın.
                </li>
                <li>
                  <strong>b)</strong> Sağ üstten oluşturduğunuz uygulamayı seçin.
                </li>
                <li>
                  <strong>c)</strong> <strong>&quot;İzin Ekle&quot;</strong> butonuyla şu izinleri ekleyin:
                  <div className="flex flex-wrap gap-1 mt-1">
                    {["instagram_basic", "instagram_content_publish", "pages_show_list", "pages_read_engagement"].map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs font-mono cursor-pointer" onClick={() => copyToClipboard(p)}>
                        {p} <Copy className="h-2.5 w-2.5 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </li>
                <li>
                  <strong>d)</strong> <strong>&quot;Token Oluştur&quot;</strong> butonuna tıklayın. Bu kısa süreli token&apos;dır.
                </li>
              </ol>
            </div>

            {/* Adım 5 */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">5</div>
                <h3 className="font-semibold">Instagram User ID Bul</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Graph API Explorer&apos;da şu sorguyu çalıştırın:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-zinc-100 px-3 py-2 text-xs font-mono dark:bg-zinc-800">
                  GET /me/accounts?fields=instagram_business_account&#123;id,username&#125;
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard("/me/accounts?fields=instagram_business_account{id,username}")}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Dönen <code className="bg-zinc-100 px-1 rounded dark:bg-zinc-800">instagram_business_account.id</code> değeri sizin <strong>INSTAGRAM_USER_ID</strong>&apos;nizdir.
              </p>
            </div>

            {/* Adım 6 */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">6</div>
                <h3 className="font-semibold">Uzun Süreli Token Al (60 gün)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Graph API Explorer&apos;da şu URL&apos;yi GET ile sorgulayın:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-zinc-100 px-3 py-2 text-xs font-mono break-all dark:bg-zinc-800">
                  /oauth/access_token?grant_type=fb_exchange_token&client_id=&#123;APP_ID&#125;&client_secret=&#123;APP_SECRET&#125;&fb_exchange_token=&#123;KISA_TOKEN&#125;
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard("/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={KISA_TOKEN}")}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Dönen <code className="bg-zinc-100 px-1 rounded dark:bg-zinc-800">access_token</code> değerini <strong>INSTAGRAM_ACCESS_TOKEN</strong> olarak kaydedin.
              </p>
            </div>

            {/* Adım 7 */}
            <div className="rounded-lg border p-4 bg-amber-50 border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">7</div>
                <h3 className="font-semibold">.env.local Dosyasına Kaydet</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Proje dizinindeki <code className="bg-white px-1 rounded">.env.local</code> dosyasını açın ve şu değerleri girin:
              </p>
              <pre className="rounded bg-zinc-900 text-green-400 p-3 text-xs font-mono overflow-x-auto">
{`INSTAGRAM_USER_ID=17841400xxxxxxx
INSTAGRAM_ACCESS_TOKEN=EAAG...uzun_token_buraya`}
              </pre>
              <p className="text-xs text-muted-foreground mt-2">
                Sonra uygulamayı yeniden başlatın (<code className="bg-white px-1 rounded">npm run dev</code>) ve bu sayfada &quot;Bağlantıları Test Et&quot; butonuna tıklayın.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ─── 2. TMDB Rehberi ─── */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleGuide("tmdb")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600">
                <Film className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">TMDB API</CardTitle>
                <CardDescription>Film/dizi verileri ve poster görselleri</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {statuses.tmdb?.ok ? (
                <Badge className="bg-green-600">Bağlı</Badge>
              ) : (
                <Badge variant="destructive">Bağlı Değil</Badge>
              )}
              {expandedGuide === "tmdb" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>

        {expandedGuide === "tmdb" && (
          <CardContent className="pt-0 space-y-4">
            <div className="rounded-lg border p-4">
              <ol className="text-sm text-muted-foreground space-y-3 ml-2">
                <li>
                  <strong>1.</strong>{" "}
                  <a href="https://www.themoviedb.org/signup" target="_blank" rel="noopener" className="text-blue-600 underline inline-flex items-center gap-1">
                    themoviedb.org/signup <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  adresinden hesap oluşturun.
                </li>
                <li>
                  <strong>2.</strong> Profil &rarr; <strong>Ayarlar &rarr; API</strong> sayfasına gidin.
                </li>
                <li>
                  <strong>3.</strong> &quot;API Anahtarı İste&quot; &rarr; <strong>Developer</strong> seçin, formu doldurun.
                </li>
                <li>
                  <strong>4.</strong> Size verilen <strong>API Read Access Token (v4)</strong> değerini kopyalayın.
                </li>
                <li>
                  <strong>5.</strong> <code className="bg-zinc-100 px-1 rounded dark:bg-zinc-800">.env.local</code> dosyasına ekleyin:
                </li>
              </ol>
              <pre className="rounded bg-zinc-900 text-green-400 p-3 text-xs font-mono mt-2">
{`TMDB_ACCESS_TOKEN=eyJhbGc...uzun_token`}
              </pre>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ─── 3. Cloudinary Rehberi ─── */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleGuide("cloudinary")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Cloud className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Cloudinary</CardTitle>
                <CardDescription>Görsellerin Instagram API için host edilmesi</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {statuses.cloudinary?.ok ? (
                <Badge className="bg-green-600">Bağlı</Badge>
              ) : (
                <Badge variant="destructive">Bağlı Değil</Badge>
              )}
              {expandedGuide === "cloudinary" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>

        {expandedGuide === "cloudinary" && (
          <CardContent className="pt-0 space-y-4">
            <div className="rounded-lg border p-4">
              <ol className="text-sm text-muted-foreground space-y-3 ml-2">
                <li>
                  <strong>1.</strong>{" "}
                  <a href="https://cloudinary.com/users/register_free" target="_blank" rel="noopener" className="text-blue-600 underline inline-flex items-center gap-1">
                    cloudinary.com <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  adresinden hesap oluşturun.
                </li>
                <li>
                  <strong>2.</strong> Dashboard&apos;da hemen üstte 3 bilgiyi göreceksiniz: <strong>Cloud Name</strong>, <strong>API Key</strong>, <strong>API Secret</strong>.
                </li>
                <li>
                  <strong>3.</strong> <code className="bg-zinc-100 px-1 rounded dark:bg-zinc-800">.env.local</code> dosyasına ekleyin:
                </li>
              </ol>
              <pre className="rounded bg-zinc-900 text-green-400 p-3 text-xs font-mono mt-2">
{`CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefgh`}
              </pre>
              <p className="text-xs text-muted-foreground mt-2">
                Bedava plan: ayda 25.000 dönüşüm + 25 GB depolama. Instagram görselleri için yeterli.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      <Separator className="mb-8" />

      {/* ─── 4. RSS Kaynaklari ─── */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleGuide("rss")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600">
                <Rss className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">RSS Haber Kaynaklari</CardTitle>
                <CardDescription>
                  Film/dizi haber sitelerinden otomatik icerik cekme
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-600">
                {feedSources.filter((s) => s.enabled).length}/{feedSources.length} aktif
              </Badge>
              {expandedGuide === "rss" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>

        {expandedGuide === "rss" && (
          <CardContent className="pt-0 space-y-6">
            <p className="text-sm text-muted-foreground">
              Aktif kaynaklar &quot;Olustur&quot; sayfasindaki haber akisinda gorunur. Habere tiklayinca form otomatik dolar.
            </p>

            {/* Turkce Kaynaklar */}
            {feedSources.filter((s) => s.category === "tr").length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="text-base">🇹🇷</span> Turkce Kaynaklar
                </h4>
                <div className="space-y-2">
                  {feedSources
                    .filter((s) => s.category === "tr")
                    .map((source) => (
                      <div
                        key={source.id}
                        className="flex items-center justify-between rounded-lg border px-4 py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{source.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{source.url}</p>
                        </div>
                        <Switch
                          checked={source.enabled}
                          onCheckedChange={() => handleToggleFeed(source.id)}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Ingilizce Kaynaklar */}
            {feedSources.filter((s) => s.category === "en").length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="text-base">🌍</span> Uluslararasi Kaynaklar
                </h4>
                <div className="space-y-2">
                  {feedSources
                    .filter((s) => s.category === "en")
                    .map((source) => (
                      <div
                        key={source.id}
                        className="flex items-center justify-between rounded-lg border px-4 py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{source.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{source.url}</p>
                        </div>
                        <Switch
                          checked={source.enabled}
                          onCheckedChange={() => handleToggleFeed(source.id)}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Ozel Kaynaklar */}
            {feedSources.filter((s) => s.category === "custom").length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Ozel Kaynaklar</h4>
                <div className="space-y-2">
                  {feedSources
                    .filter((s) => s.category === "custom")
                    .map((source) => (
                      <div
                        key={source.id}
                        className="flex items-center justify-between rounded-lg border px-4 py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{source.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{source.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={source.enabled}
                            onCheckedChange={() => handleToggleFeed(source.id)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteFeed(source.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Yeni Kaynak Ekle */}
            <div className="rounded-lg border p-4 bg-muted/30">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ozel RSS Kaynagi Ekle
              </h4>
              <div className="space-y-3">
                <Input
                  placeholder="Kaynak adi (ornegin: Sinefil)"
                  value={newFeedName}
                  onChange={(e) => setNewFeedName(e.target.value)}
                />
                <Input
                  placeholder="RSS URL (ornegin: https://site.com/feed/)"
                  value={newFeedUrl}
                  onChange={(e) => setNewFeedUrl(e.target.value)}
                />
                <Button
                  onClick={handleAddFeed}
                  className="gap-2"
                  disabled={!newFeedName.trim() || !newFeedUrl.trim()}
                >
                  <Plus className="h-4 w-4" />
                  Kaynak Ekle
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
