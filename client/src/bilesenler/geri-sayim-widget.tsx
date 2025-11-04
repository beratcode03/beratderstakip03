// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useState, useEffect } from "react";

interface CountdownWidgetProps {
  className?: string;
}

export function CountdownWidget({ className = "" }: CountdownWidgetProps) {
  const [tytCountdown, setTytCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [aytCountdown, setAytCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // TYT Tarih: Haziran 20, 2026 Cumartesi 10:15
    const tytDate = new Date("2026-06-20T10:15:00");
    // AYT Tarih: Haziran 21, 2026 Pazar 10:15
    const aytDate = new Date("2026-06-21T10:15:00");

    const updateCountdown = () => {
      const now = new Date();
      
      // TYT net hesaplama
      const tytDiff = tytDate.getTime() - now.getTime();
      if (tytDiff > 0) {
        const days = Math.floor(tytDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((tytDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((tytDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((tytDiff % (1000 * 60)) / 1000);
        setTytCountdown({ days, hours, minutes, seconds });
      } else {
        setTytCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
      
      // AYT net hesaplama
      const aytDiff = aytDate.getTime() - now.getTime();
      if (aytDiff > 0) {
        const days = Math.floor(aytDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((aytDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((aytDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((aytDiff % (1000 * 60)) / 1000);
        setAytCountdown({ days, hours, minutes, seconds });
      } else {
        setAytCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Hemen güncelle ve ardından her saniye güncelle
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: { days: number; hours: number; minutes: number; seconds: number }) => {
    return {
      days: time.days.toString().padStart(3, '0'),
      hours: time.hours.toString().padStart(2, '0'),
      minutes: time.minutes.toString().padStart(2, '0'),
      seconds: time.seconds.toString().padStart(2, '0')
    };
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-md rounded-3xl border border-border/30 p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] ${className}`}>
      {/* Arka Plan Deseni */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(var(--primary), 0.5) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(var(--primary), 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      <div className="relative text-center mb-10">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-full blur-3xl -z-10"></div>
        <h3 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 via-primary to-emerald-600 bg-clip-text text-transparent mb-3">
          YKS 2026 Geri Sayımı
        </h3>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-primary rounded-full"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="w-12 h-0.5 bg-gradient-to-r from-primary via-emerald-500 to-transparent rounded-full"></div>
        </div>
        <p className="text-muted-foreground text-sm mt-2">Hedefime olan mesafem ;</p>
      </div>

      {/* Zincir Bağlantılı Geri Sayım Düzeni */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        
        {/* TYT Net */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-card to-card/90 rounded-2xl border border-border/30 p-6 shadow-xl">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-3 shadow-lg">
                <span className="text-2xl font-bold text-white">T</span>
              </div>
              <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                TYT 2026
              </h4>
              <div className="text-xs text-muted-foreground">Temel Yeterlilik Testi</div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Gün', value: formatTime(tytCountdown).days },
                { label: 'Saat', value: formatTime(tytCountdown).hours },
                { label: 'Dk', value: formatTime(tytCountdown).minutes },
                { label: 'Sn', value: formatTime(tytCountdown).seconds }
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl px-2 py-3 shadow-lg min-h-[60px] flex flex-col justify-center">
                    <span className="text-lg md:text-xl font-bold font-mono leading-tight">{value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zincir Bağlantılı Geri Sayım Düzeni */}
        <div className="relative flex items-center justify-center">
          {/* Yan Bağlantılar */}
          <div className="lg:hidden flex flex-col items-center space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-8 h-8 border-4 border-primary/30 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-md animate-bounce" 
                   style={{ animationDelay: `${i * 200}ms`, animationDuration: '2s' }}></div>
            ))}
          </div>
          
          <div className="hidden lg:flex items-center space-x-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-6 h-6 border-3 border-primary/40 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg animate-pulse" 
                   style={{ animationDelay: `${i * 300}ms`, animationDuration: '2.5s' }}></div>
            ))}
          </div>

          {/* Merkez bağlantı elemanı */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full shadow-2xl flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full opacity-90 animate-ping"></div>
            </div>
          </div>
        </div>

        {/* AYT Zaman */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-card to-card/90 rounded-2xl border border-border/30 p-6 shadow-xl">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full mb-3 shadow-lg">
                <span className="text-2xl font-bold text-white">A</span>
              </div>
              <h4 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                AYT 2026  
              </h4>
              <div className="text-xs text-muted-foreground">Alan Yeterlilik Testi</div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Gün', value: formatTime(aytCountdown).days },
                { label: 'Saat', value: formatTime(aytCountdown).hours },
                { label: 'Dk', value: formatTime(aytCountdown).minutes },
                { label: 'Sn', value: formatTime(aytCountdown).seconds }
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-xl px-2 py-3 shadow-lg min-h-[60px] flex flex-col justify-center">
                    <span className="text-lg md:text-xl font-bold font-mono leading-tight">{value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alt Motivasyon Bölümü */}
      <div className="relative text-center mt-12 space-y-4">
        <div className="text-base text-foreground font-medium">
          ✨ Hedefime ulaşmak için kalan zaman ✨
        </div>
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-primary to-primary/60 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.6s' }}></div>
        </div>
        <div className="text-xs text-muted-foreground italic">
          "Başarı, hazırlığın fırsatla buluştuğu andır"
        </div>
      </div>
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
