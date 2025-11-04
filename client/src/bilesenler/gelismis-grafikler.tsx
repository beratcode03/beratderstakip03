// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine } from "recharts";
import { TrendingUp, Target, Brain, AlertTriangle, BarChart3, Book, Calculator, Atom, FlaskConical, Dna, User, Calendar, TrendingDown, Check, CheckCircle, ChevronDown, Filter, X, Trash2 } from "lucide-react";
import { ExamResult, QuestionLog, SUBJECT_LIMITS } from "@shared/sema";
import { useMemo, useState, memo, useCallback, useEffect } from "react";
import { Button } from "@/bilesenler/arayuz/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/bilesenler/arayuz/card";
import { Checkbox } from "@/bilesenler/arayuz/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/bilesenler/arayuz/collapsible";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/bilesenler/arayuz/dialog";

interface MissingTopic {
  topic: string;
  subject: string;
  source: 'exam' | 'question';
  exam_scope?: 'full' | 'branch';
  exam_type?: 'TYT' | 'AYT';
  frequency: number;
  lastSeen: string;
  createdAt?: string;
  difficulty?: string;
  category?: string;
}

interface ExamNetData {
  date: string;
  examName: string;
  tytNet: number;
  aytNet: number;
  tytTarget: number;
  aytTarget: number;
}

interface SubjectAnalysisData {
  subject: string;
  correct: number;
  wrong: number;
  totalQuestions: number;
  netScore: number;
  color: string;
}

