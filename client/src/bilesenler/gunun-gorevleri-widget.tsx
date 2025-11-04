// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useQuery, useMutation } from "@tanstack/react-query";
import { Task } from "@shared/sema";
import { CheckCircle2, Circle, Plus, Calendar, PartyPopper } from "lucide-react";
import { apiRequest, sorguIstemcisi } from "@/kutuphane/sorguIstemcisi";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useMemo } from "react";

export function TodaysTasksWidget() {
  const { toast } = useToast();
  const [celebratingTask, setCelebratingTask] = useState<string | null>(null);
  const [showCompletionBar, setShowCompletionBar] = useState(false);
  
  // Kategori isimlerini düzgün formatta gösterecek fonksiyon
  const getCategoryText = (category: string) => {
    switch (category) {
      case "genel":
        return "Genel";
      case "turkce":
        return "Türkçe";
      case "sosyal":
        return "Sosyal Bilimler";
      case "matematik":
        return "TYT Matematik";
      case "fizik":
        return "TYT Fizik";
      case "kimya":
        return "TYT Kimya";
      case "biyoloji":
        return "TYT Biyoloji";
      case "tyt-geometri":
        return "TYT Geometri";
      case "ayt-geometri":
        return "AYT Geometri";
      case "ayt-matematik":
        return "AYT Matematik";
      case "ayt-fizik":
        return "AYT Fizik";
      case "ayt-kimya":
        return "AYT Kimya";
      case "ayt-biyoloji":
        return "AYT Biyoloji";
      default:
        return category;
    }
  };
  
  // Bugünün tarihini YYYY-AA-BB biçiminde al (Türkiye saat dilimi)
  const getTurkeyDateString = () => {
    const now = new Date();
    const turkeyTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
    const year = turkeyTime.getFullYear();
    const month = (turkeyTime.getMonth() + 1).toString().padStart(2, '0');
    const day = turkeyTime.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayStr = getTurkeyDateString();
  
  const { data: todaysData, isLoading } = useQuery<{
    date: string;
    dayNumber: number;
    daysRemaining: number;
    tasks: Task[];
    tasksCount: number;
  }>({
    queryKey: ["/api/calendar", todayStr],
    queryFn: async () => {
      const response = await fetch(`/api/calendar/${todayStr}`);
      if (!response.ok) throw new Error('Failed to fetch today\'s tasks');
      return response.json();
    },
    refetchInterval: 2000,
  });

  const toggleTaskMutation = useMutation({
    mutationFn: (taskId: string) => 
      apiRequest("PATCH", `/api/tasks/${taskId}/toggle`),
    onSuccess: (_, taskId) => {
      // Görev tamamlandı mı kontrol et - filtrelenmemiş listeden al
      const task = allTasks.find(t => t.id === taskId);
      const wasCompleted = task?.completed;
      
      // Tamamlanmayan görevler için hemen güncelle
      if (wasCompleted) {
        sorguIstemcisi.invalidateQueries({ queryKey: ["/api/calendar", todayStr] });
        sorguIstemcisi.invalidateQueries({ queryKey: ["/api/tasks"] });
      }
      
      // Eğer görev şimdi tamamlandıysa celebration göster
      if (!wasCompleted) {
        setCelebratingTask(taskId);
        setShowCompletionBar(true);
        
        toast({
          title: "🎉 Tebrikler!",
          description: "Görev başarıyla tamamlandı!",
        });

        // 1 saniye sonra celebration'ı kaldır ve görev listesini yenile
        setTimeout(() => {
          setCelebratingTask(null);
          setShowCompletionBar(false);
          // Görev tamamlandıktan 1 saniye sonra listeden kaldırılacak
          sorguIstemcisi.invalidateQueries({ queryKey: ["/api/calendar", todayStr] });
          sorguIstemcisi.invalidateQueries({ queryKey: ["/api/tasks"] });
        }, 1000);
      } else {
        toast({
          title: "Görev güncellendi",
          description: "Görev durumu başarıyla değiştirildi.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Görev durumu değiştirilemedi.",
        variant: "destructive",
      });
    },
  });

  // Bugün için: Sadece tamamlanmamış aktif görevleri göster
  // Tamamlanan, arşivlenen ve silinen görevler Bugün Yapılacaklar'da görünmez
  const allTasks = todaysData?.tasks || [];
  
  // localStorage'dan taskOrder'ı oku ve görevleri sırala - useMemo ile optimize edildi
  const tasks = useMemo(() => {
    const tasksUnordered = allTasks.filter(task => !task.completed && !task.archived && !task.deleted);
    
    try {
      const savedOrder = localStorage.getItem('taskOrder');
      if (savedOrder) {
        const orderArray = JSON.parse(savedOrder) as string[];
        return [...tasksUnordered].sort((a, b) => {
          const indexA = orderArray.indexOf(a.id);
          const indexB = orderArray.indexOf(b.id);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return 0;
        });
      }
      return tasksUnordered;
    } catch (error) {
      console.error('Error loading task order:', error);
      return tasksUnordered;
    }
  }, [todaysData]);
  
  // Toplam sayı: Sadece aktif görevler (arşivlenmemiş + silinmemiş)
  const activeTasks = allTasks.filter(task => !task.archived && !task.deleted);
  const completedCount = activeTasks.filter(task => task.completed).length;
  const totalCount = activeTasks.length;

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 transition-colors duration-300 h-full">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Bugün Yapılacaklar
        </h3>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded mb-2"></div>
          <div className="h-3 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 transition-colors duration-300 h-full flex flex-col relative overflow-hidden">
      {/* Tamamlanma Çubuğu - Görev tamamlandığında gösterilir */}
      {showCompletionBar && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 h-2 z-10 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-ping"></div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Bugün Yapılacaklar
        </h3>
        <div className="text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1" data-testid="text-today-counts">
          {completedCount}/{totalCount}
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Bugün hiç aktivite tamamlanmamış !</p>
          <p className="text-xs mt-1">Bugün için planlanan görevler henüz yok</p>
        </div>
      ) : (
        <>
          {/* İlerleme çubuğu */}
          <div className="w-full bg-secondary rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>

          {/* Görev Listesi - Kutunun en altına kadar uzar, en az 6 görev gösterir */}
          <div className={`space-y-3 flex-1 min-h-0 max-h-[650px] ${tasks.length > 6 ? 'overflow-y-auto' : 'overflow-hidden'} custom-scrollbar`}>
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 hover:bg-muted/50 relative ${
                  celebratingTask === task.id 
                    ? 'bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/40 dark:to-emerald-900/40 border-green-300 dark:border-green-600 scale-105 shadow-lg' 
                    : task.completed 
                    ? 'bg-muted/30 border-muted' 
                    : 'bg-background border-border/50 hover:border-border animate-pulse-slow'
                }`}
                style={{
                  borderLeft: `4px solid ${task.color || '#8B5CF6'}`,
                  animation: !task.completed && celebratingTask !== task.id 
                    ? 'pulse-border 2s ease-in-out infinite' 
                    : undefined,
                }}
                data-testid={`list-task-${task.id}`}
              >
                {/* Kutlama efekti(konfeti) - geliştirilmiş */}
                {celebratingTask === task.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 animate-pulse rounded-lg pointer-events-none">
                    <div className="absolute top-2 right-2 animate-bounce">
                      <PartyPopper className="h-5 w-5 text-green-600 drop-shadow-lg" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping"></div>
                  </div>
                )}
                <button
                  onClick={() => toggleTaskMutation.mutate(task.id)}
                  className={`flex-shrink-0 transition-all duration-300 transform hover:scale-110 ${
                    task.completed 
                      ? 'text-green-600 hover:text-green-500 drop-shadow-md' 
                      : 'text-muted-foreground hover:text-primary hover:drop-shadow-md'
                  }`}
                  disabled={toggleTaskMutation.isPending}
                  data-testid={`button-toggle-task-${task.id}`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 animate-in fade-in-0 zoom-in-95 duration-200" />
                  ) : (
                    <Circle className="h-5 w-5 hover:animate-pulse" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm transition-all duration-200 ${
                    task.completed 
                      ? 'line-through text-muted-foreground' 
                      : 'text-foreground'
                  }`}>
                    {task.title}
                  </div>
                  
                  {task.description && (
                    <div className={`text-xs mt-1 transition-all duration-200 ${
                      task.completed 
                        ? 'line-through text-muted-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {task.description.length > 80 
                        ? `${task.description.substring(0, 80)}...` 
                        : task.description}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                    
                    <span className="text-xs text-muted-foreground bg-muted/50 rounded-full px-2 py-1">
                      {getCategoryText(task.category)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Özet */}
          {tasks.length > 0 && (
            <div className="mt-auto pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground text-center">
                {completedCount === totalCount 
                  ? "🎉 Tüm günlük görevler tamamlandı!" 
                  : `${totalCount - completedCount} görev kaldı`
                }
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
