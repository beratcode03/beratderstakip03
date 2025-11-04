// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function MidnightCountdown() {
  const [timeUntilSundayArchive, setTimeUntilSundayArchive] = useState("");

  useEffect(() => {
    const calculateTimeUntilSundayArchive = () => {
      // Türkiye saati için Pazar 23:59 hesaplama (GMT+3)
      const now = new Date();
      const turkeyTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
      
      // Bir sonraki Pazar 23:59'u bul
      const nextSunday = new Date(turkeyTime);
      const currentDay = nextSunday.getDay(); // 0 = Pazar, 1 = Pazartesi, ..., 6 = Cumartesi
      
      let daysUntilSunday: number;
      if (currentDay === 0) {
        // Bugün Pazar mı?
        const targetTime = new Date(turkeyTime);
        targetTime.setHours(23, 59, 0, 0);
        daysUntilSunday = turkeyTime < targetTime ? 0 : 7;
      } else {
        // Pazar değil
        daysUntilSunday = 7 - currentDay;
      }
      
      nextSunday.setDate(nextSunday.getDate() + daysUntilSunday);
      nextSunday.setHours(23, 59, 0, 0);
      
      const diff = nextSunday.getTime() - turkeyTime.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const updateTimer = () => {
      setTimeUntilSundayArchive(calculateTimeUntilSundayArchive());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200 rounded-lg border border-purple-200 dark:border-purple-800">
      <Clock className="h-4 w-4" />
      <div className="flex flex-col">
        <span className="text-xs font-medium">Pazar 23:59 Arşivleme</span>
        <span className="text-sm font-bold font-mono">{timeUntilSundayArchive}</span>
      </div>
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
