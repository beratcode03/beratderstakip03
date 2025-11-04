// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/bilesenler/arayuz/dialog";
import { Button } from "@/bilesenler/arayuz/button";
import { Textarea } from "@/bilesenler/arayuz/textarea";
import { Mood, InsertMood } from "@shared/sema";
import { apiRequest, sorguIstemcisi } from "@/kutuphane/sorguIstemcisi";
import { useToast } from "@/hooks/use-toast";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const moodEmojis = {
  "very-happy": { emoji: "😄", text: "Harika" },
  "happy": { emoji: "😊", text: "İyi" },
  "neutral": { emoji: "😐", text: "Normal" },
  "sad": { emoji: "😔", text: "Üzgün" },
  "angry": { emoji: "😠", text: "Sinirli" },
};

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const { data: latestMood } = useQuery<Mood>({
    queryKey: ["/api/moods/latest"],
    enabled: open,
  });

  const saveMoodMutation = useMutation({
    mutationFn: (data: InsertMood) => 
      apiRequest("POST", "/api/moods", data),
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ["/api/moods"] });
      sorguIstemcisi.invalidateQueries({ queryKey: ["/api/moods/latest"] });
      toast({
        title: "Ruh hali kaydedildi",
        description: "Ruh haliniz başarıyla kaydedildi.",
      });
      onOpenChange(false);
      setSelectedMood("");
      setNote("");
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Ruh hali kaydedilemedi.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!selectedMood) {
      toast({
        title: "Uyarı",
        description: "Lütfen bir ruh hali seçin.",
        variant: "destructive",
      });
      return;
    }

    saveMoodMutation.mutate({
      mood: selectedMood as any,
      note: note.trim() || undefined,
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Az önce";
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} gün önce`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ruh Halini Paylaş</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Mood seçici */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bugün nasıl hissediyorsun?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(moodEmojis).map(([mood, { emoji, text }]) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`p-3 rounded-lg border transition-colors text-center ${
                    selectedMood === mood
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                  data-testid={`mood-${mood}`}
                >
                  <div className="text-2xl">{emoji}</div>
                  <div className="text-xs mt-1">{text}</div>
                </button>
              ))}
            </div>
          </div>

          {/* not */}
          <div>
            <label htmlFor="mood-note" className="block text-sm font-medium text-foreground mb-2">
              Notun
            </label>
            <Textarea
              id="mood-note"
              placeholder="Bugün nasıl hissediyorsun? Notunu buraya yaz..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-24 resize-none"
              data-testid="input-note"
            />
          </div>

          {/* Son Ruh Hali Gösterimi */}
          {latestMood && (
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground mb-1">Son ruh hali:</div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {moodEmojis[latestMood.mood as keyof typeof moodEmojis]?.emoji}
                </span>
                <span className="text-sm text-foreground">
                  {moodEmojis[latestMood.mood as keyof typeof moodEmojis]?.text} hissediyorum
                </span>
                <span className="text-xs text-muted-foreground">
                  • {formatTimeAgo(latestMood.createdAt!)}
                </span>
              </div>
              {latestMood.note && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  "{latestMood.note}"
                </p>
              )}
            </div>
          )}

          {/* Eylem Düğmeleri */}
          <div className="flex space-x-3 pt-2">
            <Button 
              onClick={handleSave}
              disabled={saveMoodMutation.isPending}
              className="flex-1"
              data-testid="button-save-mood"
            >
              {saveMoodMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
            <Button 
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-mood"
            >
              İptal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
