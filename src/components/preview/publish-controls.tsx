"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, Loader2, CheckCircle, AlertCircle, Download } from "lucide-react";
import { useContentStore } from "@/store/content-store";
import { toast } from "sonner";

export function PublishControls() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [publishStatus, setPublishStatus] = useState<"idle" | "publishing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [precheckMessage, setPrecheckMessage] = useState<string | null>(null);

  const store = useContentStore();
  const { generatedImages, caption, contentType } = store;

  const handlePublish = async () => {
    setShowConfirm(false);
    setPublishStatus("publishing");
    store.setIsPublishing(true);
    setPrecheckMessage(null);

    try {
      // Preflight: avoid a long publish flow if credentials are missing/invalid.
      const validateRes = await fetch("/api/settings/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "all" }),
      });
      const validate = (await validateRes.json()) as Record<string, { ok: boolean; message: string }>;
      if (validate.cloudinary && !validate.cloudinary.ok) {
        const msg = `Cloudinary: ${validate.cloudinary.message}`;
        setPrecheckMessage(msg);
        throw new Error(msg);
      }
      if (validate.instagram && !validate.instagram.ok) {
        const msg = `Instagram: ${validate.instagram.message}`;
        setPrecheckMessage(msg);
        throw new Error(msg);
      }

      const res = await fetch("/api/instagram/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: generatedImages.map((img) => img.path),
          caption,
          contentType,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setPublishStatus("success");
      toast.success("Instagram'a başarıyla yayınlandı!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      setPublishStatus("error");
      setErrorMessage(msg);
      toast.error(`Yayınlama hatası: ${msg}`);
    } finally {
      store.setIsPublishing(false);
    }
  };

  const handleDownload = () => {
    generatedImages.forEach((img) => {
      const a = document.createElement("a");
      a.href = img.path;
      a.download = img.filename;
      a.click();
    });
  };

  if (generatedImages.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Button onClick={() => setShowConfirm(true)} className="flex-1 gap-2" disabled={publishStatus === "publishing"}>
          {publishStatus === "publishing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {publishStatus === "publishing" ? "Yayınlanıyor..." : "Instagram'a Yayınla"}
        </Button>

        <Button variant="outline" onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          İndir
        </Button>
      </div>

      {publishStatus === "success" && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-950 dark:text-green-300">
          <CheckCircle className="h-4 w-4" />
          <p className="text-sm font-medium">Başarıyla yayınlandı!</p>
        </div>
      )}

      {publishStatus === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-300">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instagram&apos;a Yayınla</DialogTitle>
            <DialogDescription>
              {generatedImages.length} görsel Instagram hesabınıza ({contentType === "story" ? "story olarak" : "post olarak"}) yayınlanacak. Onaylıyor musunuz?
            </DialogDescription>
          </DialogHeader>
          {precheckMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {precheckMessage}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              İptal
            </Button>
            <Button onClick={handlePublish} className="gap-2">
              <Send className="h-4 w-4" />
              Evet, Yayınla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
