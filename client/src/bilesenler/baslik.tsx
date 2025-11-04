// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { Sun, Moon, Clock, Home, CheckSquare, BarChart3, Calculator, Timer, BookOpen, Minus, Square, X, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { useTheme } from "./tema-saglayici";
import { useState, useEffect } from "react";
import { EmojiPicker } from "./emoji-secici";
import { MotivationalQuote } from "./motivasyon-sozu";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  hideClockOnHomepage?: boolean;
  onReportCounterClick?: () => void;
}

export function Header({ hideClockOnHomepage = false, onReportCounterClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [note, setNote] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // yerel depolamadan yükle(kayitlar/json)
  useEffect(() => {
    const savedEmoji = localStorage.getItem('userEmoji');
    const savedNote = localStorage.getItem('userNote');
    if (savedEmoji) setSelectedEmoji(savedEmoji);
    if (savedNote) setNote(savedNote);
  }, []);
  
  // aktivite sayısına göre otomatik emoji güncelleme
  useEffect(() => {
    const updateMoodEmoji = () => {
      // Bugünün aktivitelerini say
      const today = new Date().toISOString().split('T')[0];
      
      // Tamamlanan görevleri say
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const completedToday = tasks.filter((t: any) => 
        t.completedAt && t.completedAt.startsWith(today)
      ).length;
      
      // Soru loglarını say
      const questionLogs = JSON.parse(localStorage.getItem('questionLogs') || '[]');
      const questionsToday = questionLogs.filter((q: any) => 
        q.study_date && q.study_date.startsWith(today)
      ).length;
      
      // Deneme sonuçlarını say
      const examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
      const examsToday = examResults.filter((e: any) => 
        e.exam_date && e.exam_date.startsWith(today)
      ).length;
      
      const totalActivity = completedToday + questionsToday + examsToday;
      
      // Aktivite sayısına göre emoji belirle
      let newEmoji = '😊'; // Varsayılan
      if (totalActivity >= 15) newEmoji = '🔥'; // Çok yüksek aktivite 13-16
      else if (totalActivity >= 10) newEmoji = '💪'; // Yüksek aktivite 9-13
      else if (totalActivity >= 7) newEmoji = '⭐'; // İyi aktivite 6-9 
      else if (totalActivity >= 4) newEmoji = '😊'; // Normal aktivite 3-6
      else if (totalActivity >= 1) newEmoji = '🙂'; // Az aktivite 1-3
      else newEmoji = '😴'; // Hiç aktivite yok 0
      
      setSelectedEmoji(newEmoji);
      localStorage.setItem('userEmoji', newEmoji);
    };
    
    // İlk yüklemede güncelle
    updateMoodEmoji();
    
    // localStorage değişikliklerini dinle
    const handleStorageChange = () => updateMoodEmoji();
    window.addEventListener('localStorageUpdate', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    
    // Her 5 dakikada bir güncelle
    const interval = setInterval(updateMoodEmoji, 5 * 60 * 1000);
    
    return () => {
      window.removeEventListener('localStorageUpdate', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  // Yerel depolamaya kaydet
  useEffect(() => {
    localStorage.setItem('userEmoji', selectedEmoji);
  }, [selectedEmoji]);
  
  useEffect(() => {
    localStorage.setItem('userNote', note);
  }, [note]);

  // Her saniye güncelleme zamanı
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fullscreen durumunu dinle(EĞER ÇALIŞIRSA ELECTRON İÇİN DE YAP AMA OTO SEÇSİB)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.onFullscreenChange((fullscreen) => {
        setIsFullscreen(fullscreen);
      });
    }
  }, []);

  // F11 klavye desteği
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        if (typeof window !== 'undefined' && window.electronAPI) {
          window.electronAPI.toggleFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sakarya Serdivan (Türkiye saat dilimi) için tarih ve saati biçimlendir
  const formatDateTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Istanbul',
      weekday: 'long',
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Istanbul',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    const dateStr = currentTime.toLocaleDateString('tr-TR', options);
    const timeStr = currentTime.toLocaleTimeString('tr-TR', timeOptions);
    
    return { dateStr, timeStr };
  };

  const isHomepage = location === '/';
  const isDashboard = location === '/dashboard';

  // Aylık rapor geri sayım hesaplaması
  const getMonthlyReportCountdown = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = now.getDate();
    const daysRemaining = lastDayOfMonth - currentDay;
    const isLastDay = currentDay === lastDayOfMonth;
    
    return { daysRemaining, isLastDay };
  };

  const { daysRemaining, isLastDay } = getMonthlyReportCountdown();

  return (
    <header className="bg-card border-b border-border shadow-sm transition-colors duration-300">
      {/* özelleştirilmiş başlık çubuğu  - yalnızca electron için yapılacak, fullscreende gizle */}
      {typeof window !== 'undefined' && window.electronAPI && !isFullscreen && (
        <div 
          className="h-9 bg-background/95 border-b border-border/50 flex items-center justify-between px-2"
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        >
          {/* sol  - Navigasyon Kontrolleri */}
          <div className="flex items-center space-x-0.5" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
            <button
              onClick={() => window.electronAPI?.goBack()}
              className="h-7 w-8 flex items-center justify-center hover:bg-accent transition-colors rounded-md group"
              title="Geri"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
            <button
              onClick={() => window.electronAPI?.reload()}
              className="h-7 w-8 flex items-center justify-center hover:bg-accent transition-colors rounded-md group"
              title="Yenile"
            >
              <RotateCw className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
            <button
              onClick={() => window.electronAPI?.goForward()}
              className="h-7 w-8 flex items-center justify-center hover:bg-accent transition-colors rounded-md group"
              title="İleri"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>
          
          {/* en üst ortada logo ve berat cankır(yani ben) */}
          <div className="flex items-center space-x-2">
            <img 
              src="/app-icon.png" 
              alt="Berat Cankır Logo" 
              className="h-5 w-5 rounded-sm"
            />
            <span className="text-xs font-semibold text-foreground">Berat Cankır</span>
          </div>
          
          {/* sağ aç kapa butonları */}
          <div className="flex items-center space-x-0.5" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
            <button
              onClick={() => window.electronAPI?.minimizeWindow()}
              className="h-7 w-9 flex items-center justify-center hover:bg-accent transition-colors rounded-sm"
              title="Küçült"
            >
              <Minus className="h-3 w-3" />
            </button>
            <button
              onClick={() => window.electronAPI?.maximizeWindow()}
              className="h-7 w-9 flex items-center justify-center hover:bg-accent transition-colors rounded-sm"
              title="Ekranı Kapla"
            >
              <Square className="h-3 w-3" />
            </button>
            <button
              onClick={() => window.electronAPI?.closeWindow()}
              className="h-7 w-9 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors rounded-sm"
              title="Kapat"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
      
      {/* Motivasyon Sözü - Her sayfada en üstte ortada */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/50">
        <div className="py-3 px-4">
          <div className="max-w-7xl mx-auto">
            <MotivationalQuote />
          </div>
        </div>
      </div>
      
      {/* Saat/Tarih/konum Bölümü - Anasayfa dışındaki sayfalarda gösterilir */}
      {!isHomepage && (
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/50">
        <div className="flex justify-between items-center py-2">
          {/* Kompakt Saat ve Tarih Gösterimi - Tamamen Solda Hizalanmış */}
          <div className="flex items-start space-x-3 pl-3">
              {/* Saat Simgesi - Daha Büyük */}
              <div className="relative">
                <div className="relative w-8 h-8 bg-black/10 dark:bg-purple-950/20 backdrop-blur-xl border border-purple-500/20 dark:border-purple-400/20 rounded-lg flex items-center justify-center shadow-md">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400 drop-shadow-lg" />
                </div>
              </div>
              
              {/* Saat ve Tarih Düzeni - Dikey, daha büyük ekran */}
              <div className="flex flex-col space-y-1">
                {/* Saat Simgesi - Daha Büyük */}
                <div className="text-base font-bold bg-gradient-to-r from-purple-600 via-violet-700 to-black dark:from-purple-400 dark:via-violet-500 dark:to-gray-300 bg-clip-text text-transparent font-mono" data-testid="text-time-header">
                  {formatDateTime().timeStr}
                </div>

                {/* Tarih ve Yer - Yatay düzen, daha büyük metin */}
                <div className="flex items-center space-x-2 text-sm">
                  <span className="bg-gradient-to-r from-purple-800 to-black dark:from-purple-300 dark:to-gray-200 bg-clip-text text-transparent font-medium" data-testid="text-date-header">
                    {formatDateTime().dateStr}
                  </span>
                  <span className="text-muted-foreground/50">•</span>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <span className="text-sm">📍</span>
                    <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-700 dark:from-purple-400 dark:to-violet-500 bg-clip-text text-transparent">
                      Sakarya, Serdivan
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Üst Sağ - Tema ve Profil - Tamamen sağa eğilimli */}
            <div className="flex items-center space-x-2 pr-0">
              {/* Tema Değiştirme */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200"
                title="Tema Değiştir"
                data-testid="button-theme-toggle"
              >
                {theme === "light" ? (
                  <Sun className="h-4 w-4 text-secondary-foreground" />
                ) : (
                  <Moon className="h-4 w-4 text-secondary-foreground" />
                )}
              </button>

              {/* Profil Bölümü */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground hidden sm:block">Hoşgeldiniz</span>
                <span className="font-medium text-foreground hidden sm:block">Berat Cankır</span>
                <div className="relative">
                  <button
                    onClick={() => setEmojiPickerOpen(true)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                    data-testid="button-emoji-picker"
                  >
                    {/* Profil Fotoğrafı - Her Zaman 'B' Göster(adımın bas harfi mi yoksa???) */}
                    <span className="text-lg font-bold">B</span>
                    
                    {/* Emoji Balonu - Sağ Üst (Her Zaman emoji seçildiğinde gösterilir) */}
                    {selectedEmoji && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-2 border-primary flex items-center justify-center shadow-lg">
                        <span className="text-xs">{selectedEmoji}</span>
                      </div>
                    )}
                    
                    {/* Not Balonu - Alt Sağ */}
                    {note.trim() && (
                      <div className="absolute -bottom-1 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold">!</span>
                      </div>
                    )}
                    
                    {/* Araç ipucu - Artık aşağıda gösterilcek */}
                    {showTooltip && (
                      <div className="absolute top-full left-1/2 mt-2 px-2 py-1 bg-card text-card-foreground text-xs rounded shadow-lg border border-border transform -translate-x-1/2 whitespace-nowrap animate-in fade-in-0 zoom-in-95 z-50">
                        Emoji seç & Not bırak
                        {note.trim() && (
                          <div className="mt-1 text-xs italic text-muted-foreground max-w-40 truncate">
                            "{note.trim()}"
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
      </div>
      )}
      
      {/* Anasayfada Sadece Tema ve Profil - Sağ Üstte */}
      {isHomepage && (
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/50">
          <div className="flex justify-end items-center py-2 pr-4">
            {/* Üst Sağ - Tema ve Profil */}
            <div className="flex items-center space-x-2">
              {/* Tema Değiştirme */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200"
                title="Tema Değiştir"
                data-testid="button-theme-toggle-homepage"
              >
                {theme === "light" ? (
                  <Sun className="h-4 w-4 text-secondary-foreground" />
                ) : (
                  <Moon className="h-4 w-4 text-secondary-foreground" />
                )}
              </button>

              {/* Profil Bölümü */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground hidden sm:block">Hoşgeldiniz</span>
                <span className="font-medium text-foreground hidden sm:block">Berat Cankır</span>
                <div className="relative">
                  <button
                    onClick={() => setEmojiPickerOpen(true)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                    data-testid="button-emoji-picker-homepage"
                  >
                    {/* Profil Fotoğrafı - Her Zaman 'B' Gösterir */}
                    <span className="text-lg font-bold">B</span>
                    
                    {/* Emoji Balonu - Sağ Üst */}
                    {selectedEmoji && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-2 border-primary flex items-center justify-center shadow-lg">
                        <span className="text-xs">{selectedEmoji}</span>
                      </div>
                    )}
                    
                    {/* Not Balonu - Alt Sağ */}
                    {note.trim() && (
                      <div className="absolute -bottom-1 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold">!</span>
                      </div>
                    )}
                    
                    {/* Araç ipucu */}
                    {showTooltip && (
                      <div className="absolute top-full left-1/2 mt-2 px-2 py-1 bg-card text-card-foreground text-xs rounded shadow-lg border border-border transform -translate-x-1/2 whitespace-nowrap animate-in fade-in-0 zoom-in-95 z-50">
                        Emoji seç & Not bırak
                        {note.trim() && (
                          <div className="mt-1 text-xs italic text-muted-foreground max-w-40 truncate">
                            "{note.trim()}"
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigasyon Bölümü */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <button 
                className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2 ${
                  location === '/' 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105'
                }`}
                data-testid="link-homepage"
              >
                <Home className="w-5 h-5" />
                <span>Anasayfa</span>
              </button>
            </Link>
            <Link href="/tasks">
              <button 
                className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2 ${
                  location === '/tasks' 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105'
                }`}
                data-testid="link-todos"
              >
                <CheckSquare className="w-5 h-5" />
                <span>Yapılacaklar</span>
              </button>
            </Link>
            <Link href="/dashboard">
              <button 
                className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2 ${
                  location === '/dashboard' 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105'
                }`}
                data-testid="link-dashboard"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Raporlarım</span>
              </button>
            </Link>
            <Link href="/net-calculator">
              <button 
                className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2 ${
                  location === '/net-calculator' 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105'
                }`}
              >
                <Calculator className="w-5 h-5" />
                <span>Net Hesapla</span>
              </button>
            </Link>
            <Link href="/timer">
              <button 
                className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2 ${
                  location === '/timer' 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105'
                }`}
                data-testid="link-timer"
              >
                <Timer className="w-5 h-5" />
                <span>Sayaç</span>
              </button>
            </Link>
            <Link href="/yks-konular">
              <button 
                className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2 ${
                  location === '/yks-konular' 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105'
                }`}
                data-testid="link-yks-konular"
              >
                <BookOpen className="w-5 h-5" />
                <span>YKS Konular</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* eöoji seçme modalı */}
      <EmojiPicker 
        open={emojiPickerOpen} 
        onOpenChange={setEmojiPickerOpen}
        selectedEmoji={selectedEmoji}
        onEmojiSelect={setSelectedEmoji}
        note={note}
        onNoteChange={setNote}
      />
    </header>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
