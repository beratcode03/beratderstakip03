// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StickyNote, Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/bilesenler/arayuz/button";
import { Input } from "@/bilesenler/arayuz/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/bilesenler/arayuz/dialog";

interface Mood {
  id: string;
  mood: string;
  moodBg?: string | null;
  note?: string | null;
  createdAt: string;
}

export function LatestNotesWidget() {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const sorguIstemcisi = useQueryClient();
  
  const { data: moods = [], isLoading } = useQuery<Mood[]>({
    queryKey: ["/api/moods"],
  });
  
  const addNoteMutation = useMutation({
    mutationFn: async (noteContent: string) => {
      const response = await fetch('/api/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: '📝',
          note: noteContent,
          date: new Date().toISOString().split('T')[0]
        })
      });
      if (!response.ok) throw new Error('Failed to add note');
      return response.json();
    },
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ["/api/moods"] });
      setNoteText('');
      setIsAddingNote(false);
    }
  });
  
  const handleAddNote = () => {
    if (noteText.trim()) {
      addNoteMutation.mutate(noteText.trim());
    }
  };

  //  Notları olan ruh hallerini filtreleyin ve en son 3 tanesini alın
  const latestNotes = moods
    .filter(mood => mood.note && mood.note.trim().length > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes}dk önce`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}s önce`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} gün önce`;
    
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border p-4 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
          <StickyNote className="h-5 w-5 mr-2 text-primary" />
          Son Eklenen Notlar
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <StickyNote className="h-5 w-5 mr-2 text-primary" />
          Son Eklenen Notlar
        </h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
            {latestNotes.length}/3
          </div>
          <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Yeni Not Ekle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Notunuzu yazın..."
                  maxLength={200}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {noteText.length}/200 karakter
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                    İptal
                  </Button>
                  <Button 
                    onClick={handleAddNote} 
                    disabled={!noteText.trim() || addNoteMutation.isPending}
                  >
                    {addNoteMutation.isPending ? 'Ekleniyor...' : 'Ekle'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {latestNotes.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Henüz not eklenmemiş</p>
          <p className="text-xs mt-1">Profil modalu üzerinden not ekleyebilirsiniz</p>
        </div>
      ) : (
        <div className="space-y-3" data-testid="latest-notes-container">
          {latestNotes.map((mood, index) => (
            <div
              key={mood.id}
              className="bg-background/50 rounded-lg p-3 border border-border/30 hover:bg-muted/30 transition-all duration-200"
              data-testid={`note-card-${index}`}
            >
              <div className="flex items-start gap-3">
                {/* Mood emojileri */}
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{
                    backgroundColor: mood.moodBg || '#f3f4f6'
                  }}
                >
                  {mood.mood}
                </div>

                {/* Not içeriği */}
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-sm text-foreground leading-relaxed"
                    data-testid={`note-text-${index}`}
                  >
                    {mood.note && mood.note.length > 120 
                      ? `${mood.note.substring(0, 120)}...` 
                      : mood.note}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span 
                      className="text-xs text-muted-foreground"
                      data-testid={`note-date-${index}`}
                    >
                      {formatDate(mood.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alt Bilgi - Daha Fazla Not Ekle */}
      {latestNotes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Profil modali üzerinden yeni notlar ekleyebilirsiniz
          </p>
        </div>
      )}
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
