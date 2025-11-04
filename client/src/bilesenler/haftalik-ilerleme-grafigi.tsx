// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, BarChart3, Calendar, Crown, Zap, Sparkles, Activity } from "lucide-react";
import { useState, useEffect } from "react";

interface DaySummary {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  moods: any[];
  productivity: number;
}

export function WeeklyProgressChart() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  
  const { data: summaryData = [], isLoading } = useQuery<DaySummary[]>({
    queryKey: ["/api/summary/daily", { range: 7 }],
    queryFn: () => fetch("/api/summary/daily?range=7").then(res => res.json()),
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const formatDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    return dayNames[date.getDay()];
  };

  const getBarHeight = (tasksCompleted: number, maxTasks: number) => {
    if (maxTasks === 0) return 0;
    // Tamamlanan görevler için minimum görünür yükseklik sağlayın
    return Math.max((tasksCompleted / maxTasks) * 100, tasksCompleted > 0 ? 15 : 0);
  };

  const getBarColor = (productivity: number) => {
    if (productivity >= 80) return '#10b981'; // Yeşil
    if (productivity >= 60) return '#f59e0b'; // Sarı
    if (productivity >= 40) return '#f97316'; // Turuncu
    if (productivity > 0) return '#ef4444';   // Kırmızı
    return '#6b7280'; // Gri
  };

  // En aktif günümğü bul
  const getMostActiveDay = () => {
    if (!summaryData.length) return null;
    const mostActive = summaryData.reduce((max, day) => 
      day.tasksCompleted > max.tasksCompleted ? day : max
    );
    return mostActive.tasksCompleted > 0 ? mostActive : null;
  };

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                   'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  if (isLoading) {
    return (
      <div className="group bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 p-8 relative overflow-hidden shadow-lg">
        {/* Animasyonlu Arka Plan Öğeleri */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-green-500/10 to-blue-600/10 rounded-full blur-2xl animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg animate-pulse">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-20 mt-2 animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-3"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const reversedData = [...summaryData].reverse(); // En eski tarihten en yeni tarihe göster
  const maxTasks = Math.max(...reversedData.map(day => day.tasksCompleted), 1);
  const totalTasksCompleted = reversedData.reduce((sum, day) => sum + day.tasksCompleted, 0);
  const averageProductivity = reversedData.length > 0 
    ? Math.round(reversedData.reduce((sum, day) => sum + day.productivity, 0) / reversedData.length)
    : 0;
  const activeDays = reversedData.filter(day => day.tasksCompleted > 0).length;
  const mostActiveDay = getMostActiveDay();

  return (
    <div className={`bg-card rounded-lg border border-border p-4 relative overflow-hidden shadow-sm transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} data-testid="weekly-activity-chart">

      <div className="relative z-10">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Aktivitelerim
              </h3>
              <p className="text-xs text-muted-foreground">Son 7 gün</p>
            </div>
          </div>
          
        </div>

        {/* Özet İstatistikleri */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-primary" data-testid="total-tasks-completed">
              {totalTasksCompleted}
            </div>
            <div className="text-xs text-muted-foreground">Görev</div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-primary" data-testid="average-productivity">
              {averageProductivity}%
            </div>
            <div className="text-xs text-muted-foreground">Verim</div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-primary">
              {activeDays}/7
            </div>
            <div className="text-xs text-muted-foreground">Aktif</div>
          </div>
        </div>

        {/* Geliştirilmiş Grafik */}
        <div className="space-y-4" data-testid="progress-chart">
          {reversedData.length === 0 || (totalTasksCompleted === 0 && averageProductivity === 0) ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="relative mb-6">
                <Calendar className="h-16 w-16 mx-auto opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full animate-spin"></div>
                </div>
              </div>
              <p className="font-medium text-lg mb-2">Henüz aktivite verisi bulunmuyor</p>
              <p className="text-sm">Görev tamamlayarak ilerlemenizi takip etmeye başlayın</p>
              <div className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 inline-block">
                İlk görevinizi eklemeye hazır mısınız?
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {reversedData.map((day, index) => {
                const barWidth = Math.max((day.tasksCompleted / Math.max(maxTasks, 1)) * 100, day.tasksCompleted > 0 ? 15 : 0);
                const isHighlighted = mostActiveDay && day.date === mostActiveDay.date;
                const isHovered = hoveredDay === day.date;
                
                return (
                  <div 
                    key={day.date} 
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${isHighlighted ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700' : isHovered ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                    data-testid={`progress-bar-${index}`}
                    onMouseEnter={() => setHoveredDay(day.date)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* Gün etiketi ile geliştirilmiş stil */}
                    <div className="text-center min-w-[50px]">
                      <div className={`text-lg font-bold ${isHighlighted ? 'text-yellow-700 dark:text-yellow-300' : 'text-foreground'}`}>
                        {formatDayName(day.date)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(day.date).getDate()}
                      </div>
                    </div>

                    {/* Geliştirilmiş Yatay Çubuk */}
                    <div className="flex-1 relative">
                      <div className={`h-8 rounded-xl overflow-hidden ${isHighlighted ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-800/50'} shadow-inner`}>
                        <div
                          className={`h-full rounded-xl transition-all duration-700 flex items-center justify-between px-3 ${isHighlighted ? 'shadow-lg' : ''}`}
                          style={{
                            width: `${barWidth}%`,
                            background: `linear-gradient(135deg, ${getBarColor(day.productivity)}dd, ${getBarColor(day.productivity)})`,
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                          }}
                        >
                          {day.tasksCompleted > 0 && (
                            <>
                              <span className="text-sm font-bold text-white drop-shadow-sm">
                                {day.tasksCompleted} görev
                              </span>
                              {isHighlighted && <Crown className="h-4 w-4 text-yellow-200" />}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Gelişmiş Verimlilik Rozeti */}
                    <div className={`min-w-[60px] text-center px-3 py-1 rounded-lg text-sm font-medium ${
                      day.productivity >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      day.productivity >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      day.productivity >= 40 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                      day.productivity > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400'
                    }`}>
                      {day.productivity}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Geliştirilmiş Açıklama */}
        <div className="mt-6 pt-6 border-t border-white/20 dark:border-gray-700/30">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
              <span className="text-green-700 dark:text-green-300 font-medium">Mükemmel (80%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
              <span className="text-yellow-700 dark:text-yellow-300 font-medium">İyi (60%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></div>
              <span className="text-orange-700 dark:text-orange-300 font-medium">Orta (40%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
              <span className="text-red-700 dark:text-red-300 font-medium">Geliştirilmeli</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
