// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts";
import { BookOpen, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/bilesenler/arayuz/button";
import { Input } from "@/bilesenler/arayuz/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/bilesenler/arayuz/popover";
import { QuestionLog } from "@shared/sema";

type ExamResult = {
  id: string;
  exam_date: string;
  exam_type?: string;
  exam_scope?: string;
  subjects_data?: string;
};

type ExamSubjectNet = {
  id: string;
  exam_id: string;
  exam_type: string;
  subject: string;
  net_score: string;
  correct_count: string;
  wrong_count: string;
  blank_count: string;
};

export function QuestionAnalysisCharts() {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [useCustomDates, setUseCustomDates] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 13);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  const { data: questionLogs = [] } = useQuery<QuestionLog[]>({
    queryKey: ["/api/question-logs"],
  });
  
  // Arşivlenen soru kayıtlarını da çek
  const { data: archivedQuestionLogs = [] } = useQuery<QuestionLog[]>({
    queryKey: ["/api/question-logs/archived"],
  });
  
  const { data: examResults = [] } = useQuery<ExamResult[]>({
    queryKey: ["/api/exam-results"],
  });
  
  // Arşivlenen denemeleri de çek
  const { data: archivedExamResults = [] } = useQuery<ExamResult[]>({
    queryKey: ["/api/exam-results/archived"],
  });
  
  const { data: examSubjectNets = [] } = useQuery<ExamSubjectNet[]>({
    queryKey: ["/api/exam-subject-nets"],
  });
  
  // Sadece soru kayıtlarını birleştir (deneme verileri hariç)
  const allQuestionLogs = useMemo(() => {
    return [...questionLogs, ...archivedQuestionLogs];
  }, [questionLogs, archivedQuestionLogs]);
  
  // Tüm deneme sonuçlarını birleştir (genel ve branş denemeleri)
  const allExamResults = useMemo(() => {
    return [...examResults, ...archivedExamResults];
  }, [examResults, archivedExamResults]);

  // Günlük/haftalık soru tablosu verilerini hazırlayın - TÜM KAYNAKLARDAN VERİ ÇEK
  const prepareDailyWeeklyData = () => {
    if (allQuestionLogs.length === 0 && allExamResults.length === 0) return [];

    if (viewMode === 'daily') {
      let dateRange: string[];
      
      if (useCustomDates) {
        // Başlangıç ve bitiş tarihleri arasında tarih aralığı oluşturun
        const start = new Date(startDate);
        const end = new Date(endDate);
        dateRange = [];
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dateRange.push(d.toISOString().split('T')[0]);
        }
      } else {
        // Varsayılan: son 13 gün + bugün + yarın (toplam 15 gün) - deneme tarihlerini de kapsaması için
        dateRange = Array.from({ length: 15 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 13 + i);
          return date.toISOString().split('T')[0];
        });
      }

      return dateRange.map(dateStr => {
        // Soru kayıtlarından veri topla
        const dayLogs = allQuestionLogs.filter(log => log.study_date === dateStr);
        let totalQuestions = dayLogs.reduce((sum, log) => 
          sum + (Number(log.correct_count) || 0) + (Number(log.wrong_count) || 0) + (Number(log.blank_count) || 0), 0
        );
        let correctQuestions = dayLogs.reduce((sum, log) => sum + (Number(log.correct_count) || 0), 0);
        let wrongQuestions = dayLogs.reduce((sum, log) => sum + (Number(log.wrong_count) || 0), 0);
        let blankQuestions = dayLogs.reduce((sum, log) => sum + (Number(log.blank_count) || 0), 0);
        
        // TYT ve AYT sayılarını ayrı hesapla
        let tytQuestions = dayLogs.filter(log => log.exam_type === 'TYT').reduce((sum, log) => 
          sum + (Number(log.correct_count) || 0) + (Number(log.wrong_count) || 0), 0
        );
        let aytQuestions = dayLogs.filter(log => log.exam_type === 'AYT').reduce((sum, log) => 
          sum + (Number(log.correct_count) || 0) + (Number(log.wrong_count) || 0), 0
        );
        
        // Deneme sonuçlarından veri topla (genel ve branş denemeleri) - TÜM DYB VERİLERİ DAHİL
        const dayExams = allExamResults.filter(exam => exam.exam_date === dateStr);
        dayExams.forEach(exam => {
          if (exam.subjects_data) {
            try {
              const subjectsData = JSON.parse(exam.subjects_data);
              // Her ders için DYB verilerini topla
              Object.values(subjectsData).forEach((subjectData: any) => {
                const correct = Number(subjectData.correct) || 0;
                const wrong = Number(subjectData.wrong) || 0;
                const blank = Number(subjectData.blank) || 0;
                
                // Tüm deneme verilerini toplam grafiğe ekle
                correctQuestions += correct;
                wrongQuestions += wrong;
                blankQuestions += blank;
                totalQuestions += correct + wrong + blank;
                
                // TYT/AYT ayrımı için kontrol
                if (exam.exam_type === 'TYT') {
                  tytQuestions += correct + wrong;
                } else if (exam.exam_type === 'AYT') {
                  aytQuestions += correct + wrong;
                }
              });
            } catch (e) {
              // subjects_data parse hatası - atla
            }
          }
        });
        
        const attempted = correctQuestions + wrongQuestions;
        
        return {
          date: dateStr,
          dayName: new Date(dateStr).toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric' }),
          totalQuestions,
          correctQuestions,
          wrongQuestions,
          blankQuestions,
          tytQuestions,
          aytQuestions,
          successRate: attempted > 0 ? Math.round((correctQuestions / attempted) * 100) : 0
        };
      });
    } else {
      // Haftalık toplama
      const weeks = [];
      const today = new Date();
      
      // Tarih aralığını belirle
      let customStart: Date | null = null;
      let customEnd: Date | null = null;
      if (useCustomDates) {
        customStart = new Date(startDate);
        customEnd = new Date(endDate);
      }
      
      const weeksToShow = useCustomDates ? 52 : 8; // Custom date için daha geniş aralık
      
      for (let i = weeksToShow - 1; i >= 0; i--) {
        // Hedef haftanın Pazartesi'sini hesaplayın (ISO hafta başlangıcı) UTC'de
        const weekStart = new Date(today);
        const daysFromMonday = (today.getUTCDay() + 6) % 7;
        weekStart.setUTCDate(today.getUTCDate() - (i * 7) - daysFromMonday);
        weekStart.setUTCHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
        weekEnd.setUTCHours(23, 59, 59, 999);
        
        // Custom date kontrolü - hafta tamamen aralık dışındaysa atla
        if (useCustomDates && customStart && customEnd) {
          if (weekEnd < customStart || weekStart > customEnd) {
            continue; // Bu haftayı atla
          }
        }
        
        // UTC tabanlı dize karşılaştırması kullanarak bu haftanın günlüklerini filtrele
        const weekLogs = allQuestionLogs.filter(log => {
          const logDateStr = log.study_date;
          const weekStartStr = weekStart.toISOString().slice(0, 10);
          const weekEndStr = weekEnd.toISOString().slice(0, 10);
          return logDateStr >= weekStartStr && logDateStr <= weekEndStr;
        });
        
        // Soru kayıtlarından haftalık veri topla
        let totalQuestions = weekLogs.reduce((sum, log) => 
          sum + (Number(log.correct_count) || 0) + (Number(log.wrong_count) || 0) + (Number(log.blank_count) || 0), 0
        );
        let correctQuestions = weekLogs.reduce((sum, log) => sum + (Number(log.correct_count) || 0), 0);
        let wrongQuestions = weekLogs.reduce((sum, log) => sum + (Number(log.wrong_count) || 0), 0);
        let blankQuestions = weekLogs.reduce((sum, log) => sum + (Number(log.blank_count) || 0), 0);
        
        // TYT ve AYT sayılarını ayrı hesapla
        let tytQuestions = weekLogs.filter(log => log.exam_type === 'TYT').reduce((sum, log) => 
          sum + (Number(log.correct_count) || 0) + (Number(log.wrong_count) || 0), 0
        );
        let aytQuestions = weekLogs.filter(log => log.exam_type === 'AYT').reduce((sum, log) => 
          sum + (Number(log.correct_count) || 0) + (Number(log.wrong_count) || 0), 0
        );
        
        // Deneme sonuçlarından haftalık veri topla
        const weekExams = allExamResults.filter(exam => {
          const examDateStr = exam.exam_date;
          const weekStartStr = weekStart.toISOString().slice(0, 10);
          const weekEndStr = weekEnd.toISOString().slice(0, 10);
          return examDateStr >= weekStartStr && examDateStr <= weekEndStr;
        });
        
        weekExams.forEach(exam => {
          if (exam.subjects_data) {
            try {
              const subjectsData = JSON.parse(exam.subjects_data);
              Object.values(subjectsData).forEach((subjectData: any) => {
                const correct = Number(subjectData.correct) || 0;
                const wrong = Number(subjectData.wrong) || 0;
                const blank = Number(subjectData.blank) || 0;
                correctQuestions += correct;
                wrongQuestions += wrong;
                blankQuestions += blank;
                totalQuestions += correct + wrong + blank;
                
                // TYT/AYT ayrımı
                if (exam.exam_type === 'TYT') {
                  tytQuestions += correct + wrong;
                } else if (exam.exam_type === 'AYT') {
                  aytQuestions += correct + wrong;
                }
              });
            } catch (e) {
              // subjects_data parse hatası - atla
            }
          }
        });
        
        const attempted = correctQuestions + wrongQuestions;
        
        // Tarih aralığı içeren açıklayıcı hafta etiketi oluştuR
        const weekKey = `${weekStart.getUTCFullYear()}-W${String(8 - i).padStart(2, '0')}`;
        const startMonth = weekStart.toLocaleDateString('tr-TR', { month: 'short', timeZone: 'UTC' });
        const endMonth = weekEnd.toLocaleDateString('tr-TR', { month: 'short', timeZone: 'UTC' });
        const startYear = weekStart.getUTCFullYear();
        const endYear = weekEnd.getUTCFullYear();
        
        let weekLabel;
        if (startMonth === endMonth && startYear === endYear) {
          // Aynı ay ve yıl
          weekLabel = `${weekStart.getUTCDate().toString().padStart(2, '0')}–${weekEnd.getUTCDate().toString().padStart(2, '0')} ${startMonth}`;
        } else if (startYear === endYear) {
          // Farklı aylar
          weekLabel = `${weekStart.getUTCDate().toString().padStart(2, '0')} ${startMonth} – ${weekEnd.getUTCDate().toString().padStart(2, '0')} ${endMonth}`;
        } else {
          // Farklı yıllar
          weekLabel = `${weekStart.getUTCDate().toString().padStart(2, '0')} ${startMonth} ${startYear} – ${weekEnd.getUTCDate().toString().padStart(2, '0')} ${endMonth} ${endYear}`;
        }
        
        weeks.push({
          date: weekKey,
          dayName: weekLabel,
          totalQuestions,
          correctQuestions,
          wrongQuestions,
          blankQuestions,
          tytQuestions,
          aytQuestions,
          successRate: attempted > 0 ? Math.round((correctQuestions / attempted) * 100) : 0
        });
      }
      
      return weeks;
    }
  };

  const dailyWeeklyData = useMemo(() => prepareDailyWeeklyData(), [allQuestionLogs, allExamResults, viewMode, useCustomDates, startDate, endDate]);

  return (
    <div className="space-y-6 mb-8">
      {/* Geliştirilmiş Günlük/Haftalık Soru Grafiği */}
      <div className="bg-gradient-to-br from-emerald-50/60 via-card to-blue-50/40 dark:from-emerald-950/30 dark:via-card dark:to-blue-950/25 rounded-2xl border-2 border-emerald-200/40 dark:border-emerald-800/40 p-8 relative overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 via-blue-500 to-emerald-600 rounded-xl shadow-lg">
                <BookOpen className="h-6 w-6 text-white drop-shadow-lg" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-700 bg-clip-text text-transparent">
                  📚 {viewMode === 'daily' ? 'Günlük' : 'Haftalık'} Soru Çözüm Analizi
                </h3>
                <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70 font-medium">
                  Çözülmüş Sorular ve Deneme Sonuçları kısımlarından eklenen tüm DYB verileriniz (Genel ve Branş)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex border-2 border-emerald-200/50 dark:border-emerald-700/50 rounded-xl p-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
                <Button
                  variant={viewMode === 'daily' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('daily')}
                  className={`text-sm px-4 py-2 h-auto font-medium transition-all duration-200 rounded-lg ${
                    viewMode === 'daily'
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg hover:shadow-xl'
                      : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  }`}
                  data-testid="button-daily-view"
                >
                  📅 Günlük
                </Button>
                <Button
                  variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('weekly')}
                  className={`text-sm px-4 py-2 h-auto font-medium transition-all duration-200 rounded-lg ${
                    viewMode === 'weekly'
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg hover:shadow-xl'
                      : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  }`}
                  data-testid="button-weekly-view"
                >
                  🗓️ Haftalık
                </Button>
                
                {/* Tarih Aralığı Popover */}
                <Popover open={useCustomDates} onOpenChange={setUseCustomDates}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={useCustomDates ? 'default' : 'ghost'}
                      size="sm"
                      className={`text-sm px-4 py-2 h-auto font-medium transition-all duration-200 rounded-lg ${
                        useCustomDates
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg hover:shadow-xl'
                          : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      }`}
                      data-testid="button-custom-dates"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Tarih Seç
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4 bg-white dark:bg-gray-900 border-emerald-200 dark:border-emerald-700" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300 whitespace-nowrap">Başlangıç:</label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="text-sm border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 focus:ring-emerald-500"
                          data-testid="input-start-date"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300 whitespace-nowrap">Bitiş:</label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="text-sm border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 focus:ring-emerald-500"
                          data-testid="input-end-date"
                        />
                      </div>
                      <div className="flex flex-col gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-700">
                        <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Hızlı Seçim:</div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const today = new Date();
                              const threeMonthsAgo = new Date();
                              threeMonthsAgo.setMonth(today.getMonth() - 3);
                              setStartDate(threeMonthsAgo.toISOString().split('T')[0]);
                              setEndDate(today.toISOString().split('T')[0]);
                              setUseCustomDates(true);
                            }}
                            className="text-xs hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                            data-testid="button-3-months"
                          >
                            📅 3 Ay
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const today = new Date();
                              const sixMonthsAgo = new Date();
                              sixMonthsAgo.setMonth(today.getMonth() - 6);
                              setStartDate(sixMonthsAgo.toISOString().split('T')[0]);
                              setEndDate(today.toISOString().split('T')[0]);
                              setUseCustomDates(true);
                            }}
                            className="text-xs hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                            data-testid="button-6-months"
                          >
                            📅 6 Ay
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const today = new Date();
                            const twoWeeksAgo = new Date();
                            twoWeeksAgo.setDate(today.getDate() - 13);
                            setStartDate(twoWeeksAgo.toISOString().split('T')[0]);
                            setEndDate(today.toISOString().split('T')[0]);
                            setUseCustomDates(false);
                          }}
                          className="text-xs hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                          data-testid="button-reset-dates"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sıfırla (Son 14 gün)
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {!useCustomDates && (
                <div className="text-sm text-muted-foreground bg-emerald-100/60 dark:bg-emerald-900/30 px-4 py-2 rounded-full border border-emerald-200/50 dark:border-emerald-700/50 font-medium">
                  {viewMode === 'daily' ? 'Son 14 gün' : 'Son 8 hafta'}
                </div>
              )}
            </div>
          </div>
          
          {dailyWeeklyData.length === 0 || dailyWeeklyData.every(d => d.totalQuestions === 0) ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BookOpen className="h-10 w-10 text-emerald-500" />
              </div>
              <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Soru çözüm verisi bulunmuyor</h4>
              <p className="text-sm opacity-75 mb-4">Soru kayıtları veri girişi yapılmadan gözükmez.</p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-200"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dailyWeeklyData} margin={{ top: 20, right: 40, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" stroke="currentColor" />
                    <XAxis 
                      dataKey="dayName" 
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 11, fontWeight: 500 }}
                      stroke="currentColor"
                      axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                    />
                    <YAxis 
                      yAxisId="questions"
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 11, fontWeight: 500 }}
                      stroke="currentColor"
                      axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                      label={{ value: 'Soru Sayısı', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <YAxis 
                      yAxisId="percentage"
                      orientation="right"
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 11, fontWeight: 500 }}
                      stroke="currentColor"
                      axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                      domain={[0, 100]}
                      label={{ value: 'Başarı %', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '13px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                      formatter={(value: any, name: any) => [
                        name === 'successRate' ? `%${value}` : `${value} soru`,
                        name === 'correctQuestions' ? '✅ Doğru' : 
                        name === 'wrongQuestions' ? '❌ Yanlış' : 
                        name === 'successRate' ? '📈 Başarı Oranı' :
                        name === 'totalQuestions' ? '📊 Toplam' : name
                      ]}
                      labelFormatter={(label) => `📅 ${label}`}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="rect"
                    />
                    
                    {/* Degrade efektli geliştirilmiş çubuklar */}
                    <Bar 
                      yAxisId="questions" 
                      dataKey="correctQuestions" 
                      stackId="a" 
                      fill="url(#correctGradient)" 
                      name="Doğru" 
                      radius={[0, 0, 0, 0]} 
                    />
                    <Bar 
                      yAxisId="questions" 
                      dataKey="wrongQuestions" 
                      stackId="a" 
                      fill="url(#wrongGradient)" 
                      name="Yanlış" 
                      radius={[4, 4, 0, 0]} 
                    />
                    
                    {/* Geliştirilmiş başarı oranı çizgisi */}
                    <Line 
                      yAxisId="percentage" 
                      type="monotone" 
                      dataKey="successRate" 
                      stroke="url(#successGradient)" 
                      strokeWidth={4} 
                      dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: '#ffffff' }} 
                      activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 3, fill: '#ffffff' }}
                      name="Başarı Oranı (%)" 
                    />
                    
                    {/* Degrade Tanımları */}
                    <defs>
                      <linearGradient id="correctGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="wrongGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                      <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              {/* Modern Özet İstatistikler */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-emerald-200/30 dark:border-emerald-700/30">
                {/* Toplam Çözülen Soru - Doğru + Yanlış (Boş Hariç) */}
                <div className="group relative bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 rounded-2xl p-5 border-2 border-emerald-200/50 dark:border-emerald-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                      {dailyWeeklyData.reduce((sum, d) => sum + d.correctQuestions + d.wrongQuestions, 0)}
                    </div>
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">Toplam Çözülen Soru</div>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="text-blue-600 dark:text-blue-400">TYT: {dailyWeeklyData.reduce((sum, d) => sum + (d.tytQuestions || 0), 0)}</span>
                      <span className="text-green-600 dark:text-green-400">AYT: {dailyWeeklyData.reduce((sum, d) => sum + (d.aytQuestions || 0), 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Toplam Doğru */}
                <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-2xl p-5 border-2 border-green-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                      {dailyWeeklyData.reduce((sum, d) => sum + d.correctQuestions, 0)}
                    </div>
                    <div className="text-xs font-bold text-green-700 dark:text-green-300">Toplam Doğru</div>
                  </div>
                </div>

                {/* Toplam Yanlış */}
                <div className="group relative bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 rounded-2xl p-5 border-2 border-red-200/50 dark:border-red-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-4xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                      {dailyWeeklyData.reduce((sum, d) => sum + d.wrongQuestions, 0)}
                    </div>
                    <div className="text-xs font-bold text-red-700 dark:text-red-300">Toplam Yanlış</div>
                  </div>
                </div>

                {/* Toplam Boş */}
                <div className="group relative bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 rounded-2xl p-5 border-2 border-amber-200/50 dark:border-amber-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-4xl font-black bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                      {dailyWeeklyData.reduce((sum, d) => sum + (d.blankQuestions || 0), 0)}
                    </div>
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-300">Toplam Boş</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
