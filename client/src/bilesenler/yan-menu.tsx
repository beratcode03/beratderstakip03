// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/sema";
import { Clock, Plus, X, Info } from "lucide-react";
import { Button } from "@/bilesenler/arayuz/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/bilesenler/arayuz/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/bilesenler/arayuz/popover";

export function Sidebar() {
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
  
  // Arşivlenmiş görevleri de getir - heatmap için
  const { data: archivedTasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks/archived"],
  });
  
  // Rapor için gerekli ek verileri al
  const { data: questionLogs = [] } = useQuery<any[]>({
    queryKey: ["/api/question-logs"],
  });
  
  const { data: examResults = [] } = useQuery<any[]>({
    queryKey: ["/api/exam-results"],
  });
  
  const { data: studyHours = [] } = useQuery<any[]>({
    queryKey: ["/api/study-hours"],
  });

  // Gerçek zamanlı saat durumu
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  // takvim dialog durumu
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Her saniye güncelleme 
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const turkçeTasks = tasks.filter(task => task.category === "turkce").length;
  const matematikTasks = tasks.filter(task => task.category === "matematik").length;
  const genelTasks = tasks.filter(task => task.category === "genel").length;

  // Heatmap için aktif ve arşivlenmiş tüm görevleri birleştir
  const allTasksForHeatmap = React.useMemo(() => [...tasks, ...archivedTasks], [tasks, archivedTasks]);

  // Yerel saat dilimine göre tarih formatla (UTC sorununu çöz)
  const formatLocalDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Zaman dilimi sorunlarını önlemek ve performansı artırmak için yerel tarihleri kullanarak özet ön hesaplama etkinlik haritasını geliştir, İstatistikler - 2x2 Izgara Düzeni
  const activityMap = React.useMemo(() => {
    const map = new Map<string, { hasCreated: boolean; hasCompleted: boolean; hasActivity: boolean }>();
    
    allTasksForHeatmap.forEach(task => {
      // Yerel tarih biçimini kullanarak görev oluşturma tarihini işleyin
      if (task.createdAt) {
        const createdDate = formatLocalDate(task.createdAt);
        const existing = map.get(createdDate) || { hasCreated: false, hasCompleted: false, hasActivity: false };
        map.set(createdDate, { ...existing, hasCreated: true, hasActivity: true });
      }
      
      // Yerel tarih biçimini kullanarak görev tamamlama tarihini işleyin
      if (task.completed && task.completedAt) {
        const completedDate = formatLocalDate(task.completedAt);
        const existing = map.get(completedDate) || { hasCreated: false, hasCompleted: false, hasActivity: false };
        map.set(completedDate, { ...existing, hasCompleted: true, hasActivity: true });
      }
    });
    
    // Soru loglarını ekle
    questionLogs.forEach((log: any) => {
      if (log.study_date) {
        const dateStr = formatLocalDate(log.study_date);
        const existing = map.get(dateStr) || { hasCreated: false, hasCompleted: false, hasActivity: false };
        map.set(dateStr, { ...existing, hasActivity: true });
      }
    });
    
    // Sınav sonuçlarını ekle
    examResults.forEach((exam: any) => {
      if (exam.exam_date) {
        const dateStr = formatLocalDate(exam.exam_date);
        const existing = map.get(dateStr) || { hasCreated: false, hasCompleted: false, hasActivity: false };
        map.set(dateStr, { ...existing, hasActivity: true });
      }
    });
    
    // Çalışma saatlerini ekle
    studyHours.forEach((sh: any) => {
      if (sh.study_date) {
        const dateStr = formatLocalDate(sh.study_date);
        const existing = map.get(dateStr) || { hasCreated: false, hasCompleted: false, hasActivity: false };
        map.set(dateStr, { ...existing, hasActivity: true });
      }
    });
    
    return map;
  }, [allTasksForHeatmap, questionLogs, examResults, studyHours]);

  // Bir tarih için etkinlik türünü alma işlevi (O(1) arama)
  const getActivityType = (date: Date): 'created' | 'completed' | 'both' | 'activity' | 'none' => {
    const dateStr = formatLocalDate(date);
    const activity = activityMap.get(dateStr);
    
    if (!activity || !activity.hasActivity) return 'none';
    if (activity.hasCreated && activity.hasCompleted) return 'both';
    if (activity.hasCompleted) return 'completed';
    if (activity.hasCreated) return 'created';
    return 'activity';
  };
  
  // Belirli bir tarihteki görevleri getir - Arşivlenmemiş görevleri göster
  const getTasksForDate = (date: Date) => {
    const dateStr = formatLocalDate(date);
    return allTasksForHeatmap.filter(task => {
      // Arşivlenmiş görevleri hariç tut
      if (task.archived) return false;
      
      const createdDateStr = task.createdAt ? formatLocalDate(task.createdAt) : null;
      const completedDateStr = task.completed && task.completedAt ? formatLocalDate(task.completedAt) : null;
      return createdDateStr === dateStr || completedDateStr === dateStr;
    });
  };
  
  // Belirli bir tarihteki soru çözme bilgilerini getir
  const getQuestionLogsForDate = (date: Date) => {
    const dateStr = formatLocalDate(date);
    return questionLogs.filter((log: any) => {
      const logDateStr = log.study_date ? formatLocalDate(log.study_date) : null;
      return logDateStr === dateStr;
    });
  };
  
  // Belirli bir tarihteki sınav sonuçlarını getir
  const getExamResultsForDate = (date: Date) => {
    const dateStr = formatLocalDate(date);
    return examResults.filter((exam: any) => {
      const examDateStr = exam.exam_date ? formatLocalDate(exam.exam_date) : null;
      return examDateStr === dateStr;
    });
  };
  
  // Belirli bir tarihteki çalışma saatlerini getir
  const getStudyHoursForDate = (date: Date) => {
    const dateStr = formatLocalDate(date);
    return studyHours.filter((sh: any) => {
      const studyDateStr = sh.study_date ? formatLocalDate(sh.study_date) : null;
      return studyDateStr === dateStr;
    });
  };
  
  // Kategori ismini güzelleştir
  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'turkce': 'Türkçe',
      'matematik': 'Matematik',
      'fizik': 'Fizik',
      'kimya': 'Kimya',
      'biyoloji': 'Biyoloji',
      'sosyal': 'Sosyal',
      'tyt-geometri': 'TYT Geometri',
      'ayt-matematik': 'AYT Matematik',
      'ayt-fizik': 'AYT Fizik',
      'ayt-kimya': 'AYT Kimya',
      'ayt-biyoloji': 'AYT Biyoloji',
      'ayt-geometri': 'AYT Geometri',
      'genel': 'Genel'
    };
    return categoryMap[category] || category;
  };
  
  // Takvim gününe tıklandığında
  const handleDayClick = (date: Date, activityType: string) => {
    if (activityType !== 'none') {
      setSelectedDate(date);
      setIsDialogOpen(true);
    }
  };

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
  const currentWeekday = currentDate.toLocaleDateString("tr-TR", { weekday: "long" });

  // Geçerli ay için takvim günleri oluştur
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const calendarDays = [];
  for (let i = 0; i < 35; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    calendarDays.push(date);
  }

  return (
    <div className="space-y-6">
      {/* Hızlı İstatistikler */}
      <div className="bg-card rounded-lg border border-border p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-foreground mb-4">Dashboard</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Toplam Görev</span>
            <span className="font-semibold text-foreground" data-testid="text-total-tasks">{totalTasks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Tamamlanan</span>
            <span className="font-semibold text-green-600" data-testid="text-completed-tasks">{completedTasks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Bekleyen</span>
            <span className="font-semibold text-orange-600" data-testid="text-pending-tasks">{pendingTasks}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground">%{completionPercentage} tamamlandı</p>
        </div>
      </div>

      {/* Takvim Widget'ı */}
      <div className="bg-card rounded-lg border border-border p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-foreground mb-4">Takvim</h3>
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-foreground" data-testid="text-current-day">{currentDay}</div>
          <div className="text-sm text-muted-foreground" data-testid="text-current-date">{currentMonth}</div>
          <div className="text-xs text-muted-foreground" data-testid="text-current-weekday">{currentWeekday}</div>
        </div>
        
        {/* Saat Göstergesi - Saat Simgesi ile Ortalanmış */}
        <div className="flex items-center justify-center gap-2 mb-4 p-3 border border-border rounded-lg bg-secondary/30" data-testid="clock-display">
          <Clock className="w-5 h-5 text-primary" />
          <div className="text-lg font-mono font-semibold text-foreground" data-testid="text-current-time">
            {currentTime.toLocaleTimeString('tr-TR', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit',
              hour12: false 
            })}
          </div>
        </div>

        {/* Mini Takvim Izgarası */}
        <div className="grid grid-cols-7 gap-1 text-xs">
          <div className="text-center text-muted-foreground p-1">P</div>
          <div className="text-center text-muted-foreground p-1">S</div>
          <div className="text-center text-muted-foreground p-1">Ç</div>
          <div className="text-center text-muted-foreground p-1">P</div>
          <div className="text-center text-muted-foreground p-1">C</div>
          <div className="text-center text-muted-foreground p-1">C</div>
          <div className="text-center text-muted-foreground p-1">P</div>
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.getDate() === currentDay && isCurrentMonth && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
            const activityType = getActivityType(date);
            
            return (
              <div
                key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                onClick={() => handleDayClick(date, activityType)}
                className={`text-center p-1 relative bg-transparent ${
                  isToday
                    ? "bg-primary text-primary-foreground rounded"
                    : isCurrentMonth
                    ? `hover:bg-secondary rounded ${activityType !== 'none' ? 'cursor-pointer' : ''}`
                    : "text-muted-foreground/30 opacity-50"
                }`}
              >
                {date.getDate()}
                {activityType !== 'none' && !isToday && (
                  <div className="absolute top-0 right-0 flex flex-col gap-0.5">
                    {activityType === 'created' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    {activityType === 'completed' && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    )}
                    {activityType === 'both' && (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      </>
                    )}
                    {activityType === 'activity' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Kategoriler */}
      <div className="bg-card rounded-lg border border-border p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-foreground mb-4">Kategoriler</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 hover:bg-secondary rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-foreground">Türkçe</span>
            </div>
            <span className="text-xs text-muted-foreground" data-testid="text-turkce-tasks">{turkçeTasks}</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-secondary rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-foreground">Matematik</span>
            </div>
            <span className="text-xs text-muted-foreground" data-testid="text-matematik-tasks">{matematikTasks}</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-secondary rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-foreground">Genel</span>
            </div>
            <span className="text-xs text-muted-foreground" data-testid="text-genel-tasks">{genelTasks}</span>
          </div>
        </div>
      </div>
      
      {/* Aktivite Detayları Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {selectedDate?.toLocaleDateString('tr-TR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {/* Çözülen Sorular Özeti */}
            {selectedDate && getQuestionLogsForDate(selectedDate).length > 0 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Çözülen Sorular
                </h4>
                <div className="space-y-2">
                  {getQuestionLogsForDate(selectedDate).map((log: any, index: number) => {
                    const totalNet = (parseInt(log.correct_count) || 0) - (parseInt(log.wrong_count) || 0) / 4;
                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-blue-700 dark:text-blue-300">
                          {log.exam_type} {log.subject}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            ✓ {log.correct_count}
                          </span>
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            ✗ {log.wrong_count}
                          </span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">
                            Net: {totalNet.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t border-blue-300 dark:border-blue-700">
                    <div className="flex justify-between font-bold text-blue-900 dark:text-blue-100">
                      <span>Toplam Net:</span>
                      <span>
                        {getQuestionLogsForDate(selectedDate).reduce((sum: number, log: any) => {
                          return sum + ((parseInt(log.correct_count) || 0) - (parseInt(log.wrong_count) || 0) / 4);
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Sınav Sonuçları Özeti */}
            {selectedDate && getExamResultsForDate(selectedDate).length > 0 && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Sınav Sonuçları
                </h4>
                <div className="space-y-2">
                  {getExamResultsForDate(selectedDate).map((exam: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-700 dark:text-purple-300 font-medium">
                          {exam.exam_type} {exam.exam_scope === 'branch' ? 'Branş' : 'Genel'} Denemesi
                        </span>
                        <span className="text-purple-600 dark:text-purple-400 font-bold">
                          {exam.totalNet || 0} Net
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Çalışma Saatleri Özeti */}
            {selectedDate && getStudyHoursForDate(selectedDate).length > 0 && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Çalışma Saatleri
                </h4>
                <div className="space-y-2">
                  {getStudyHoursForDate(selectedDate).map((sh: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 dark:text-green-300">
                          {sh.subject || 'Genel'}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          {sh.hours || 0} saat
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-green-300 dark:border-green-700">
                    <div className="flex justify-between font-bold text-green-900 dark:text-green-100">
                      <span>Toplam:</span>
                      <span>
                        {getStudyHoursForDate(selectedDate).reduce((sum: number, sh: any) => {
                          return sum + (parseFloat(sh.hours) || 0);
                        }, 0).toFixed(1)} saat
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {selectedDate && (
              getTasksForDate(selectedDate).length > 0 ||
              getQuestionLogsForDate(selectedDate).length > 0 ||
              getExamResultsForDate(selectedDate).length > 0 ||
              getStudyHoursForDate(selectedDate).length > 0
            ) ? (
              getTasksForDate(selectedDate).length > 0 && (
                <div className="space-y-3">
                  {getTasksForDate(selectedDate).map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-secondary/30 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                      style={{ borderLeftColor: task.color, borderLeftWidth: '4px' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                              {getCategoryName(task.category)}
                            </span>
                            {task.completed && task.completedAt && (
                              <span className="text-green-600 font-medium">✓ Tamamlandı</span>
                            )}
                          </div>
                        </div>
                        
                        {/* + Butonu - Görev Detayları */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <button 
                              className="flex-shrink-0 p-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors"
                              data-testid={`button-calendar-task-details-${task.id}`}
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80" align="end">
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-foreground mb-1">{task.title}</h4>
                                {task.description && (
                                  <p className="text-sm text-muted-foreground">{task.description}</p>
                                )}
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Ders:</span>
                                  <span className="font-medium text-foreground">{getCategoryName(task.category)}</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Öncelik:</span>
                                  <span className={`font-medium ${
                                    task.priority === 'high' 
                                      ? 'text-red-600 dark:text-red-400'
                                      : task.priority === 'medium'
                                      ? 'text-yellow-600 dark:text-yellow-400'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                                  </span>
                                </div>
                                
                                {task.dueDate && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Bitiş Tarihi:</span>
                                    <span className="font-medium text-foreground">
                                      {new Date(task.dueDate).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Oluşturulma:</span>
                                  <span className="font-medium text-foreground">
                                    {new Date(task.createdAt).toLocaleDateString('tr-TR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                
                                {task.completed && task.completedAt && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Tamamlanma:</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                      {new Date(task.completedAt).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Bugün hiçbir aktivite tamamlanmamış</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
