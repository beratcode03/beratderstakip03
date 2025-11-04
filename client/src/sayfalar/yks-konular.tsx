// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useState, createElement } from "react";
import { Header } from "@/bilesenler/baslik";
import { tytTopics, aytTopics, type SubjectTopics } from "@/data/yks-konular";
import { BookOpen, Award, AlertCircle } from "lucide-react";

// Önemli konular mapping
const importantTopicsMap: { [key: string]: string[] } = {
  "TYT Türkçe": ["Paragraf"],
  "TYT Matematik": ["Problemler"],
  "TYT Geometri": ["Açılar ve Üçgenler"],
  "TYT Fizik": ["Kuvvet ve Hareket"],
  "TYT Kimya": ["Periyodik Tablo", "Kimyasal Türler Arası Etkileşimler"],
  "TYT Biyoloji": ["Hücre ve Organelleri"],
  "AYT Matematik": ["Limit", "Türev", "İntegral", "Trigonometri"],
  "AYT Geometri": ["Doğruda ve Üçgende Açı", "Özel Üçgenler", "Noktanın Analitiği", "Doğrunun Analitiği"],
  "AYT Fizik": ["İndüksiyon, Alternatif Akım ve Transformatörler", "Atom Fiziğine Giriş ve Radyoaktivite", "Modern Fizik", "Modern Fiziğin Teknolojideki Uygulamaları"],
  "AYT Kimya": ["Kimya ve Elektrik", "Organik Kimya"],
  "AYT Biyoloji": ["Sinir Sistemi", "Endokrin Sistem", "Duyu Organları", "Destek ve Hareket Sistemi", "Sindirim Sistemi", "Dolaşım Sistemi", "Solunum Sistemi", "Üriner Sistem"],
};

