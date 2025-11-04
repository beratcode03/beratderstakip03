// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, BookOpen, Brain, CheckCircle, FlaskConical, Calendar, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/bilesenler/arayuz/card";
import { Badge } from "@/bilesenler/arayuz/badge";
import { QuestionLog, Task, ExamResult } from "@shared/sema";

interface ActivityMetric {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend: number; // Artış için pozitif azalma için negatif
  color: string;
  bgColor: string;
}

export function WeeklyActivitySummary() {
  const { data: questionLogs = [] } = useQuery<QuestionLog[]>({
    queryKey: ["/api/question-logs"],
  });
  
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
  
  const { data: examResults = [] } = useQuery<ExamResult[]>({
    queryKey: ["/api/exam-results"],
  });

  // Tarih aralıklarını hesaplayın
  const today = new Date();
  const last7Days = new Date(today);
  last7Days.setDate(today.getDate() - 7);
  const previous7Days = new Date(today);
  previous7Days.setDate(today.getDate() - 14);
  
  const formatDateForComparison = (date: Date) => date.toISOString().split('T')[0];
  
  const last7DaysStr = formatDateForComparison(last7Days);
  const previous7DaysStr = formatDateForComparison(previous7Days);
  const todayStr = formatDateForComparison(today);

  // Aktivite metriklerini hesapla
  const calculateActivityMetrics = (): ActivityMetric[] => {
    // Son 7 günde çözülen sorular
    const recentQuestions = questionLogs.filter(log => 
      log.study_date >= last7DaysStr && log.study_date <= todayStr
    );
    const previousQuestions = questionLogs.filter(log => 
      log.study_date >= previous7DaysStr && log.study_date < last7DaysStr
    );
    
    const recentQuestionCount = recentQuestions.reduce((sum, log) => 
      sum + (Number(log.correct_count) || 0) + (Number(log.wrong_count) || 0) + (Number(log.blank_count) || 0), 0
    );
    const previousQuestionCount = previousQuestions.reduce((sum, log) => 
      sum + (Number(log.correct_count) || 0) + (Number(log.wrong_count) || 0) + (Number(log.blank_count) || 0), 0
    );
    const questionTrend = previousQuestionCount > 0 
      ? ((recentQuestionCount - previousQuestionCount) / previousQuestionCount) * 100 
      : recentQuestionCount > 0 ? 100 : 0;

    // Son 7 günde tamamlanan görevler
    const recentCompletedTasks = tasks.filter(task => 
      task.completed && task.completedAt && 
      new Date(task.completedAt).toISOString().split('T')[0] >= last7DaysStr
    ).length;
    const previousCompletedTasks = tasks.filter(task => 
      task.completed && task.completedAt && 
      new Date(task.completedAt).toISOString().split('T')[0] >= previous7DaysStr &&
      new Date(task.completedAt).toISOString().split('T')[0] < last7DaysStr
    ).length;
    const taskTrend = previousCompletedTasks > 0 
      ? ((recentCompletedTasks - previousCompletedTasks) / previousCompletedTasks) * 100 
      : recentCompletedTasks > 0 ? 100 : 0;

    // Son 7 günde eklenen sınav sonuçları
    const recentExams = examResults.filter(exam => 
      exam.exam_date >= last7DaysStr && exam.exam_date <= todayStr
    ).length;
    const previousExams = examResults.filter(exam => 
      exam.exam_date >= previous7DaysStr && exam.exam_date < last7DaysStr
    ).length;
    const examTrend = previousExams > 0 
      ? ((recentExams - previousExams) / previousExams) * 100 
      : recentExams > 0 ? 100 : 0;

    // Çalışma oturumları (sorularla birlikteki tüm tarihler)
    const recentStudyDays = new Set(recentQuestions.map(log => log.study_date)).size;
    const previousStudyDays = new Set(previousQuestions.map(log => log.study_date)).size;
    const studyTrend = previousStudyDays > 0 
      ? ((recentStudyDays - previousStudyDays) / previousStudyDays) * 100 
      : recentStudyDays > 0 ? 100 : 0;

    return [
      {
        label: "Çözülen Sorular",
        value: recentQuestionCount,
        icon: BookOpen,
        trend: questionTrend,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950/20"
      },
      {
        label: "Tamamlanan Görevler",
        value: recentCompletedTasks,
        icon: CheckCircle,
        trend: taskTrend,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950/20"
      },
      {
        label: "Çalışma Günü",
        value: recentStudyDays,
        icon: Calendar,
        trend: studyTrend,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950/20"
      },
      {
        label: "Deneme Sınavları",
        value: recentExams,
        icon: FlaskConical,
        trend: examTrend,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950/20"
      }
    ];
  };

  const metrics = calculateActivityMetrics();
  const totalActivity = metrics.reduce((sum, metric) => sum + metric.value, 0);
  const averageTrend = metrics.reduce((sum, metric) => sum + metric.trend, 0) / metrics.length;

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/80 rounded-xl border border-border shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📈 Aktivitelerim
              </CardTitle>
              <p className="text-sm text-muted-foreground">Son 7 günlük genel bakış</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              {averageTrend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : averageTrend < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <Badge 
                variant={averageTrend > 0 ? "default" : averageTrend < 0 ? "destructive" : "secondary"}
                className="text-xs"
              >
                {averageTrend > 0 ? '+' : ''}{averageTrend.toFixed(0)}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalActivity} toplam aktivite
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div 
                key={index}
                className={`${metric.bgColor} rounded-xl p-4 transition-all duration-200 hover:scale-105`}
                data-testid={`metric-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                  <div className="flex items-center space-x-1">
                    {metric.trend > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : metric.trend < 0 ? (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    ) : null}
                    <span className={`text-xs font-medium ${
                      metric.trend > 0 ? 'text-green-600' : 
                      metric.trend < 0 ? 'text-red-600' : 
                      'text-muted-foreground'
                    }`}>
                      {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground" data-testid={`value-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    {metric.value}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {metric.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {totalActivity === 0 && (
          <div className="mt-6 text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">Henüz bu hafta aktivite yok</p>
            <p className="text-xs mt-1">Soru çözmeye veya görev eklemeye başla</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