function AdvancedChartsComponent() {
  const [analysisMode, setAnalysisMode] = useState<'general' | 'branch'>('general');
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [useDateFilter, setUseDateFilter] = useState<boolean>(false);
  const [selectedDateTopics, setSelectedDateTopics] = useState<string | null>(null);
  const [useDateFilterTopics, setUseDateFilterTopics] = useState<boolean>(false);
  const [selectedDateErrors, setSelectedDateErrors] = useState<string | null>(null);
  const [useDateFilterErrors, setUseDateFilterErrors] = useState<boolean>(false);
  const [selectedSubjectTopics, setSelectedSubjectTopics] = useState<string>('all');
  const [selectedTagTopics, setSelectedTagTopics] = useState<string>('all');
  const [selectedSubjectErrors, setSelectedSubjectErrors] = useState<string>('all');
  const [selectedTagErrors, setSelectedTagErrors] = useState<string>('all');
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [celebratingTopics, setCelebratingTopics] = useState<Set<string>>(new Set());
  const [completedExamErrors, setCompletedExamErrors] = useState<Map<string, string>>(new Map());
  const [completedQuestionErrors, setCompletedQuestionErrors] = useState<Map<string, string>>(new Map());
  const [celebratingErrorTopics, setCelebratingErrorTopics] = useState<Set<string>>(new Set());
  const [removedTopics, setRemovedTopics] = useState<Set<string>>(new Set());
  const [removedErrorTopics, setRemovedErrorTopics] = useState<Set<string>>(new Set());
  const [tytTargetNet, setTytTargetNet] = useState<number>(90);
  const [aytTargetNet, setAytTargetNet] = useState<number>(50);
  const [isEditingTytTarget, setIsEditingTytTarget] = useState(false);
  const [isEditingAytTarget, setIsEditingAytTarget] = useState(false);
  const [tytSummaryExpanded, setTytSummaryExpanded] = useState(false);
  const [aytSummaryExpanded, setAytSummaryExpanded] = useState(false);
  const [tytBranchSummaryExpanded, setTytBranchSummaryExpanded] = useState(false);
  const [aytBranchSummaryExpanded, setAytBranchSummaryExpanded] = useState(false);
  
  const [tytGeneralTimelineExpanded, setTytGeneralTimelineExpanded] = useState(true);
  const [aytGeneralTimelineExpanded, setAytGeneralTimelineExpanded] = useState(true);
  const [tytBranchTimelineExpanded, setTytBranchTimelineExpanded] = useState(true);
  const [aytBranchTimelineExpanded, setAytBranchTimelineExpanded] = useState(true);
  
  // Branş hedef netleri
  const [tytBranchTargetNet, setTytBranchTargetNet] = useState<number>(30);
  const [aytBranchTargetNet, setAytBranchTargetNet] = useState<number>(20);
  const [isEditingTytBranchTarget, setIsEditingTytBranchTarget] = useState(false);
  const [isEditingAytBranchTarget, setIsEditingAytBranchTarget] = useState(false);
  
  // Deneme seçme state'leri
  const [selectedGeneralExamIds, setSelectedGeneralExamIds] = useState<string[]>([]);
  const [selectedBranchExamIds, setSelectedBranchExamIds] = useState<string[]>([]);
  const [showExamSelectModal, setShowExamSelectModal] = useState(false);
  
  const { toast } = useToast();
  
  // Filtre Modalları için state'ler
  const [showTopicsFilterModal, setShowTopicsFilterModal] = useState(false);
  const [showErrorsFilterModal, setShowErrorsFilterModal] = useState(false);
  const [showCompletedTopicsModal, setShowCompletedTopicsModal] = useState(false);
  const [completedTopicsRefreshKey, setCompletedTopicsRefreshKey] = useState(0);
  const [completedTopicsFilter, setCompletedTopicsFilter] = useState<'all' | 'general' | 'branch' | 'question'>('all');
  const [showCompletedErrorsModal, setShowCompletedErrorsModal] = useState(false);
  const [completedErrorsRefreshKey, setCompletedErrorsRefreshKey] = useState(0);
  const [completedErrorsFilter, setCompletedErrorsFilter] = useState<'all' | 'general' | 'branch' | 'question'>('all');
  
  // Sıralama state'leri
  const [topicsSortBy, setTopicsSortBy] = useState<string>('all');
  const [errorsSortBy, setErrorsSortBy] = useState<string>('all');
  
  // Eksik Konular Filtre Ayarları
  const [topicsFilterEnabled, setTopicsFilterEnabled] = useState({
    tag: false,
    subject: false,
    date: false,
    wrongQuestions: false
  });
  const [topicsFilterValues, setTopicsFilterValues] = useState({
    tags: [] as string[],
    subjects: [] as string[],
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    wrongQuestions: false
  });
  
  // Hata Sıklığı Filtre Ayarları
  const [errorsFilterEnabled, setErrorsFilterEnabled] = useState({
    tag: false,
    subject: false,
    date: false,
    wrongQuestions: false
  });
  const [errorsFilterValues, setErrorsFilterValues] = useState({
    tags: [] as string[],
    subjects: [] as string[],
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    wrongQuestions: false
  });

  // localStoragedan stateleri yükle
  useEffect(() => {
    try {
      const savedRemovedTopics = localStorage.getItem('removedTopics');
      const savedRemovedErrorTopics = localStorage.getItem('removedErrorTopics');
      const savedCompletedTopics = localStorage.getItem('completedTopics');
      const savedCompletedExamErrors = localStorage.getItem('completedExamErrors');
      const savedCompletedQuestionErrors = localStorage.getItem('completedQuestionErrors');
      const savedTytTarget = localStorage.getItem('tytTargetNet');
      const savedAytTarget = localStorage.getItem('aytTargetNet');
      const savedTytBranchTarget = localStorage.getItem('tytBranchTargetNet');
      const savedAytBranchTarget = localStorage.getItem('aytBranchTargetNet');
      
      if (savedRemovedTopics) {
        setRemovedTopics(new Set(JSON.parse(savedRemovedTopics)));
      }
      if (savedRemovedErrorTopics) {
        setRemovedErrorTopics(new Set(JSON.parse(savedRemovedErrorTopics)));
      }
      if (savedCompletedTopics) {
        setCompletedTopics(new Set(JSON.parse(savedCompletedTopics)));
      }
      if (savedCompletedExamErrors) {
        const parsed = JSON.parse(savedCompletedExamErrors);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            // Eski format - string array
            const map = new Map<string, string>();
            parsed.forEach(key => map.set(key, new Date().toISOString()));
            setCompletedExamErrors(map);
          } else {
            // Yeni format - object array
            const map = new Map<string, string>();
            parsed.forEach((item: any) => map.set(item.key, item.completedAt));
            setCompletedExamErrors(map);
          }
        }
      }
      if (savedCompletedQuestionErrors) {
        const parsed = JSON.parse(savedCompletedQuestionErrors);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            // Eski format - string array
            const map = new Map<string, string>();
            parsed.forEach(key => map.set(key, new Date().toISOString()));
            setCompletedQuestionErrors(map);
          } else {
            // Yeni format - object array
            const map = new Map<string, string>();
            parsed.forEach((item: any) => map.set(item.key, item.completedAt));
            setCompletedQuestionErrors(map);
          }
        }
      }
      if (savedTytTarget) {
        setTytTargetNet(parseInt(savedTytTarget));
      }
      if (savedAytTarget) {
        setAytTargetNet(parseInt(savedAytTarget));
      }
      if (savedTytBranchTarget) {
        setTytBranchTargetNet(parseInt(savedTytBranchTarget));
      }
      if (savedAytBranchTarget) {
        setAytBranchTargetNet(parseInt(savedAytBranchTarget));
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  }, []);

  // Hedef net değerlerini kaydet
  useEffect(() => {
    localStorage.setItem('tytTargetNet', tytTargetNet.toString());
  }, [tytTargetNet]);

  useEffect(() => {
    localStorage.setItem('aytTargetNet', aytTargetNet.toString());
  }, [aytTargetNet]);

  useEffect(() => {
    localStorage.setItem('tytBranchTargetNet', tytBranchTargetNet.toString());
  }, [tytBranchTargetNet]);

  useEffect(() => {
    localStorage.setItem('aytBranchTargetNet', aytBranchTargetNet.toString());
  }, [aytBranchTargetNet]);

  // localStoragea stateleri kaydet
  useEffect(() => {
    try {
      localStorage.setItem('removedTopics', JSON.stringify(Array.from(removedTopics)));
    } catch (error) {
      console.error('Error saving removedTopics to localStorage:', error);
    }
  }, [removedTopics]);

  useEffect(() => {
    try {
      localStorage.setItem('removedErrorTopics', JSON.stringify(Array.from(removedErrorTopics)));
    } catch (error) {
      console.error('Error saving removedErrorTopics to localStorage:', error);
    }
  }, [removedErrorTopics]);

  useEffect(() => {
    try {
      localStorage.setItem('completedTopics', JSON.stringify(Array.from(completedTopics)));
    } catch (error) {
      console.error('Error saving completedTopics to localStorage:', error);
    }
  }, [completedTopics]);

  useEffect(() => {
    try {
      const array = Array.from(completedExamErrors.entries()).map(([key, completedAt]) => ({ key, completedAt }));
      localStorage.setItem('completedExamErrors', JSON.stringify(array));
      // Aynı sekmede diğer bileşenleri bilgilendir
      window.dispatchEvent(new CustomEvent('localStorageUpdate'));
    } catch (error) {
      console.error('Error saving completedExamErrors to localStorage:', error);
    }
  }, [completedExamErrors]);

  useEffect(() => {
    try {
      const array = Array.from(completedQuestionErrors.entries()).map(([key, completedAt]) => ({ key, completedAt }));
      localStorage.setItem('completedQuestionErrors', JSON.stringify(array));
      // Aynı sekmede diğer componentleri bilgilendir
      window.dispatchEvent(new CustomEvent('localStorageUpdate'));
    } catch (error) {
      console.error('Error saving completedQuestionErrors to localStorage:', error);
    }
  }, [completedQuestionErrors]);

  // Konu isimlerinden TYT/AYT ve konu başlıklarını kaldırmak için yardımcı işlev
  const normalizeTopic = (topic: string | undefined | null): string => {
    // Undefined veya null kontrolü
    if (!topic || typeof topic !== 'string') {
      return '';
    }
    
    // "TYT Türkçe - " veya "AYT Fizik - " gibi desenleri konu isimlerinden kaldırır
    let cleaned = topic.replace(/^(TYT|AYT)\s+[^-]+\s*-\s*/, '').trim();
    
    // Ders adı prefix'lerini kaldır (Türkçe-, Fizik-, Matematik- vb.)
    cleaned = cleaned.replace(/^(Türkçe|Sosyal Bilimler|Matematik|Geometri|Fen Bilimleri|Fizik|Kimya|Biyoloji|TYT|AYT)\s*-\s*/i, '').trim();
    
    // Baş harfi büyük yap
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    
    return cleaned;
  };

  // Ders isimlerini düzgün kapitalize etmek için yardımcı işlev
  const capitalizeSubjectName = (subject: string): string => {
    const subjectMap: {[key: string]: string} = {
      'turkce': 'Türkçe',
      'matematik': 'Matematik',
      'sosyal': 'Sosyal Bilimler',
      'fen': 'Fen Bilimleri',
      'fizik': 'Fizik',
      'kimya': 'Kimya',
      'biyoloji': 'Biyoloji',
      'geometri': 'Geometri'
    };
    return subjectMap[subject.toLowerCase()] || subject;
  };

  const { data: examResults = [], isLoading: isLoadingExams } = useQuery<ExamResult[]>({
    queryKey: ["/api/exam-results"],
  });
  
  const { data: archivedExamResults = [] } = useQuery<ExamResult[]>({
    queryKey: ["/api/exam-results/archived"],
  });
  
  const { data: questionLogs = [], isLoading: isLoadingQuestions } = useQuery<QuestionLog[]>({
    queryKey: ["/api/question-logs"],
  });
  
  const { data: archivedQuestionLogs = [] } = useQuery<QuestionLog[]>({
    queryKey: ["/api/question-logs/archived"],
  });

  const { data: examSubjectNets = [], isLoading: isLoadingExamNets } = useQuery<any[]>({
    queryKey: ["/api/exam-subject-nets"],
  });

  const isLoading = isLoadingExams || isLoadingQuestions || isLoadingExamNets;

  // Her zaman arşivlenmiş verileri dahil et - Eksik Konular için - GELİŞTİRİLMİŞ FİLTRELEME
  const topicsFilteredExams = useMemo(() => {
    let combined = [...examResults, ...archivedExamResults];
    
    // Etiket filtresi uygula
    if (topicsFilterEnabled.tag && topicsFilterValues.tags.length > 0) {
      combined = combined.filter(exam => {
        const examTag = exam.exam_scope === 'full' ? 'Genel Deneme' : 'Branş Deneme';
        return topicsFilterValues.tags.includes(examTag);
      });
    }
    
    // Ders filtresi uygula - examlarda subjects_data içindeki derslerle eşleştir
    if (topicsFilterEnabled.subject && topicsFilterValues.subjects.length > 0) {
      combined = combined.filter(exam => {
        if (!exam.subjects_data) return false;
        
        try {
          const subjectsData = JSON.parse(exam.subjects_data);
          const examSubjects = Object.keys(subjectsData);
          
          // Ders adı eşleme tablosu
          const subjectNameMap: {[key: string]: string[]} = {
            'Türkçe': ['turkce'],
            'TYT Matematik': ['matematik'],
            'Sosyal Bilimler': ['sosyal'],
            'Fen Bilimleri': ['fen'],
            'Fizik': ['fizik'],
            'Kimya': ['kimya'],
            'Biyoloji': ['biyoloji'],
            'TYT Geometri': ['geometri'],
            'AYT Matematik': ['matematik'],
            'AYT Geometri': ['geometri']
          };
          
          // Seçili derslerin exam'da olup olmadığını kontrol et
          return topicsFilterValues.subjects.some(selectedSubject => {
            const examKeys = subjectNameMap[selectedSubject] || [selectedSubject.toLowerCase()];
            return examKeys.some(key => examSubjects.includes(key));
          });
        } catch {
          return false;
        }
      });
    }
    
    // Tarih filtresi uygula
    if (topicsFilterEnabled.date && (topicsFilterValues.dateFrom || topicsFilterValues.dateTo)) {
      combined = combined.filter(exam => {
        const examDate = exam.exam_date;
        if (topicsFilterValues.dateFrom && examDate < topicsFilterValues.dateFrom) return false;
        if (topicsFilterValues.dateTo && examDate > topicsFilterValues.dateTo) return false;
        return true;
      });
    }
    
    return combined;
  }, [examResults, archivedExamResults, topicsFilterEnabled, topicsFilterValues]);
  
  const topicsFilteredQuestions = useMemo(() => {
    let combined = [...questionLogs, ...archivedQuestionLogs];
    
    // Etiket filtresi - Soru kayıtları için
    if (topicsFilterEnabled.tag && topicsFilterValues.tags.length > 0) {
      combined = combined.filter(log => topicsFilterValues.tags.includes('Soru'));
    }
    
    // Ders filtresi uygula
    if (topicsFilterEnabled.subject && topicsFilterValues.subjects.length > 0) {
      combined = combined.filter(log => {
        const subjectNameMap: {[key: string]: string} = {
          'turkce': 'Türkçe',
          'Türkçe': 'Türkçe',
          'matematik': 'TYT Matematik',
          'Matematik': 'TYT Matematik',
          'sosyal': 'Sosyal Bilimler',
          'Sosyal': 'Sosyal Bilimler',
          'Sosyal Bilimler': 'Sosyal Bilimler',
          'fen': 'Fen Bilimleri',
          'Fen': 'Fen Bilimleri',
          'Fen Bilimleri': 'Fen Bilimleri',
          'fizik': 'Fizik',
          'Fizik': 'Fizik',
          'kimya': 'Kimya',
          'Kimya': 'Kimya',
          'biyoloji': 'Biyoloji',
          'Biyoloji': 'Biyoloji',
          'geometri': 'TYT Geometri',
          'Geometri': 'TYT Geometri',
          'TYT Geometri': 'TYT Geometri',
          'AYT Matematik': 'AYT Matematik',
          'AYT Geometri': 'AYT Geometri'
        };
        const mappedSubject = subjectNameMap[log.subject] || log.subject;
        return topicsFilterValues.subjects.includes(mappedSubject);
      });
    }
    
    // Tarih filtresi uygula
    if (topicsFilterEnabled.date && (topicsFilterValues.dateFrom || topicsFilterValues.dateTo)) {
      combined = combined.filter(log => {
        const logDate = log.study_date;
        if (topicsFilterValues.dateFrom && logDate < topicsFilterValues.dateFrom) return false;
        if (topicsFilterValues.dateTo && logDate > topicsFilterValues.dateTo) return false;
        return true;
      });
    }
    
    return combined;
  }, [questionLogs, archivedQuestionLogs, topicsFilterEnabled, topicsFilterValues]);
  
  // Hata Analizi için - GELİŞTİRİLMİŞ FİLTRELEME
  const errorsFilteredExams = useMemo(() => {
    let combined = [...examResults, ...archivedExamResults];
    
    // Etiket filtresi uygula
    if (errorsFilterEnabled.tag && errorsFilterValues.tags.length > 0) {
      combined = combined.filter(exam => {
        const examTag = exam.exam_scope === 'full' ? 'Genel Deneme' : 'Branş Deneme';
        return errorsFilterValues.tags.includes(examTag);
      });
    }
    
    // Ders filtresi uygula - examlarda subjects_data içindeki derslerle eşleştir
    if (errorsFilterEnabled.subject && errorsFilterValues.subjects.length > 0) {
      combined = combined.filter(exam => {
        if (!exam.subjects_data) return false;
        
        try {
          const subjectsData = JSON.parse(exam.subjects_data);
          const examSubjects = Object.keys(subjectsData);
          
          // Ders adı eşleme tablosu
          const subjectNameMap: {[key: string]: string[]} = {
            'Türkçe': ['turkce'],
            'TYT Matematik': ['matematik'],
            'Sosyal Bilimler': ['sosyal'],
            'Fen Bilimleri': ['fen'],
            'Fizik': ['fizik'],
            'Kimya': ['kimya'],
            'Biyoloji': ['biyoloji'],
            'TYT Geometri': ['geometri'],
            'AYT Matematik': ['matematik'],
            'AYT Geometri': ['geometri']
          };
          
          // Seçili derslerin exam'da olup olmadığını kontrol et
          return errorsFilterValues.subjects.some(selectedSubject => {
            const examKeys = subjectNameMap[selectedSubject] || [selectedSubject.toLowerCase()];
            return examKeys.some(key => examSubjects.includes(key));
          });
        } catch {
          return false;
        }
      });
    }
    
    // Tarih filtresi uygula
    if (errorsFilterEnabled.date && (errorsFilterValues.dateFrom || errorsFilterValues.dateTo)) {
      combined = combined.filter(exam => {
        const examDate = exam.exam_date;
        if (errorsFilterValues.dateFrom && examDate < errorsFilterValues.dateFrom) return false;
        if (errorsFilterValues.dateTo && examDate > errorsFilterValues.dateTo) return false;
        return true;
      });
    }
    
    return combined;
  }, [examResults, archivedExamResults, errorsFilterEnabled, errorsFilterValues]);
  
  const errorsFilteredQuestions = useMemo(() => {
    let combined = [...questionLogs, ...archivedQuestionLogs];
    
    // Etiket filtresi - Soru kayıtları için
    if (errorsFilterEnabled.tag && errorsFilterValues.tags.length > 0) {
      combined = combined.filter(log => errorsFilterValues.tags.includes('Soru'));
    }
    
    // Ders filtresi uygula
    if (errorsFilterEnabled.subject && errorsFilterValues.subjects.length > 0) {
      combined = combined.filter(log => {
        const subjectNameMap: {[key: string]: string} = {
          'turkce': 'Türkçe',
          'Türkçe': 'Türkçe',
          'matematik': 'TYT Matematik',
          'Matematik': 'TYT Matematik',
          'sosyal': 'Sosyal Bilimler',
          'Sosyal': 'Sosyal Bilimler',
          'Sosyal Bilimler': 'Sosyal Bilimler',
          'fen': 'Fen Bilimleri',
          'Fen': 'Fen Bilimleri',
          'Fen Bilimleri': 'Fen Bilimleri',
          'fizik': 'Fizik',
          'Fizik': 'Fizik',
          'kimya': 'Kimya',
          'Kimya': 'Kimya',
          'biyoloji': 'Biyoloji',
          'Biyoloji': 'Biyoloji',
          'geometri': 'TYT Geometri',
          'Geometri': 'TYT Geometri',
          'TYT Geometri': 'TYT Geometri',
          'AYT Matematik': 'AYT Matematik',
          'AYT Geometri': 'AYT Geometri'
        };
        const mappedSubject = subjectNameMap[log.subject] || log.subject;
        return errorsFilterValues.subjects.includes(mappedSubject);
      });
    }
    
    // Tarih filtresi uygula
    if (errorsFilterEnabled.date && (errorsFilterValues.dateFrom || errorsFilterValues.dateTo)) {
      combined = combined.filter(log => {
        const logDate = log.study_date;
        if (errorsFilterValues.dateFrom && logDate < errorsFilterValues.dateFrom) return false;
        if (errorsFilterValues.dateTo && logDate > errorsFilterValues.dateTo) return false;
        return true;
      });
    }
    
    return combined;
  }, [questionLogs, archivedQuestionLogs, errorsFilterEnabled, errorsFilterValues]);
  
  // Ana Analiz için
  const allExamResults = useMemo(() => {
    let combined = [...examResults, ...archivedExamResults];
    if (useDateFilter && selectedDate) {
      combined = combined.filter(exam => exam.exam_date === selectedDate);
    }
    return combined;
  }, [examResults, archivedExamResults, useDateFilter, selectedDate]);
  
  const allQuestionLogs = useMemo(() => {
    let combined = [...questionLogs, ...archivedQuestionLogs];
    if (useDateFilter && selectedDate) {
      combined = combined.filter(log => log.study_date === selectedDate);
    }
    return combined;
  }, [questionLogs, archivedQuestionLogs, useDateFilter, selectedDate]);

  // Filtre sonuç sayısını hesapla
  const topicsFilterResultCount = useMemo(() => {
    let count = 0;
    const uniqueTopics = new Set<string>();
    
    // Sınav sonuçlarından say
    topicsFilteredExams.forEach(exam => {
      if (exam.subjects_data) {
        try {
          const subjectsData = JSON.parse(exam.subjects_data);
          Object.entries(subjectsData).forEach(([subjectKey, data]: [string, any]) => {
            if (data.wrong_topics && data.wrong_topics.length > 0) {
              data.wrong_topics.forEach((topic: any) => {
                const topicStr = typeof topic === 'string' ? topic : topic.topic || '';
                if (topicStr) {
                  // removedTopicsde olmayan konuları say
                  const topicKey = `${exam.exam_type}-${subjectKey}-${topicStr}`;
                  if (!removedTopics.has(topicKey)) {
                    uniqueTopics.add(`exam-${exam.id}-${topicStr}`);
                  }
                }
              });
            }
          });
        } catch (e) {}
      }
    });
    
    // Soru günlüklerinden say
    topicsFilteredQuestions.forEach(log => {
      if (log.wrong_topics) {
        try {
          const wrongTopics = typeof log.wrong_topics === 'string' ? JSON.parse(log.wrong_topics) : log.wrong_topics;
          if (Array.isArray(wrongTopics)) {
            wrongTopics.forEach(topic => {
              const topicStr = typeof topic === 'string' ? topic : topic.topic || '';
              if (topicStr) {
                // removedTopics'de olmayan konuları say
                const topicKey = `${log.exam_type}-${log.subject}-${topicStr}`;
                if (!removedTopics.has(topicKey)) {
                  uniqueTopics.add(`question-${log.id}-${topicStr}`);
                }
              }
            });
          }
        } catch (e) {}
      }
    });
    
    return uniqueTopics.size;
  }, [topicsFilteredExams, topicsFilteredQuestions, removedTopics]);

  // Konu bazında eksik konuları toplar - DENEME VE EXAM SUBJECT NETS VERİLERİ
  const missingTopics = useMemo(() => {
    const topicMap = new Map<string, MissingTopic>();

    // Sınav sonuçlarını işleyin - eksik konuları subjects_datadan çıkarmamız gerekiyor
    topicsFilteredExams.forEach(exam => {
      if (exam.subjects_data) {
        try {
          const subjectsData = JSON.parse(exam.subjects_data);
          Object.entries(subjectsData).forEach(([subjectKey, data]: [string, any]) => {
            if (data.wrong_topics && data.wrong_topics.length > 0) {
              // Subject'i canonical display name'e normalize et - exam_type'a göre
              const examType = exam.exam_type || 'TYT';
              const subjectLower = subjectKey.toLowerCase();
              
              let normalizedSubject = '';
              if (subjectLower === 'turkce' || subjectKey === 'Türkçe') {
                normalizedSubject = 'TYT Türkçe';
              } else if (subjectLower === 'sosyal' || subjectKey === 'Sosyal' || subjectKey === 'Sosyal Bilimler') {
                normalizedSubject = 'TYT Sosyal Bilimler';
              } else if (subjectLower === 'fen' || subjectKey === 'Fen' || subjectKey === 'Fen Bilimleri') {
                normalizedSubject = 'TYT Fen Bilimleri';
              } else if (subjectLower === 'matematik' || subjectKey === 'Matematik') {
                normalizedSubject = examType === 'AYT' ? 'AYT Matematik' : 'TYT Matematik';
              } else if (subjectLower === 'geometri' || subjectKey === 'Geometri') {
                normalizedSubject = examType === 'AYT' ? 'AYT Geometri' : 'TYT Geometri';
              } else if (subjectLower === 'fizik' || subjectKey === 'Fizik') {
                normalizedSubject = examType === 'AYT' ? 'AYT Fizik' : 'TYT Fizik';
              } else if (subjectLower === 'kimya' || subjectKey === 'Kimya') {
                normalizedSubject = examType === 'AYT' ? 'AYT Kimya' : 'TYT Kimya';
              } else if (subjectLower === 'biyoloji' || subjectKey === 'Biyoloji') {
                normalizedSubject = examType === 'AYT' ? 'AYT Biyoloji' : 'TYT Biyoloji';
              } else {
                normalizedSubject = subjectKey;
              }
              
              // Ders filtresi aktifse ve bu ders seçili değilse atla
              if (topicsFilterEnabled.subject && topicsFilterValues.subjects.length > 0) {
                if (!topicsFilterValues.subjects.includes(normalizedSubject)) return;
              }
              
              data.wrong_topics.forEach((rawTopic: any) => {
                let topicName = '';
                if (typeof rawTopic === 'string') {
                  topicName = rawTopic;
                } else if (rawTopic && typeof rawTopic === 'object') {
                  topicName = rawTopic.topic || rawTopic.name || '';
                }
                
                if (topicName && topicName.trim()) {
                  //  "TYT Türkçe - " veya "AYT Fizik - " gibi desenleri konu isimlerinden kaldırma
                  const topic = normalizeTopic(topicName);
                  const key = `${normalizedSubject}-${topic}`;
                  if (topicMap.has(key)) {
                    const existing = topicMap.get(key)!;
                    // Her yanlış eklendiğinde frequency artır (sınır yok)
                    existing.frequency += 1;
                    existing.lastSeen = exam.exam_date > existing.lastSeen ? exam.exam_date : existing.lastSeen;
                  } else {
                    topicMap.set(key, {
                      topic,
                      subject: normalizedSubject,
                      source: 'exam',
                      exam_scope: exam.exam_scope as 'full' | 'branch',
                      exam_type: examType as 'TYT' | 'AYT',
                      frequency: 1,
                      lastSeen: exam.exam_date,
                      createdAt: new Date().toISOString()
                    });
                  }
                }
              });
            }
          });
        } catch (e) {
          console.error('Error parsing subjects_data:', e);
        }
      }
    });

    // examSubjectNets'ten de yanlış konuları işle
    examSubjectNets.forEach((subjectNet: any) => {
      if (subjectNet.wrong_topics_json && subjectNet.wrong_topics_json.trim() !== '' && subjectNet.wrong_topics_json !== 'null' && subjectNet.wrong_topics_json !== '[]') {
        try {
          const wrongTopics = JSON.parse(subjectNet.wrong_topics_json);
          if (Array.isArray(wrongTopics)) {
            const exam = topicsFilteredExams.find((e: any) => e.id === subjectNet.exam_id);
            if (!exam) return; // Tarih filtresi aktifse ve eşleşme yoksa atla
            
            // Subjecti normalize et - exam_typea göre
            const examType = exam.exam_type || 'TYT';
            const subjectLower = subjectNet.subject.toLowerCase();
            
            let normalizedSubject = '';
            if (subjectLower === 'turkce' || subjectNet.subject === 'Türkçe') {
              normalizedSubject = 'TYT Türkçe';
            } else if (subjectLower === 'sosyal' || subjectNet.subject === 'Sosyal' || subjectNet.subject === 'Sosyal Bilimler') {
              normalizedSubject = 'TYT Sosyal Bilimler';
            } else if (subjectLower === 'fen' || subjectNet.subject === 'Fen' || subjectNet.subject === 'Fen Bilimleri') {
              normalizedSubject = 'TYT Fen Bilimleri';
            } else if (subjectLower === 'matematik' || subjectNet.subject === 'Matematik') {
              normalizedSubject = examType === 'AYT' ? 'AYT Matematik' : 'TYT Matematik';
            } else if (subjectLower === 'geometri' || subjectNet.subject === 'Geometri') {
              normalizedSubject = examType === 'AYT' ? 'AYT Geometri' : 'TYT Geometri';
            } else if (subjectLower === 'fizik' || subjectNet.subject === 'Fizik') {
              normalizedSubject = examType === 'AYT' ? 'AYT Fizik' : 'TYT Fizik';
            } else if (subjectLower === 'kimya' || subjectNet.subject === 'Kimya') {
              normalizedSubject = examType === 'AYT' ? 'AYT Kimya' : 'TYT Kimya';
            } else if (subjectLower === 'biyoloji' || subjectNet.subject === 'Biyoloji') {
              normalizedSubject = examType === 'AYT' ? 'AYT Biyoloji' : 'TYT Biyoloji';
            } else {
              normalizedSubject = subjectNet.subject;
            }
            
            // Ders filtresi aktifse ve bu ders seçili değilse atla
            if (topicsFilterEnabled.subject && topicsFilterValues.subjects.length > 0) {
              if (!topicsFilterValues.subjects.includes(normalizedSubject)) return;
            }
            
            const examDate = exam.exam_date;
            const examScope = exam.exam_scope;
            
            wrongTopics.forEach((topicItem: any) => {
              const topicName = typeof topicItem === 'string' ? topicItem : topicItem.topic;
              if (topicName) {
                const topic = normalizeTopic(topicName);
                const key = `${normalizedSubject}-${topic}`;
                if (topicMap.has(key)) {
                  const existing = topicMap.get(key)!;
                  // Her yanlış eklendiğinde frequency artır (sınır yok)
                  existing.frequency += 2;
                  existing.lastSeen = examDate > existing.lastSeen ? examDate : existing.lastSeen;
                } else {
                  topicMap.set(key, {
                    topic,
                    subject: normalizedSubject,
                    source: 'exam',
                    exam_scope: examScope as 'full' | 'branch',
                    exam_type: examType as 'TYT' | 'AYT',
                    frequency: 2,
                    lastSeen: examDate,
                    createdAt: new Date().toISOString()
                  });
                }
              }
            });
          }
        } catch (e) {
          console.error('Error parsing wrong_topics_json from examSubjectNets:', e);
        }
      }
    });

    // Soru günlüklerinden yanlış konuları işle
    topicsFilteredQuestions.forEach((log: QuestionLog) => {
      if (log.wrong_topics) {
        try {
          const wrongTopics = typeof log.wrong_topics === 'string' 
            ? JSON.parse(log.wrong_topics) 
            : log.wrong_topics;
          
          if (Array.isArray(wrongTopics) && wrongTopics.length > 0) {
            // Subject'i normalize et - exam_type'a göre
            const examType = log.exam_type || 'TYT';
            const subjectLower = log.subject.toLowerCase();
            
            let normalizedSubject = '';
            if (subjectLower === 'turkce' || log.subject === 'Türkçe') {
              normalizedSubject = 'TYT Türkçe';
            } else if (subjectLower === 'sosyal' || log.subject === 'Sosyal' || log.subject === 'Sosyal Bilimler') {
              normalizedSubject = 'TYT Sosyal Bilimler';
            } else if (subjectLower === 'fen' || log.subject === 'Fen' || log.subject === 'Fen Bilimleri') {
              normalizedSubject = 'TYT Fen Bilimleri';
            } else if (subjectLower === 'matematik' || log.subject === 'Matematik') {
              normalizedSubject = examType === 'AYT' ? 'AYT Matematik' : 'TYT Matematik';
            } else if (subjectLower === 'geometri' || log.subject === 'Geometri') {
              normalizedSubject = examType === 'AYT' ? 'AYT Geometri' : 'TYT Geometri';
            } else if (subjectLower === 'fizik' || log.subject === 'Fizik') {
              normalizedSubject = examType === 'AYT' ? 'AYT Fizik' : 'TYT Fizik';
            } else if (subjectLower === 'kimya' || log.subject === 'Kimya') {
              normalizedSubject = examType === 'AYT' ? 'AYT Kimya' : 'TYT Kimya';
            } else if (subjectLower === 'biyoloji' || log.subject === 'Biyoloji') {
              normalizedSubject = examType === 'AYT' ? 'AYT Biyoloji' : 'TYT Biyoloji';
            } else {
              normalizedSubject = log.subject;
            }
            
            wrongTopics.forEach((topicItem: any) => {
              const topicName = typeof topicItem === 'string' ? topicItem : topicItem.topic || topicItem.name;
              if (topicName) {
                const topic = normalizeTopic(topicName);
                const key = `${normalizedSubject}-${topic}`;
                if (topicMap.has(key)) {
                  const existing = topicMap.get(key)!;
                  existing.frequency += 1;
                  existing.lastSeen = log.study_date > existing.lastSeen ? log.study_date : existing.lastSeen;
                } else {
                  topicMap.set(key, {
                    topic,
                    subject: normalizedSubject,
                    source: 'question',
                    exam_type: examType as 'TYT' | 'AYT',
                    frequency: 1,
                    lastSeen: log.study_date,
                    createdAt: new Date().toISOString()
                  });
                }
              }
            });
          }
        } catch (e) {
          console.error('Error parsing wrong_topics from question log:', e);
        }
      }
    });

    let topics = Array.from(topicMap.values()).filter(topic => topic.frequency >= 1);
    
    // topicsSortBya göre sırala
    if (topicsSortBy === 'all') {
      // Hepsi - herhangi bir sıralama veya filtreleme yapma
    } else if (topicsSortBy === 'mostFrequent') {
      topics = topics.sort((a, b) => b.frequency - a.frequency);
    } else if (topicsSortBy === 'newest') {
      topics = topics.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());
    } else if (topicsSortBy === 'oldest') {
      topics = topics.sort((a, b) => new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime());
    } else if (topicsSortBy === 'generalExam') {
      topics = topics.filter(t => t.source === 'exam' && t.exam_scope === 'full');
    } else if (topicsSortBy === 'branchExam') {
      topics = topics.filter(t => t.source === 'exam' && t.exam_scope === 'branch');
    } else if (topicsSortBy === 'question') {
      topics = topics.filter(t => t.source === 'question');
    } else if (topicsSortBy === 'tyt') {
      topics = topics.filter(t => t.exam_type === 'TYT');
    } else if (topicsSortBy === 'ayt') {
      topics = topics.filter(t => t.exam_type === 'AYT');
    }
    
    return topics;
  }, [topicsFilteredExams, topicsFilteredQuestions, examSubjectNets, topicsSortBy]);

  // Net Analiz Verilerini İşle - Ortalama netleri göstermek için hareketli ortalama ekle
  const netAnalysisData = useMemo(() => {
    let fullExams = allExamResults
      .filter(exam => exam.exam_scope === 'full');
    
    // Eğer deneme seçildiyse sadece seçili denemeleri göster
    if (selectedGeneralExamIds.length > 0) {
      fullExams = fullExams.filter(exam => selectedGeneralExamIds.includes(exam.id));
    }
    
    fullExams = fullExams.sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime());
    
    const tytExams = fullExams.filter(e => e.exam_type === 'TYT' || (parseFloat(e.tyt_net) > 0 && !parseFloat(e.ayt_net)));
    const aytExams = fullExams.filter(e => e.exam_type === 'AYT' || parseFloat(e.ayt_net) > 0);
    
    // Hareketli ortalama hesapla (son 3 sınav)
    const calculateMovingAverage = (exams: any[], index: number, key: 'tyt_net' | 'ayt_net') => {
      const window = 3;
      const start = Math.max(0, index - window + 1);
      const slice = exams.slice(start, index + 1);
      const sum = slice.reduce((acc, e) => acc + (parseFloat(e[key]) || 0), 0);
      return slice.length > 0 ? sum / slice.length : 0;
    };
    
    return fullExams.map((exam, index) => {
      const examType = exam.exam_type || (parseFloat(exam.ayt_net) > 0 ? 'AYT' : 'TYT');
      const tytIndex = tytExams.findIndex(e => e.id === exam.id);
      const aytIndex = aytExams.findIndex(e => e.id === exam.id);
      
      return {
        date: new Date(exam.exam_date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
        examName: exam.display_name || exam.exam_name,
        // Hareketli ortalama kullan
        tytNet: examType === 'TYT' && tytIndex >= 0 ? calculateMovingAverage(tytExams, tytIndex, 'tyt_net') : null,
        aytNet: examType === 'AYT' && aytIndex >= 0 ? calculateMovingAverage(aytExams, aytIndex, 'ayt_net') : null,
        // Gerçek netler (isteğe bağlı olarak göstermek için)
        tytActual: examType === 'TYT' ? (parseFloat(exam.tyt_net) || 0) : null,
        aytActual: examType === 'AYT' ? (parseFloat(exam.ayt_net) || 0) : null,
        tytTarget: tytTargetNet,
        aytTarget: aytTargetNet,
        sortDate: exam.exam_date
      };
    });
  }, [allExamResults, tytTargetNet, aytTargetNet, selectedGeneralExamIds]);

  // Branş Denemeleri Verisi - Sadece branchscope olanları al
  const branchExamData = useMemo(() => {
    let branchExams = allExamResults
      .filter(exam => exam.exam_scope === 'branch');
    
    // Eğer deneme seçildiyse sadece seçili denemeleri göster
    if (selectedBranchExamIds.length > 0) {
      branchExams = branchExams.filter(exam => selectedBranchExamIds.includes(exam.id));
    }
    
    return branchExams
      .map(exam => {
        const subjectData = exam.subjects_data ? JSON.parse(exam.subjects_data) : {};
        const subjectKey = exam.selected_subject || '';
        const data = subjectData[subjectKey] || {};
        const correct = parseInt(data.correct) || 0;
        const wrong = parseInt(data.wrong) || 0;
        const net = correct - (wrong * 0.25);
        
        return {
          date: new Date(exam.exam_date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
          examName: exam.display_name || exam.exam_name,
          subject: capitalizeSubjectName(subjectKey),
          examType: exam.exam_type || 'TYT',
          net: net,
          correct,
          wrong,
          sortDate: exam.exam_date,
          latestDate: exam.createdAt || exam.exam_date
        };
      })
      .sort((a, b) => new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime());
  }, [allExamResults, selectedBranchExamIds]);

  // Branş Denemelerini ders ve sınav türüne göre grupla
  const branchExamsBySubject = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    
    branchExamData.forEach(exam => {
      const key = `${exam.examType}-${exam.subject}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(exam);
    });
    
    return grouped;
  }, [branchExamData]);

  // Branş Denemeleri için radar grafik(poligon veya pasta) Verisi - TYT ve AYT için ayrı
  const { tytBranchRadarData, aytBranchRadarData } = useMemo(() => {
    const tytSubjectMap = new Map<string, { net: number; correct: number; wrong: number; date: string }>();
    const aytSubjectMap = new Map<string, { net: number; correct: number; wrong: number; date: string }>();
    
    let branchExams = allExamResults
      .filter(exam => exam.exam_scope === 'branch');
    
    // Eğer deneme seçildiyse sadece seçili denemeleri göster
    if (selectedBranchExamIds.length > 0) {
      branchExams = branchExams.filter(exam => selectedBranchExamIds.includes(exam.id));
    }
    
    branchExams.forEach(exam => {
        const subjectData = exam.subjects_data ? JSON.parse(exam.subjects_data) : {};
        const subjectKey = exam.selected_subject || '';
        const data = subjectData[subjectKey] || {};
        const correct = parseInt(data.correct) || 0;
        const wrong = parseInt(data.wrong) || 0;
        const net = correct - (wrong * 0.25);
        const subject = capitalizeSubjectName(subjectKey);
        
        // Sınav türüne göre uygun haritayı seçin
        const targetMap = exam.exam_type === 'TYT' ? tytSubjectMap : aytSubjectMap;
        
        // Her ders için en son veya en yüksek neti al
        if (!targetMap.has(subject) || new Date(exam.exam_date) > new Date(targetMap.get(subject)!.date)) {
          targetMap.set(subject, { net, correct, wrong, date: exam.exam_date });
        }
      });
    
    const subjectColors: {[key: string]: string} = {
      'Türkçe': '#ef4444',
      'Matematik': '#3b82f6',
      'Sosyal Bilimler': '#f59e0b',
      'Fen Bilimleri': '#10b981',
      'Geometri': '#a855f7',
      'Fizik': '#8b5cf6',
      'Kimya': '#ec4899',
      'Biyoloji': '#06b6d4'
    };
    
    const processSubjectData = (subjectMap: Map<string, any>) => {
      return Array.from(subjectMap.entries()).map(([subject, data]) => ({
        subject,
        net: Math.max(0, data.net),
        correct: data.correct,
        wrong: data.wrong,
        color: subjectColors[subject] || '#6b7280'
      }));
    };

    return {
      tytBranchRadarData: processSubjectData(tytSubjectMap),
      aytBranchRadarData: processSubjectData(aytSubjectMap)
    };
  }, [allExamResults, selectedBranchExamIds]);

  // Konu Analiz Verilerini İşle - TYT ve AYT için ayrı - SADECE GENEL DENEMELER
  const { tytSubjectAnalysisData, aytSubjectAnalysisData } = useMemo(() => {
    const tytSubjectMap = new Map<string, { correct: number; wrong: number; total: number; latestDate?: string }>();
    const aytSubjectMap = new Map<string, { correct: number; wrong: number; total: number; latestDate?: string }>();

    // Sınav sonuçlarını konu verileri için işle, sınav türüne göre ayırın - SADECE GENEL DENEMELER
    let fullExams = allExamResults
      .filter(exam => exam.exam_scope === 'full');
    
    // Eğer deneme seçildiyse sadece seçili denemeleri göster
    if (selectedGeneralExamIds.length > 0) {
      fullExams = fullExams.filter(exam => selectedGeneralExamIds.includes(exam.id));
    }
    
    fullExams.forEach(exam => {
      if (exam.subjects_data) {
        try {
          const subjectsData = JSON.parse(exam.subjects_data);
          Object.entries(subjectsData).forEach(([subjectKey, data]: [string, any]) => {
            const subjectNameMap: {[key: string]: string} = {
              'turkce': 'Türkçe',
              'matematik': 'Matematik', 
              'sosyal': 'Sosyal Bilimler',
              'geometri': 'Geometri',
              'fen': 'Fen Bilimleri',
              'fizik': 'Fizik',
              'kimya': 'Kimya',
              'biyoloji': 'Biyoloji'
            };
            const subjectName = subjectNameMap[subjectKey] || subjectKey;
            const correct = parseInt(data.correct) || 0;
            const wrong = parseInt(data.wrong) || 0;
            
            if (correct > 0 || wrong > 0) {
              // Sınav türüne göre uygun haritayı seç
              const targetMap = exam.exam_type === 'TYT' ? tytSubjectMap : aytSubjectMap;
              
              // examSubjectNets'ten bu ders için en son createdAt tarihini bul
              const relatedNets = examSubjectNets.filter((net: any) => 
                net.exam_id === exam.id && 
                net.subject.toLowerCase() === subjectKey.toLowerCase()
              );
              const latestNet = relatedNets.sort((a: any, b: any) => 
                new Date(b.createdAt || b.created_at || '').getTime() - new Date(a.createdAt || a.created_at || '').getTime()
              )[0];
              const latestDate = latestNet?.createdAt || latestNet?.created_at;
              
              if (targetMap.has(subjectName)) {
                const existing = targetMap.get(subjectName)!;
                existing.correct += correct;
                existing.wrong += wrong;
                existing.total += (correct + wrong);
                // En son tarihi güncelle
                if (latestDate) {
                  const existingDate = existing.latestDate ? new Date(existing.latestDate) : null;
                  const newDate = new Date(latestDate);
                  if (!existingDate || newDate > existingDate) {
                    existing.latestDate = latestDate;
                  }
                }
              } else {
                targetMap.set(subjectName, {
                  correct,
                  wrong,
                  total: correct + wrong,
                  latestDate
                });
              }
            }
          });
        } catch (e) {
          console.error('Error parsing subjects_data:', e);
        }
      }
    });

    const subjectColors: {[key: string]: string} = {
      'Türkçe': '#ef4444',
      'Matematik': '#3b82f6', 
      'Sosyal Bilimler': '#f59e0b',
      'Geometri': '#a855f7',
      'Fen Bilimleri': '#10b981',
      'Fizik': '#8b5cf6',
      'Kimya': '#ec4899',
      'Biyoloji': '#06b6d4'
    };

    const processSubjectData = (subjectMap: Map<string, any>) => {
      return Array.from(subjectMap.entries()).map(([subject, data]) => ({
        subject,
        correct: data.correct,
        wrong: data.wrong,
        totalQuestions: data.total,
        netScore: data.correct - (data.wrong * 0.25),
        color: subjectColors[subject] || '#6b7280',
        correctRate: data.total > 0 ? (data.correct / data.total) * 100 : 0,
        wrongRate: data.total > 0 ? (data.wrong / data.total) * 100 : 0,
        latestDate: data.latestDate
      }));
    };

    return {
      tytSubjectAnalysisData: processSubjectData(tytSubjectMap),
      aytSubjectAnalysisData: processSubjectData(aytSubjectMap)
    };
  }, [allExamResults, selectedGeneralExamIds, examSubjectNets]);

  // Genel Deneme Zaman Çizgileri için Veri Hazırlama - TYT ve AYT Dersleri
  const { tytGeneralSubjectTimelines, aytGeneralSubjectTimelines } = useMemo(() => {
    const tytTimelines: { [key: string]: any[] } = {};
    const aytTimelines: { [key: string]: any[] } = {};

    let fullExams = allExamResults
      .filter(exam => exam.exam_scope === 'full');
    
    // Eğer deneme seçildiyse sadece seçili denemeleri göster
    if (selectedGeneralExamIds.length > 0) {
      fullExams = fullExams.filter(exam => selectedGeneralExamIds.includes(exam.id));
    }
    
    fullExams
      .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
      .forEach(exam => {
        if (exam.subjects_data) {
          try {
            const subjectsData = JSON.parse(exam.subjects_data);
            Object.entries(subjectsData).forEach(([subjectKey, data]: [string, any]) => {
              const subjectNameMap: {[key: string]: string} = {
                'turkce': 'Türkçe',
                'matematik': 'Matematik',
                'sosyal': 'Sosyal Bilimler',
                'geometri': 'Geometri',
                'fen': 'Fen Bilimleri',
                'fizik': 'Fizik',
                'kimya': 'Kimya',
                'biyoloji': 'Biyoloji'
              };
              const subjectName = subjectNameMap[subjectKey] || subjectKey;
              const correct = parseInt(data.correct) || 0;
              const wrong = parseInt(data.wrong) || 0;
              const net = correct - (wrong * 0.25);
              
              if (correct > 0 || wrong > 0) {
                const examType = exam.exam_type || 'TYT';
                const targetTimelines = examType === 'TYT' ? tytTimelines : aytTimelines;
                
                if (!targetTimelines[subjectName]) {
                  targetTimelines[subjectName] = [];
                }
                
                targetTimelines[subjectName].push({
                  date: new Date(exam.exam_date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
                  examName: exam.display_name || exam.exam_name,
                  net: Math.max(0, net),
                  correct,
                  wrong,
                  sortDate: exam.exam_date
                });
              }
            });
          } catch (e) {
            console.error('Error parsing subjects_data for timelines:', e);
          }
        }
      });

    return {
      tytGeneralSubjectTimelines: tytTimelines,
      aytGeneralSubjectTimelines: aytTimelines
    };
  }, [allExamResults, selectedGeneralExamIds]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg border p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analiz verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Geliştirilmiş Eksik Konular Bölümü - Daha Büyük ve Daha Modern */}
      <Card className="bg-gradient-to-br from-red-50/70 via-white to-orange-50/60 dark:from-red-950/40 dark:via-slate-800/60 dark:to-orange-950/30 backdrop-blur-lg border-2 border-red-200/40 dark:border-red-800/40 shadow-2xl hover:shadow-3xl transition-all duration-700 group relative overflow-hidden">
        {/* Animasyonlu Arka Plan Elemanları - BERAT CANKIR - 03:03:03(EN BÜYÜK AFYON) */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-br from-red-500/15 to-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-orange-500/15 to-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-red-400/5 to-orange-400/5 rounded-full blur-2xl"></div>
        
        <CardHeader className="bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-t-lg border-b border-red-200/40 pb-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-red-500 via-red-600 to-orange-500 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                <AlertTriangle className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    🎯 Eksik Olduğum Konular
                  </CardTitle>
                  <Button
                    onClick={() => setShowCompletedTopicsModal(true)}
                    variant="outline"
                    className="border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    ✅ Tamamlanan Hatalı Konular
                  </Button>
                </div>
                <p className="text-sm text-red-600/70 dark:text-red-400/70 font-medium mt-2">
                  Soru çözümü ve deneme sınavlarından toplanan eksik konu analizi
                </p>
              </div>
            </div>
            
            {/* Filtreler ve Sıralama Butonları */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-3">
                <select
                  value={topicsSortBy}
                  onChange={(e) => setTopicsSortBy(e.target.value)}
                  className="px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-none outline-none"
                >
                  <option value="all" className="bg-purple-600 text-white">Hepsi</option>
                  <option value="mostFrequent" className="bg-purple-600 text-white">En Çok Tekrar Eden</option>
                  <option value="newest" className="bg-purple-600 text-white">Son Yapılan Hata</option>
                  <option value="oldest" className="bg-purple-600 text-white">İlk Yapılan Hata</option>
                  <option value="generalExam" className="bg-purple-600 text-white">Genel Deneme</option>
                  <option value="branchExam" className="bg-purple-600 text-white">Branş Deneme</option>
                  <option value="question" className="bg-purple-600 text-white">Soru</option>
                  <option value="tyt" className="bg-purple-600 text-white">TYT</option>
                  <option value="ayt" className="bg-purple-600 text-white">AYT</option>
                </select>
                <Button
                  onClick={() => setShowTopicsFilterModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Filter className="h-5 w-5" />
                  Filtreler
                  {[topicsFilterEnabled.tag, topicsFilterEnabled.subject, topicsFilterEnabled.date].filter(Boolean).length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-white/30 rounded-full text-xs font-bold">
                      {[topicsFilterEnabled.tag, topicsFilterEnabled.subject, topicsFilterEnabled.date].filter(Boolean).length}
                    </span>
                  )}
                </Button>
              </div>
              {[topicsFilterEnabled.tag, topicsFilterEnabled.subject, topicsFilterEnabled.date].filter(Boolean).length > 0 && (
                <div className="text-xs text-red-600 dark:text-red-400 font-semibold flex flex-wrap gap-1 max-w-xs justify-end">
                  {topicsFilterEnabled.tag && topicsFilterValues.tags.length > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 rounded-full">
                      🏷️ {topicsFilterValues.tags.length} etiket
                    </span>
                  )}
                  {topicsFilterEnabled.subject && topicsFilterValues.subjects.length > 0 && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                      📚 {topicsFilterValues.subjects.length} ders
                    </span>
                  )}
                  {topicsFilterEnabled.date && (topicsFilterValues.dateFrom || topicsFilterValues.dateTo) && (
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 rounded-full">
                      📅 Tarih
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 pb-8 relative min-h-[400px]">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full mb-6 shadow-lg">
                <div className="animate-spin w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full"></div>
              </div>
              <h4 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-3">Eksik konular analiz ediliyor...</h4>
              <div className="flex justify-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-bounce"></div>
                <div className="w-3 h-3 rounded-full bg-orange-500 animate-bounce delay-100"></div>
                <div className="w-3 h-3 rounded-full bg-red-600 animate-bounce delay-200"></div>
              </div>
            </div>
          ) : missingTopics.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Target className="h-12 w-12 text-green-500" />
              </div>
              {[topicsFilterEnabled.tag, topicsFilterEnabled.subject, topicsFilterEnabled.date].filter(Boolean).length > 0 ? (
                <>
                  <h4 className="text-2xl font-semibold text-orange-700 dark:text-orange-300 mb-3">⚠️ Henüz seçilen filtreye göre veri bulunmamaktadır</h4>
                  <p className="text-base opacity-75">Farklı filtre seçeneklerini deneyin veya filtreleri sıfırlayın</p>
                </>
              ) : (
                <>
                  <h4 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-3">Harika! Henüz eksik konu yok</h4>
                  <p className="text-base opacity-75">Soru çözümü ve deneme sınavı ekledikçe eksik konular burada görünecek</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {missingTopics
                .filter(topic => {
                  // Ders filtresi
                  if (selectedSubjectTopics !== 'all' && topic.subject !== selectedSubjectTopics) {
                    return false;
                  }
                  // Etiket/kaynak filtresi
                  if (selectedTagTopics !== 'all') {
                    if (selectedTagTopics === 'exam-full' && (topic.source !== 'exam' || topic.exam_scope !== 'full')) {
                      return false;
                    }
                    if (selectedTagTopics === 'exam-branch' && (topic.source !== 'exam' || topic.exam_scope !== 'branch')) {
                      return false;
                    }
                    if (selectedTagTopics === 'question' && topic.source !== 'question') {
                      return false;
                    }
                  }
                  // Sadece kaldırılan konuları gösterme (tamamlanan konuları göster)
                  const topicKey = `${topic.subject}-${topic.topic}`;
                  return !removedTopics.has(topicKey);
                })
                .slice(0, 15)
                .map((topic, index) => (
                <div key={index} className={`bg-white/70 dark:bg-gray-900/70 rounded-xl p-4 border border-red-200/50 dark:border-red-700/50 hover:shadow-lg backdrop-blur-sm relative overflow-hidden group/card transition-all duration-200 ${
                  celebratingTopics.has(`${topic.subject}-${topic.topic}`) ? 'animate-pulse bg-green-100/80 dark:bg-green-900/40 border-green-300 dark:border-green-600 scale-105' : 'hover:scale-105'
                } ${
                  completedTopics.has(`${topic.subject}-${topic.topic}`) && !celebratingTopics.has(`${topic.subject}-${topic.topic}`) ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${
                    celebratingTopics.has(`${topic.subject}-${topic.topic}`) 
                      ? 'bg-gradient-to-br from-green-200/60 to-emerald-200/40 dark:from-green-800/40 dark:to-emerald-800/30 opacity-100' 
                      : 'from-red-50/50 to-orange-50/30 dark:from-red-950/20 dark:to-orange-950/10 opacity-0 group-hover/card:opacity-100'
                  }`}></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold text-red-700 dark:text-red-300">{topic.subject}</span>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={completedTopics.has(`${topic.subject}-${topic.topic}`)}
                          onCheckedChange={(checked) => {
                            const topicKey = `${topic.subject}-${topic.topic}`;
                            if (checked) {
                              // Eksik Olduğum Konular'dan tamamlananlar için 
                              const completedAt = new Date().toISOString();
                              const saved = localStorage.getItem('completedTopicsFromMissing');
                              const arr = saved ? JSON.parse(saved) : [];
                              const existing = arr.find((item: any) => item.key === topicKey);
                              
                              // Tag belirle
                              let tag = 'Soru';
                              if (topic.source === 'exam') {
                                tag = topic.exam_scope === 'branch' ? 'Branş Deneme' : 'Genel Deneme';
                              }
                              
                              if (existing) {
                                // Aynı key varsa frequency'i güncelle
                                existing.frequency = topic.frequency;
                                existing.completedAt = completedAt;
                                existing.tag = tag;
                              } else {
                                // Yeni ekle
                                arr.push({
                                  key: topicKey,
                                  completedAt,
                                  subject: topic.subject,
                                  topic: topic.topic,
                                  tag,
                                  frequency: topic.frequency
                                });
                              }
                              localStorage.setItem('completedTopicsFromMissing', JSON.stringify(arr));
                              
                              // Tag'e göre ilgili localStorage'a da ekle (Panel Özet Kartları için)
                              const normalizedSubject = topic.subject.replace(/^(TYT|AYT)\s+/, '');
                              if (tag === 'Genel Deneme') {
                                const generalSaved = localStorage.getItem('completedGeneralExamErrors');
                                const generalArr = generalSaved ? JSON.parse(generalSaved) : [];
                                const generalExisting = generalArr.find((entry: any) => entry.key === topicKey);
                                if (!generalExisting) {
                                  generalArr.push({
                                    key: topicKey,
                                    completedAt,
                                    subject: normalizedSubject,
                                    topic: topic.topic,
                                    tag: 'Genel Deneme',
                                    frequency: topic.frequency,
                                    exam_type: topic.exam_type
                                  });
                                  localStorage.setItem('completedGeneralExamErrors', JSON.stringify(generalArr));
                                }
                              } else if (tag === 'Branş Deneme') {
                                const branchSaved = localStorage.getItem('completedBranchExamErrors');
                                const branchArr = branchSaved ? JSON.parse(branchSaved) : [];
                                const branchExisting = branchArr.find((entry: any) => entry.key === topicKey);
                                if (!branchExisting) {
                                  branchArr.push({
                                    key: topicKey,
                                    completedAt,
                                    subject: normalizedSubject,
                                    topic: topic.topic,
                                    tag: 'Branş Denemesi',
                                    frequency: topic.frequency,
                                    exam_type: topic.exam_type
                                  });
                                  localStorage.setItem('completedBranchExamErrors', JSON.stringify(branchArr));
                                }
                              } else if (tag === 'Soru') {
                                const questionSaved = localStorage.getItem('completedQuestionErrors');
                                const questionArr = questionSaved ? JSON.parse(questionSaved) : [];
                                const questionExisting = questionArr.find((entry: any) => entry.key === topicKey);
                                if (!questionExisting) {
                                  questionArr.push({
                                    key: topicKey,
                                    completedAt,
                                    subject: normalizedSubject,
                                    topic: topic.topic,
                                    tag: 'Soru',
                                    frequency: topic.frequency,
                                    exam_type: topic.exam_type
                                  });
                                  localStorage.setItem('completedQuestionErrors', JSON.stringify(questionArr));
                                }
                              }
                              
                              window.dispatchEvent(new Event('localStorageUpdate'));
                              
                              setCompletedTopics(prev => new Set([...prev, topicKey]));
                              setCelebratingTopics(prev => new Set([...prev, topicKey]));
                              toast({ 
                                title: "🎉 Tebrikler!", 
                                description: `${topic.topic} konusunu tamamladınız!`,
                                duration: 3000
                              });

                              // 1.5 saniye sonra kutunun animasyonunu kaldır ve 3 saniye sonra kutuyu kaldır
                              setTimeout(() => {
                                setCelebratingTopics(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete(topicKey);
                                  return newSet;
                                });
                              }, 1500);
                              
                              // 1.5 saniye sonra kutuyu kaldır
                              setTimeout(() => {
                                setRemovedTopics(prev => new Set([...prev, topicKey]));
                              }, 1500);
                            } else {
                              // Uncheck durumunda localStoragedan kaldır
                              const saved = localStorage.getItem('completedTopicsFromMissing');
                              if (saved) {
                                const arr = JSON.parse(saved);
                                const item = arr.find((i: any) => i.key === topicKey);
                                const tag = item?.tag || '';
                                
                                const filtered = arr.filter((item: any) => item.key !== topicKey);
                                localStorage.setItem('completedTopicsFromMissing', JSON.stringify(filtered));
                                
                                // Tag'e göre ilgili localStorage'dan da sil
                                if (tag === 'Genel Deneme') {
                                  const generalSaved = localStorage.getItem('completedGeneralExamErrors');
                                  if (generalSaved) {
                                    const generalArr = JSON.parse(generalSaved);
                                    const generalFiltered = generalArr.filter((entry: any) => entry.key !== topicKey);
                                    localStorage.setItem('completedGeneralExamErrors', JSON.stringify(generalFiltered));
                                  }
                                } else if (tag === 'Branş Deneme') {
                                  const branchSaved = localStorage.getItem('completedBranchExamErrors');
                                  if (branchSaved) {
                                    const branchArr = JSON.parse(branchSaved);
                                    const branchFiltered = branchArr.filter((entry: any) => entry.key !== topicKey);
                                    localStorage.setItem('completedBranchExamErrors', JSON.stringify(branchFiltered));
                                  }
                                } else if (tag === 'Soru') {
                                  const questionSaved = localStorage.getItem('completedQuestionErrors');
                                  if (questionSaved) {
                                    const questionArr = JSON.parse(questionSaved);
                                    const questionFiltered = questionArr.filter((entry: any) => entry.key !== topicKey);
                                    localStorage.setItem('completedQuestionErrors', JSON.stringify(questionFiltered));
                                  }
                                }
                                
                                window.dispatchEvent(new Event('localStorageUpdate'));
                              }
                              
                              setCompletedTopics(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(topicKey);
                                return newSet;
                              });
                              setRemovedTopics(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(topicKey);
                                return newSet;
                              });
                            }
                          }}
                          className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed flex-1">{topic.topic}</p>
                      {celebratingTopics.has(`${topic.subject}-${topic.topic}`) && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-bounce">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm font-bold">Tebrikler!</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className={`px-3 py-1.5 rounded-full font-medium shadow-sm ${
                        topic.source === 'exam' 
                          ? topic.exam_scope === 'branch'
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                      }`}>
                        {topic.source === 'exam' 
                          ? topic.exam_scope === 'branch' 
                            ? '📊 Branş Deneme' 
                            : '🎯 Genel Deneme'
                          : '📝 Soru'}
                      </span>
                      <span className="text-xs font-medium">{(() => {
                        const lastSeenDate = new Date(topic.lastSeen);
                        const today = new Date();
                        const diffTime = today.getTime() - lastSeenDate.getTime();
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        
                        // Bugün veya gelecek bir tarih ise "Bugün" göster
                        if (diffDays <= 0) return 'Bugün';
                        if (diffDays === 1) return 'Dün';
                        if (diffDays < 7) return `${diffDays} gün önce`;
                        if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
                        return new Date(topic.lastSeen).toLocaleDateString('tr-TR');
                      })()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Geliştirilmiş Hata Sıklığı Analizi Bölümü - Daha Büyük ve Daha Modern */}
      <Card className="bg-gradient-to-br from-orange-50/70 via-white to-red-50/60 dark:from-orange-950/40 dark:via-slate-800/60 dark:to-red-950/30 backdrop-blur-lg border-2 border-orange-200/40 dark:border-orange-800/40 shadow-2xl hover:shadow-3xl transition-all duration-700 group relative overflow-hidden">
        {/* Animasyonlu Arka Plan Elemanları  */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-br from-orange-500/15 to-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-red-500/15 to-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-orange-400/5 to-red-400/5 rounded-full blur-2xl"></div>
        
        <CardHeader className="bg-gradient-to-r from-orange-500/15 to-red-500/15 rounded-t-lg border-b border-orange-200/40 pb-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                <Brain className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    🔍 Hata Sıklığı Analizi
                  </CardTitle>
                  <Button
                    onClick={() => setShowCompletedErrorsModal(true)}
                    variant="outline"
                    className="border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    ✅ Tamamlanan Hatalı Sorular
                  </Button>
                </div>
                <p className="text-sm text-orange-600/70 dark:text-orange-400/70 font-medium mt-2">
                  Yanlış yaptığınız sorulara bu alandan geri dönüp tamamlayabilirsiniz.
                </p>
              </div>
            </div>
            
            {/* Filtreler ve Sıralama Butonları  */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-3">
                <select
                  value={errorsSortBy}
                  onChange={(e) => setErrorsSortBy(e.target.value)}
                  className="px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-none outline-none"
                >
                  <option value="all" className="bg-purple-600 text-white">Hepsi</option>
                  <option value="mostFrequent" className="bg-purple-600 text-white">En Çok Kez Hata Yapılan</option>
                  <option value="leastFrequent" className="bg-purple-600 text-white">En Az Kez Hata Yapılan</option>
                  <option value="newest" className="bg-purple-600 text-white">Son Yapılan</option>
                  <option value="oldest" className="bg-purple-600 text-white">İlk Yapılan</option>
                  <option value="questionErrors" className="bg-purple-600 text-white">Soru Hataları</option>
                  <option value="generalExamErrors" className="bg-purple-600 text-white">Genel Deneme Hataları</option>
                  <option value="branchExamErrors" className="bg-purple-600 text-white">Branş Deneme Hataları</option>
                  <option value="tyt" className="bg-purple-600 text-white">TYT</option>
                  <option value="ayt" className="bg-purple-600 text-white">AYT</option>
                  <option value="easy" className="bg-purple-600 text-white">Kolay</option>
                  <option value="medium" className="bg-purple-600 text-white">Orta</option>
                  <option value="hard" className="bg-purple-600 text-white">Zor</option>
                </select>
                <Button
                  onClick={() => setShowErrorsFilterModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Filter className="h-5 w-5" />
                  Filtreler
                  {[errorsFilterEnabled.tag, errorsFilterEnabled.subject, errorsFilterEnabled.date].filter(Boolean).length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-white/30 rounded-full text-xs font-bold">
                      {[errorsFilterEnabled.tag, errorsFilterEnabled.subject, errorsFilterEnabled.date].filter(Boolean).length}
                    </span>
                  )}
                </Button>
              </div>
              {[errorsFilterEnabled.tag, errorsFilterEnabled.subject, errorsFilterEnabled.date].filter(Boolean).length > 0 && (
                <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold flex flex-wrap gap-1 max-w-xs justify-end">
                  {errorsFilterEnabled.tag && errorsFilterValues.tags.length > 0 && (
                    <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                      🏷️ {errorsFilterValues.tags.length} etiket
                    </span>
                  )}
                  {errorsFilterEnabled.subject && errorsFilterValues.subjects.length > 0 && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                      📚 {errorsFilterValues.subjects.length} ders
                    </span>
                  )}
                  {errorsFilterEnabled.date && (errorsFilterValues.dateFrom || errorsFilterValues.dateTo) && (
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 rounded-full">
                      📅 Tarih
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 pb-8 relative min-h-[400px]">
          {(() => {
            // konu bazında tüm yanlış verilerini topla
            let allWrongTopicData: Array<{
              topic: string;
              source: 'question' | 'exam';
              subject: string;
              exam_type: string;
              exam_scope?: 'full' | 'branch';
              wrong_count: number;
              study_date: string;
              difficulty?: 'kolay' | 'orta' | 'zor';
              category?: 'kavram' | 'hesaplama' | 'analiz' | 'dikkatsizlik';
              createdAt?: string;
            }> = [];

            // Soru günlüklerini işle - SORU GÜNLÜĞÜ VERİLERİ
            errorsFilteredQuestions.forEach(log => {
              // Subjecti normalize et - exam_typea göre - TYT/AYT ibaresi her ders için
              const examType = log.exam_type || 'TYT';
              const subjectLower = log.subject.toLowerCase();
              
              let normalizedSubject = '';
              if (subjectLower === 'turkce' || log.subject === 'Türkçe') {
                normalizedSubject = `${examType} Türkçe`;
              } else if (subjectLower === 'sosyal' || log.subject === 'Sosyal' || log.subject === 'Sosyal Bilimler') {
                normalizedSubject = `${examType} Sosyal Bilimler`;
              } else if (subjectLower === 'fen' || log.subject === 'Fen' || log.subject === 'Fen Bilimleri') {
                normalizedSubject = `${examType} Fen Bilimleri`;
              } else if (subjectLower === 'matematik' || log.subject === 'Matematik') {
                normalizedSubject = `${examType} Matematik`;
              } else if (subjectLower === 'geometri' || log.subject === 'Geometri') {
                normalizedSubject = `${examType} Geometri`;
              } else if (subjectLower === 'fizik' || log.subject === 'Fizik') {
                normalizedSubject = `${examType} Fizik`;
              } else if (subjectLower === 'kimya' || log.subject === 'Kimya') {
                normalizedSubject = `${examType} Kimya`;
              } else if (subjectLower === 'biyoloji' || log.subject === 'Biyoloji') {
                normalizedSubject = `${examType} Biyoloji`;
              } else {
                normalizedSubject = `${examType} ${log.subject}`;
              }
              
              //  wrong_topics_jsondan yapılandırılmış verileri ayrıştırmayı dene
              let structuredTopics: Array<{
                topic: string;
                difficulty: 'kolay' | 'orta' | 'zor';
                category: 'kavram' | 'hesaplama' | 'analiz' | 'dikkatsizlik';
              }> = [];
              
              try {
                if (log.wrong_topics_json && log.wrong_topics_json.trim() !== '' && log.wrong_topics_json !== 'null' && log.wrong_topics_json !== '[]') {
                  structuredTopics = JSON.parse(log.wrong_topics_json);
                }
              } catch (e) {
                console.error('Error parsing wrong_topics_json:', e);
              }

              // Yapılandırılmış konular mevcutsa ekle
              if (structuredTopics.length > 0) {
                structuredTopics.forEach(topicItem => {
                  allWrongTopicData.push({
                    topic: normalizeTopic(topicItem.topic),
                    source: 'question',
                    subject: normalizedSubject,
                    exam_type: log.exam_type,
                    wrong_count: parseInt(log.wrong_count) || 0,
                    study_date: log.study_date,
                    difficulty: topicItem.difficulty,
                    category: topicItem.category,
                    createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : log.createdAt
                  });
                });
              } else if (log.wrong_topics && log.wrong_topics.length > 0) {
                // Basit wrong_topics dizisine geri dön
                log.wrong_topics.forEach(topic => {
                  let topicName = '';
                  if (typeof topic === 'string') {
                    topicName = topic;
                  } else if (topic && typeof topic === 'object') {
                    topicName = (topic as any)?.topic || (topic as any)?.name || '';
                  }
                  
                  if (topicName && topicName.trim()) {
                    allWrongTopicData.push({
                      topic: normalizeTopic(topicName),
                      source: 'question',
                      subject: normalizedSubject,
                      exam_type: log.exam_type,
                      wrong_count: parseInt(log.wrong_count) || 0,
                      study_date: log.study_date,
                      createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : log.createdAt,
                      difficulty: 'orta',
                      category: 'kavram'
                    });
                  }
                });
              }
            });

            // examSubjectNetsten de yanlış konuları işle - DENEME VERİLERİ
            examSubjectNets.forEach((subjectNet: any) => {
              if (subjectNet.wrong_topics_json && subjectNet.wrong_topics_json.trim() !== '' && subjectNet.wrong_topics_json !== 'null' && subjectNet.wrong_topics_json !== '[]') {
                try {
                  const wrongTopics = JSON.parse(subjectNet.wrong_topics_json);
                  if (Array.isArray(wrongTopics)) {
                    const exam = errorsFilteredExams.find((e: any) => e.id === subjectNet.exam_id);
                    if (!exam) return; // Tarih filtresi aktifse ve eşleşme yoksa atla
                    
                    // Subject'i normalize et - exam_type'a göre - TYT/AYT ibaresi her ders için
                    // ÖNEMLİ: subjectNet.exam_type kullan (exam.exam_type DEĞİL) - AYT Fizik/Kimya/Biyoloji hatası düzeltildi
                    const examType = subjectNet.exam_type || exam.exam_type || 'TYT';
                    const subjectLower = subjectNet.subject.toLowerCase();
                    
                    let normalizedSubject = '';
                    if (subjectLower === 'turkce' || subjectNet.subject === 'Türkçe') {
                      normalizedSubject = `${examType} Türkçe`;
                    } else if (subjectLower === 'sosyal' || subjectNet.subject === 'Sosyal' || subjectNet.subject === 'Sosyal Bilimler') {
                      normalizedSubject = `${examType} Sosyal Bilimler`;
                    } else if (subjectLower === 'fen' || subjectNet.subject === 'Fen' || subjectNet.subject === 'Fen Bilimleri') {
                      normalizedSubject = `${examType} Fen Bilimleri`;
                    } else if (subjectLower === 'matematik' || subjectNet.subject === 'Matematik') {
                      normalizedSubject = `${examType} Matematik`;
                    } else if (subjectLower === 'geometri' || subjectNet.subject === 'Geometri') {
                      normalizedSubject = `${examType} Geometri`;
                    } else if (subjectLower === 'fizik' || subjectNet.subject === 'Fizik') {
                      normalizedSubject = `${examType} Fizik`;
                    } else if (subjectLower === 'kimya' || subjectNet.subject === 'Kimya') {
                      normalizedSubject = `${examType} Kimya`;
                    } else if (subjectLower === 'biyoloji' || subjectNet.subject === 'Biyoloji') {
                      normalizedSubject = `${examType} Biyoloji`;
                    } else {
                      normalizedSubject = `${examType} ${subjectNet.subject}`;
                    }
                    
                    // Ders filtresi aktifse ve bu ders seçili değilse atla
                    if (errorsFilterEnabled.subject && errorsFilterValues.subjects.length > 0) {
                      if (!errorsFilterValues.subjects.includes(normalizedSubject)) return;
                    }
                    
                    const examDate = exam.exam_date;
                    const examScope = exam.exam_scope;
                    const examCreatedAt = exam.createdAt;
                    
                    wrongTopics.forEach((topicItem: any) => {
                      const topicName = typeof topicItem === 'string' ? topicItem : topicItem.topic;
                      if (topicName) {
                        allWrongTopicData.push({
                          topic: normalizeTopic(topicName),
                          source: 'exam',
                          subject: normalizedSubject,
                          exam_type: subjectNet.exam_type,
                          exam_scope: examScope as 'full' | 'branch',
                          wrong_count: parseInt(subjectNet.wrong_count) || 0,
                          study_date: examDate,
                          createdAt: examCreatedAt instanceof Date ? examCreatedAt.toISOString() : examCreatedAt
                        });
                      }
                    });
                  }
                } catch (e) {
                  console.error('Error parsing wrong_topics_json from examSubjectNets:', e);
                }
              }
            });

            // Konu bazında gruplandır ve verileri topla
            const topicAggregated = allWrongTopicData.reduce((acc, item) => {
              const key = `${item.subject}-${item.topic}`;
              if (acc[key]) {
                acc[key].frequency += 1;
                acc[key].totalWrong += item.wrong_count;
                if (!acc[key].sources.includes(item.source)) {
                  acc[key].sources.push(item.source);
                }
                if (item.study_date > acc[key].lastSeen) {
                  acc[key].lastSeen = item.study_date;
                  acc[key].difficulty = item.difficulty;
                  acc[key].category = item.category;
                  acc[key].exam_scope = item.exam_scope;
                }
                // İlk ekleme zamanını koru (en eski createdAt)
                if (item.createdAt && (!acc[key].createdAt || new Date(item.createdAt) < new Date(acc[key].createdAt))) {
                  acc[key].createdAt = item.createdAt;
                }
              } else {
                acc[key] = {
                  topic: item.topic,
                  subject: item.subject,
                  exam_type: item.exam_type,
                  exam_scope: item.exam_scope,
                  frequency: 1,
                  totalWrong: item.wrong_count,
                  lastSeen: item.study_date,
                  createdAt: item.createdAt,
                  difficulty: item.difficulty,
                  category: item.category,
                  sources: [item.source]
                };
              }
              return acc;
            }, {} as {[key: string]: any});

            // Sıralama mantığı
            let wrongTopicAnalysisData = Object.values(topicAggregated);
            
            // errorsSortBy değerine göre sırala
            switch (errorsSortBy) {
              case 'all':
                // Hepsi - herhangi bir sıralama veya filtreleme yapma
                break;
              case 'mostFrequent':
                wrongTopicAnalysisData.sort((a: any, b: any) => b.frequency - a.frequency);
                break;
              case 'leastFrequent':
                wrongTopicAnalysisData.sort((a: any, b: any) => a.frequency - b.frequency);
                break;
              case 'newest':
                wrongTopicAnalysisData.sort((a: any, b: any) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());
                break;
              case 'oldest':
                wrongTopicAnalysisData.sort((a: any, b: any) => new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime());
                break;
              case 'questionErrors':
                wrongTopicAnalysisData = wrongTopicAnalysisData.filter((item: any) => item.sources.includes('question'));
                break;
              case 'generalExamErrors':
                wrongTopicAnalysisData = wrongTopicAnalysisData.filter((item: any) => item.sources.includes('exam') && item.exam_scope === 'full');
                break;
              case 'branchExamErrors':
                wrongTopicAnalysisData = wrongTopicAnalysisData.filter((item: any) => item.sources.includes('exam') && item.exam_scope === 'branch');
                break;
              case 'tyt':
                wrongTopicAnalysisData = wrongTopicAnalysisData.filter((item: any) => item.exam_type === 'TYT');
                break;
              case 'ayt':
                wrongTopicAnalysisData = wrongTopicAnalysisData.filter((item: any) => item.exam_type === 'AYT');
                break;
              case 'easy':
                wrongTopicAnalysisData = wrongTopicAnalysisData.filter((item: any) => item.difficulty === 'kolay');
                break;
              case 'medium':
                wrongTopicAnalysisData = wrongTopicAnalysisData.filter((item: any) => item.difficulty === 'orta');
                break;
              case 'hard':
                wrongTopicAnalysisData = wrongTopicAnalysisData.filter((item: any) => item.difficulty === 'zor');
                break;
              default:
                wrongTopicAnalysisData.sort((a: any, b: any) => b.frequency - a.frequency);
            }
            
            if (isLoading) {
              return (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full mb-6 shadow-lg">
                    <div className="animate-spin w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full"></div>
                  </div>
                  <h4 className="text-xl font-semibold text-orange-700 dark:text-orange-300 mb-3">Hata sıklığı analiz ediliyor...</h4>
                  <div className="flex justify-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-bounce"></div>
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-bounce delay-100"></div>
                    <div className="w-3 h-3 rounded-full bg-orange-600 animate-bounce delay-200"></div>
                  </div>
                </div>
              );
            }
            
            if (wrongTopicAnalysisData.length === 0) {
              return (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Brain className="h-12 w-12 text-blue-500" />
                  </div>
                  <h4 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-3">Henüz hata analizi verisi yok</h4>
                  <p className="text-base opacity-75">Soru veya deneme ekleyip yanlış konuları girdikçe hata sıklığınız burada görünecek</p>
                </div>
              );
            }
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wrongTopicAnalysisData
                  .filter((item: any) => {
                    // Ders filtresi
                    if (selectedSubjectErrors !== 'all' && item.subject !== selectedSubjectErrors) {
                      return false;
                    }
                    // Etiket/kaynak filtresi
                    if (selectedTagErrors !== 'all') {
                      if (selectedTagErrors === 'exam' && (!item.sources || !item.sources.includes('exam'))) {
                        return false;
                      }
                      if (selectedTagErrors === 'question' && (!item.sources || !item.sources.includes('question'))) {
                        return false;
                      }
                    }
                    // Kaldırılan ve tamamlanan konuları gösterme
                    const errorTopicKey = `${item.exam_type}-${item.subject}-${item.topic}`;
                    const isCompleted = item.sources && item.sources.includes('exam') 
                      ? completedExamErrors.has(errorTopicKey)
                      : completedQuestionErrors.has(errorTopicKey);
                    return !removedErrorTopics.has(errorTopicKey) && !isCompleted;
                  })
                  .slice(0, 15)
                  .map((item: any, index) => {
                  const errorTopicKey = `${item.exam_type}-${item.subject}-${item.topic}`;
                  return (
                  <div key={index} className={`bg-white/70 dark:bg-gray-900/70 rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50 hover:shadow-lg backdrop-blur-sm relative overflow-hidden group/card transition-all duration-200 ${
                    celebratingErrorTopics.has(errorTopicKey) ? 'animate-pulse bg-green-100/80 dark:bg-green-900/40 border-green-300 dark:border-green-600 scale-105' : 'hover:scale-105'
                  } ${
                    ((item.sources && item.sources.includes('exam') ? completedExamErrors : completedQuestionErrors).has(errorTopicKey) && !celebratingErrorTopics.has(errorTopicKey)) ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/30 dark:from-orange-950/20 dark:to-red-950/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full shadow-md ${
                            item.exam_type === 'TYT' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}></div>
                          <span className="text-base font-bold text-orange-700 dark:text-orange-300">
                            {item.subject.startsWith('TYT ') || item.subject.startsWith('AYT ') 
                              ? item.subject 
                              : `${item.exam_type} ${capitalizeSubjectName(item.subject)}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={
                              (item.sources && item.sources.includes('exam') && completedExamErrors.has(errorTopicKey)) ||
                              (item.sources && item.sources.includes('question') && completedQuestionErrors.has(errorTopicKey))
                            }
                            onCheckedChange={(checked) => {
                              const hasExamError = item.sources && item.sources.includes('exam');
                              const hasQuestionError = item.sources && item.sources.includes('question');
                              if (checked) {
                                const completedAt = new Date().toISOString();
                                
                                // Eğer deneme hatası varsa, deneme hatası olarak kaydet
                                if (hasExamError) {
                                  // Sınav hatası - exam_scop'a göre localStoragea kaydet
                                  if (item.exam_scope === 'branch') {
                                    const saved = localStorage.getItem('completedBranchExamErrors');
                                    const arr = saved ? JSON.parse(saved) : [];
                                    const existing = arr.find((entry: any) => entry.key === errorTopicKey);
                                    
                                    if (existing) {
                                      // Aynı key varsa frequencyi artır
                                      existing.frequency = (existing.frequency || 1) + item.frequency;
                                      existing.completedAt = completedAt;
                                    } else {
                                      // Yeni ekle - subjecti normalize et
                                      const normalizedSubject = item.subject.replace(/^(TYT|AYT)\s+/, '');
                                      arr.push({
                                        key: errorTopicKey,
                                        completedAt,
                                        subject: normalizedSubject,
                                        topic: item.topic,
                                        tag: 'Branş Denemesi',
                                        frequency: item.frequency,
                                        exam_type: item.exam_type,
                                        difficulty: item.difficulty,
                                        category: item.category
                                      });
                                    }
                                    localStorage.setItem('completedBranchExamErrors', JSON.stringify(arr));
                                    window.dispatchEvent(new Event('localStorageUpdate'));
                                  } else {
                                    const saved = localStorage.getItem('completedGeneralExamErrors');
                                    const arr = saved ? JSON.parse(saved) : [];
                                    const existing = arr.find((entry: any) => entry.key === errorTopicKey);
                                    
                                    if (existing) {
                                      // Aynı key varsa frequencyi artır
                                      existing.frequency = (existing.frequency || 1) + item.frequency;
                                      existing.completedAt = completedAt;
                                    } else {
                                      // Yeni ekle - subjecti normalize et
                                      const normalizedSubject = item.subject.replace(/^(TYT|AYT)\s+/, '');
                                      arr.push({
                                        key: errorTopicKey,
                                        completedAt,
                                        subject: normalizedSubject,
                                        topic: item.topic,
                                        tag: 'Genel Deneme',
                                        frequency: item.frequency,
                                        exam_type: item.exam_type,
                                        difficulty: item.difficulty,
                                        category: item.category
                                      });
                                    }
                                    localStorage.setItem('completedGeneralExamErrors', JSON.stringify(arr));
                                    window.dispatchEvent(new Event('localStorageUpdate'));
                                  }
                                  
                                  setCompletedExamErrors(prev => {
                                    const newMap = new Map(prev);
                                    newMap.set(errorTopicKey, completedAt);
                                    return newMap;
                                  });
                                  
                                  // Tamamlanan Hatalı Sorular Geçmişi modalını refresh et
                                  setCompletedErrorsRefreshKey(prev => prev + 1);
                                }
                                // Eğer deneme hatası yoksa VE soru hatası varsa, soru hatası olarak kaydet
                                else if (hasQuestionError) {
                                  const saved = localStorage.getItem('completedQuestionErrors');
                                  const arr = saved ? JSON.parse(saved) : [];
                                  const existing = arr.find((entry: any) => entry.key === errorTopicKey);
                                  
                                  if (existing) {
                                    // Aynı key varsa frequencyi artır
                                    existing.frequency = (existing.frequency || 1) + item.frequency;
                                    existing.completedAt = completedAt;
                                  } else {
                                    // Yeni ekle - subjecti normalize et
                                    const normalizedSubject = item.subject.replace(/^(TYT|AYT)\s+/, '');
                                    arr.push({
                                      key: errorTopicKey,
                                      completedAt,
                                      subject: normalizedSubject,
                                      topic: item.topic,
                                      tag: 'Soru',
                                      frequency: item.frequency,
                                      exam_type: item.exam_type,
                                      difficulty: item.difficulty,
                                      category: item.category
                                    });
                                  }
                                  localStorage.setItem('completedQuestionErrors', JSON.stringify(arr));
                                  window.dispatchEvent(new Event('localStorageUpdate'));
                                  
                                  setCompletedQuestionErrors(prev => {
                                    const newMap = new Map(prev);
                                    newMap.set(errorTopicKey, completedAt);
                                    return newMap;
                                  });
                                  
                                  // Tamamlanan Hatalı Sorular Geçmişi modalını refresh et
                                  setCompletedErrorsRefreshKey(prev => prev + 1);
                                }
                                
                                setCelebratingErrorTopics(prev => new Set([...prev, errorTopicKey]));
                                toast({ 
                                  title: "🎉 Tebrikler!", 
                                  description: `${item.topic} konusundaki hatanızı çözdünüz!`,
                                  duration: 3000
                                });

                                setTimeout(() => {
                                  setCelebratingErrorTopics(prev => {
                                    const newSet = new Set(prev);
                                    newSet.delete(errorTopicKey);
                                    return newSet;
                                  });
                                }, 1500);
                                
                                setTimeout(() => {
                                  setRemovedErrorTopics(prev => new Set([...prev, errorTopicKey]));
                                }, 1500);
                              } else {
                                // Checkbox işareti kaldırma - tüm kayıtları temizle
                                if (hasExamError) {
                                  // localStoragedan kaldır
                                  if (item.exam_scope === 'branch') {
                                    const saved = localStorage.getItem('completedBranchExamErrors');
                                    if (saved) {
                                      const arr = JSON.parse(saved);
                                      const filtered = arr.filter((entry: any) => entry.key !== errorTopicKey);
                                      localStorage.setItem('completedBranchExamErrors', JSON.stringify(filtered));
                                      window.dispatchEvent(new Event('localStorageUpdate'));
                                    }
                                  } else {
                                    const saved = localStorage.getItem('completedGeneralExamErrors');
                                    if (saved) {
                                      const arr = JSON.parse(saved);
                                      const filtered = arr.filter((entry: any) => entry.key !== errorTopicKey);
                                      localStorage.setItem('completedGeneralExamErrors', JSON.stringify(filtered));
                                      window.dispatchEvent(new Event('localStorageUpdate'));
                                    }
                                  }
                                  
                                  setCompletedExamErrors(prev => {
                                    const newMap = new Map(prev);
                                    newMap.delete(errorTopicKey);
                                    return newMap;
                                  });
                                }
                                // Deneme hatası yoksa VE soru hatası varsa, soru hatasını temizle
                                else if (hasQuestionError) {
                                  const saved = localStorage.getItem('completedQuestionErrors');
                                  if (saved) {
                                    const arr = JSON.parse(saved);
                                    const filtered = arr.filter((entry: any) => entry.key !== errorTopicKey);
                                    localStorage.setItem('completedQuestionErrors', JSON.stringify(filtered));
                                    window.dispatchEvent(new Event('localStorageUpdate'));
                                  }
                                  
                                  setCompletedQuestionErrors(prev => {
                                    const newMap = new Map(prev);
                                    newMap.delete(errorTopicKey);
                                    return newMap;
                                  });
                                }
                                
                                setRemovedErrorTopics(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete(errorTopicKey);
                                  return newSet;
                                });
                              }
                            }}
                            className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          />
                          <div className="text-sm text-orange-600 dark:text-orange-400 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 px-3 py-1.5 rounded-full font-semibold shadow-md ml-auto">
                            {item.frequency} Kez
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="text-sm bg-white/50 dark:bg-gray-800/50 p-3 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex-1">{item.topic}</div>
                            {celebratingErrorTopics.has(errorTopicKey) && (
                              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-bounce">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-bold">Tebrikler!</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {item.difficulty && (
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                item.difficulty === 'kolay' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                                item.difficulty === 'orta' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                                'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                              }`}>
                                📊 {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                              </span>
                            )}
                            {item.category && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium">
                                🔍 {item.category === 'kavram' ? 'Kavram Eksikliği' :
                                    item.category === 'hesaplama' ? 'Hesaplama Hatası' :
                                    item.category === 'analiz' ? 'Analiz Sorunu' : 'Dikkatsizlik'}
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              item.sources && item.sources.includes('exam') 
                                ? item.exam_scope === 'branch'
                                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                            }`}>
                              {item.sources && item.sources.includes('exam') 
                                ? item.exam_scope === 'branch'
                                  ? '📊 Branş Deneme'
                                  : '🎯 Genel Deneme'
                                : '📝 Soru'} Hatası
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-orange-200/40 dark:border-orange-700/40">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">{new Date(item.createdAt || item.lastSeen).toLocaleDateString('tr-TR').replace(/\//g, '.')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{new Date(item.createdAt || item.lastSeen).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Analiz Bölümü */}
      <Card className="bg-gradient-to-br from-indigo-50/50 via-card to-purple-50/50 dark:from-indigo-950/30 dark:via-card dark:to-purple-950/30 backdrop-blur-sm border-2 border-indigo-200/30 dark:border-indigo-800/30 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-lg border-b border-indigo-200/30 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-indigo-500" />
                📊 Deneme Analiz Sistemi
              </CardTitle>
              <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70 font-medium">
                {analysisMode === 'general' ? 'TYT/AYT net gelişimi, hedef karşılaştırması ve ders bazında analiz' : 'Branş bazında deneme performans analizi'}
              </p>
            </div>

            {/* Analiz Modu Değiştirme */}
            <div className="flex bg-indigo-100/50 dark:bg-indigo-900/30 rounded-xl p-1 border border-indigo-200/50 dark:border-indigo-700/50">
              <Button
                variant={analysisMode === 'general' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setAnalysisMode('general')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                  analysisMode === 'general' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                    : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200/50 dark:hover:bg-indigo-800/50'
                }`}
                data-testid="button-analysis-general"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                📊 Genel Deneme Analiz
              </Button>
              <Button
                variant={analysisMode === 'branch' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setAnalysisMode('branch')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                  analysisMode === 'branch' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                    : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200/50 dark:hover:bg-indigo-800/50'
                }`}
                data-testid="button-analysis-branch"
              >
                <Book className="h-4 w-4 mr-2" />
                📚 Branş Deneme Analiz
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {analysisMode === 'general' ? (
            // Genel Deneme Analizi (TYT/AYT Net + Ders Analizi)
            netAnalysisData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
                <h4 className="text-base font-semibold text-blue-700 dark:text-blue-300">Henüz bir deneme verisi girilmedi.</h4>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Deneme Seçme ve Filtre Butonları */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExamSelectModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200"
                      data-testid="button-select-general-exam"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="whitespace-nowrap">Genel Deneme Seç</span>
                      {selectedGeneralExamIds.length > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs">
                          {selectedGeneralExamIds.length}
                        </span>
                      )}
                    </Button>
                    {selectedGeneralExamIds.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedGeneralExamIds([])}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100/50 to-slate-100/50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-all duration-200"
                        data-testid="button-reset-general-exam"
                      >
                        <X className="h-4 w-4" />
                        <span className="whitespace-nowrap">Sıfırla</span>
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFilterState = !useDateFilter;
                        setUseDateFilter(newFilterState);
                        if (!newFilterState) {
                          setSelectedDate(null);
                        } else {
                          setSelectedDate(new Date().toISOString().split('T')[0]);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100/50 to-blue-100/50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-xl border border-cyan-200/50 dark:border-cyan-700/50 text-sm font-medium text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-all duration-200"
                      data-testid="button-toggle-date-filter"
                    >
                      <span className="whitespace-nowrap">📅 Filtrele</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${useDateFilter ? 'rotate-180' : ''}`} />
                    </Button>
                    {useDateFilter && (
                      <input
                        type="date"
                        value={selectedDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        data-testid="input-date-filter"
                      />
                    )}
                  </div>
                </div>
                {/* Hedefler ve Mevcut Network Ekranı */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50/80 dark:bg-blue-950/30 rounded-xl p-4 text-center border border-blue-200/50 dark:border-blue-800/40 transition-all">
                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1 flex items-center justify-center gap-2">
                      TYT Hedef: 
                      {isEditingTytTarget ? (
                        <input
                          type="number"
                          value={tytTargetNet}
                          onChange={(e) => setTytTargetNet(parseInt(e.target.value) || 90)}
                          onBlur={() => setIsEditingTytTarget(false)}
                          className="w-16 px-2 py-1 text-center bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <span 
                          className="cursor-pointer hover:bg-blue-200/50 dark:hover:bg-blue-800/50 px-2 py-1 rounded-lg transition-colors"
                          onMouseEnter={() => setIsEditingTytTarget(true)}
                        >
                          {tytTargetNet}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      TYT DENEME: {(() => {
                        // En son TYT sınavını bul (tytNet > 0 veya exam_type TYT ise) - Tarih filtresini dikkate al
                        const tytExams = allExamResults.filter(exam => 
                          exam.exam_type === 'TYT' || (parseFloat(exam.tyt_net) > 0 && parseFloat(exam.ayt_net) === 0)
                        ).sort((a, b) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime());
                        return tytExams.length > 0 ? parseFloat(tytExams[0].tyt_net) : 0;
                      })()} net
                    </div>
                  </div>
                  <div className="bg-green-50/80 dark:bg-green-950/30 rounded-xl p-4 text-center border border-green-200/50 dark:border-green-800/40 transition-all">
                    <div className="text-lg font-bold text-green-700 dark:text-green-300 mb-1 flex items-center justify-center gap-2">
                      AYT Hedef: 
                      {isEditingAytTarget ? (
                        <input
                          type="number"
                          value={aytTargetNet}
                          onChange={(e) => setAytTargetNet(parseInt(e.target.value) || 50)}
                          onBlur={() => setIsEditingAytTarget(false)}
                          className="w-16 px-2 py-1 text-center bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          autoFocus
                        />
                      ) : (
                        <span 
                          className="cursor-pointer hover:bg-green-200/50 dark:hover:bg-green-800/50 px-2 py-1 rounded-lg transition-colors"
                          onMouseEnter={() => setIsEditingAytTarget(true)}
                        >
                          {aytTargetNet}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      AYT DENEME: {(() => {
                        // En son AYT sınavını bul (aytNet > 0 veya exam_type AYT ise) - Tarih filtresini dikkate al
                        const aytExams = allExamResults.filter(exam => 
                          exam.exam_type === 'AYT' || (parseFloat(exam.ayt_net) > 0 && parseFloat(exam.tyt_net) === 0)
                        ).sort((a, b) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime());
                        return aytExams.length > 0 ? parseFloat(aytExams[0].ayt_net) : 0;
                      })()} net
                    </div>
                  </div>
                </div>
                
                <div className="h-96 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={netAnalysisData} margin={{ top: 40, right: 60, bottom: 50, left: 40 }}>
                    <defs>
                      <linearGradient id="tytGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="aytGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="currentColor" opacity={0.15} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fontWeight: 600 }}
                      className="text-foreground"
                      axisLine={{ stroke: 'currentColor', opacity: 0.4 }}
                      tickLine={{ stroke: 'currentColor', opacity: 0.4 }}
                      angle={-30}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fontWeight: 600 }}
                      className="text-foreground"
                      axisLine={{ stroke: 'currentColor', opacity: 0.4 }}
                      tickLine={{ stroke: 'currentColor', opacity: 0.4 }}
                      label={{ value: 'Net Sayısı', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontWeight: 600 } }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '2px solid hsl(var(--border))',
                        borderRadius: '16px',
                        fontSize: '14px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        padding: '16px',
                        backdropFilter: 'blur(8px)'
                      }}
                      labelFormatter={(label, payload) => {
                        const data = payload?.[0]?.payload;
                        return data ? `📊 ${data.examName} - ${label}` : label;
                      }}
                      formatter={(value: any, name: any) => {
                        // ekran boşsa tooltip gösterme
                        if (value === null) return [null, null];
                        
                        if (name === 'tytTarget') return [`${value} net`, `🔵 TYT Hedef: ${tytTargetNet} net`];
                        if (name === 'aytTarget') return [`${value} net`, `🔵 AYT Hedef: ${aytTargetNet} net`];
                        if (name === 'tytNet') return [`${value} net`, '🟢 TYT DENEME'];
                        if (name === 'aytNet') return [`${value} net`, '🟢 AYT DENEME'];
                        return [`${value} net`, name];
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '30px', fontSize: '14px', fontWeight: 600 }}
                      iconType="line"
                    />

                    {/* Hedef çizgileri */}
                    <Line 
                      type="monotone" 
                      dataKey="tytTarget" 
                      stroke="#3b82f6" 
                      strokeDasharray="10 6" 
                      strokeWidth={3}
                      dot={false} 
                      connectNulls={false}
                      name={`🎯 TYT Hedef (${tytTargetNet})`}
                      opacity={0.8}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="aytTarget" 
                      stroke="#059669" 
                      strokeDasharray="10 6" 
                      strokeWidth={3}
                      dot={false} 
                      connectNulls={false}
                      name={`🎯 AYT Hedef (${aytTargetNet})`}
                      opacity={0.8}
                    />

                    {/* Gerçek netler */}
                    <Line 
                      type="linear" 
                      dataKey="tytNet" 
                      stroke="#3b82f6" 
                      strokeWidth={5}
                      dot={{ fill: '#3b82f6', strokeWidth: 4, r: 8, stroke: '#ffffff' }} 
                      activeDot={{ r: 12, stroke: '#3b82f6', strokeWidth: 4, fill: '#ffffff' }}
                      connectNulls={true}
                      name="🔵 TYT Net"
                    />
                    <Line 
                      type="linear" 
                      dataKey="aytNet" 
                      stroke="#059669" 
                      strokeWidth={5}
                      dot={{ fill: '#059669', strokeWidth: 4, r: 8, stroke: '#ffffff' }} 
                      activeDot={{ r: 12, stroke: '#059669', strokeWidth: 4, fill: '#ffffff' }}
                      connectNulls={true}
                      name="🟢 AYT Net"
                    />
                  </LineChart>
                </ResponsiveContainer>
                </div>
                
                {/* Ders Analizi - Radar Charts */}
                {(tytSubjectAnalysisData.length > 0 || aytSubjectAnalysisData.length > 0) && (
                  <div className="space-y-6 mt-8">
                    <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      📊 Ders Bazında Analiz
                    </h3>
                    {/* İkiz Radar Grafikleri(polygon ama) - TYT ve AYT yan yana */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* TYT Grafiği */}
                  <div className="h-[400px] bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-center mb-4 text-blue-700 dark:text-blue-300">🔵 TYT Ders Analizi</h3>
                    {tytSubjectAnalysisData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="85%">
                        <RadarChart data={tytSubjectAnalysisData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                          <defs>
                            <linearGradient id="tytCorrectGlow" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4}/>
                              <stop offset="100%" stopColor="#16a34a" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="tytWrongGlow" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4}/>
                              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <PolarGrid stroke="currentColor" className="opacity-25" strokeWidth={1} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 600 }} />
                          <PolarRadiusAxis angle={0} domain={[0, 'dataMax']} tick={{ fontSize: 10 }} />
                          <Tooltip content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const correct = payload.find(p => p.name === '✅ Doğru Cevaplar')?.value || 0;
                              const wrong = payload.find(p => p.name === '❌ Yanlış Cevaplar')?.value || 0;
                              const net = (Number(correct) - Number(wrong) * 0.25).toFixed(2);
                              return (
                                <div className="bg-white/95 dark:bg-gray-800/95 px-2 py-1 rounded shadow-sm border text-xs">
                                  <p className="font-semibold text-xs mb-0.5">{label}</p>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-green-600">✅ {correct}</span>
                                    <span className="text-red-600">❌ {wrong}</span>
                                    <span className="text-blue-600 font-bold">Net: {net}</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }} />
                          <Radar name="✅ Doğru Cevaplar" dataKey="correct" stroke="#22c55e" strokeWidth={2} fill="url(#tytCorrectGlow)" fillOpacity={0.3} dot={{ r: 4, fill: '#22c55e' }} />
                          <Radar name="❌ Yanlış Cevaplar" dataKey="wrong" stroke="#ef4444" strokeWidth={2} fill="url(#tytWrongGlow)" fillOpacity={0.3} dot={{ r: 4, fill: '#ef4444' }} />
                          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} iconType="circle" />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <div className="text-4xl mb-2">📊</div>
                          <p className="text-sm text-muted-foreground">Henüz TYT deneme verisi yok</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AYT Grafiği */}
                  <div className="h-[400px] bg-gradient-to-br from-green-50/30 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-center mb-4 text-green-700 dark:text-green-300">🟢 AYT Ders Analizi</h3>
                    {aytSubjectAnalysisData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="85%">
                        <RadarChart data={aytSubjectAnalysisData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                          <defs>
                            <linearGradient id="aytCorrectGlow" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4}/>
                              <stop offset="100%" stopColor="#16a34a" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="aytWrongGlow" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4}/>
                              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <PolarGrid stroke="currentColor" className="opacity-25" strokeWidth={1} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 600 }} />
                          <PolarRadiusAxis angle={0} domain={[0, 'dataMax']} tick={{ fontSize: 10 }} />
                          <Tooltip content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const correct = payload.find(p => p.name === '✅ Doğru Cevaplar')?.value || 0;
                              const wrong = payload.find(p => p.name === '❌ Yanlış Cevaplar')?.value || 0;
                              const net = (Number(correct) - Number(wrong) * 0.25).toFixed(2);
                              return (
                                <div className="bg-white/95 dark:bg-gray-800/95 px-2 py-1 rounded shadow-sm border text-xs">
                                  <p className="font-semibold text-xs mb-0.5">{label}</p>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-green-600">✅ {correct}</span>
                                    <span className="text-red-600">❌ {wrong}</span>
                                    <span className="text-blue-600 font-bold">Net: {net}</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }} />
                          <Radar name="✅ Doğru Cevaplar" dataKey="correct" stroke="#22c55e" strokeWidth={2} fill="url(#aytCorrectGlow)" fillOpacity={0.3} dot={{ r: 4, fill: '#22c55e' }} />
                          <Radar name="❌ Yanlış Cevaplar" dataKey="wrong" stroke="#ef4444" strokeWidth={2} fill="url(#aytWrongGlow)" fillOpacity={0.3} dot={{ r: 4, fill: '#ef4444' }} />
                          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} iconType="circle" />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <div className="text-4xl mb-2">📊</div>
                          <p className="text-sm text-muted-foreground">Henüz AYT deneme verisi yok</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Zaman Çizgileri ve Ders Özetleri */}
                <div className="space-y-6">
                  {/* TYT Dersleri - Zaman Çizgileri */}
                  {Object.keys(tytGeneralSubjectTimelines).length > 0 && (
                    <Collapsible open={tytGeneralTimelineExpanded} onOpenChange={setTytGeneralTimelineExpanded}>
                      <div className="flex items-center justify-center mb-4 mt-6">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg"
                            data-testid="button-toggle-tyt-timeline"
                          >
                            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">📈 TYT Dersleri - Zaman Çizgileri</h3>
                            <ChevronDown className={`h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${tytGeneralTimelineExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(tytGeneralSubjectTimelines).map(([subject, exams]) => {
                          const subjectColors: {[key: string]: string} = {
                            'Türkçe': '#ef4444',
                            'Matematik': '#3b82f6',
                            'Geometri': '#8b5cf6',
                            'Fizik': '#7c3aed',
                            'Kimya': '#ec4899',
                            'Biyoloji': '#06b6d4',
                            'Sosyal Bilimler': '#f59e0b',
                            'Fen Bilimleri': '#10b981'
                          };
                          const color = subjectColors[subject] || '#f97316';
                          return (
                            <div key={subject} className="h-64 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-3 border border-gray-200/30 dark:border-gray-700/30">
                              <h4 className="text-sm font-semibold text-center mb-1.5" style={{ color }}>{subject}</h4>
                              <ResponsiveContainer width="100%" height="87%">
                                <LineChart data={exams} margin={{ top: 5, right: 20, bottom: 30, left: 20 }}>
                                  <CartesianGrid strokeDasharray="4 4" stroke="currentColor" opacity={0.15} />
                                  <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 600 }} className="text-foreground" axisLine={{ stroke: 'currentColor', opacity: 0.4 }} tickLine={{ stroke: 'currentColor', opacity: 0.4 }} angle={-30} textAnchor="end" height={40} />
                                  <YAxis tick={{ fontSize: 11, fontWeight: 600 }} className="text-foreground" axisLine={{ stroke: 'currentColor', opacity: 0.4 }} tickLine={{ stroke: 'currentColor', opacity: 0.4 }} domain={[0, 40]} />
                                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '2px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.15)', padding: '12px' }} labelFormatter={(label, payload) => { const data = payload?.[0]?.payload; return data ? `${data.examName} - ${label}` : label; }} formatter={(value: any) => [`${Number(value).toFixed(1)} net`, 'Net Skoru']} />
                                  <Line type="linear" dataKey="net" stroke={color} strokeWidth={4} dot={{ fill: color, strokeWidth: 3, r: 6, stroke: '#ffffff' }} activeDot={{ r: 10, stroke: color, strokeWidth: 3, fill: '#ffffff' }} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          );
                        })}
                      </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* AYT Dersleri - Zaman Çizgileri */}
                  {Object.keys(aytGeneralSubjectTimelines).length > 0 && (
                    <Collapsible open={aytGeneralTimelineExpanded} onOpenChange={setAytGeneralTimelineExpanded}>
                      <div className="flex items-center justify-center mb-4 mt-6">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/20 px-4 py-2 rounded-lg"
                            data-testid="button-toggle-ayt-timeline"
                          >
                            <h3 className="text-lg font-bold text-green-700 dark:text-green-300">📈 AYT Dersleri - Zaman Çizgileri</h3>
                            <ChevronDown className={`h-5 w-5 text-green-600 dark:text-green-400 transition-transform duration-200 ${aytGeneralTimelineExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(aytGeneralSubjectTimelines).map(([subject, exams]) => {
                          const subjectColors: {[key: string]: string} = {
                            'Türkçe': '#ef4444',
                            'Matematik': '#3b82f6',
                            'Geometri': '#8b5cf6',
                            'Fizik': '#7c3aed',
                            'Kimya': '#ec4899',
                            'Biyoloji': '#06b6d4',
                            'Sosyal Bilimler': '#f59e0b',
                            'Fen Bilimleri': '#10b981'
                          };
                          const color = subjectColors[subject] || '#f97316';
                          return (
                            <div key={subject} className="h-64 bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-3 border border-gray-200/30 dark:border-gray-700/30">
                              <h4 className="text-sm font-semibold text-center mb-1.5" style={{ color }}>{subject}</h4>
                              <ResponsiveContainer width="100%" height="87%">
                                <LineChart data={exams} margin={{ top: 5, right: 20, bottom: 30, left: 20 }}>
                                  <CartesianGrid strokeDasharray="4 4" stroke="currentColor" opacity={0.15} />
                                  <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 600 }} className="text-foreground" axisLine={{ stroke: 'currentColor', opacity: 0.4 }} tickLine={{ stroke: 'currentColor', opacity: 0.4 }} angle={-30} textAnchor="end" height={40} />
                                  <YAxis tick={{ fontSize: 11, fontWeight: 600 }} className="text-foreground" axisLine={{ stroke: 'currentColor', opacity: 0.4 }} tickLine={{ stroke: 'currentColor', opacity: 0.4 }} domain={[0, 40]} />
                                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '2px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.15)', padding: '12px' }} labelFormatter={(label, payload) => { const data = payload?.[0]?.payload; return data ? `${data.examName} - ${label}` : label; }} formatter={(value: any) => [`${Number(value).toFixed(1)} net`, 'Net Skoru']} />
                                  <Line type="linear" dataKey="net" stroke={color} strokeWidth={4} dot={{ fill: color, strokeWidth: 3, r: 6, stroke: '#ffffff' }} activeDot={{ r: 10, stroke: color, strokeWidth: 3, fill: '#ffffff' }} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          );
                        })}
                      </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* TYT Ders Özeti Kartları - MİNİMAL */}
                  {tytSubjectAnalysisData.length > 0 && (
                    <Collapsible open={tytSummaryExpanded} onOpenChange={setTytSummaryExpanded}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300">📚 TYT Ders Özeti</h4>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg"
                            data-testid="button-toggle-tyt-summary"
                          >
                            <ChevronDown className={`h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${tytSummaryExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {tytSubjectAnalysisData.map((subject, index) => (
                            <div key={index} className="bg-blue-50/60 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200/40 dark:border-blue-700/40 hover:shadow-md transition-all duration-200">
                              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 truncate">{subject.subject}</h4>
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span className="text-green-600 dark:text-green-400 font-semibold">✓{subject.correct}</span>
                                <span className="text-red-600 dark:text-red-400 font-semibold">✗{subject.wrong}</span>
                                <span className="text-blue-600 dark:text-blue-400 font-bold">Net:{subject.netScore.toFixed(1)}</span>
                              </div>
                              {subject.latestDate && (
                                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 border-t border-blue-200/30 dark:border-blue-700/30 pt-1.5">
                                  <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{new Date(subject.latestDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span>🕐</span>
                                      <span>{new Date(subject.latestDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* AYT Ders Özeti Kartları - MİNİMAL */}
                  {aytSubjectAnalysisData.length > 0 && (
                    <Collapsible open={aytSummaryExpanded} onOpenChange={setAytSummaryExpanded}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-green-700 dark:text-green-300">📚 AYT Ders Özeti</h4>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg"
                            data-testid="button-toggle-ayt-summary"
                          >
                            <ChevronDown className={`h-5 w-5 text-green-600 dark:text-green-400 transition-transform duration-200 ${aytSummaryExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {aytSubjectAnalysisData.map((subject, index) => (
                            <div key={index} className="bg-green-50/60 dark:bg-green-900/20 rounded-lg p-4 border border-green-200/40 dark:border-green-700/40 hover:shadow-md transition-all duration-200">
                              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 truncate">{subject.subject}</h4>
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span className="text-green-600 dark:text-green-400 font-semibold">✓{subject.correct}</span>
                                <span className="text-red-600 dark:text-red-400 font-semibold">✗{subject.wrong}</span>
                                <span className="text-green-600 dark:text-green-400 font-bold">Net:{subject.netScore.toFixed(1)}</span>
                              </div>
                              {subject.latestDate && (
                                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 border-t border-green-200/30 dark:border-green-700/30 pt-1.5">
                                  <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{new Date(subject.latestDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span>🕐</span>
                                      <span>{new Date(subject.latestDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </div>
            )}
          </div>
          )) : (
            // Branş Denemeleri Analizi
            branchExamData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Book className="h-8 w-8 text-orange-500" />
                </div>
                <h4 className="text-base font-semibold text-orange-700 dark:text-orange-300">Henüz branş denemesi girilmedi</h4>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Deneme Seçme ve Filtre Butonları */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExamSelectModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100/50 to-indigo-100/50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50 text-sm font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all duration-200"
                      data-testid="button-select-branch-exam"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="whitespace-nowrap">Branş Deneme Seç</span>
                      {selectedBranchExamIds.length > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-purple-500 text-white rounded-full text-xs">
                          {selectedBranchExamIds.length}
                        </span>
                      )}
                    </Button>
                    {selectedBranchExamIds.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBranchExamIds([])}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100/50 to-slate-100/50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-all duration-200"
                        data-testid="button-reset-branch-exam"
                      >
                        <X className="h-4 w-4" />
                        <span className="whitespace-nowrap">Sıfırla</span>
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFilterState = !useDateFilter;
                        setUseDateFilter(newFilterState);
                        if (!newFilterState) {
                          setSelectedDate(null);
                        } else {
                          setSelectedDate(new Date().toISOString().split('T')[0]);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100/50 to-blue-100/50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-xl border border-cyan-200/50 dark:border-cyan-700/50 text-sm font-medium text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-all duration-200"
                      data-testid="button-toggle-date-filter-branch"
                    >
                      <span className="whitespace-nowrap">📅 Filtrele</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${useDateFilter ? 'rotate-180' : ''}`} />
                    </Button>
                    {useDateFilter && (
                      <input
                        type="date"
                        value={selectedDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        data-testid="input-date-filter-branch"
                      />
                    )}
                  </div>
                </div>
                {/* TYT ve AYT Branş Denemeleri - Radar Grafikleri Yan Yana */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                  {/* TYT Radar Grafiği */}
                  <div className="h-[400px] bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-center mb-4 text-blue-700 dark:text-blue-300">📚 TYT Branş Denemeleri - Ders Bazlı Net Analizi</h3>
                    {tytBranchRadarData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="85%">
                        <RadarChart data={tytBranchRadarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                          <defs>
                            <linearGradient id="tytBranchNetGlow" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <PolarGrid stroke="currentColor" className="opacity-25" strokeWidth={1} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 600 }} />
                          <PolarRadiusAxis angle={0} domain={[0, 'dataMax']} tick={{ fontSize: 10 }} />
                          <Tooltip content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white/95 dark:bg-gray-800/95 px-2 py-1.5 rounded shadow-md border text-xs">
                                  <div className="font-semibold mb-0.5">{label}</div>
                                  <div className="space-y-0.5">
                                    <div className="text-green-600 dark:text-green-400">✓ {data.correct}</div>
                                    <div className="text-red-600 dark:text-red-400">✗ {data.wrong}</div>
                                    <div className="text-blue-600 dark:text-blue-400 font-semibold">Net: {data.net.toFixed(1)}</div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }} />
                          <Radar 
                            name="📚 TYT Branş Net Skoru" 
                            dataKey="net" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            fill="url(#tytBranchNetGlow)" 
                            fillOpacity={0.4} 
                            dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} iconType="circle" />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <div className="text-4xl mb-2">📚</div>
                          <p className="text-sm text-muted-foreground">Henüz TYT branş denemesi yok</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AYT Radar Grafiği */}
                  <div className="h-[400px] bg-gradient-to-br from-purple-50/30 to-violet-50/30 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-center mb-4 text-purple-700 dark:text-purple-300">📚 AYT Branş Denemeleri - Ders Bazlı Net Analizi</h3>
                    {aytBranchRadarData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="85%">
                        <RadarChart data={aytBranchRadarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                          <defs>
                            <linearGradient id="aytBranchNetGlow" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4}/>
                              <stop offset="100%" stopColor="#9333ea" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <PolarGrid stroke="currentColor" className="opacity-25" strokeWidth={1} />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 600 }} />
                          <PolarRadiusAxis angle={0} domain={[0, 'dataMax']} tick={{ fontSize: 10 }} />
                          <Tooltip content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white/95 dark:bg-gray-800/95 px-2 py-1.5 rounded shadow-md border text-xs">
                                  <div className="font-semibold mb-0.5">{label}</div>
                                  <div className="space-y-0.5">
                                    <div className="text-green-600 dark:text-green-400">✓ {data.correct}</div>
                                    <div className="text-red-600 dark:text-red-400">✗ {data.wrong}</div>
                                    <div className="text-blue-600 dark:text-blue-400 font-semibold">Net: {data.net.toFixed(1)}</div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }} />
                          <Radar 
                            name="📚 AYT Branş Net Skoru" 
                            dataKey="net" 
                            stroke="#a855f7" 
                            strokeWidth={3}
                            fill="url(#aytBranchNetGlow)" 
                            fillOpacity={0.4} 
                            dot={{ r: 5, fill: '#a855f7', strokeWidth: 2, stroke: '#ffffff' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} iconType="circle" />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <div className="text-4xl mb-2">📚</div>
                          <p className="text-sm text-muted-foreground">Henüz AYT branş denemesi yok</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* TYT Dersleri Zaman Çizgileri */}
                {Object.entries(branchExamsBySubject).filter(([key]) => key.startsWith('TYT-')).length > 0 && (
                  <Collapsible open={tytBranchTimelineExpanded} onOpenChange={setTytBranchTimelineExpanded}>
                    <div className="flex items-center justify-center mb-4">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg"
                          data-testid="button-toggle-tyt-branch-timeline"
                        >
                          <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">📈 TYT Dersleri - Zaman Çizgileri</h3>
                          <ChevronDown className={`h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${tytBranchTimelineExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(branchExamsBySubject)
                        .filter(([key]) => key.startsWith('TYT-'))
                        .map(([key, exams]) => {
                          const [examType, subject] = key.split('-');
                          const subjectColors: {[key: string]: string} = {
                            'Türkçe': '#ef4444',
                            'Matematik': '#3b82f6',
                            'Geometri': '#8b5cf6',
                            'Fizik': '#7c3aed',
                            'Kimya': '#ec4899',
                            'Biyoloji': '#06b6d4',
                            'Sosyal Bilimler': '#f59e0b',
                            'Fen Bilimleri': '#10b981'
                          };
                          const color = subjectColors[subject] || '#f97316';
                          const bgColor = 'from-blue-50/30 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20';
                          
                          // SUBJECT_LIMITS'ten max değeri al
                          const subjectKey = subject.replace('TYT ', '').replace('AYT ', '');
                          const maxValue = SUBJECT_LIMITS[examType]?.[subjectKey] || 50;
                          
                          return (
                            <div key={key} className={`h-64 bg-gradient-to-br ${bgColor} rounded-xl p-3 border border-gray-200/30 dark:border-gray-700/30`}>
                              <h4 className="text-sm font-semibold text-center mb-1.5" style={{ color }}>
                                {subject}
                              </h4>
                              <ResponsiveContainer width="100%" height="87%">
                                <LineChart data={exams} margin={{ top: 5, right: 20, bottom: 30, left: 20 }}>
                                  <CartesianGrid strokeDasharray="4 4" stroke="currentColor" opacity={0.15} />
                                  <XAxis 
                                    dataKey="date" 
                                    tick={{ fontSize: 11, fontWeight: 600 }}
                                    className="text-foreground"
                                    axisLine={{ stroke: 'currentColor', opacity: 0.4 }}
                                    tickLine={{ stroke: 'currentColor', opacity: 0.4 }}
                                    angle={-30}
                                    textAnchor="end"
                                    height={40}
                                  />
                                  <YAxis 
                                    tick={{ fontSize: 11, fontWeight: 600 }}
                                    className="text-foreground"
                                    axisLine={{ stroke: 'currentColor', opacity: 0.4 }}
                                    tickLine={{ stroke: 'currentColor', opacity: 0.4 }}
                                    domain={[0, maxValue]}
                                  />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: 'hsl(var(--card))',
                                      border: '2px solid hsl(var(--border))',
                                      borderRadius: '12px',
                                      fontSize: '12px',
                                      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                                      padding: '12px'
                                    }}
                                    labelFormatter={(label, payload) => {
                                      const data = payload?.[0]?.payload;
                                      return data ? `${data.examName} - ${label}` : label;
                                    }}
                                    formatter={(value: any) => [`${Number(value).toFixed(1)} net`, 'Net Skoru']}
                                  />
                                  <Line 
                                    type="linear" 
                                    dataKey="net" 
                                    stroke={color} 
                                    strokeWidth={4}
                                    dot={{ fill: color, strokeWidth: 3, r: 6, stroke: '#ffffff' }} 
                                    activeDot={{ r: 10, stroke: color, strokeWidth: 3, fill: '#ffffff' }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          );
                        })}
                    </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* AYT Dersleri Zaman Çizgileri */}
                {Object.entries(branchExamsBySubject).filter(([key]) => key.startsWith('AYT-')).length > 0 && (
                  <Collapsible open={aytBranchTimelineExpanded} onOpenChange={setAytBranchTimelineExpanded}>
                    <div className="flex items-center justify-center mb-4">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/20 px-4 py-2 rounded-lg"
                          data-testid="button-toggle-ayt-branch-timeline"
                        >
                          <h3 className="text-lg font-bold text-green-700 dark:text-green-300">📈 AYT Dersleri - Zaman Çizgileri</h3>
                          <ChevronDown className={`h-5 w-5 text-green-600 dark:text-green-400 transition-transform duration-200 ${aytBranchTimelineExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(branchExamsBySubject)
                        .filter(([key]) => key.startsWith('AYT-'))
                        .map(([key, exams]) => {
                          const [examType, subject] = key.split('-');
                          const subjectColors: {[key: string]: string} = {
                            'Türkçe': '#ef4444',
                            'Matematik': '#3b82f6',
                            'Geometri': '#8b5cf6',
                            'Fizik': '#7c3aed',
                            'Kimya': '#ec4899',
                            'Biyoloji': '#06b6d4',
                            'Sosyal Bilimler': '#f59e0b',
                            'Fen Bilimleri': '#10b981'
                          };
                          const color = subjectColors[subject] || '#f97316';
                          const bgColor = 'from-purple-50/30 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/20';
                          
                          // SUBJECT_LIMITSten max değeri al
                          const subjectKey = subject.replace('TYT ', '').replace('AYT ', '');
                          const maxValue = SUBJECT_LIMITS[examType]?.[subjectKey] || 50;
                          
                          return (
                            <div key={key} className={`h-64 bg-gradient-to-br ${bgColor} rounded-xl p-3 border border-gray-200/30 dark:border-gray-700/30`}>
                              <h4 className="text-sm font-semibold text-center mb-1.5" style={{ color }}>
                                {subject}
                              </h4>
                              <ResponsiveContainer width="100%" height="87%">
                                <LineChart data={exams} margin={{ top: 5, right: 20, bottom: 30, left: 20 }}>
                                  <CartesianGrid strokeDasharray="4 4" stroke="currentColor" opacity={0.15} />
                                  <XAxis 
                                    dataKey="date" 
                                    tick={{ fontSize: 11, fontWeight: 600 }}
                                    className="text-foreground"
                                    axisLine={{ stroke: 'currentColor', opacity: 0.4 }}
                                    tickLine={{ stroke: 'currentColor', opacity: 0.4 }}
                                    angle={-30}
                                    textAnchor="end"
                                    height={40}
                                  />
                                  <YAxis 
                                    tick={{ fontSize: 11, fontWeight: 600 }}
                                    className="text-foreground"
                                    axisLine={{ stroke: 'currentColor', opacity: 0.4 }}
                                    tickLine={{ stroke: 'currentColor', opacity: 0.4 }}
                                    domain={[0, maxValue]}
                                  />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: 'hsl(var(--card))',
                                      border: '2px solid hsl(var(--border))',
                                      borderRadius: '12px',
                                      fontSize: '12px',
                                      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                                      padding: '12px'
                                    }}
                                    labelFormatter={(label, payload) => {
                                      const data = payload?.[0]?.payload;
                                      return data ? `${data.examName} - ${label}` : label;
                                    }}
                                    formatter={(value: any) => [`${Number(value).toFixed(1)} net`, 'Net Skoru']}
                                  />
                                  <Line 
                                    type="linear" 
                                    dataKey="net" 
                                    stroke={color} 
                                    strokeWidth={4}
                                    dot={{ fill: color, strokeWidth: 3, r: 6, stroke: '#ffffff' }} 
                                    activeDot={{ r: 10, stroke: color, strokeWidth: 3, fill: '#ffffff' }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          );
                        })}
                    </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* TYT Branş Denemeleri Özet Kartları - MİNİMAL */}
                {branchExamData.filter(exam => exam.examType === 'TYT').length > 0 && (
                  <Collapsible open={tytBranchSummaryExpanded} onOpenChange={setTytBranchSummaryExpanded}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300">📚 TYT Ders Özeti</h4>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg"
                          data-testid="button-toggle-tyt-branch-summary"
                        >
                          <ChevronDown className={`h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${tytBranchSummaryExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                        {branchExamData.filter(exam => exam.examType === 'TYT').map((exam, index) => (
                          <div key={index} className="bg-blue-50/60 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200/40 dark:border-blue-700/40 hover:shadow-md transition-all duration-200">
                            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 truncate">{exam.subject}</h4>
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="text-green-600 dark:text-green-400 font-semibold">✓{exam.correct}</span>
                              <span className="text-red-600 dark:text-red-400 font-semibold">✗{exam.wrong}</span>
                              <span className="text-blue-600 dark:text-blue-400 font-bold">Net:{exam.net.toFixed(1)}</span>
                            </div>
                            {exam.latestDate && (
                              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 border-t border-blue-200/30 dark:border-blue-700/30 pt-1.5">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(exam.latestDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>🕐</span>
                                    <span>{new Date(exam.latestDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* AYT Branş Denemeleri Özet Kartları - MİNİMAL */}
                {branchExamData.filter(exam => exam.examType === 'AYT').length > 0 && (
                  <Collapsible open={aytBranchSummaryExpanded} onOpenChange={setAytBranchSummaryExpanded}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-green-700 dark:text-green-300">📚 AYT Ders Özeti</h4>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg"
                          data-testid="button-toggle-ayt-branch-summary"
                        >
                          <ChevronDown className={`h-5 w-5 text-green-600 dark:text-green-400 transition-transform duration-200 ${aytBranchSummaryExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {branchExamData.filter(exam => exam.examType === 'AYT').map((exam, index) => (
                          <div key={index} className="bg-green-50/60 dark:bg-green-900/20 rounded-lg p-4 border border-green-200/40 dark:border-green-700/40 hover:shadow-md transition-all duration-200">
                            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 truncate">{exam.subject}</h4>
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="text-green-600 dark:text-green-400 font-semibold">✓{exam.correct}</span>
                              <span className="text-red-600 dark:text-red-400 font-semibold">✗{exam.wrong}</span>
                              <span className="text-green-600 dark:text-green-400 font-bold">Net:{exam.net.toFixed(1)}</span>
                            </div>
                            {exam.latestDate && (
                              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 border-t border-green-200/30 dark:border-green-700/30 pt-1.5">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(exam.latestDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>🕐</span>
                                    <span>{new Date(exam.latestDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Eksik Konular Filtre Modalı - GELİŞTİRİLMİŞ */}
      <Dialog open={showTopicsFilterModal} onOpenChange={setShowTopicsFilterModal}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-red-50/90 via-white to-orange-50/90 dark:from-red-950/60 dark:via-gray-900 dark:to-orange-950/60 backdrop-blur-xl border-2 border-red-200/50 dark:border-red-800/50 shadow-2xl">
          {/* Arka Plan Animasyonları */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-orange-500/8 to-red-500/8 rounded-full blur-3xl"></div>
          </div>
          
          <DialogHeader className="relative z-10 pb-6 border-b border-red-200/30 dark:border-red-800/30">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-xl">
                <Filter className="h-7 w-7 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  🎯 Eksik Konular - Filtreler
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-400 font-medium mt-1">
                  Filtreleri aktifleştirmek için checkbox'ları işaretleyin
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-7 mt-6 relative z-10">
            {/* Etiket Filtresi - GELİŞTİRİLMİŞ */}
            <div className="space-y-4 bg-gradient-to-br from-white/80 to-red-50/60 dark:from-gray-800/80 dark:to-red-950/40 p-5 rounded-2xl border-2 border-red-200/40 dark:border-red-800/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <Checkbox
                    id="topicsTagFilter"
                    checked={topicsFilterEnabled.tag}
                    onCheckedChange={(checked) => 
                      setTopicsFilterEnabled(prev => ({ ...prev, tag: checked as boolean }))
                    }
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-500 data-[state=checked]:to-orange-500 w-6 h-6 border-2 border-red-400 dark:border-red-600 transition-all duration-300 shadow-md"
                  />
                  {topicsFilterEnabled.tag && (
                    <div className="absolute -inset-1 bg-red-500/20 rounded-md blur animate-pulse"></div>
                  )}
                </div>
                <label htmlFor="topicsTagFilter" className="text-lg font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors cursor-pointer">
                  <span className="text-2xl">🏷️</span>
                  <span>Etiket Seçimi</span>
                </label>
              </div>
              {topicsFilterEnabled.tag && (
                <div className="ml-10 space-y-3 p-5 bg-white/70 dark:bg-gray-900/70 rounded-xl border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  {topicsFilterValues.tags.length > 0 && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/40 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-sm font-bold text-red-700 dark:text-red-300">
                        {topicsFilterResultCount > 0 
                          ? `✅ ${topicsFilterResultCount} konu bulundu`
                          : '⚠️ Henüz seçilen filtreye göre veri bulunmamaktadır'}
                      </p>
                    </div>
                  )}
                  {['Genel Deneme', 'Branş Deneme', 'Soru'].map((tag, idx) => (
                    <div key={tag} className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50/80 dark:hover:bg-red-950/40 transition-all duration-200 group/item" style={{animationDelay: `${idx * 50}ms`}}>
                      <Checkbox
                        id={`topicsTag-${tag}`}
                        checked={topicsFilterValues.tags.includes(tag)}
                        onCheckedChange={(checked) => {
                          setTopicsFilterValues(prev => ({
                            ...prev,
                            tags: checked 
                              ? [...prev.tags, tag]
                              : prev.tags.filter(t => t !== tag)
                          }));
                        }}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-500 data-[state=checked]:to-orange-500 w-5 h-5 border-2 border-red-300 dark:border-red-700 transition-all duration-200"
                      />
                      <label htmlFor={`topicsTag-${tag}`} className="text-base font-semibold text-gray-700 dark:text-gray-300 group-hover/item:text-red-600 dark:group-hover/item:text-red-400 cursor-pointer transition-colors">{tag}</label>
                      {topicsFilterValues.tags.includes(tag) && (
                        <span className="ml-auto text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full font-bold animate-in fade-in zoom-in duration-200">✓ Seçili</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ders Filtresi - GELİŞTİRİLMİŞ */}
            <div className="space-y-4 bg-gradient-to-br from-white/80 to-blue-50/60 dark:from-gray-800/80 dark:to-blue-950/40 p-5 rounded-2xl border-2 border-blue-200/40 dark:border-blue-800/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <Checkbox
                    id="topicsSubjectFilter"
                    checked={topicsFilterEnabled.subject}
                    onCheckedChange={(checked) => 
                      setTopicsFilterEnabled(prev => ({ ...prev, subject: checked as boolean }))
                    }
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 w-6 h-6 border-2 border-blue-400 dark:border-blue-600 transition-all duration-300 shadow-md"
                  />
                  {topicsFilterEnabled.subject && (
                    <div className="absolute -inset-1 bg-blue-500/20 rounded-md blur animate-pulse"></div>
                  )}
                </div>
                <label htmlFor="topicsSubjectFilter" className="text-lg font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                  <span className="text-2xl">📚</span>
                  <span>Ders Seçimi</span>
                </label>
              </div>
              {topicsFilterEnabled.subject && (
                <div className="ml-10 space-y-5 p-5 bg-white/70 dark:bg-gray-900/70 rounded-xl border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  {topicsFilterValues.subjects.length > 0 && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                        {topicsFilterResultCount > 0 
                          ? `✅ ${topicsFilterResultCount} konu bulundu`
                          : '⚠️ Henüz seçilen filtreye göre veri bulunmamaktadır'}
                      </p>
                    </div>
                  )}
                  {/* TYT Dersleri */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-300/50 dark:border-blue-700/50">
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-100/80 dark:bg-blue-900/40 rounded-full">TYT</span>
                      {topicsFilterValues.subjects.filter(s => ['Türkçe', 'Sosyal Bilimler', 'TYT Matematik', 'TYT Geometri', 'Fen Bilimleri'].includes(s)).length > 0 && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">{topicsFilterValues.subjects.filter(s => ['Türkçe', 'Sosyal Bilimler', 'TYT Matematik', 'TYT Geometri', 'Fen Bilimleri'].includes(s)).length} seçili</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['Türkçe', 'Sosyal Bilimler', 'TYT Matematik', 'TYT Geometri', 'Fen Bilimleri'].map((subject, idx) => (
                        <div key={subject} className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-all duration-200 group/item" style={{animationDelay: `${idx * 30}ms`}}>
                          <Checkbox
                            id={`topicsSubject-${subject}`}
                            checked={topicsFilterValues.subjects.includes(subject)}
                            onCheckedChange={(checked) => {
                              // TEK SEÇİM MODU EKLENECEK ->  Bir derse tıklayınca diğerlerini temizle
                              setTopicsFilterValues(prev => ({
                                ...prev,
                                subjects: checked ? [subject] : []
                              }));
                            }}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-cyan-500 w-4 h-4 border-2 border-blue-300 dark:border-blue-700 transition-all duration-200"
                          />
                          <label htmlFor={`topicsSubject-${subject}`} className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 cursor-pointer transition-colors flex-1">{subject}</label>
                          {topicsFilterValues.subjects.includes(subject) && (
                            <span className="text-blue-500 text-xs">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* AYT Dersleri */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-green-300/50 dark:border-green-700/50">
                      <span className="text-sm font-black text-green-600 dark:text-green-400 px-3 py-1 bg-green-100/80 dark:bg-green-900/40 rounded-full">AYT</span>
                      {topicsFilterValues.subjects.filter(s => ['AYT Matematik', 'AYT Geometri', 'AYT Fizik', 'AYT Kimya', 'AYT Biyoloji'].includes(s)).length > 0 && (
                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">{topicsFilterValues.subjects.filter(s => ['AYT Matematik', 'AYT Geometri', 'AYT Fizik', 'AYT Kimya', 'AYT Biyoloji'].includes(s)).length} seçili</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['AYT Matematik', 'AYT Geometri', 'AYT Fizik', 'AYT Kimya', 'AYT Biyoloji'].map((subject, idx) => (
                        <div key={subject} className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-green-50/80 dark:hover:bg-green-950/40 transition-all duration-200 group/item" style={{animationDelay: `${idx * 30}ms`}}>
                          <Checkbox
                            id={`topicsSubject-${subject}`}
                            checked={topicsFilterValues.subjects.includes(subject)}
                            onCheckedChange={(checked) => {
                              // TEK SEÇİM MODU EKLENECEK -> Bir derse tıklayınca diğerlerini temizle
                              setTopicsFilterValues(prev => ({
                                ...prev,
                                subjects: checked ? [subject] : []
                              }));
                            }}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500 w-4 h-4 border-2 border-green-300 dark:border-green-700 transition-all duration-200"
                          />
                          <label htmlFor={`topicsSubject-${subject}`} className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 cursor-pointer transition-colors flex-1">{subject}</label>
                          {topicsFilterValues.subjects.includes(subject) && (
                            <span className="text-green-500 text-xs">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tarih Filtresi - GELİŞTİRİLMİŞ */}
            <div className="space-y-4 bg-gradient-to-br from-white/80 to-purple-50/60 dark:from-gray-800/80 dark:to-purple-950/40 p-5 rounded-2xl border-2 border-purple-200/40 dark:border-purple-800/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <Checkbox
                    id="topicsDateFilter"
                    checked={topicsFilterEnabled.date}
                    onCheckedChange={(checked) => 
                      setTopicsFilterEnabled(prev => ({ ...prev, date: checked as boolean }))
                    }
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500 w-6 h-6 border-2 border-purple-400 dark:border-purple-600 transition-all duration-300 shadow-md"
                  />
                  {topicsFilterEnabled.date && (
                    <div className="absolute -inset-1 bg-purple-500/20 rounded-md blur animate-pulse"></div>
                  )}
                </div>
                <label htmlFor="topicsDateFilter" className="text-lg font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors cursor-pointer">
                  <span className="text-2xl">📅</span>
                  <span>Tarih Aralığı</span>
                </label>
              </div>
              {topicsFilterEnabled.date && (
                <div className="ml-10 space-y-4 p-5 bg-white/70 dark:bg-gray-900/70 rounded-xl border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  {(topicsFilterValues.dateFrom || topicsFilterValues.dateTo) && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                        {topicsFilterResultCount > 0 
                          ? `✅ ${topicsFilterResultCount} konu bulundu`
                          : '⚠️ Henüz seçilen filtreye göre veri bulunmamaktadır'}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <span>📍</span> Başlangıç Tarihi
                      </label>
                      <input
                        type="date"
                        value={topicsFilterValues.dateFrom}
                        onChange={(e) => setTopicsFilterValues(prev => ({ ...prev, dateFrom: e.target.value }))}
                        className="w-full px-4 py-2.5 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-800 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <span>📍</span> Bitiş Tarihi
                      </label>
                      <input
                        type="date"
                        value={topicsFilterValues.dateTo}
                        onChange={(e) => setTopicsFilterValues(prev => ({ ...prev, dateTo: e.target.value }))}
                        className="w-full px-4 py-2.5 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-800 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  {topicsFilterValues.dateFrom && topicsFilterValues.dateTo && (
                    <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        📊 Seçili Aralık: {topicsFilterValues.dateFrom} → {topicsFilterValues.dateTo}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t-2 border-red-200/30 dark:border-red-800/30 relative z-10">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {[topicsFilterEnabled.tag, topicsFilterEnabled.subject, topicsFilterEnabled.date].filter(Boolean).length > 0 ? (
                <span className="font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {[topicsFilterEnabled.tag, topicsFilterEnabled.subject, topicsFilterEnabled.date].filter(Boolean).length} filtre aktif
                </span>
              ) : (
                <span className="text-gray-400">Filtre seçilmedi</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setTopicsFilterEnabled({ tag: false, subject: false, date: false, wrongQuestions: false });
                  setTopicsFilterValues({ tags: [], subjects: [], dateFrom: '', dateTo: '', wrongQuestions: false });
                  toast({
                    title: "🔄 Filtreler Sıfırlandı",
                    description: "Tüm filtre seçimleri temizlendi",
                    duration: 3000
                  });
                }}
                className="border-2 border-yellow-400 dark:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 font-bold px-6 transition-all duration-200"
              >
                🔄 Sıfırla
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowTopicsFilterModal(false)}
                className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold px-6 transition-all duration-200"
              >
                ❌ İptal
              </Button>
              <Button
                onClick={() => {
                  setShowTopicsFilterModal(false);
                  toast({
                    title: "✅ Filtreler Uygulandı",
                    description: "Eksik konular başarıyla filtrelendi",
                    duration: 3000
                  });
                }}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                ✨ Uygula
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hata Sıklığı Filtre Modalı - GELİŞTİRİLMİŞ */}
      <Dialog open={showErrorsFilterModal} onOpenChange={setShowErrorsFilterModal}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-orange-50/90 via-white to-red-50/90 dark:from-orange-950/60 dark:via-gray-900 dark:to-red-950/60 backdrop-blur-xl border-2 border-orange-200/50 dark:border-orange-800/50 shadow-2xl">
          {/* Arka Plan Animasyonları  */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tr from-red-500/8 to-orange-500/8 rounded-full blur-3xl"></div>
          </div>
          
          <DialogHeader className="relative z-10 pb-6 border-b border-orange-200/30 dark:border-orange-800/30">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl">
                <Filter className="h-7 w-7 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                  🔥 Hata Sıklığı - Filtreler
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-400 font-medium mt-1">
                  Filtreleri aktifleştirmek için checkbox'ları işaretleyin
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-7 mt-6 relative z-10">
            {/* Etiket Filtresi - GELİŞTİRİLMİŞ */}
            <div className="space-y-4 bg-gradient-to-br from-white/80 to-orange-50/60 dark:from-gray-800/80 dark:to-orange-950/40 p-5 rounded-2xl border-2 border-orange-200/40 dark:border-orange-800/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <Checkbox
                    id="errorsTagFilter"
                    checked={errorsFilterEnabled.tag}
                    onCheckedChange={(checked) => 
                      setErrorsFilterEnabled(prev => ({ ...prev, tag: checked as boolean }))
                    }
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500 w-6 h-6 border-2 border-orange-400 dark:border-orange-600 transition-all duration-300 shadow-md"
                  />
                  {errorsFilterEnabled.tag && (
                    <div className="absolute -inset-1 bg-orange-500/20 rounded-md blur animate-pulse"></div>
                  )}
                </div>
                <label htmlFor="errorsTagFilter" className="text-lg font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors cursor-pointer">
                  <span className="text-2xl">🏷️</span>
                  <span>Etiket Seçimi</span>
                </label>
              </div>
              {errorsFilterEnabled.tag && (
                <div className="ml-10 space-y-3 p-5 bg-white/70 dark:bg-gray-900/70 rounded-xl border border-orange-200/50 dark:border-orange-800/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  {['Genel Deneme', 'Branş Deneme', 'Soru'].map((tag, idx) => (
                    <div key={tag} className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50/80 dark:hover:bg-orange-950/40 transition-all duration-200 group/item" style={{animationDelay: `${idx * 50}ms`}}>
                      <Checkbox
                        id={`errorsTag-${tag}`}
                        checked={errorsFilterValues.tags.includes(tag)}
                        onCheckedChange={(checked) => {
                          setErrorsFilterValues(prev => ({
                            ...prev,
                            tags: checked 
                              ? [...prev.tags, tag]
                              : prev.tags.filter(t => t !== tag)
                          }));
                        }}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500 w-5 h-5 border-2 border-orange-300 dark:border-orange-700 transition-all duration-200"
                      />
                      <label htmlFor={`errorsTag-${tag}`} className="text-base font-semibold text-gray-700 dark:text-gray-300 group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 cursor-pointer transition-colors">{tag}</label>
                      {errorsFilterValues.tags.includes(tag) && (
                        <span className="ml-auto text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full font-bold animate-in fade-in zoom-in duration-200">✓ Seçili</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ders Filtresi - GELİŞTİRİLMİŞ */}
            <div className="space-y-4 bg-gradient-to-br from-white/80 to-blue-50/60 dark:from-gray-800/80 dark:to-blue-950/40 p-5 rounded-2xl border-2 border-blue-200/40 dark:border-blue-800/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <Checkbox
                    id="errorsSubjectFilter"
                    checked={errorsFilterEnabled.subject}
                    onCheckedChange={(checked) => 
                      setErrorsFilterEnabled(prev => ({ ...prev, subject: checked as boolean }))
                    }
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 w-6 h-6 border-2 border-blue-400 dark:border-blue-600 transition-all duration-300 shadow-md"
                  />
                  {errorsFilterEnabled.subject && (
                    <div className="absolute -inset-1 bg-blue-500/20 rounded-md blur animate-pulse"></div>
                  )}
                </div>
                <label htmlFor="errorsSubjectFilter" className="text-lg font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                  <span className="text-2xl">📚</span>
                  <span>Ders Seçimi</span>
                </label>
              </div>
              {errorsFilterEnabled.subject && (
                <div className="ml-10 space-y-5 p-5 bg-white/70 dark:bg-gray-900/70 rounded-xl border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* TYT Dersleri */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-300/50 dark:border-blue-700/50">
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-100/80 dark:bg-blue-900/40 rounded-full">TYT</span>
                      {errorsFilterValues.subjects.filter(s => ['Türkçe', 'Sosyal Bilimler', 'TYT Matematik', 'TYT Geometri', 'Fen Bilimleri'].includes(s)).length > 0 && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">{errorsFilterValues.subjects.filter(s => ['Türkçe', 'Sosyal Bilimler', 'TYT Matematik', 'TYT Geometri', 'Fen Bilimleri'].includes(s)).length} seçili</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['Türkçe', 'Sosyal Bilimler', 'TYT Matematik', 'TYT Geometri', 'Fen Bilimleri'].map((subject, idx) => (
                        <div key={subject} className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-all duration-200 group/item" style={{animationDelay: `${idx * 30}ms`}}>
                          <Checkbox
                            id={`errorsSubject-${subject}`}
                            checked={errorsFilterValues.subjects.includes(subject)}
                            onCheckedChange={(checked) => {
                              // TEK SEÇİM MODU EKLENECEK -> Bir derse tıklayınca diğerlerini temizle
                              setErrorsFilterValues(prev => ({
                                ...prev,
                                subjects: checked ? [subject] : []
                              }));
                            }}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-cyan-500 w-4 h-4 border-2 border-blue-300 dark:border-blue-700 transition-all duration-200"
                          />
                          <label htmlFor={`errorsSubject-${subject}`} className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 cursor-pointer transition-colors flex-1">{subject}</label>
                          {errorsFilterValues.subjects.includes(subject) && (
                            <span className="text-blue-500 text-xs">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* AYT Dersleri */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-green-300/50 dark:border-green-700/50">
                      <span className="text-sm font-black text-green-600 dark:text-green-400 px-3 py-1 bg-green-100/80 dark:bg-green-900/40 rounded-full">AYT</span>
                      {errorsFilterValues.subjects.filter(s => ['AYT Matematik', 'AYT Geometri', 'AYT Fizik', 'AYT Kimya', 'AYT Biyoloji'].includes(s)).length > 0 && (
                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">{errorsFilterValues.subjects.filter(s => ['AYT Matematik', 'AYT Geometri', 'AYT Fizik', 'AYT Kimya', 'AYT Biyoloji'].includes(s)).length} seçili</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['AYT Matematik', 'AYT Geometri', 'AYT Fizik', 'AYT Kimya', 'AYT Biyoloji'].map((subject, idx) => (
                        <div key={subject} className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-green-50/80 dark:hover:bg-green-950/40 transition-all duration-200 group/item" style={{animationDelay: `${idx * 30}ms`}}>
                          <Checkbox
                            id={`errorsSubject-${subject}`}
                            checked={errorsFilterValues.subjects.includes(subject)}
                            onCheckedChange={(checked) => {
                              // TEK SEÇİM MODU EKLENECEK -> Bir derse tıklayınca diğerlerini temizle
                              setErrorsFilterValues(prev => ({
                                ...prev,
                                subjects: checked ? [subject] : []
                              }));
                            }}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500 w-4 h-4 border-2 border-green-300 dark:border-green-700 transition-all duration-200"
                          />
                          <label htmlFor={`errorsSubject-${subject}`} className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 cursor-pointer transition-colors flex-1">{subject}</label>
                          {errorsFilterValues.subjects.includes(subject) && (
                            <span className="text-green-500 text-xs">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tarih Filtresi - GELİŞTİRİLMİŞ */}
            <div className="space-y-4 bg-gradient-to-br from-white/80 to-purple-50/60 dark:from-gray-800/80 dark:to-purple-950/40 p-5 rounded-2xl border-2 border-purple-200/40 dark:border-purple-800/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <Checkbox
                    id="errorsDateFilter"
                    checked={errorsFilterEnabled.date}
                    onCheckedChange={(checked) => 
                      setErrorsFilterEnabled(prev => ({ ...prev, date: checked as boolean }))
                    }
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500 w-6 h-6 border-2 border-purple-400 dark:border-purple-600 transition-all duration-300 shadow-md"
                  />
                  {errorsFilterEnabled.date && (
                    <div className="absolute -inset-1 bg-purple-500/20 rounded-md blur animate-pulse"></div>
                  )}
                </div>
                <label htmlFor="errorsDateFilter" className="text-lg font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors cursor-pointer">
                  <span className="text-2xl">📅</span>
                  <span>Tarih Aralığı</span>
                </label>
              </div>
              {errorsFilterEnabled.date && (
                <div className="ml-10 space-y-4 p-5 bg-white/70 dark:bg-gray-900/70 rounded-xl border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <span>📍</span> Başlangıç Tarihi
                      </label>
                      <input
                        type="date"
                        value={errorsFilterValues.dateFrom}
                        onChange={(e) => setErrorsFilterValues(prev => ({ ...prev, dateFrom: e.target.value }))}
                        className="w-full px-4 py-2.5 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-800 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <span>📍</span> Bitiş Tarihi
                      </label>
                      <input
                        type="date"
                        value={errorsFilterValues.dateTo}
                        onChange={(e) => setErrorsFilterValues(prev => ({ ...prev, dateTo: e.target.value }))}
                        className="w-full px-4 py-2.5 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-800 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  {errorsFilterValues.dateFrom && errorsFilterValues.dateTo && (
                    <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        📊 Seçili Aralık: {errorsFilterValues.dateFrom} → {errorsFilterValues.dateTo}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t-2 border-orange-200/30 dark:border-orange-800/30 relative z-10">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {[errorsFilterEnabled.tag, errorsFilterEnabled.subject, errorsFilterEnabled.date].filter(Boolean).length > 0 ? (
                <span className="font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {[errorsFilterEnabled.tag, errorsFilterEnabled.subject, errorsFilterEnabled.date].filter(Boolean).length} filtre aktif
                </span>
              ) : (
                <span className="text-gray-400">Filtre seçilmedi</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setErrorsFilterEnabled({ tag: false, subject: false, date: false, wrongQuestions: false });
                  setErrorsFilterValues({ tags: [], subjects: [], dateFrom: '', dateTo: '', wrongQuestions: false });
                  toast({
                    title: "🔄 Filtreler Sıfırlandı",
                    description: "Tüm filtre seçimleri temizlendi",
                    duration: 3000
                  });
                }}
                className="border-2 border-yellow-400 dark:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 font-bold px-6 transition-all duration-200"
              >
                🔄 Sıfırla
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowErrorsFilterModal(false)}
                className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold px-6 transition-all duration-200"
              >
                ❌ İptal
              </Button>
              <Button
                onClick={() => {
                  setShowErrorsFilterModal(false);
                  toast({
                    title: "✅ Filtreler Uygulandı",
                    description: "Hata sıklığı başarıyla filtrelendi",
                    duration: 3000
                  });
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                ✨ Uygula
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tamamlanan Hatalı Konular Modalı */}
      <Dialog open={showCompletedTopicsModal} onOpenChange={setShowCompletedTopicsModal}>
        <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-y-auto" key={completedTopicsRefreshKey}>
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ✅ Tamamlanan Hatalı Konular Geçmişi
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-lg">
              Checkbox ile işaretlediğiniz ve tamamladığınız tüm konuların geçmişi
            </DialogDescription>
          </DialogHeader>
          
          {/* Filtre Butonları */}
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              onClick={() => setCompletedTopicsFilter('all')}
              variant={completedTopicsFilter === 'all' ? 'default' : 'outline'}
              className={`${completedTopicsFilter === 'all' ? 'bg-green-600 hover:bg-green-700' : ''} font-semibold`}
            >
              🔎 Tümü
            </Button>
            <Button
              onClick={() => setCompletedTopicsFilter('general')}
              variant={completedTopicsFilter === 'general' ? 'default' : 'outline'}
              className={`${completedTopicsFilter === 'general' ? 'bg-blue-600 hover:bg-blue-700' : ''} font-semibold`}
            >
              📝 Genel Deneme
            </Button>
            <Button
              onClick={() => setCompletedTopicsFilter('branch')}
              variant={completedTopicsFilter === 'branch' ? 'default' : 'outline'}
              className={`${completedTopicsFilter === 'branch' ? 'bg-purple-600 hover:bg-purple-700' : ''} font-semibold`}
            >
              📚 Branş Deneme
            </Button>
            <Button
              onClick={() => setCompletedTopicsFilter('question')}
              variant={completedTopicsFilter === 'question' ? 'default' : 'outline'}
              className={`${completedTopicsFilter === 'question' ? 'bg-orange-600 hover:bg-orange-700' : ''} font-semibold`}
            >
              ❓ Soru Hataları
            </Button>
          </div>
          
          <div className="space-y-4">
            {(() => {
              // LocalStorage'dan Eksik Olduğum Konular'dan tamamlanan konuları al
              const completedFromMissing = JSON.parse(localStorage.getItem('completedTopicsFromMissing') || '[]');
              
              // Filtreye göre filtrele
              let allCompletedRaw = [];
              if (completedTopicsFilter === 'all') {
                allCompletedRaw = completedFromMissing;
              } else if (completedTopicsFilter === 'general') {
                allCompletedRaw = completedFromMissing.filter((item: any) => item.tag === 'Genel Deneme');
              } else if (completedTopicsFilter === 'branch') {
                allCompletedRaw = completedFromMissing.filter((item: any) => item.tag === 'Branş Deneme');
              } else if (completedTopicsFilter === 'question') {
                allCompletedRaw = completedFromMissing.filter((item: any) => item.tag === 'Soru');
              }
              
              // Konu bazında grupla - aynı konu birden fazla kez eklenebilir
              const topicGroups = allCompletedRaw.reduce((acc: any, item: any) => {
                // Keyden subject ve topic bilgisini çıkar
                let subject = item.subject;
                let topic = item.topic;
                
                // Eğer subject veya topic yoksa keyden parse et
                if (!subject || !topic) {
                  const keyParts = (item.key || '').split('-');
                  if (keyParts.length >= 2) {
                    subject = subject || keyParts[0] || capitalizeSubjectName(keyParts[0]) || 'Genel';
                    topic = topic || keyParts.slice(1).join('-') || normalizeTopic(keyParts.slice(1).join('-')) || 'Konu Belirtilmemiş';
                  }
                }
                
                // Fallback değerleri
                subject = subject || item.tag || 'Genel';
                topic = topic || 'Konu Belirtilmemiş';
                const tag = item.tag || 'Genel';
                const topicKey = `${subject}-${topic}`;
                
                if (!acc[topicKey]) {
                  acc[topicKey] = {
                    subject,
                    topic,
                    tag,
                    entries: []
                  };
                }
                acc[topicKey].entries.push({
                  key: item.key,
                  completedAt: item.completedAt,
                  frequency: item.frequency || 1
                });
                return acc;
              }, {});
              
              // Her konu grubu için toplam hata sayısını hesapla
              const allCompleted = Object.values(topicGroups).map((group: any) => {
                const totalFrequency = group.entries.reduce((sum: number, entry: any) => sum + entry.frequency, 0);
                const latestEntry = group.entries.sort((a: any, b: any) => 
                  new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
                )[0];
                
                return {
                  subject: group.subject,
                  topic: group.topic,
                  tag: group.tag,
                  totalFrequency,
                  entryCount: group.entries.length,
                  latestCompletedAt: latestEntry.completedAt,
                  allEntries: group.entries
                };
              }).sort((a: any, b: any) => new Date(b.latestCompletedAt).getTime() - new Date(a.latestCompletedAt).getTime());
              
              if (allCompleted.length === 0) {
                return (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-40" />
                    <p className="text-lg">Henüz tamamlanmış konu yok</p>
                    <p className="text-sm mt-2">🎯 Eksik Olduğum Konular bölümünden konuları işaretleyerek tamamlayabilirsiniz</p>
                  </div>
                );
              }
              
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Toplam {allCompleted.length} farklı konu tamamlandı 🎉
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    {allCompleted.map((item, index) => (
                      <div 
                        key={index} 
                        className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-5 border-2 border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-full shadow-sm">
                                {item.subject}
                              </span>
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                item.tag === 'Genel Deneme' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                                item.tag === 'Branş Deneme' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' :
                                'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400'
                              }`}>
                                {item.tag === 'Genel Deneme' ? 'Genel Deneme' : 
                                 item.tag === 'Branş Deneme' ? 'Branş Deneme' : 
                                 'Soru'}
                              </span>
                            </div>
                            <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
                              {normalizeTopic(item.topic)}
                            </div>
                            
                            <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-2">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(item.latestCompletedAt).toLocaleDateString('tr-TR').replace(/\//g, '.')}{' '}{new Date(item.latestCompletedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                // LocalStorage'dan tüm bu konuya ait kayıtları sil ve state'i güncelle
                                item.allEntries.forEach((entry: any) => {
                                  const saved = localStorage.getItem('completedTopicsFromMissing');
                                  if (saved) {
                                    const arr = JSON.parse(saved);
                                    const filtered = arr.filter((e: any) => e.key !== entry.key);
                                    localStorage.setItem('completedTopicsFromMissing', JSON.stringify(filtered));
                                  }
                                  // State'ten de sil
                                  setCompletedTopics(prev => {
                                    const newSet = new Set(prev);
                                    newSet.delete(entry.key);
                                    return newSet;
                                  });
                                });
                                
                                // State güncelleme event'i tetikle
                                window.dispatchEvent(new Event('localStorageUpdate'));
                                
                                // Modalı yenile
                                setCompletedTopicsRefreshKey(prev => prev + 1);
                                
                                toast({ 
                                  title: "✅ Silindi", 
                                  description: `${item.topic} konusu tamamlananlardan kaldırıldı.`,
                                  duration: 2000
                                });
                              }}
                              className="p-2 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </button>
                            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl">
                              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Tamamlanan Hatalı Sorular Modalı */}
      <Dialog open={showCompletedErrorsModal} onOpenChange={setShowCompletedErrorsModal}>
        <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-y-auto" key={completedErrorsRefreshKey}>
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              ✅ Tamamlanan Hatalı Sorular Geçmişi
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-lg">
              Hata Sıklığı Analizi bölümünden checkbox ile işaretlediğiniz ve tamamladığınız tüm hataların geçmişi
            </DialogDescription>
          </DialogHeader>
          
          {/* Filtre Butonları */}
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              onClick={() => setCompletedErrorsFilter('all')}
              variant={completedErrorsFilter === 'all' ? 'default' : 'outline'}
              className={`${completedErrorsFilter === 'all' ? 'bg-orange-600 hover:bg-orange-700' : ''} font-semibold`}
            >
              🔎 Tümü
            </Button>
            <Button
              onClick={() => setCompletedErrorsFilter('general')}
              variant={completedErrorsFilter === 'general' ? 'default' : 'outline'}
              className={`${completedErrorsFilter === 'general' ? 'bg-blue-600 hover:bg-blue-700' : ''} font-semibold`}
            >
              📝 Genel Deneme
            </Button>
            <Button
              onClick={() => setCompletedErrorsFilter('branch')}
              variant={completedErrorsFilter === 'branch' ? 'default' : 'outline'}
              className={`${completedErrorsFilter === 'branch' ? 'bg-purple-600 hover:bg-purple-700' : ''} font-semibold`}
            >
              📚 Branş Deneme
            </Button>
            <Button
              onClick={() => setCompletedErrorsFilter('question')}
              variant={completedErrorsFilter === 'question' ? 'default' : 'outline'}
              className={`${completedErrorsFilter === 'question' ? 'bg-pink-600 hover:bg-pink-700' : ''} font-semibold`}
            >
              ❓ Soru Hataları
            </Button>
          </div>
          
          <div className="space-y-4">
            {(() => {
              // LocalStorage'dan Hata Sıklığı Analizi'nden tamamlanan hataları al
              const completedGeneralErrors = JSON.parse(localStorage.getItem('completedGeneralExamErrors') || '[]');
              const completedBranchErrors = JSON.parse(localStorage.getItem('completedBranchExamErrors') || '[]');
              const completedQuestionErrors = JSON.parse(localStorage.getItem('completedQuestionErrors') || '[]');
              
              // Tüm hataları birleştir
              let allCompletedErrorsRaw = [
                ...completedGeneralErrors,
                ...completedBranchErrors,
                ...completedQuestionErrors
              ];
              
              // Filtreye göre filtrele
              if (completedErrorsFilter === 'general') {
                allCompletedErrorsRaw = completedGeneralErrors;
              } else if (completedErrorsFilter === 'branch') {
                allCompletedErrorsRaw = completedBranchErrors;
              } else if (completedErrorsFilter === 'question') {
                allCompletedErrorsRaw = completedQuestionErrors;
              }
              
              // Konu bazında grupla
              const errorGroups = allCompletedErrorsRaw.reduce((acc: any, item: any) => {
                // Eski format  ise key'den parse et
                let subject = item.subject;
                let topic = item.topic;
                let tag = item.tag;
                let exam_type = item.exam_type || 'TYT';
                
                if (!subject || !topic) {
                  if (item.key) {
                    const parts = item.key.split('-');
                    if (parts.length >= 3) {
                      exam_type = parts[0]; // TYT veya AYT
                      subject = parts[1]; // "TYT Türkçe", "AYT Matematik"
                      topic = parts.slice(2).join('-'); //
                      
                      // Subject'i normalize et - "TYT Türkçe" -> "Türkçe"
                      subject = subject.replace(/^(TYT|AYT)\s+/, '');
                      
                      // Tag'i completedErrorsFilter'dan tahmin et
                      if (completedErrorsFilter === 'general') {
                        tag = 'Genel Deneme';
                      } else if (completedErrorsFilter === 'branch') {
                        tag = 'Branş Deneme';
                      } else if (completedErrorsFilter === 'question') {
                        tag = 'Soru';
                      } else {
                        tag = 'Soru'; // Default
                      }
                    } else {
                      // Başarısız parse atla
                      return acc;
                    }
                  } else {
                    // Key de yok atla
                    return acc;
                  }
                }
                
                const topicKey = `${subject}-${topic}`;
                
                if (!acc[topicKey]) {
                  acc[topicKey] = {
                    subject,
                    topic,
                    tag,
                    exam_type,
                    entries: []
                  };
                }
                acc[topicKey].entries.push({
                  key: item.key,
                  completedAt: item.completedAt,
                  frequency: item.frequency || 1,
                  difficulty: item.difficulty,
                  category: item.category
                });
                return acc;
              }, {});
              
              // Her konu grubu için toplam hata sayısını hesapla
              const allCompletedErrors = Object.values(errorGroups).map((group: any) => {
                const totalFrequency = group.entries.reduce((sum: number, entry: any) => sum + (entry.frequency || 1), 0);
                const latestEntry = group.entries.sort((a: any, b: any) => 
                  new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
                )[0];
                
                return {
                  subject: group.subject,
                  topic: group.topic,
                  tag: group.tag,
                  exam_type: group.exam_type,
                  totalFrequency,
                  entryCount: group.entries.length,
                  latestCompletedAt: latestEntry.completedAt,
                  difficulty: latestEntry.difficulty,
                  category: latestEntry.category,
                  allEntries: group.entries
                };
              }).sort((a: any, b: any) => new Date(b.latestCompletedAt).getTime() - new Date(a.latestCompletedAt).getTime());
              
              if (allCompletedErrors.length === 0) {
                return (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-40" />
                    <p className="text-lg">Henüz tamamlanmış hata yok</p>
                    <p className="text-sm mt-2">🔍 Hata Sıklığı Analizi bölümünden hataları işaretleyerek tamamlayabilirsiniz</p>
                  </div>
                );
              }
              
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <div className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                      Toplam {allCompletedErrors.length} farklı hata tamamlandı 🎉
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    {allCompletedErrors.map((item, index) => (
                      <div 
                        key={index} 
                        className="bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-xl p-5 border-2 border-orange-200/50 dark:border-orange-800/50 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="px-3 py-1 bg-orange-600 text-white text-sm font-bold rounded-full shadow-sm">
                                {item.exam_type} {item.subject}
                              </span>
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                item.tag === 'Genel Deneme' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                                item.tag === 'Branş Deneme' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' :
                                'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400'
                              }`}>
                                {item.tag}
                              </span>
                            </div>
                            <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
                              {normalizeTopic(item.topic)}
                            </div>
                            
                            <div className="flex gap-2 flex-wrap mb-3">
                              {item.difficulty && (
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  item.difficulty === 'kolay' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                                  item.difficulty === 'orta' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                                  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                }`}>
                                  📊 {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                                </span>
                              )}
                              {item.category && (
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium">
                                  🔍 {item.category === 'kavram' ? 'Kavram Eksikliği' :
                                      item.category === 'hesaplama' ? 'Hesaplama Hatası' :
                                      item.category === 'analiz' ? 'Analiz Sorunu' : 'Dikkatsizlik'}
                                </span>
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-2">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(item.latestCompletedAt).toLocaleDateString('tr-TR').replace(/\//g, '.')}{' '}{new Date(item.latestCompletedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                // LocalStoragedan tüm bu hataya ait kayıtları sil ve statei güncelle
                                item.allEntries.forEach((entry: any) => {
                                  if (item.tag === 'Genel Deneme') {
                                    const saved = localStorage.getItem('completedGeneralExamErrors');
                                    if (saved) {
                                      const arr = JSON.parse(saved);
                                      const filtered = arr.filter((e: any) => e.key !== entry.key);
                                      localStorage.setItem('completedGeneralExamErrors', JSON.stringify(filtered));
                                    }
                                    // Stateten de sil
                                    setCompletedExamErrors(prev => {
                                      const newMap = new Map(prev);
                                      newMap.delete(entry.key);
                                      return newMap;
                                    });
                                  } else if (item.tag === 'Branş Deneme') {
                                    const saved = localStorage.getItem('completedBranchExamErrors');
                                    if (saved) {
                                      const arr = JSON.parse(saved);
                                      const filtered = arr.filter((e: any) => e.key !== entry.key);
                                      localStorage.setItem('completedBranchExamErrors', JSON.stringify(filtered));
                                    }
                                    // Stateten de sil
                                    setCompletedExamErrors(prev => {
                                      const newMap = new Map(prev);
                                      newMap.delete(entry.key);
                                      return newMap;
                                    });
                                  } else {
                                    const saved = localStorage.getItem('completedQuestionErrors');
                                    if (saved) {
                                      const arr = JSON.parse(saved);
                                      const filtered = arr.filter((e: any) => e.key !== entry.key);
                                      localStorage.setItem('completedQuestionErrors', JSON.stringify(filtered));
                                    }
                                    // Stateten de sil
                                    setCompletedQuestionErrors(prev => {
                                      const newMap = new Map(prev);
                                      newMap.delete(entry.key);
                                      return newMap;
                                    });
                                  }
                                });

                                // State güncelleme eventi tetikle
                                window.dispatchEvent(new Event('localStorageUpdate'));
                                
                                // Modalı yenile
                                setCompletedErrorsRefreshKey(prev => prev + 1);
                                
                                toast({ 
                                  title: "✅ Silindi", 
                                  description: `${item.topic} hatası tamamlananlardan kaldırıldı.`,
                                  duration: 2000
                                });
                              }}
                              className="p-2 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </button>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
                              <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Deneme Seçme Modalı */}
      <Dialog open={showExamSelectModal} onOpenChange={setShowExamSelectModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {analysisMode === 'general' ? '📊 Genel Deneme Seç' : '📚 Branş Deneme Seç'}
            </DialogTitle>
            <DialogDescription>
              Analiz yapmak istediğiniz denemeleri seçin. Hiçbir şey seçmezseniz tüm aktif denemeler gösterilir.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {(() => {
              const activeExams = allExamResults
                .filter(exam => !exam.archived && exam.exam_scope === (analysisMode === 'general' ? 'full' : 'branch'))
                .sort((a, b) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime());
              
              const archivedExams = allExamResults
                .filter(exam => exam.archived && exam.exam_scope === (analysisMode === 'general' ? 'full' : 'branch'))
                .sort((a, b) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime());
              
              const selectedIds = analysisMode === 'general' ? selectedGeneralExamIds : selectedBranchExamIds;
              const setSelectedIds = analysisMode === 'general' ? setSelectedGeneralExamIds : setSelectedBranchExamIds;
              
              const allExams = [...activeExams, ...archivedExams];
              
              if (allExams.length === 0) {
                return (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Deneme bulunamadı</p>
                  </div>
                );
              }
              
              return (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-semibold">
                      {selectedIds.length} / {allExams.length} deneme seçildi
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIds(allExams.map(e => e.id))}
                        className="text-xs"
                      >
                        Tümünü Seç
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIds([])}
                        className="text-xs"
                      >
                        Temizle
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Aktif Denemeler */}
                    {activeExams.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                          📋 Aktif Denemeler ({activeExams.length})
                        </h4>
                        <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-2">
                          {activeExams.map((exam) => (
                            <div
                              key={exam.id}
                              onClick={() => {
                                if (selectedIds.includes(exam.id)) {
                                  setSelectedIds(selectedIds.filter(id => id !== exam.id));
                                } else {
                                  setSelectedIds([...selectedIds, exam.id]);
                                }
                              }}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedIds.includes(exam.id)
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={selectedIds.includes(exam.id)}
                                      onCheckedChange={() => {}}
                                      className="pointer-events-none"
                                    />
                                    <div>
                                      <div className="font-semibold">{exam.display_name || exam.exam_name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {new Date(exam.exam_date).toLocaleDateString('tr-TR')} • {exam.exam_type}
                                        {exam.exam_scope === 'full' && exam.tyt_net && ` • TYT Net: ${exam.tyt_net}`}
                                        {exam.exam_scope === 'full' && exam.ayt_net && ` • AYT Net: ${exam.ayt_net}`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Arşivlenen Denemeler */}
                    {archivedExams.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-2">
                          📦 Arşivlenen Denemeler ({archivedExams.length})
                        </h4>
                        <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-2">
                          {archivedExams.map((exam) => (
                            <div
                              key={exam.id}
                              onClick={() => {
                                if (selectedIds.includes(exam.id)) {
                                  setSelectedIds(selectedIds.filter(id => id !== exam.id));
                                } else {
                                  setSelectedIds([...selectedIds, exam.id]);
                                }
                              }}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedIds.includes(exam.id)
                                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                                  : 'border-amber-200 dark:border-amber-700/50 hover:border-amber-300 dark:hover:border-amber-600'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={selectedIds.includes(exam.id)}
                                      onCheckedChange={() => {}}
                                      className="pointer-events-none"
                                    />
                                    <div>
                                      <div className="font-semibold flex items-center gap-2">
                                        {exam.display_name || exam.exam_name}
                                        <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">Arşiv</span>
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {new Date(exam.exam_date).toLocaleDateString('tr-TR')} • {exam.exam_type}
                                        {exam.exam_scope === 'full' && exam.tyt_net && ` • TYT Net: ${exam.tyt_net}`}
                                        {exam.exam_scope === 'full' && exam.ayt_net && ` • AYT Net: ${exam.ayt_net}`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setShowExamSelectModal(false)}
                    >
                      İptal
                    </Button>
                    <Button
                      onClick={() => {
                        setShowExamSelectModal(false);
                        toast({
                          title: "✅ Denemeler Seçildi",
                          description: `${selectedIds.length} deneme seçildi`,
                        });
                      }}
                    >
                      Uygula
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Performans optimizasyonu için memo kullanımı
export const AdvancedCharts = memo(AdvancedChartsComponent);

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