export default function YKSKonular() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectTopics | null>(tytTopics[0]);

  const getYears = (topics: SubjectTopics) => {
    if (topics.topics.length === 0) return [];
    const firstTopic = topics.topics[0];
    return Object.keys(firstTopic.years).sort((a, b) => parseInt(b) - parseInt(a));
  };

  const getTotalByYear = (topics: SubjectTopics) => {
    const years = getYears(topics);
    const totals: { [year: string]: number } = {};
    
    years.forEach(year => {
      let total = 0;
      topics.topics.forEach(topic => {
        const value = topic.years[year];
        if (value !== "−" && value !== "" && value !== null && value !== undefined) {
          total += typeof value === 'number' ? value : parseInt(value as string) || 0;
        }
      });
      totals[year] = total;
    });
    
    return totals;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Kenar çubuğu - Sol taraf konuları */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-card/95 backdrop-saturate-150 rounded-2xl border border-border/60 shadow-xl p-6 sticky top-4">
              {/* Simgeli Başlık */}
              <div className="mb-7 pb-5 border-b border-border/50">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-gradient-to-br from-primary via-purple-600 to-purple-700 rounded-2xl shadow-lg shadow-primary/30">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground tracking-tight">Dersler</h2>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Hangi yıl hangi konudan kaç soru çıkmış görebileceğim alan</p>
                  </div>
                </div>
              </div>
              
              {/* TYT ALANI */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest">TYT Konuları</h3>
                </div>
                <div className="space-y-2">
                  {tytTopics.map((subject) => (
                    <button
                      key={subject.name}
                      onClick={() => setSelectedSubject(subject)}
                      className={`group relative w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-3 overflow-hidden ${
                        selectedSubject?.name === subject.name
                          ? `bg-gradient-to-r ${subject.color} text-white shadow-xl shadow-${subject.color.split('-')[1]}-500/25 ring-2 ring-white/20`
                          : "bg-gradient-to-br from-secondary/70 to-secondary/50 hover:from-secondary hover:to-secondary/70 text-foreground hover:shadow-md"
                      }`}
                    >
                      <div className="text-2xl transition-transform group-hover:scale-110">
                        {subject.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-sm block">{subject.name.replace('TYT ', '')}</span>
                      </div>
                      {selectedSubject?.name === subject.name && (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* tytyi aytden bölen kısımü */}
              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="px-4 bg-card">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-purple-600 shadow-lg"></div>
                  </div>
                </div>
              </div>

              {/* AYT Bölümü */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-1 bg-gradient-to-b from-purple-600 to-purple-600/50 rounded-full"></div>
                  <h3 className="text-xs font-bold text-purple-600 uppercase tracking-widest">AYT Konuları</h3>
                </div>
                <div className="space-y-2">
                  {aytTopics.map((subject) => (
                    <button
                      key={subject.name}
                      onClick={() => setSelectedSubject(subject)}
                      className={`group relative w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-3 overflow-hidden ${
                        selectedSubject?.name === subject.name
                          ? `bg-gradient-to-r ${subject.color} text-white shadow-xl shadow-${subject.color.split('-')[1]}-500/25 ring-2 ring-white/20`
                          : "bg-gradient-to-br from-secondary/70 to-secondary/50 hover:from-secondary hover:to-secondary/70 text-foreground hover:shadow-md"
                      }`}
                    >
                      <div className="text-2xl transition-transform group-hover:scale-110">
                        {subject.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-sm block">{subject.name.replace('AYT ', '')}</span>
                      </div>
                      {selectedSubject?.name === subject.name && (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ana içerik  */}
          <div className="flex-1">
            {selectedSubject && (
              <div className="bg-card/95 backdrop-saturate-150 rounded-2xl border border-border/60 shadow-xl overflow-hidden">
                {/* Başlık */}
                <div className="relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${selectedSubject.color} opacity-95`}></div>
                  <div className="relative p-8">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-white/20 rounded-2xl shadow-lg border border-white/20">
                        <span className="text-4xl">{selectedSubject.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-1">{selectedSubject.name}</h2>
                        <p className="text-white/90 text-sm font-medium flex items-center gap-2">
                          <span className="inline-block w-1 h-1 bg-white/70 rounded-full"></span>
                          Yıllara Göre Soru Dağılımı & İstatistik Analizi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Önemli Konular Uyarısı */}
                {importantTopicsMap[selectedSubject.name] && importantTopicsMap[selectedSubject.name].length > 0 && (
                  <div className="mx-8 mt-6 mb-4">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-400/60 dark:border-amber-600/60 rounded-xl p-5 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="p-2.5 bg-amber-500/20 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-amber-900 dark:text-amber-200 text-base mb-2 flex items-center gap-2">
                            ⭐ En Çok Değer Verilmesi Gereken Konular
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {importantTopicsMap[selectedSubject.name].map((topic, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3.5 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-lg text-sm font-semibold border border-amber-300 dark:border-amber-700 shadow-sm"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`bg-gradient-to-r ${selectedSubject.color} bg-opacity-10`}>
                        <th className="px-6 py-5 text-left font-bold text-sm text-foreground sticky left-0 bg-card/95 z-10 border-r border-border/30">
                          <div className="flex items-center gap-2">
                            <div className={`w-1 h-6 bg-gradient-to-b ${selectedSubject.color} rounded-full`}></div>
                            KONU BAŞLIĞI
                          </div>
                        </th>
                        {getYears(selectedSubject).map((year, idx) => (
                          <th key={year} className={`px-5 py-5 text-center font-bold text-sm min-w-[95px] ${
                            idx === 0 ? 'text-primary' : 'text-foreground'
                          }`}>
                            <div className="flex flex-col items-center gap-1.5">
                              <span className={idx === 0 ? 'text-base' : ''}>{year}</span>
                              {idx === 0 && <div className={`w-10 h-1 bg-gradient-to-r ${selectedSubject.color} rounded-full`}></div>}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSubject.topics.map((topic, index) => (
                        <tr 
                          key={index} 
                          className={`group border-b border-border/50 transition-all ${
                            index % 2 === 0 ? 'bg-background/50 hover:bg-muted/40' : 'bg-muted/20 hover:bg-muted/50'
                          }`}
                        >
                          <td className="px-6 py-4 font-semibold text-sm text-foreground sticky left-0 bg-inherit z-10 border-r border-border/30">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${selectedSubject.color} opacity-70 group-hover:opacity-100 transition-opacity`}></div>
                              {topic.topic}
                            </div>
                          </td>
                          {getYears(selectedSubject).map((year, idx) => (
                            <td key={year} className="px-5 py-4 text-center">
                              {topic.years[year] === "−" || !topic.years[year] ? (
                                <span className="text-muted-foreground/40 font-light">−</span>
                              ) : (
                                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl font-bold text-sm transition-all ${
                                  idx === 0 
                                    ? `bg-gradient-to-br ${selectedSubject.color} text-white shadow-md hover:shadow-lg hover:scale-105` 
                                    : 'text-foreground bg-secondary hover:bg-secondary/80'
                                }`}>
                                  {topic.years[year]}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                      
                      {/* Toplam Satır */}
                      <tr className={`bg-gradient-to-r ${selectedSubject.color} font-bold`}>
                        <td className="px-6 py-6 text-sm text-white sticky left-0 z-10 bg-inherit border-r border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white/20 rounded-lg">
                              <Award className="w-5 h-5" />
                            </div>
                            <span className="text-base tracking-wide">TOPLAM SORU SAYISI</span>
                          </div>
                        </td>
                        {getYears(selectedSubject).map((year, idx) => (
                          <td key={year} className="px-5 py-6 text-center">
                            <div className={`inline-flex items-center justify-center min-w-[45px] h-11 px-4 rounded-xl font-bold text-base shadow-lg transition-transform hover:scale-105 ${
                              idx === 0 
                                ? 'bg-white text-primary' 
                                : 'bg-white/25 text-white border border-white/30'
                            }`}>
                              {getTotalByYear(selectedSubject)[year]}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* en alttaki footer */}
                <div className="relative px-6 py-5 bg-gradient-to-r from-muted/40 via-muted/30 to-muted/40 border-t border-border/50">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                      <span className="font-semibold text-foreground">Not:</span>
                      <span>Tabloda <span className="font-mono text-foreground/80">"−"</span> işareti o yıl konudan soru çıkmadığını gösterir.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
