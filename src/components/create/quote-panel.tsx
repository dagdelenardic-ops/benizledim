"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useContentStore } from "@/store/content-store";
import {
  Quote,
  ChevronDown,
  ChevronUp,
  Search,
  Loader2,
  ImageIcon,
  Sparkles,
  Check,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface Backdrop {
  url: string;
  urlHd: string;
  width: number;
  height: number;
  score: number;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
  profileUrlHd: string | null;
  order: number;
}

// Popüler ve az bilinen film replikleri veritabanı (Türkçe)
const POPULAR_QUOTES = [
  // Klasik popüler filmler
  { movie: "Dövüş Kulübü", character: "Tyler Durden", quote: "Sahip olduğun şeyler eninde sonunda sana sahip olur.", year: "1999" },
  { movie: "Esaretin Bedeli", character: "Andy Dufresne", quote: "Umut güzel bir şeydir. Belki de en güzel şey. Ve güzel şeyler asla ölmez.", year: "1994" },
  { movie: "Forrest Gump", character: "Forrest Gump", quote: "Hayat bir kutu çikolata gibidir. Ne çıkacağını asla bilemezsin.", year: "1994" },
  { movie: "Baba", character: "Don Vito Corleone", quote: "Reddedemeyeceği bir teklif yapacağım ona.", year: "1972" },
  { movie: "Yüzüklerin Efendisi", character: "Gandalf", quote: "Tek yapman gereken, sana verilen zamanla ne yapacağına karar vermek.", year: "2001" },
  { movie: "Yıldızlararası", character: "Cooper", quote: "İnsanlık yeryüzünde doğdu ama burada ölmeye mahkum değil.", year: "2014" },
  { movie: "Kara Şövalye", character: "Joker", quote: "Neden bu kadar ciddiyiz?", year: "2008" },
  { movie: "Matrix", character: "Morpheus", quote: "Sana söyleyebileceğim tek şey var: sen seçilmiş kişisin, Neo.", year: "1999" },
  { movie: "Başlangıç", character: "Dom Cobb", quote: "Bir fikir, bir virüs gibidir. Dayanıklı, bulaşıcı. Bir kere zihne yerleşti mi çıkarmak neredeyse imkansızdır.", year: "2010" },
  { movie: "Güzel Zihinler", character: "John Nash", quote: "Mantığım bana söylüyor ki Tanrı var. Ama kalbim söylüyor ki beni seviyor.", year: "2001" },
  { movie: "Gladyatör", character: "Maximus", quote: "Yaptıklarımız hayatta yankılanır.", year: "2000" },
  { movie: "Schindler'in Listesi", character: "Oskar Schindler", quote: "Bir insanı kurtaran, tüm dünyayı kurtarır.", year: "1993" },
  { movie: "Cesur Yürek", character: "William Wallace", quote: "Her insan ölür, ama her insan gerçekten yaşamaz.", year: "1995" },
  { movie: "Joker", character: "Arthur Fleck", quote: "En kötü yanı akıl hastası olmak değil. İnsanların senden normal gibi davranmanı beklemesi.", year: "2019" },
  { movie: "Ucuz Roman", character: "Jules Winnfield", quote: "Hayatımda mucize gördüm ve mucize bu.", year: "1994" },
  { movie: "Yeşil Yol", character: "John Coffey", quote: "İnsanların birbirine yaptığı şeylerden yoruldum.", year: "1999" },
  { movie: "V for Vendetta", character: "V", quote: "İnsanlar hükümetlerinden korkmamalı. Hükümetler insanlarından korkmalı.", year: "2005" },
  { movie: "Kelebek Etkisi", character: "Evan Treborn", quote: "Küçük bir değişiklik her şeyi değiştirebilir.", year: "2004" },
  { movie: "Amelie", character: "Amelie", quote: "Zamanlar acı çekmek için değil, yaşamak içindir.", year: "2001" },
  { movie: "Titanik", character: "Jack Dawson", quote: "Hayatın en güzel hediyelerinden biri ne olacağını bilmemendir.", year: "1997" },

  // Kült ve az bilinen filmler
  { movie: "Clerks", character: "Dante Hicks", quote: "Bugün burada olmam bile gerekmiyordu.", year: "1994" },
  { movie: "The Warriors", character: "Luther", quote: "Savaşçılar, dışarı çıkın ve oynayın!", year: "1979" },
  { movie: "Eternal Sunshine", character: "Clementine", quote: "Ben sadece kendi huzurunu arayan karmaşık bir kızım; benimkini bana yükleme.", year: "2004" },
  { movie: "Donnie Darko", character: "Donnie", quote: "Bazen korku ve derin sevgi ayırt edilemez.", year: "2001" },
  { movie: "Heathers", character: "Veronica", quote: "Senin sorunun ne, Heather?", year: "1988" },
  { movie: "They Live", character: "Nada", quote: "Kıçınızı tekmelemek ve sakız çiğnemek için geldim. Ve sakızım bitti.", year: "1988" },
  { movie: "Clue", character: "Mrs. White", quote: "Alevler. Yüzümün yanında alevler...", year: "1985" },
  { movie: "Office Space", character: "Peter", quote: "Tembel değilim. Sadece umurumda değil.", year: "1999" },
  { movie: "Lost in Translation", character: "Bob", quote: "Ne yapıyorsun burada? Bütün hayatın senin önünde.", year: "2003" },
  { movie: "Before Sunrise", character: "Jesse", quote: "Eğer insanlarla bağ kuracaksak, kendimizi savunmasız bırakmalıyız.", year: "1995" },
  { movie: "Waking Life", character: "Main Character", quote: "Rüya, uyanık haldeki hayatın özlemidir.", year: "2001" },
  { movie: "Pi", character: "Max Cohen", quote: "11:15, kaos temsili.", year: "1998" },
  { movie: "Primer", character: "Abe", quote: "Kaybedecek hiçbir şeyin yoksa, çok şey kazanabilirsin.", year: "2004" },
  { movie: "Moon", character: "Sam Bell", quote: "İki haftam daha var. Sonra eve dönüyorum.", year: "2009" },
  { movie: "Gattaca", character: "Vincent", quote: "Asla geri dönüşü olmayan bir yolculuğa hazırlandım.", year: "1997" },
  { movie: "The Fountain", character: "Tommy", quote: "Ölüm hayatın yoludur.", year: "2006" },
  { movie: "Memento", character: "Leonard", quote: "Hatırlayamadığım şeyin nasıl olduğunu bilmiyorum.", year: "2000" },
  { movie: "Trainspotting", character: "Renton", quote: "Bir yaşam seç. Bir kariyer seç. Ama ben neden böyle bir şey yapayım ki?", year: "1996" },
  { movie: "Requiem for a Dream", character: "Harry", quote: "Her şey yolunda olacak. Bir plan var.", year: "2000" },
  { movie: "The Machinist", character: "Trevor", quote: "Bir yıldır uyumuyorum.", year: "2004" },

  // Türk sineması kült filmleri
  { movie: "Eşkıya", character: "Baran", quote: "Bana Baran derler. İstanbul'u altüst ederim.", year: "1996" },
  { movie: "Babam ve Oğlum", character: "Sadık", quote: "Deniz dediğin, kumsalı olmayan denizdir.", year: "2005" },
  { movie: "Organize İşler", character: "Sabit", quote: "Her şey para için değil. Ama para olmadan da bir şey olmaz.", year: "2005" },
  { movie: "Vizontele", character: "Deli Emin", quote: "Yunan malı, sağlam malı.", year: "2001" },
  { movie: "G.O.R.A.", character: "Arif", quote: "Dünyadan geliyorum ben, dünyalıyım ben!", year: "2004" },

  // Yabancı kült filmler (Türk izleyici için)
  { movie: "Cidade de Deus", character: "Zé Pequeno", quote: "Küçük Zé'ye 'Şirin'e benziyor diyenler var. Peki Şirin kimleri öldürdü?", year: "2002" },
  { movie: "The Grand Budapest Hotel", character: "M. Gustave", quote: "Medeniyetin son kalıntılarını korumaya devam et.", year: "2014" },
  { movie: "Her", character: "Theodore", quote: "Bazen sırf hissettiklerimi hissetmek istiyorum.", year: "2013" },
  { movie: "The Fall", character: "Roy", quote: "Bu hikayede iyi ile kötü arasında net bir çizgi yok.", year: "2006" },
  { movie: "In Bruges", character: "Ken", quote: "Belki bu cehennemin bir versiyonu. Sonsuza dek Brugge'de kalmak.", year: "2008" },
];

export function QuotePanel() {
  const contentStore = useContentStore();
  const [isOpen, setIsOpen] = useState(false);
  const [movieSearch, setMovieSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ id: number; title: string; year: string; type: string }>>([]);
  const [backdrops, setBackdrops] = useState<Backdrop[]>([]);
  const [selectedBackdrop, setSelectedBackdrop] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<{ id: number; title: string; year: string; type: string } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [castMembers, setCastMembers] = useState<CastMember[]>([]);
  const [isLoadingCast, setIsLoadingCast] = useState(false);
  const [selectedCharacterPhoto, setSelectedCharacterPhoto] = useState<string | null>(null);
  const [showCharacterPhotos, setShowCharacterPhotos] = useState(false);

  const handleMovieSearch = async () => {
    if (!movieSearch.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch("/api/tmdb/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: movieSearch, type: "movie" }),
      });
      const data = await res.json();
      const results = (data.results || []).slice(0, 8).map((r: Record<string, unknown>) => ({
        id: r.id as number,
        title: (r.title || r.name || "") as string,
        year: ((r.release_date || r.first_air_date || "") as string).slice(0, 4),
        type: r.title ? "movie" : "tv",
      }));
      setSearchResults(results);
    } catch {
      toast.error("Film arama hatası");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMovie = async (movie: { id: number; title: string; year: string; type: string }) => {
    setSelectedMovie(movie);
    setSearchResults([]);
    setIsLoadingImages(true);
    setIsLoadingCast(true);

    // Fetch backdrops and cast in parallel
    try {
      const [imagesRes, castRes] = await Promise.all([
        fetch(`/api/tmdb/images?id=${movie.id}&type=${movie.type}`),
        fetch(`/api/tmdb/cast?id=${movie.id}&type=${movie.type}`)
      ]);

      const [imagesData, castData] = await Promise.all([
        imagesRes.json(),
        castRes.json()
      ]);

      setBackdrops(imagesData.backdrops || []);
      setCastMembers(castData.cast || []);

      if (castData.cast && castData.cast.length > 0) {
        setShowCharacterPhotos(true);
      }
    } catch (error) {
      toast.error("Film bilgileri alınamadı");
      console.error(error);
    } finally {
      setIsLoadingImages(false);
      setIsLoadingCast(false);
    }
  };

  const handleSelectBackdrop = (url: string) => {
    setSelectedBackdrop(url);
    contentStore.setPosterUrl(url);
  };

  const handleSelectCharacterPhoto = (photoUrl: string, castCharacterName: string, actorName: string) => {
    setSelectedCharacterPhoto(photoUrl);
    contentStore.setPosterUrl(photoUrl);

    // Auto-fill character name if empty (prefer character name over actor name)
    if (!characterName.trim()) {
      setCharacterName(castCharacterName || actorName);
    }

    toast.success("Karakter fotoğrafı seçildi!");
  };

  // Auto-match character name to cast member
  const getMatchedCastMembers = () => {
    if (!characterName.trim() || castMembers.length === 0) {
      return castMembers.slice(0, 12); // Show first 12 by default
    }

    const searchTerm = characterName.toLowerCase().trim();
    const matched = castMembers.filter(
      (member) =>
        member.character.toLowerCase().includes(searchTerm) ||
        member.name.toLowerCase().includes(searchTerm)
    );

    return matched.length > 0 ? matched : castMembers.slice(0, 12);
  };

  const handleApplyQuote = () => {
    if (!quoteText.trim()) {
      toast.error("Replik yazın veya seçin");
      return;
    }

    // Reset state to clear any previous news/content data
    contentStore.resetForQuote();

    contentStore.setBodyText(quoteText);
    contentStore.setTemplateId("replik");
    contentStore.setBadgeText("REPLİK");

    if (selectedMovie) {
      contentStore.setTitle(selectedMovie.title);
      contentStore.setYear(selectedMovie.year);
    }
    if (characterName) {
      contentStore.setSubtitle(characterName);
    }

    const hashtags = "#benizledim #replik #film #sinema #filmreplikleri";
    const caption = `"${quoteText}"\n\n— ${characterName || ""}${selectedMovie ? `, ${selectedMovie.title}` : ""}\n\n${hashtags}`;
    contentStore.setCaption(caption.slice(0, 2200));

    toast.success("Replik formu dolduruldu!");
  };

  const handleSelectSuggestion = (q: typeof POPULAR_QUOTES[0]) => {
    setQuoteText(q.quote);
    setCharacterName(q.character);
    setMovieSearch(q.movie);
    setShowSuggestions(false);

    if (!selectedMovie) {
      // Auto search the movie
      setMovieSearch(q.movie);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between gap-2",
            isOpen && "border-amber-200 bg-amber-50/50"
          )}
        >
          <div className="flex items-center gap-2">
            <Quote className="h-4 w-4 text-amber-700" />
            <span className="font-medium">Film Replikleri</span>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3 space-y-4">
        {/* Film Arama */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Film/Dizi Ara (sahne görseli için)</Label>
          <div className="flex gap-2">
            <Input
              value={movieSearch}
              onChange={(e) => setMovieSearch(e.target.value)}
              placeholder="Film adı yaz..."
              onKeyDown={(e) => e.key === "Enter" && handleMovieSearch()}
            />
            <Button size="icon" variant="outline" onClick={handleMovieSearch} disabled={isSearching}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Arama Sonuçları */}
        {searchResults.length > 0 && (
          <div className="max-h-40 overflow-y-auto rounded border divide-y">
            {searchResults.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectMovie(r)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent"
              >
                <span className="font-medium">{r.title}</span>
                <Badge variant="outline" className="text-[10px]">{r.year}</Badge>
              </button>
            ))}
          </div>
        )}

        {/* Seçili Film */}
        {selectedMovie && (
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800">
              {selectedMovie.title} ({selectedMovie.year})
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => { setSelectedMovie(null); setBackdrops([]); }}>
              Değiştir
            </Button>
          </div>
        )}

        {/* Sahne Görselleri */}
        {isLoadingImages && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            Sahne görselleri yükleniyor...
          </div>
        )}

        {backdrops.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              Sahne Görseli Seç ({backdrops.length})
            </Label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {backdrops.map((b, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectBackdrop(b.url)}
                  className={cn(
                    "relative rounded overflow-hidden aspect-video border-2 transition-all",
                    selectedBackdrop === b.url ? "border-amber-500 ring-2 ring-amber-300" : "border-transparent hover:border-amber-300"
                  )}
                >
                  <img src={b.url} alt="" className="w-full h-full object-cover" />
                  {selectedBackdrop === b.url && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                      <Check className="h-5 w-5 text-white drop-shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Karakter/Oyuncu Fotoğrafları */}
        {isLoadingCast && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            Oyuncu kadrosu yükleniyor...
          </div>
        )}

        {castMembers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Karakter Fotoğrafı Seç ({getMatchedCastMembers().length})
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setShowCharacterPhotos(!showCharacterPhotos)}
              >
                {showCharacterPhotos ? "Gizle" : "Göster"}
              </Button>
            </div>

            {showCharacterPhotos && (
              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-muted/30 rounded">
                {getMatchedCastMembers().map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleSelectCharacterPhoto(member.profileUrlHd || member.profileUrl || "", member.character, member.name)}
                    className={cn(
                      "relative rounded overflow-hidden aspect-[2/3] border-2 transition-all group",
                      selectedCharacterPhoto === (member.profileUrlHd || member.profileUrl)
                        ? "border-amber-500 ring-2 ring-amber-300"
                        : "border-transparent hover:border-amber-300"
                    )}
                    title={`${member.character} - ${member.name}`}
                  >
                    <img
                      src={member.profileUrl || ""}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedCharacterPhoto === (member.profileUrlHd || member.profileUrl) && (
                      <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white drop-shadow-lg" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[9px] text-white font-medium leading-tight truncate">
                        {member.character}
                      </p>
                      <p className="text-[8px] text-white/70 leading-tight truncate">
                        {member.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showCharacterPhotos && characterName && getMatchedCastMembers().length < castMembers.length && (
              <p className="text-xs text-muted-foreground text-center">
                💡 "{characterName}" ile eşleşen karakterler gösteriliyor
              </p>
            )}
          </div>
        )}

        {/* Replik Yazma */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Replik</Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs gap-1"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              <Sparkles className="h-3 w-3" />
              {showSuggestions ? "Gizle" : "Öneriler"}
            </Button>
          </div>
          <Textarea
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            placeholder="Repliği buraya yazın veya aşağıdan seçin..."
            rows={3}
            maxLength={300}
          />
        </div>

        {/* Otomatik Replik Önerileri */}
        {showSuggestions && (
          <div className="max-h-48 overflow-y-auto rounded border divide-y bg-card">
            {POPULAR_QUOTES.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectSuggestion(q)}
                className="flex w-full flex-col px-3 py-2.5 text-left hover:bg-accent transition-colors"
              >
                <p className="text-sm font-medium italic">&ldquo;{q.quote}&rdquo;</p>
                <p className="text-xs text-muted-foreground mt-1">
                  — {q.character}, <span className="font-medium">{q.movie}</span> ({q.year})
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Karakter Adı */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Karakter Adı (opsiyonel)</Label>
          <Input
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Tyler Durden, Gandalf..."
          />
        </div>

        {/* Uygula Butonu */}
        <Button
          onClick={handleApplyQuote}
          className="w-full bg-amber-600 hover:bg-amber-700"
          disabled={!quoteText.trim()}
        >
          <Quote className="h-4 w-4 mr-2" />
          Repliği Forma Uygula
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Film arayıp sahne görseli seçin, repliği yazın veya önerilerden seçin.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
