// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useState, useEffect, useReducer, useRef } from "react";
import { Header } from "@/bilesenler/baslik";
import { Button } from "@/bilesenler/arayuz/button";
import { Input } from "@/bilesenler/arayuz/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/bilesenler/arayuz/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/bilesenler/arayuz/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/bilesenler/arayuz/card";
import { Badge } from "@/bilesenler/arayuz/badge";
import { Volume2, VolumeX, Play, Pause, Square, RotateCcw, Clock, Timer as TimerIcon, AlarmClock, Plus, Trash2, Zap, Target, Sparkles, Moon } from "lucide-react";
import { Switch } from "@/bilesenler/arayuz/switch";
import { useToast } from "@/hooks/use-toast";
import Confetti from 'react-confetti';

interface TimerState {
  time: number; // milisaniye
  isRunning: boolean;
  laps: Array<{ id: number; time: number; split: number; }>;
  lapCounter: number;
}

type TimerAction = 
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK'; payload: number }
  | { type: 'ADD_LAP'; payload: number };

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'START':
      return { ...state, isRunning: true };
    case 'PAUSE':
      return { ...state, isRunning: false };
    case 'RESET':
      return { 
        time: 0, 
        isRunning: false, 
        laps: [], 
        lapCounter: 0 
      };
    case 'TICK':
      return { ...state, time: action.payload };
    case 'ADD_LAP':
      const previousLapTime = state.laps.length > 0 ? state.laps[state.laps.length - 1].time : 0;
      const split = action.payload - previousLapTime;
      return { 
        ...state, 
        laps: [...state.laps, { 
          id: state.lapCounter + 1, 
          time: action.payload, 
          split 
        }],
        lapCounter: state.lapCounter + 1
      };
    default:
      return state;
  }
};

interface PomodoroSettings {
  workTime: number; // dakika
  breakTime: number; // dakika
  longBreakTime: number; // dakika
  cycles: number;
}

interface AlarmSettings {
  time: string; // SS:DD format
  sound: string;
  enabled: boolean;
}

