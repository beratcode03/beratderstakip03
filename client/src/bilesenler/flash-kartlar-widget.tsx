// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR


// SİLİNECEK!!!
//kullanılmayacak
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Brain, RefreshCw, Shuffle, CheckCircle, XCircle, AlertCircle, Plus, Trash2, Sparkles, GraduationCap, BarChart3, ExternalLink } from "lucide-react";
import { Button } from "@/bilesenler/arayuz/button";
import { Input } from "@/bilesenler/arayuz/input";
import { Textarea } from "@/bilesenler/arayuz/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/bilesenler/arayuz/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/bilesenler/arayuz/dialog";
import { Badge } from "@/bilesenler/arayuz/badge";
import { Card, CardContent, CardHeader } from "@/bilesenler/arayuz/card";
import { Link } from "wouter";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  examType: 'TYT' | 'AYT';
  subject: string;
  topic?: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date | null;
  nextReview?: Date | null;
  reviewCount: string;
  createdAt: Date;
}

export function FlashcardsWidget() {
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [newCard, setNewCard] = useState({
    question: '',
    answer: '',
    examType: 'TYT' as 'TYT' | 'AYT',
    subject: '',
    topic: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
  });
  const sorguIstemcisi = useQueryClient();

  const { data: dueCards = [], isLoading } = useQuery<Flashcard[]>({
    queryKey: ["/api/flashcards/due"],
  });

  const reviewCardMutation = useMutation({
    mutationFn: async ({ cardId, difficulty, isCorrect, userAnswer }: { cardId: string; difficulty: 'easy' | 'medium' | 'hard'; isCorrect: boolean; userAnswer: string }) => {
      const response = await fetch(`/api/flashcards/${cardId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, isCorrect, userAnswer }),
      });
      if (!response.ok) throw new Error('Failed to review card');
      return response.json();
    },
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ["/api/flashcards/due"] });
      setUserAnswer('');
      setIsAnswered(false);
      setIsCorrect(null);
      setCurrentCard(null);
    }
  });

  const createCardMutation = useMutation({
    mutationFn: async (cardData: typeof newCard) => {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData)
      });
      if (!response.ok) throw new Error('Failed to create card');
      return response.json();
    },
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ["/api/flashcards/due"] });
      setNewCard({ question: '', answer: '', examType: 'TYT', subject: '', topic: '', difficulty: 'medium' });
      setIsCreatingCard(false);
    }
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (cardId: string) => {
      const response = await fetch(`/api/flashcards/${cardId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete card');
      return response.json();
    },
    onSuccess: () => {
      sorguIstemcisi.invalidateQueries({ queryKey: ["/api/flashcards/due"] });
      setCurrentCard(null);
      setIsStudyMode(false);
    }
  });

  const handleCreateCard = () => {
    if (newCard.question.trim() && newCard.answer.trim() && newCard.subject.trim() && newCard.topic.trim()) {
      createCardMutation.mutate(newCard);
    }
  };

  const handleAnswerSubmit = () => {
    if (!currentCard || !userAnswer.trim()) return;
    
    const isAnswerCorrect = userAnswer.toLowerCase().trim() === currentCard.answer.toLowerCase().trim();
    setIsCorrect(isAnswerCorrect);
    setIsAnswered(true);
  };

  const handleNextCard = () => {
    if (!currentCard || !isAnswered) return;
    
    // Yanlış cevaplanan kartlar için daha sık tekrar
    const difficulty = isCorrect ? 'easy' : 'hard';
    
    reviewCardMutation.mutate({ 
      cardId: currentCard.id, 
      difficulty, 
      isCorrect: isCorrect || false, 
      userAnswer 
    });
  };

  const drawRandomCard = () => {
    if (dueCards.length === 0) return;
    
    const availableCards = dueCards.filter(card => !currentCard || card.id !== currentCard.id);
    if (availableCards.length === 0 && dueCards.length > 0) {
      setCurrentCard(dueCards[0]);
    } else if (availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      setCurrentCard(availableCards[randomIndex]);
    }
    
    setUserAnswer('');
    setIsAnswered(false);
    setIsCorrect(null);
    setIsStudyMode(true);
  };

  const getExamTypeColor = (examType: string) => {
    return examType === 'TYT' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
      case 'medium': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800';
      case 'hard': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800';
    }
  };

  const getSubjectEmoji = (subject: string) => {
    const emojiMap: { [key: string]: string } = {
      'matematik': '📐',
      'turkce': '📚',
      'fizik': '⚛️',
      'kimya': '🧪',
      'biyoloji': '🧬',
      'tarih': '🏛️',
      'cografya': '🌍',
      'felsefe': '🤔',
      'genel': '📖'
    };
    return emojiMap[subject] || '📖';
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Tekrar Kartları
            </span>
          </h3>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gradient-to-r from-muted via-muted/80 to-muted rounded-lg"></div>
            <div className="h-24 bg-gradient-to-br from-muted via-muted/60 to-muted/40 rounded-xl"></div>
            <div className="h-10 bg-gradient-to-r from-muted via-muted/70 to-muted rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isStudyMode || !currentCard) {
    return (
      <Card className="bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Tekrar Kartları
              </span>
            </h3>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-gradient-to-r from-muted/80 to-muted/60 text-foreground font-medium px-3 py-1 shadow-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                {dueCards.length} kart hazır
              </Badge>
              <Dialog open={isCreatingCard} onOpenChange={setIsCreatingCard}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Yeni Tekrar Kartı Oluştur
                    </DialogTitle>
                  </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Sınav Türü</label>
                    <Select value={newCard.examType} onValueChange={(value: 'TYT' | 'AYT') => setNewCard({...newCard, examType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TYT">TYT</SelectItem>
                        <SelectItem value="AYT">AYT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Ders</label>
                    <Select value={newCard.subject} onValueChange={(value) => setNewCard({...newCard, subject: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ders seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matematik">Matematik</SelectItem>
                        <SelectItem value="turkce">Türkçe</SelectItem>
                        <SelectItem value="fizik">Fizik</SelectItem>
                        <SelectItem value="kimya">Kimya</SelectItem>
                        <SelectItem value="biyoloji">Biyoloji</SelectItem>
                        <SelectItem value="tarih">Tarih</SelectItem>
                        <SelectItem value="cografya">Coğrafya</SelectItem>
                        <SelectItem value="felsefe">Felsefe</SelectItem>
                        <SelectItem value="genel">Genel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Konu</label>
                    <Input
                      value={newCard.topic}
                      onChange={(e) => setNewCard({...newCard, topic: e.target.value})}
                      placeholder="Konuyu yazın... (ör: Türev, Hareket)"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Soru</label>
                    <Textarea
                      value={newCard.question}
                      onChange={(e) => setNewCard({...newCard, question: e.target.value})}
                      placeholder="Soruyu yazın..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Cevap</label>
                    <Textarea
                      value={newCard.answer}
                      onChange={(e) => setNewCard({...newCard, answer: e.target.value})}
                      placeholder="Cevabı yazın..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Zorluk</label>
                    <Select value={newCard.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setNewCard({...newCard, difficulty: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Kolay</SelectItem>
                        <SelectItem value="medium">Orta</SelectItem>
                        <SelectItem value="hard">Zor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreatingCard(false)}>
                      İptal
                    </Button>
                    <Button 
                      onClick={handleCreateCard} 
                      disabled={!newCard.question.trim() || !newCard.answer.trim() || !newCard.subject || !newCard.topic.trim() || createCardMutation.isPending}
                    >
                      {createCardMutation.isPending ? 'Oluşturuyor...' : 'Oluştur'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        </CardHeader>
        <CardContent>
          {dueCards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto mb-4">
                <Brain className="h-10 w-10 opacity-50" />
              </div>
              <p className="text-base font-medium mb-2">Çalışılacak kart yok</p>
              <p className="text-sm">Tüm kartlar gözden geçirilmiş! 🎉</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {dueCards.length} kart çalışmaya hazır
                </p>
                <Button
                  onClick={drawRandomCard}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
                  data-testid="draw-card-button"
                >
                  <Shuffle className="h-5 w-5 mr-2" />
                  Kart Çek
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm">
                  <div className="font-semibold text-green-800 dark:text-green-300 text-sm mb-1">Kolay</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {dueCards.filter(c => c.difficulty === 'easy').length}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800 rounded-xl shadow-sm">
                  <div className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm mb-1">Orta</div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {dueCards.filter(c => c.difficulty === 'medium').length}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm">
                  <div className="font-semibold text-red-800 dark:text-red-300 text-sm mb-1">Zor</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {dueCards.filter(c => c.difficulty === 'hard').length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Tekrar Kartları
              </span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteCardMutation.mutate(currentCard!.id)}
              disabled={deleteCardMutation.isPending}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStudyMode(false)}
              className="border-muted-foreground/20 hover:bg-muted/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4" data-testid="flashcard-study-mode">
        {/* Kart Bilgisi */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">{currentCard.examType}</span>
            <span className="text-lg">{getSubjectEmoji(currentCard.subject)}</span>
            <span className="font-medium capitalize">{currentCard.subject}</span>
            {currentCard.topic && <span className="text-muted-foreground">• {currentCard.topic}</span>}
          </div>
          <div className={`px-2 py-1 rounded-lg border text-xs font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
            {currentCard.difficulty === 'easy' ? 'Kolay' : currentCard.difficulty === 'medium' ? 'Orta' : 'Zor'}
          </div>
        </div>

        {/* Soru Kartı */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 min-h-[120px]">
          <div className="text-xs text-primary font-medium mb-2">SORU</div>
          <p className="text-foreground font-medium text-base leading-relaxed" data-testid="flashcard-question">
            {currentCard.question}
          </p>
        </div>

        {/* Cevap Girişi Bölümü */}
        {!isAnswered ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Cevabınızı Yazın:</label>
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Cevabı buraya yazın..."
                onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                className="text-base"
                data-testid="answer-input"
              />
            </div>
            <Button
              onClick={handleAnswerSubmit}
              disabled={!userAnswer.trim()}
              className="w-full"
              data-testid="check-answer-button"
            >
              Kontrol Et
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Kullanıcı Cevabı Geri Bildirimi */}
            <div className={`p-4 rounded-lg border ${
              isCorrect 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <span className={`font-medium ${
                  isCorrect 
                    ? 'text-green-800 dark:text-green-300' 
                    : 'text-red-800 dark:text-red-300'
                }`}>
                  {isCorrect ? 'Doğru!' : 'Yanlış!'}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Sizin cevabınız: <span className="font-medium">{userAnswer}</span></p>
                <p className="text-muted-foreground">Doğru cevap: <span className="font-medium text-foreground">{currentCard.answer}</span></p>
                {!isCorrect && (
                  <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium text-sm">Hata Analizi Önerisi</span>
                    </div>
                    <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                      Yanlış cevap verdiğin konuları analiz etmek için
                    </p>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 mt-2 text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 font-medium text-sm transition-colors">
                      <BarChart3 className="h-4 w-4" />
                      Raporlarım kısmında Hata Analiz Kısmını kontrol et !
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sonraki Buton */}
            <Button
              onClick={handleNextCard}
              disabled={reviewCardMutation.isPending}
              className="w-full"
              data-testid="next-card-button"
            >
              {reviewCardMutation.isPending ? 'Yükleniyor...' : 'Sonraki Kart'}
            </Button>
          </div>
        )}

        {/* Kart İlerlemesi */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          İnceleme: {parseInt(currentCard.reviewCount) + 1} • 
          Kalan: {dueCards.length - 1} kart
        </div>
      </CardContent>
    </Card>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
