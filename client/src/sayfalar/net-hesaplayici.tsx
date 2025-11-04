// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useState } from "react";
import { Header } from "@/bilesenler/baslik";
import { Calculator, TrendingUp, BookOpen, Brain, BarChart2, FlaskConical } from "lucide-react";
import { Input } from "@/bilesenler/arayuz/input";
import { Label } from "@/bilesenler/arayuz/label";
import { Checkbox } from "@/bilesenler/arayuz/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/bilesenler/arayuz/card";
import { Progress } from "@/bilesenler/arayuz/progress";
import { Separator } from "@/bilesenler/arayuz/separator";

interface TYTData {
  Türkçe: { dogru: number; yanlis: number; };
  sosyal: { dogru: number; yanlis: number; };
  matematik: { dogru: number; yanlis: number; };
  fenBilimleri: { dogru: number; yanlis: number; };
}

interface AYTData {
  matematik: { dogru: number; yanlis: number; };
  fizik: { dogru: number; yanlis: number; };
  kimya: { dogru: number; yanlis: number; };
  biyoloji: { dogru: number; yanlis: number; };
}

interface OBPData {
  diplomaNotu: number;
  gecenSeneYerlesti: boolean;
}

export default function NetCalculator() {
  
  const [tytData, setTytData] = useState<TYTData>({
    Türkçe: { dogru: 0, yanlis: 0 },
    sosyal: { dogru: 0, yanlis: 0 },
    matematik: { dogru: 0, yanlis: 0 },
    fenBilimleri: { dogru: 0, yanlis: 0 }
  });

  const [aytData, setAytData] = useState<AYTData>({
    matematik: { dogru: 0, yanlis: 0 },
    fizik: { dogru: 0, yanlis: 0 },
    kimya: { dogru: 0, yanlis: 0 },
    biyoloji: { dogru: 0, yanlis: 0 }
  });

  const [obpData, setObpData] = useState<OBPData>({
    diplomaNotu: 85,
    gecenSeneYerlesti: false
  });

  // Bir konu için net hesaplayın
  const calculateNet = (dogru: number, yanlis: number): number => {
    return Math.max(0, dogru - (yanlis / 4));
  };

  // TYT toplam neti hesaplayın
  const calculateTYTNet = (): number => {
    return Object.values(tytData).reduce((total, subject) => {
      return total + calculateNet(subject.dogru, subject.yanlis);
    }, 0);
  };

  // AYT toplam neti hesaplayın
  const calculateAYTNet = (): number => {
    return Object.values(aytData).reduce((total, subject) => {
      return total + calculateNet(subject.dogru, subject.yanlis);
    }, 0);
  };

  // OBP'yi hesaplayın (YKS standardı: diploma * 5, max 500)
  const calculateOBP = (): number => {
    let obp = (obpData.diplomaNotu / 100) * 500;
    if (obpData.gecenSeneYerlesti) {
      obp = obp / 2;
    }
    return Math.min(500, Math.max(0, obp));
  };

  // Girdi doğrulama
  const validateInput = (subject: string, value: number, section: 'tyt' | 'ayt'): number => {
    const maxValues: Record<string, number> = {
      // TYT sınırları
      'tyt-Türkçe': 40,
      'tyt-sosyal': 20, 
      'tyt-matematik': 30,
      'tyt-geometri': 10,
      'tyt-fenBilimleri': 20,
      // AYT sınırları
      'ayt-matematik': 30,
      'ayt-geometri': 10,
      'ayt-fizik': 14,
      'ayt-kimya': 13,
      'ayt-biyoloji': 13
    };
    
    const key = `${section}-${subject}`;
    const max = maxValues[key] || 40;
    return Math.min(Math.max(0, value), max);
  };

  // Tüm verileri sıfırla
  const resetAllData = () => {
    setTytData({
      Türkçe: { dogru: 0, yanlis: 0 },
      sosyal: { dogru: 0, yanlis: 0 },
      matematik: { dogru: 0, yanlis: 0 },
      fenBilimleri: { dogru: 0, yanlis: 0 }
    });
    setAytData({
      matematik: { dogru: 0, yanlis: 0 },
      fizik: { dogru: 0, yanlis: 0 },
      kimya: { dogru: 0, yanlis: 0 },
      biyoloji: { dogru: 0, yanlis: 0 }
    });
    setObpData({
      diplomaNotu: 85,
      gecenSeneYerlesti: false
    });
  };

  const tytNet = calculateTYTNet();
  const aytNet = calculateAYTNet();
  const obp = calculateOBP();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Sayfa Başlığı */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center">
            <Calculator className="h-8 w-8 mr-3 text-primary" />
            Net Hesaplama
          </h1>
          <p className="text-muted-foreground">TYT ve AYT netlerimi burda hesaplayıp OBP'mi görebileceğim sayfa</p>
        </div>

        {/* OBP Bölümü - yukarı taşındı */}
        <Card className="mb-8 shadow-xl border-purple-300 dark:border-purple-800/50 hover:shadow-2xl transition-all duration-500 ring-1 ring-purple-200 dark:ring-purple-800/30">
          <CardHeader className="bg-gradient-to-r from-purple-800 via-purple-900 to-purple-950 text-white rounded-t-lg shadow-lg">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <BookOpen className="h-6 w-6" />
              Ortaöğretim Başarı Puanı (OBP)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="diploma-notu">Diploma Notu</Label>
                  <Input
                    id="diploma-notu"
                    type="number"
                    min="0"
                    max="100"
                    value={obpData.diplomaNotu}
                    onChange={(e) => setObpData(prev => ({...prev, diplomaNotu: parseFloat(e.target.value) || 0}))}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gecen-sene"
                    checked={obpData.gecenSeneYerlesti}
                    onCheckedChange={(checked) => setObpData(prev => ({...prev, gecenSeneYerlesti: checked as boolean}))}
                  />
                  <Label htmlFor="gecen-sene" className="text-sm">
                    Geçen Sene Bir Bölüme Yerleştim (OBP yarıya düşer)
                  </Label>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{obp.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Hesaplanan OBP</div>
                  <Progress value={(obp / 500) * 100} className="mt-2 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* TYT Bölümü */}
          <Card className="shadow-xl border-purple-300 dark:border-purple-800/50 hover:shadow-2xl transition-all duration-500 ring-1 ring-purple-200 dark:ring-purple-800/30">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white rounded-t-lg shadow-lg">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Calculator className="h-6 w-6" />
                TYT Puan Hesaplama
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(tytData).map(([subject, data]) => {
                const subjectDisplayName = {
                  'Türkçe': 'Türkçe',
                  'sosyal': 'Sosyal Bilimler',
                  'matematik': 'Matematik',
                  'fenBilimleri': 'Fen Bilimleri'
                }[subject] || subject;
                
                const subjectIcon = {
                  'Türkçe': <BookOpen className="h-4 w-4" />,
                  'sosyal': <Brain className="h-4 w-4" />,
                  'matematik': <BarChart2 className="h-4 w-4" />,
                  'fenBilimleri': <FlaskConical className="h-4 w-4" />
                }[subject];
                
                return (
                <div key={subject} className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 rounded-xl border border-purple-200 dark:border-purple-800/50 shadow-md hover:shadow-lg transition-all duration-300">
                  <Label className="text-sm font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    {subjectIcon}
                    {subjectDisplayName}
                  </Label>
                  <div className="grid grid-cols-5 gap-3 items-center">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-purple-600 dark:text-purple-400">Doğru</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={data.dogru}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0;
                          const currentYanlis = data.yanlis;
                          const maxValues: Record<string, number> = {
                            'Türkçe': 40, 'sosyal': 20, 'matematik': 40, 'fenBilimleri': 20
                          };
                          const maxQuestions = maxValues[subject] || 40;
                          
                          // Doğru + Yanlış toplamı max'ı geçemesin
                          const validatedValue = Math.min(Math.max(0, newValue), maxQuestions - currentYanlis);
                          
                          setTytData(prev => ({
                            ...prev,
                            [subject]: { ...prev[subject as keyof TYTData], dogru: validatedValue }
                          }));
                        }}
                        className="h-12 text-center text-lg font-semibold border-purple-300 focus:border-purple-500 dark:border-purple-700 dark:focus:border-purple-400 rounded-lg bg-white dark:bg-purple-950/30 placeholder:text-purple-400 shadow-sm hover:shadow-md transition-all"
                        data-testid={`tyt-${subject}-dogru`}
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer group">
                        <span className="text-xl group-hover:scale-125 transition-transform">−</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-purple-600 dark:text-purple-400">Yanlış</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={data.yanlis}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0;
                          const currentDogru = data.dogru;
                          const maxValues: Record<string, number> = {
                            'Türkçe': 40, 'sosyal': 20, 'matematik': 40, 'fenBilimleri': 20
                          };
                          const maxQuestions = maxValues[subject] || 40;
                          
                          // Doğru + Yanlış toplamı max'ı geçemesin
                          const validatedValue = Math.min(Math.max(0, newValue), maxQuestions - currentDogru);
                          
                          setTytData(prev => ({
                            ...prev,
                            [subject]: { ...prev[subject as keyof TYTData], yanlis: validatedValue }
                          }));
                        }}
                        className="h-12 text-center text-lg font-semibold border-purple-300 focus:border-purple-500 dark:border-purple-700 dark:focus:border-purple-400 rounded-lg bg-white dark:bg-purple-950/30 placeholder:text-purple-400 shadow-sm hover:shadow-md transition-all"
                        data-testid={`tyt-${subject}-yanlis`}
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer group">
                        <span className="text-xl group-hover:scale-125 transition-transform">=</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-purple-600 dark:text-purple-400">Net</label>
                      <div className="h-12 flex items-center justify-center text-lg font-bold text-purple-800 dark:text-purple-200 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/60 dark:to-purple-800/60 rounded-lg border border-purple-300 dark:border-purple-700 shadow-sm">
                        {calculateNet(data.dogru, data.yanlis).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold">Toplam TYT Net:</span>
                <span className="text-lg font-bold text-blue-600">{tytNet.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* AYT Bölümü */}
          <Card className="shadow-xl border-purple-300 dark:border-purple-800/50 hover:shadow-2xl transition-all duration-500 ring-1 ring-purple-200 dark:ring-purple-800/30">
            <CardHeader className="bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 text-white rounded-t-lg shadow-lg">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <TrendingUp className="h-6 w-6" />
                AYT Puan Hesaplama (Sayısal)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(aytData).map(([subject, data]) => {
                const subjectDisplayName = {
                  'matematik': 'Matematik',
                  'fizik': 'Fizik',
                  'kimya': 'Kimya',
                  'biyoloji': 'Biyoloji'
                }[subject] || subject;
                
                const subjectIcon = {
                  'matematik': <BarChart2 className="h-4 w-4" />,
                  'fizik': <FlaskConical className="h-4 w-4" />,
                  'kimya': <FlaskConical className="h-4 w-4" />,
                  'biyoloji': <Brain className="h-4 w-4" />
                }[subject];
                
                return (
                <div key={subject} className="space-y-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 rounded-xl border border-green-200 dark:border-green-800/50 shadow-md hover:shadow-lg transition-all duration-300">
                  <Label className="text-sm font-semibold flex items-center gap-2 text-green-700 dark:text-green-300">
                    {subjectIcon}
                    {subjectDisplayName}
                  </Label>
                  <div className="grid grid-cols-5 gap-3 items-center">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-green-600 dark:text-green-400">Doğru</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={data.dogru}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0;
                          const currentYanlis = data.yanlis;
                          const maxValues: Record<string, number> = {
                            'matematik': 40, 'fizik': 14, 'kimya': 13, 'biyoloji': 13
                          };
                          const maxQuestions = maxValues[subject] || 40;
                          
                          // Doğru + Yanlış toplamı max'ı geçemesin
                          const validatedValue = Math.min(Math.max(0, newValue), maxQuestions - currentYanlis);
                          
                          setAytData(prev => ({
                            ...prev,
                            [subject]: { ...prev[subject as keyof AYTData], dogru: validatedValue }
                          }));
                        }}
                        className="h-12 text-center text-lg font-semibold border-green-300 focus:border-green-500 dark:border-green-700 dark:focus:border-green-400 rounded-lg bg-white dark:bg-green-950/30 placeholder:text-green-400 shadow-sm hover:shadow-md transition-all"
                        data-testid={`ayt-${subject}-dogru`}
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer group">
                        <span className="text-xl group-hover:scale-125 transition-transform">−</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-green-600 dark:text-green-400">Yanlış</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={data.yanlis}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0;
                          const currentDogru = data.dogru;
                          const maxValues: Record<string, number> = {
                            'matematik': 40, 'fizik': 14, 'kimya': 13, 'biyoloji': 13
                          };
                          const maxQuestions = maxValues[subject] || 40;
                          
                          // Doğru + Yanlış toplamı max'ı geçemesin
                          const validatedValue = Math.min(Math.max(0, newValue), maxQuestions - currentDogru);
                          
                          setAytData(prev => ({
                            ...prev,
                            [subject]: { ...prev[subject as keyof AYTData], yanlis: validatedValue }
                          }));
                        }}
                        className="h-12 text-center text-lg font-semibold border-green-300 focus:border-green-500 dark:border-green-700 dark:focus:border-green-400 rounded-lg bg-white dark:bg-green-950/30 placeholder:text-green-400 shadow-sm hover:shadow-md transition-all"
                        data-testid={`ayt-${subject}-yanlis`}
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer group">
                        <span className="text-xl group-hover:scale-125 transition-transform">=</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-green-600 dark:text-green-400">Net</label>
                      <div className="h-12 flex items-center justify-center text-lg font-bold text-green-800 dark:text-green-200 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/60 dark:to-green-800/60 rounded-lg border border-green-300 dark:border-green-700 shadow-sm">
                        {calculateNet(data.dogru, data.yanlis).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold">Toplam AYT Net:</span>
                <span className="text-lg font-bold text-green-600">{aytNet.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sonuçlar Özeti - büyütülmüş ve ortalanmış */}
        <div className="flex justify-center">
          <Card className="mb-8 shadow-2xl border-purple-400 dark:border-purple-700/50 hover:shadow-purple-500/25 transition-all duration-500 ring-2 ring-purple-300 dark:ring-purple-800/40 w-full max-w-5xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white rounded-t-lg shadow-xl py-8">
              <CardTitle className="flex items-center justify-center text-white text-2xl">
                <TrendingUp className="h-8 w-8 mr-3" />
                Sonuçlar Özeti
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{tytNet.toFixed(2)}</div>
                  <div className="text-lg font-medium text-muted-foreground mb-4">TYT Net</div>
                  <Progress value={(tytNet / 120) * 100} className="h-3" />
                  <div className="text-sm text-muted-foreground mt-2">/ 120 sorudan</div>
                </div>
                <div className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 rounded-xl p-6 border border-green-200 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl font-bold text-green-600 mb-2">{aytNet.toFixed(2)}</div>
                  <div className="text-lg font-medium text-muted-foreground mb-4">AYT Net</div>
                  <Progress value={(aytNet / 80) * 100} className="h-3" />
                  <div className="text-sm text-muted-foreground mt-2">/ 80 sorudan</div>
                </div>
                <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 rounded-xl p-6 border border-purple-200 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{obp.toFixed(2)}</div>
                  <div className="text-lg font-medium text-muted-foreground mb-4">OBP</div>
                  <Progress value={(obp / 500) * 100} className="h-3" />
                  <div className="text-sm text-muted-foreground mt-2">/ 500 puan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