const formatTime = (ms: number, includeMs = true): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10); // saniyenin yüzde biri
  
  if (hours > 0) {
    return includeMs 
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`
      : `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return includeMs 
    ? `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`
    : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function Timer() {
  
  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(() => 
    localStorage.getItem('timer-sound-enabled') !== 'false'
  );
  const [doNotDisturb, setDoNotDisturb] = useState(() =>
    localStorage.getItem('timer-do-not-disturb') === 'true'
  );
  
  const [alarmSound, setAlarmSound] = useState(() => 
    localStorage.getItem('timer-alarm-sound') || 'beep'
  );

  // Kronometre - localStorage'dan geri yükle
  const [stopwatchState, dispatchStopwatch] = useReducer(
    timerReducer,
    {
      time: 0,
      isRunning: false,
      laps: [],
      lapCounter: 0
    },
    (initialState) => {
      const saved = localStorage.getItem('timer-stopwatch-state');
      const savedStartTime = localStorage.getItem('timer-stopwatch-start');
      
      if (saved) {
        const state = JSON.parse(saved);
        if (state.isRunning && savedStartTime) {
          // Arka planda geçen süreyi hesapla
          const startTime = parseInt(savedStartTime);
          const elapsed = Date.now() - startTime;
          return {
            ...state,
            time: elapsed
          };
        }
        return state;
      }
      
      return initialState;
    }
  );

  // Pomodoro
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(() => ({
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    cycles: 4
  }));
  
  const [pomodoroState, setPomodoroState] = useState(() => {
    const saved = localStorage.getItem('timer-pomodoro-state');
    const savedStartTime = localStorage.getItem('timer-pomodoro-start');
    
    if (saved) {
      const state = JSON.parse(saved);
      if (state.isRunning && savedStartTime) {
        // Arka planda geçen süreyi hesapla
        const startTime = parseInt(savedStartTime);
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, state.time - elapsed);
        return {
          ...state,
          time: remainingTime
        };
      }
      return state;
    }
    
    return {
      time: 25 * 60 * 1000,
      isRunning: false,
      isBreak: false,
      currentCycle: 1,
      mode: 'work' as 'work' | 'break' | 'longBreak'
    };
  });

  // Alarm ayarları
  const [alarms, setAlarms] = useState<AlarmSettings[]>(() => {
    const saved = localStorage.getItem('timer-alarms');
    return saved ? JSON.parse(saved) : [];
  });
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [activeTab, setActiveTab] = useState('stopwatch');

  // Zamanlayıcı Hedef Belirleme
  const [timerGoal, setTimerGoal] = useState<number>(0); // dakika cinsinden
  const [goalInput, setGoalInput] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [goalAchieved, setGoalAchieved] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Ses efektleri için ses bağlamı
  const playSound = (frequency = 800, duration = 200, type: 'beep' | 'lap' | 'alarm' = 'beep') => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'alarm') {
        // AAlarm sesi - seçime göre farklı tonlar
        if (alarmSound === 'chime') {
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.4);
          duration = 800;
        } else if (alarmSound === 'bell') {
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
          duration = 500;
        } else {
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        }
      } else if (type === 'lap') {
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        duration = 100;
      } else {
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      }
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  };

  // Hedef kontrolü için kronometre
  useEffect(() => {
    if (timerGoal > 0 && stopwatchState.time >= timerGoal * 60 * 1000 && !goalAchieved) {
      setGoalAchieved(true);
      setShowConfetti(true);
      playSound(1000, 1000, 'alarm');
      toast({
        title: '🎉 Tebrikler! Hedefe Ulaştın!',
        description: `${timerGoal} dakikalık hedefini başarıyla tamamladın!`,
      });
      
      // 5 saniye sonra konfeti gizle
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [stopwatchState.time, timerGoal, goalAchieved, toast]);

  // Kronometre efektleri
  useEffect(() => {
    if (stopwatchState.isRunning) {
      const startTime = Date.now() - stopwatchState.time;
      intervalRef.current = setInterval(() => {
        dispatchStopwatch({ type: 'TICK', payload: Date.now() - startTime });
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stopwatchState.isRunning, stopwatchState.time]);

  // Pomodoro etkileri
  useEffect(() => {
    let pomodoroInterval: NodeJS.Timeout | null = null;
    
    if (pomodoroState.isRunning && pomodoroState.time > 0) {
      pomodoroInterval = setInterval(() => {
        setPomodoroState(prev => {
          if (prev.time <= 1000) {
            playSound(800, 500, 'alarm');
            toast({
              title: prev.mode === 'work' ? 'Çalışma süresi bitti!' : 'Mola süresi bitti!',
              description: prev.mode === 'work' ? 'Mola zamanı!' : 'Çalışmaya devam!',
            });
            
            // Bir sonraki aşamaya otomatik geçiş
            const nextMode = prev.mode === 'work' 
              ? (prev.currentCycle >= pomodoroSettings.cycles ? 'longBreak' : 'break')
              : 'work';
            
            const nextTime = nextMode === 'work' 
              ? pomodoroSettings.workTime * 60 * 1000
              : nextMode === 'break'
              ? pomodoroSettings.breakTime * 60 * 1000
              : pomodoroSettings.longBreakTime * 60 * 1000;
            
            const nextCycle = prev.mode === 'break' || prev.mode === 'longBreak' 
              ? prev.currentCycle + 1
              : prev.currentCycle;
            
            return {
              ...prev,
              time: nextTime,
              isRunning: false,
              mode: nextMode,
              currentCycle: nextMode === 'longBreak' ? 1 : nextCycle
            };
          }
          return { ...prev, time: prev.time - 1000 };
        });
      }, 1000);
    }

    return () => {
      if (pomodoroInterval) clearInterval(pomodoroInterval);
    };
  }, [pomodoroState.isRunning, pomodoroState.time, pomodoroSettings, toast]);

  // Alarm kontrolü
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTime) {
          playSound(800, 1000, 'alarm');
          toast({
            title: 'Alarm!',
            description: `${alarm.time} alarmı çalıyor!`,
          });
          // Alarm çaldıktan sonra devre dışı bırak
          setAlarms(prev => prev.map(a => 
            a.time === alarm.time ? { ...a, enabled: false } : a
          ));
        }
      });
    };

    alarmIntervalRef.current = setInterval(checkAlarms, 1000);
    return () => {
      if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
    };
  }, [alarms, toast]);

  // Alarm sekmesi etkinleştirildiğinde mevcut zamanı otomatik doldur
  useEffect(() => {
    if (activeTab === 'alarm' && !newAlarmTime) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setNewAlarmTime(currentTime);
    }
  }, [activeTab, newAlarmTime]);

  // Ayarları localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('timer-sound-enabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('timer-do-not-disturb', doNotDisturb.toString());
  }, [doNotDisturb]);

  useEffect(() => {
    localStorage.setItem('timer-alarm-sound', alarmSound);
  }, [alarmSound]);

  useEffect(() => {
    localStorage.setItem('timer-alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Kronometre durumunu kaydet
  useEffect(() => {
    localStorage.setItem('timer-stopwatch-state', JSON.stringify(stopwatchState));
    if (stopwatchState.isRunning) {
      const startTime = Date.now() - stopwatchState.time;
      localStorage.setItem('timer-stopwatch-start', startTime.toString());
    } else {
      localStorage.removeItem('timer-stopwatch-start');
    }
  }, [stopwatchState]);

  // Pomodoro durumunu kaydet
  useEffect(() => {
    localStorage.setItem('timer-pomodoro-state', JSON.stringify(pomodoroState));
    if (pomodoroState.isRunning) {
      const startTime = Date.now();
      localStorage.setItem('timer-pomodoro-start', startTime.toString());
    } else {
      localStorage.removeItem('timer-pomodoro-start');
    }
  }, [pomodoroState]);

  // Pomodoro ayarları değiştiğinde timer'ı otomatik güncelle (çalışmıyorsa)
  useEffect(() => {
    if (!pomodoroState.isRunning) {
      setPomodoroState(prev => {
        const newTime = prev.mode === 'work' 
          ? pomodoroSettings.workTime * 60 * 1000
          : prev.mode === 'break'
          ? pomodoroSettings.breakTime * 60 * 1000
          : pomodoroSettings.longBreakTime * 60 * 1000;
        
        return { ...prev, time: newTime };
      });
    }
  }, [pomodoroSettings, pomodoroState.isRunning, pomodoroState.mode]);

  const handleStopwatchStart = () => {
    dispatchStopwatch({ type: 'START' });
    playSound();
  };

  const handleStopwatchPause = () => {
    dispatchStopwatch({ type: 'PAUSE' });
    playSound();
  };

  const handleStopwatchReset = () => {
    dispatchStopwatch({ type: 'RESET' });
    setGoalAchieved(false);
    setShowConfetti(false);
    playSound();
  };

  const setTimerGoalHandler = () => {
    const minutes = parseInt(goalInput);
    if (minutes > 0) {
      setTimerGoal(minutes);
      setGoalAchieved(false);
      toast({
        title: '🎯 Hedef Belirlendi',
        description: `${minutes} dakikalık çalışma hedefi ayarlandı!`,
      });
      setGoalInput('');
    }
  };

  const handleStopwatchLap = () => {
    dispatchStopwatch({ type: 'ADD_LAP', payload: stopwatchState.time });
    playSound(600, 100, 'lap');
  };

  const handlePomodoroStart = () => {
    setPomodoroState(prev => ({ ...prev, isRunning: true }));
    playSound();
  };

  const handlePomodoroPause = () => {
    setPomodoroState(prev => ({ ...prev, isRunning: false }));
    playSound();
  };

  const handlePomodoroReset = () => {
    setPomodoroState(prev => ({
      ...prev,
      time: pomodoroSettings.workTime * 60 * 1000,
      isRunning: false,
      mode: 'work',
      currentCycle: 1
    }));
    playSound();
  };

  const addAlarm = () => {
    if (newAlarmTime && !alarms.some(a => a.time === newAlarmTime)) {
      // Alarm zamanının geçmişte olup olmadığını kontrol et
      const now = new Date();
      const [hours, minutes] = newAlarmTime.split(':').map(Number);
      const alarmDate = new Date();
      alarmDate.setHours(hours, minutes, 0, 0);
      
      if (alarmDate <= now) {
        toast({
          title: 'Geçersiz Alarm Saati',
          description: 'Geçmiş bir saat için alarm kuramazsınız.',
          variant: 'destructive'
        });
        return;
      }
      
      setAlarms(prev => [...prev, {
        time: newAlarmTime,
        sound: alarmSound,
        enabled: true
      }]);
      setNewAlarmTime('');
    }
  };

  const removeAlarm = (time: string) => {
    setAlarms(prev => prev.filter(a => a.time !== time));
  };

  const toggleAlarm = (time: string) => {
    setAlarms(prev => prev.map(a => 
      a.time === time ? { ...a, enabled: !a.enabled } : a
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}
      <Header />
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            Sayaç Merkezi
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          </h1>
          <p className="text-lg text-muted-foreground">Pomodoro, Kronometre ve Alarm ile derse fokuslanabilir,süre ölçebilir,alarm kurabilirim.</p>
        </div>

        {/* Modern Ses Kontroller */}
        <div className="mb-8 flex items-center justify-center">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Switch 
                  checked={soundEnabled} 
                  onCheckedChange={setSoundEnabled}
                  className="data-[state=checked]:bg-primary"
                />
                <div className="flex items-center gap-2">
                  {soundEnabled ? 
                    <Volume2 className="h-5 w-5 text-primary" /> : 
                    <VolumeX className="h-5 w-5 text-muted-foreground" />
                  }
                  <span className="font-medium">Ses Efektleri</span>
                </div>
              </div>
              
              <div className="h-6 w-px bg-border" />
              
              <div className="flex items-center gap-3">
                <Switch 
                  checked={doNotDisturb} 
                  onCheckedChange={(checked) => {
                    setDoNotDisturb(checked);
                    if (checked) {
                      toast({
                        title: "🔇 Rahatsız Etmeyin Modu Aktif",
                        description: "Bilgisayarınızın tüm bildirimleri sessize alındı. Eğer tekrar açmak isterseniz Rahatsız Etmeyin kısmındaki butona tekrar dokunun.",
                        duration: 5000,
                      });
                    } else {
                      toast({
                        title: "🔊 Bildirimler Açık",
                        description: "Bilgisayarınızdaki tüm bildirimlerin sesi açıldı.",
                        duration: 3000,
                      });
                    }
                  }}
                  className="data-[state=checked]:bg-purple-600"
                />
                <div className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Rahatsız Etmeyin</span>
                </div>
              </div>
              
              <div className="h-6 w-px bg-border" />
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Alarm Sesi:</span>
                <Select value={alarmSound} onValueChange={setAlarmSound}>
                  <SelectTrigger className="w-32 border-primary/20 focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beep">🔊 Bip</SelectItem>
                    <SelectItem value="chime">🔔 Çan</SelectItem>
                    <SelectItem value="bell">🔔 Zil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-2 shadow-lg">
            <TabsTrigger 
              value="stopwatch" 
              className="flex items-center gap-2 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <TimerIcon className="h-5 w-5" />
              ⏱️ Kronometre
            </TabsTrigger>
            <TabsTrigger 
              value="pomodoro" 
              className="flex items-center gap-2 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Target className="h-5 w-5" />
              🍅 Pomodoro
            </TabsTrigger>
            <TabsTrigger 
              value="alarm" 
              className="flex items-center gap-2 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <AlarmClock className="h-5 w-5" />
              ⏰ Alarm
            </TabsTrigger>
          </TabsList>

          {/* Kronometre */}
          <TabsContent value="stopwatch" className="mt-6">
            <Card className="bg-gradient-to-br from-card/70 via-card/50 to-blue-50/30 dark:to-blue-950/30 backdrop-blur-sm border-2 border-blue-200/30 dark:border-blue-800/30 shadow-2xl">
              <CardHeader className="text-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-t-lg border-b border-blue-200/30">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                  <Zap className="h-6 w-6 text-blue-500" />
                  ⏱️ Kronometre
                </CardTitle>
                <CardDescription className="text-lg">Zaman tutma ve tur kaydetme ile performansını ölç</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-8">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="text-7xl font-mono font-bold tracking-wider bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent drop-shadow-lg">
                      {formatTime(stopwatchState.time)}
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl rounded-full opacity-60"></div>
                    
                    {/* Hedef İlerleme Göstergesi */}
                    {timerGoal > 0 && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl border border-purple-200 dark:border-purple-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">🎯 Hedef: {timerGoal} dakika</span>
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            {((stopwatchState.time / (timerGoal * 60 * 1000)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-purple-200 dark:bg-purple-800/50 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              goalAchieved 
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' 
                                : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                            }`}
                            style={{
                              width: `${Math.min(100, (stopwatchState.time / (timerGoal * 60 * 1000)) * 100)}%`
                            }}
                          />
                        </div>
                        {goalAchieved && (
                          <div className="mt-2 text-center text-green-600 dark:text-green-400 font-bold animate-bounce">
                            🎉 Tebrikler! Hedefe ulaştın! 🎉
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hedef Belirleme Bölümü */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-xl border border-yellow-200 dark:border-yellow-800/50">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Target className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-bold text-orange-800 dark:text-orange-200">Zaman Hedefi Belirle</h3>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <Input
                        type="number"
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        placeholder="Dakika"
                        className="w-24 text-center font-bold border-orange-300 focus:border-orange-500 dark:border-orange-700"
                        min="1"
                        max="1440"
                      />
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">dakika</span>
                      <Button
                        onClick={setTimerGoalHandler}
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        🎯 Hedef Ayarla
                      </Button>
                      {timerGoal > 0 && (
                        <Button
                          onClick={() => {
                            setTimerGoal(0);
                            setGoalAchieved(false);
                            setShowConfetti(false);
                            toast({
                              title: 'Hedef Temizlendi',
                              description: 'Zaman hedefi kaldırıldı.',
                            });
                          }}
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          ❌ Temizle
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4 mb-8">
                    {!stopwatchState.isRunning ? (
                      <Button 
                        onClick={handleStopwatchStart} 
                        size="lg" 
                        className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <Play className="mr-2 h-6 w-6" />
                        🚀 Başlat
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleStopwatchPause} 
                        size="lg" 
                        className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white"
                      >
                        <Pause className="mr-2 h-6 w-6" />
                        ⏸️ Duraklat
                      </Button>
                    )}
                    
                    {stopwatchState.isRunning && (
                      <Button 
                        onClick={handleStopwatchLap} 
                        size="lg" 
                        className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white"
                      >
                        <Plus className="mr-2 h-6 w-6" />
                        🏃 Tur
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handleStopwatchReset} 
                      size="lg" 
                      className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white"
                    >
                      <RotateCcw className="mr-2 h-6 w-6" />
                      🔄 Sıfırla
                    </Button>
                  </div>
                </div>

                {stopwatchState.laps.length > 0 && (
                  <div className="bg-gradient-to-br from-muted/50 to-slate-100/50 dark:to-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-blue-200/30">
                    <h3 className="font-bold text-xl mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🏁 Tur Kayıtları</h3>
                    <div className="max-h-80 overflow-y-auto space-y-3">
                      {stopwatchState.laps.map((lap, index) => (
                        <div key={lap.id} className={`flex justify-between items-center p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-102 ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-300/50' : 
                          'bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-800 dark:to-gray-800 border border-slate-200/50 dark:border-slate-700/50'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0 ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'
                            }`}>
                              {lap.id}
                            </div>
                            <span className="font-semibold">Tur {lap.id}</span>
                          </div>
                          <div className="flex gap-6">
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">Ara Zaman</div>
                              <span className="font-mono font-bold text-lg">{formatTime(lap.split)}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">Toplam</div>
                              <span className="font-mono text-muted-foreground">{formatTime(lap.time)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pomodoro */}
          <TabsContent value="pomodoro" className="mt-6">
            <Card className="bg-gradient-to-br from-card/70 via-card/50 to-red-50/30 dark:to-red-950/30 backdrop-blur-sm border-2 border-red-200/30 dark:border-red-800/30 shadow-2xl">
              <CardHeader className="text-center bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-t-lg border-b border-red-200/30">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                  <Target className="h-6 w-6 text-red-500" />
                  🍅 Pomodoro Tekniği
                </CardTitle>
                <CardDescription className="text-lg">
                  {pomodoroState.mode === 'work' && '💪 Çalışma süresi - Odaklan!'}
                  {pomodoroState.mode === 'break' && '☕ Kısa mola - Nefes al!'}
                  {pomodoroState.mode === 'longBreak' && '🏖️ Uzun mola - Dinlen!'}
                  {' - Döngü ' + pomodoroState.currentCycle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-8">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="text-7xl font-mono font-bold tracking-wider bg-gradient-to-r from-red-600 via-pink-500 to-red-700 bg-clip-text text-transparent drop-shadow-lg">
                      {formatTime(pomodoroState.time, false)}
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 blur-xl rounded-full opacity-60"></div>
                  </div>
                  
                  <div className="flex justify-center gap-3 mb-8">
                    <Badge 
                      variant={pomodoroState.mode === 'work' ? 'default' : 'secondary'}
                      className={`px-6 py-2 text-lg font-semibold ${
                        pomodoroState.mode === 'work' 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                          : pomodoroState.mode === 'break'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      }`}
                    >
                      {pomodoroState.mode === 'work' && '💪 Çalışma Zamanı'}
                      {pomodoroState.mode === 'break' && '☕ Kısa Mola'}
                      {pomodoroState.mode === 'longBreak' && '🏖️ Uzun Mola'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-center gap-4 mb-8">
                    {!pomodoroState.isRunning ? (
                      <Button 
                        onClick={handlePomodoroStart} 
                        size="lg" 
                        className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <Play className="mr-2 h-6 w-6" />
                        🚀 Başlat
                      </Button>
                    ) : (
                      <Button 
                        onClick={handlePomodoroPause} 
                        size="lg" 
                        className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white"
                      >
                        <Pause className="mr-2 h-6 w-6" />
                        ⏸️ Duraklat
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handlePomodoroReset} 
                      size="lg" 
                      className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white"
                    >
                      <RotateCcw className="mr-2 h-6 w-6" />
                      🔄 Sıfırla
                    </Button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-muted/50 to-slate-100/50 dark:to-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-red-200/30">
                  <h3 className="font-bold text-xl mb-6 text-center bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">⚙️ Ayarlar</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        💪 Çalışma (dk)
                      </label>
                      <Input
                        type="number"
                        value={pomodoroSettings.workTime}
                        onChange={(e) => setPomodoroSettings(prev => ({
                          ...prev,
                          workTime: parseInt(e.target.value) || 25
                        }))}
                        min="1"
                        max="60"
                        className="border-red-200/50 focus:border-red-500 font-mono text-center text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        ☕ Mola (dk)
                      </label>
                      <Input
                        type="number"
                        value={pomodoroSettings.breakTime}
                        onChange={(e) => setPomodoroSettings(prev => ({
                          ...prev,
                          breakTime: parseInt(e.target.value) || 5
                        }))}
                        min="1"
                        max="30"
                        className="border-green-200/50 focus:border-green-500 font-mono text-center text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        🏖️ Uzun Mola (dk)
                      </label>
                      <Input
                        type="number"
                        value={pomodoroSettings.longBreakTime}
                        onChange={(e) => setPomodoroSettings(prev => ({
                          ...prev,
                          longBreakTime: parseInt(e.target.value) || 15
                        }))}
                        min="5"
                        max="60"
                        className="border-blue-200/50 focus:border-blue-500 font-mono text-center text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        🔄 Döngü Sayısı
                      </label>
                      <Input
                        type="number"
                        value={pomodoroSettings.cycles}
                        onChange={(e) => setPomodoroSettings(prev => ({
                          ...prev,
                          cycles: parseInt(e.target.value) || 4
                        }))}
                        min="1"
                        max="10"
                        className="border-purple-200/50 focus:border-purple-500 font-mono text-center text-lg"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alarm */}
          <TabsContent value="alarm" className="mt-6">
            <Card className="bg-gradient-to-br from-card/70 via-card/50 to-orange-50/30 dark:to-orange-950/30 backdrop-blur-sm border-2 border-orange-200/30 dark:border-orange-800/30 shadow-2xl">
              <CardHeader className="text-center bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-t-lg border-b border-orange-200/30">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                  <AlarmClock className="h-6 w-6 text-orange-500" />
                  ⏰ Alarm Merkezi
                </CardTitle>
                <CardDescription className="text-lg">Alarm kur ve zamanında uyarı al</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-8">
                <div className="bg-gradient-to-r from-orange-100/50 to-yellow-100/50 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-xl p-6 backdrop-blur-sm border border-orange-200/50">
                  <h3 className="font-bold text-lg mb-4 text-center text-orange-700 dark:text-orange-300">➕ Yeni Alarm Ekle</h3>
                  <div className="flex gap-4">
                    <Input
                      type="time"
                      value={newAlarmTime}
                      onChange={(e) => setNewAlarmTime(e.target.value)}
                      onClick={() => {
                        if (!newAlarmTime) {
                          const now = new Date();
                          const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                          setNewAlarmTime(currentTime);
                        }
                      }}
                      placeholder="HH:MM"
                      className="text-2xl font-mono text-center border-orange-200/50 focus:border-orange-500 bg-white/70 dark:bg-slate-800/70"
                    />
                    <Button 
                      onClick={addAlarm} 
                      disabled={!newAlarmTime}
                      className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      🔔 Ekle
                    </Button>
                  </div>
                </div>

                {alarms.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl text-center bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">📅 Aktif Alarmlar</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {alarms.map((alarm, index) => (
                        <div key={alarm.time} className={`flex items-center justify-between p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-102 ${
                          alarm.enabled 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 border-2 border-green-300/50' 
                            : 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800/50 dark:to-slate-800/50 border-2 border-gray-300/50'
                        }`}>
                          <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${
                              alarm.enabled ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gray-400 text-white'
                            }`}>
                              ⏰
                            </div>
                            <div>
                              <div className="text-3xl font-mono font-bold text-foreground">
                                {alarm.time}
                              </div>
                              <Badge 
                                variant={alarm.enabled ? 'default' : 'secondary'}
                                className={`mt-1 ${
                                  alarm.enabled 
                                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white' 
                                    : 'bg-gray-400 text-white'
                                }`}
                              >
                                🔊 {alarm.sound}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-2">
                              <Switch
                                checked={alarm.enabled}
                                onCheckedChange={() => toggleAlarm(alarm.time)}
                                className="data-[state=checked]:bg-green-500"
                              />
                              <span className="text-xs font-medium">
                                {alarm.enabled ? '🟢 Aktif' : '🔴 Pasif'}
                              </span>
                            </div>
                            <Button 
                              size="lg" 
                              variant="destructive"
                              onClick={() => removeAlarm(alarm.time)}
                              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {alarms.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⏰</div>
                    <h3 className="text-xl font-bold text-muted-foreground mb-2">Henüz Alarm Yok</h3>
                    <p className="text-muted-foreground">Ekle butonu ile yeni bir alarm ekleyerek başla!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
