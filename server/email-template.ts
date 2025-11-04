// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
export function generateModernEmailTemplate(data: {
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  totalEmpty: number;
  successRate: string;
  recentExams: any[];
  generalExams: any[];
  branchExams: any[];
  tasks: any[];
  completedTasks: number;
  totalActivities: number;
  activityMotivation: string;
  activityColor: string;
  longestStreak: number;
  wrongTopicsCount: number;
  completedTopics: number;
  maxTytNet: any;
  maxAytNet: any;
  branchRecords: any;
  mostQuestionsDate: string;
  mostQuestionsCount: number;
  mostWrongSubjects: any[];
  mostSolvedSubjects: any[];
  mostCorrectSubjects: any[];
  examSubjectNets: any[];
  completedTopicsHistory: any[];
  completedQuestionsHistory: any[];
  isManualRequest: boolean;
}) {
  // Calculate days until end of month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysUntilEndOfMonth = Math.ceil(
    (lastDayOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  const {
    totalQuestions,
    totalCorrect,
    totalWrong,
    totalEmpty,
    successRate,
    recentExams,
    generalExams,
    branchExams,
    tasks,
    completedTasks,
    totalActivities,
    activityMotivation,
    activityColor,
    longestStreak,
    wrongTopicsCount,
    completedTopics,
    maxTytNet,
    maxAytNet,
    branchRecords,
    mostQuestionsDate,
    mostQuestionsCount,
    mostWrongSubjects,
    mostSolvedSubjects,
    mostCorrectSubjects,
    examSubjectNets,
    completedTopicsHistory,
    completedQuestionsHistory,
    isManualRequest,
  } = data;

  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Aylık Çalışma Raporum</title>
    </head>
    <body style="margin: 0; padding: 20px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: white;">
      
      <!-- Ana Konteyner - Kalın gradient border -->
      <div style="max-width: 720px; width: 100%; margin: 0 auto; background: white; border-radius: 24px; overflow: visible; box-shadow: 0 30px 90px rgba(0,0,0,0.4); padding: 20px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 12%, #9333ea 25%, #7c3aed 37%, #2563eb 50%, #10b981 62%, #ec4899 75%, #c084fc 87%, #a855f7 100%);">
        <div style="background: white; border-radius: 12px; overflow: visible;">
        
        <!-- ATATÜRK SECTION - Dış kenarlıkla bitişik çerçeve (email-safe) -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding: 0; background: white;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background: white;">
                    <img src="cid:turkbayragi" alt="Türk Bayrağı" style="width: 220px; height: auto; margin-bottom: 30px; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); display: block; margin-left: auto; margin-right: auto;" />
                    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; line-height: 1.8; color: #1a1a1a; margin: 30px auto; max-width: 700px; font-weight: 700; font-style: italic; letter-spacing: 0.3px; text-align: center; padding: 0 25px;">
                      &ldquo;Biz her şeyi gençliğe bırakacağız. Geleceğin ümidi, ışıklı çiçekleri onlardır. Bütün ümidim gençliktedir.&rdquo;
                    </div>
                    <div style="color: #b71c1c; font-weight: 900; font-size: 18px; margin: 25px 0; letter-spacing: 1.2px; font-family: 'Segoe UI', Arial, sans-serif;">&mdash; Mustafa Kemal Atatürk &mdash;</div>
                    <img src="cid:ataturkimza" alt="Atatürk İmza" style="width: 180px; height: auto; margin: 25px auto; display: block;" />
                    <img src="cid:ataturk" alt="Mustafa Kemal Atatürk" style="width: 240px; height: auto; margin: 25px auto 0; display: block; border-radius: 14px; border: 6px solid #e91e63; box-shadow: 0 8px 30px rgba(0,0,0,0.35);" />
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0; height: 8px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                      <tr>
                        <td style="width: 11.11%; height: 8px; padding: 0; background-color: #dc2626;"></td>
                        <td style="width: 11.11%; height: 8px; padding: 0; background-color: #b91c1c;"></td>
                        <td style="width: 11.11%; height: 8px; padding: 0; background-color: #9333ea;"></td>
                        <td style="width: 11.11%; height: 8px; padding: 0; background-color: #7c3aed;"></td>
                        <td style="width: 11.11%; height: 8px; padding: 0; background-color: #2563eb;"></td>
                        <td style="width: 11.11%; height: 8px; padding: 0; background-color: #10b981;"></td>
                        <td style="width: 11.11%; height: 8px; padding: 0; background-color: #ec4899;"></td>
                        <td style="width: 11.11%; height: 8px; padding: 0; background-color: #c084fc;"></td>
                        <td style="width: 11.12%; height: 8px; padding: 0; background-color: #a855f7;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- BAŞLIK -->
          <tr>
            <td style="background: white; padding: 35px 30px 20px; text-align: center;">
              <h1 style="font-size: 32px; margin: 0 0 10px 0; font-weight: 900; letter-spacing: 0.5px; color: #8e24aa;">🎓 BERAT CANKIR</h1>
              <div style="font-size: 20px; font-weight: 700; margin: 0 0 15px 0; letter-spacing: 0.3px; color: #424242;">KİŞİSEL ÇALIŞMA ANALİZ RAPORU</div>
              <div style="font-size: 16px; font-weight: 600; color: #666; margin: 0;">📅 ${new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} | 🎯 Üniversite Kazanılacak !</div>
            </td>
          </tr>
          
          <!-- ÇÖZÜLEN SORU VE DENEME - EN ÜSTTE -->
          <tr>
            <td style="padding: 30px; background: #fafafa;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="49%" style="vertical-align: top;">
                    <div style="border-radius: 20px; padding: 35px 25px; text-align: center; color: white; box-shadow: 0 12px 35px rgba(124, 77, 255, 0.4); background: linear-gradient(135deg, #9c27b0 0%, #7c4dff 50%, #651fff 100%); border: 3px solid rgba(255, 255, 255, 0.3);">
                      <div style="font-size: 14px; font-weight: 700; margin-bottom: 18px; opacity: 0.95; letter-spacing: 0.5px;">📚 ÇÖZÜLEN SORU</div>
                      <div style="font-size: 52px; font-weight: 900; text-shadow: 0 4px 12px rgba(0,0,0,0.4);">${totalQuestions}</div>
                    </div>
                  </td>
                  <td width="2%"></td>
                  <td width="49%" style="vertical-align: top;">
                    <div style="border-radius: 20px; padding: 35px 25px; text-align: center; color: white; box-shadow: 0 12px 35px rgba(239, 83, 80, 0.4); background: linear-gradient(135deg, #f44336 0%, #ef5350 50%, #d32f2f 100%); border: 3px solid rgba(255, 255, 255, 0.3);">
                      <div style="font-size: 14px; font-weight: 700; margin-bottom: 18px; opacity: 0.95; letter-spacing: 0.5px;">🎯 ÇÖZÜLEN DENEME</div>
                      <div style="font-size: 52px; font-weight: 900; text-shadow: 0 4px 12px rgba(0,0,0,0.4);">${recentExams.length}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- TOPLAM AKTİVİTE VE GÖREVLER - ALTTA -->
          <tr>
            <td style="padding: 30px; background: #fafafa;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="49%" style="vertical-align: top;">
                    <div style="border-radius: 20px; padding: 35px 25px; text-align: center; color: white; box-shadow: 0 12px 35px rgba(38, 166, 154, 0.4); background: linear-gradient(135deg, #00bfa5 0%, #26a69a 50%, #00897b 100%); border: 3px solid rgba(255, 255, 255, 0.3);">
                      <div style="font-size: 14px; font-weight: 700; margin-bottom: 18px; opacity: 0.95; letter-spacing: 0.5px;">📈 TOPLAM AKTİVİTE</div>
                      <div style="font-size: 52px; font-weight: 900; margin-bottom: 12px; text-shadow: 0 4px 12px rgba(0,0,0,0.4);">${totalActivities}</div>
                      <div style="font-size: 14px; opacity: 0.9; font-weight: 600;">kayıtlı aktivite</div>
                    </div>
                  </td>
                  <td width="2%"></td>
                  <td width="49%" style="vertical-align: top;">
                    <div style="border-radius: 20px; padding: 35px 25px; text-align: center; color: white; box-shadow: 0 12px 35px rgba(171, 71, 188, 0.4); background: linear-gradient(135deg, #ce93d8 0%, #ab47bc 50%, #8e24aa 100%); border: 3px solid rgba(255, 255, 255, 0.3);">
                      <div style="font-size: 14px; font-weight: 700; margin-bottom: 18px; opacity: 0.95; letter-spacing: 0.5px;">✅ TAMAMLANAN GÖREVLER</div>
                      <div style="font-size: 52px; font-weight: 900; margin-bottom: 12px; text-shadow: 0 4px 12px rgba(0,0,0,0.4);">${completedTasks}/${tasks.length}</div>
                      <div style="font-size: 14px; opacity: 0.9; font-weight: 600;">görev tamamlandı</div>
                    </div>
                  </td>
                </tr>
              </table>
              <div style="border-radius: 16px; padding: 22px; text-align: center; color: white; font-weight: 700; font-size: 15px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); margin-top: 25px; background: ${activityColor}; line-height: 1.6;">
                ${activityMotivation}
              </div>
            </td>
          </tr>
          
          <!-- ÇÖZÜLEN TÜM SORULAR - Gerçek Veriler -->
          <tr>
            <td style="padding: 30px; background: #fafafa;">
              <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border-radius: 24px; padding: 35px; box-shadow: 0 15px 40px rgba(156, 39, 176, 0.35); border: 5px solid #9c27b0;">
                <div style="font-size: 22px; font-weight: 900; margin-bottom: 30px; color: #6a1b9a; text-align: center; letter-spacing: 0.5px;">📊 Çözülen Tüm Sorular</div>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td width="32%" style="vertical-align: top;">
                      <div style="border: 4px solid #66bb6a; border-radius: 18px; padding: 28px 18px; text-align: center; background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%); box-shadow: 0 10px 25px rgba(102, 187, 106, 0.45); border: 3px solid rgba(255, 255, 255, 0.4);">
                        <div style="font-size: 14px; color: white; margin-bottom: 14px; font-weight: 800; opacity: 0.95;">✓ Doğru</div>
                        <div style="font-size: 44px; font-weight: 900; color: white; text-shadow: 0 3px 10px rgba(0,0,0,0.3);">${totalCorrect}</div>
                      </div>
                    </td>
                    <td width="2%"></td>
                    <td width="32%" style="vertical-align: top;">
                      <div style="border: 4px solid #ef5350; border-radius: 18px; padding: 28px 18px; text-align: center; background: linear-gradient(135deg, #ef5350 0%, #e53935 100%); box-shadow: 0 10px 25px rgba(239, 83, 80, 0.45); border: 3px solid rgba(255, 255, 255, 0.4);">
                        <div style="font-size: 14px; color: white; margin-bottom: 14px; font-weight: 800; opacity: 0.95;">✗ Yanlış</div>
                        <div style="font-size: 44px; font-weight: 900; color: white; text-shadow: 0 3px 10px rgba(0,0,0,0.3);">${totalWrong}</div>
                      </div>
                    </td>
                    <td width="2%"></td>
                    <td width="32%" style="vertical-align: top;">
                      <div style="border: 4px solid #ffa726; border-radius: 18px; padding: 28px 18px; text-align: center; background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%); box-shadow: 0 10px 25px rgba(255, 167, 38, 0.45); border: 3px solid rgba(255, 255, 255, 0.4);">
                        <div style="font-size: 14px; color: white; margin-bottom: 14px; font-weight: 800; opacity: 0.95;">○ Boş</div>
                        <div style="font-size: 44px; font-weight: 900; color: white; text-shadow: 0 3px 10px rgba(0,0,0,0.3);">${totalEmpty}</div>
                      </div>
                    </td>
                  </tr>
                </table>
                <div style="border: 4px solid #7c4dff; border-radius: 20px; padding: 32px; text-align: center; background: linear-gradient(135deg, #9c27b0 0%, #7c4dff 50%, #651fff 100%); color: white; margin-top: 28px; box-shadow: 0 12px 35px rgba(124, 77, 255, 0.5); border: 3px solid rgba(255, 255, 255, 0.3);">
                  <div style="font-size: 52px; font-weight: 900; margin-bottom: 12px; text-shadow: 0 4px 12px rgba(0,0,0,0.4);">${successRate}%</div>
                  <div style="font-size: 16px; font-weight: 800; opacity: 0.95;">Başarı Oranım</div>
                </div>
              </div>
            </td>
          </tr>
          
          <!-- ÖZEL İSTATİSTİKLER - Gerçek Veriler -->
          <tr>
            <td style="padding: 30px; background: #fafafa;">
              <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); border: 2px solid #9c27b0;">
                <div style="font-size: 20px; font-weight: 800; margin-bottom: 25px; color: #424242; text-align: center;">📊 ÖZEL İSTATİSTİKLER</div>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td width="24%" style="vertical-align: top;">
                      <div style="border: 4px solid #ab47bc; border-radius: 16px; padding: 25px 15px; text-align: center; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);">
                        <div style="font-size: 11px; color: #6a1b9a; margin-bottom: 12px; font-weight: 700; text-transform: uppercase; line-height: 1.3;">🔥 En Uzun Çalışma Serisi</div>
                        <div style="font-size: 42px; font-weight: 900; margin: 12px 0; color: #8e24aa;">${longestStreak}</div>
                        <div style="font-size: 11px; color: #9e9e9e; font-weight: 500;">ardışık gün</div>
                      </div>
                    </td>
                    <td width="1%"></td>
                    <td width="24%" style="vertical-align: top;">
                      <div style="border: 4px solid #ef5350; border-radius: 16px; padding: 25px 15px; text-align: center; background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);">
                        <div style="font-size: 11px; color: #c62828; margin-bottom: 12px; font-weight: 700; text-transform: uppercase; line-height: 1.3;">❌ Bu Ay Hatalı Konular</div>
                        <div style="font-size: 42px; font-weight: 900; margin: 12px 0; color: #e53935;">${wrongTopicsCount}</div>
                        <div style="font-size: 11px; color: #9e9e9e; font-weight: 500;">toplam hata</div>
                      </div>
                    </td>
                    <td width="1%"></td>
                    <td width="24%" style="vertical-align: top;">
                      <div style="border: 4px solid #66bb6a; border-radius: 16px; padding: 25px 15px; text-align: center; background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);">
                        <div style="font-size: 11px; color: #2e7d32; margin-bottom: 12px; font-weight: 700; text-transform: uppercase; line-height: 1.3;">✅ Düzeltilen Konular</div>
                        <div style="font-size: 42px; font-weight: 900; margin: 12px 0; color: #43a047;">${completedTopicsHistory.length}</div>
                        <div style="font-size: 11px; color: #9e9e9e; font-weight: 500;">konu tamamlandı</div>
                      </div>
                    </td>
                    <td width="1%"></td>
                    <td width="24%" style="vertical-align: top;">
                      <div style="border: 4px solid #42a5f5; border-radius: 16px; padding: 25px 15px; text-align: center; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);">
                        <div style="font-size: 11px; color: #1565c0; margin-bottom: 12px; font-weight: 700; text-transform: uppercase; line-height: 1.3;">✅ Tamamlanan Hatalı Sorular</div>
                        <div style="font-size: 42px; font-weight: 900; margin: 12px 0; color: #1976d2;">${completedQuestionsHistory.length}</div>
                        <div style="font-size: 11px; color: #9e9e9e; font-weight: 500;">soru</div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- BU AYIN REKOR GENEL DENEME NETLERİ -->
          ${
            generalExams.length > 0
              ? `
          <tr>
            <td style="padding: 30px; background: #fafafa;">
              <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 20px; padding: 35px; border: 5px solid #2196f3; box-shadow: 0 10px 30px rgba(33, 150, 243, 0.3);">
                <div style="font-size: 22px; font-weight: 900; color: #1565c0; margin-bottom: 30px; text-align: center; letter-spacing: 0.5px;">🏆 BU AYIN REKOR GENEL DENEME NETLERİ</div>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td width="49%" style="vertical-align: top;">
                      <div style="border: 5px solid #ab47bc; border-radius: 18px; padding: 30px 25px; text-align: center; background: white; box-shadow: 0 6px 20px rgba(171, 71, 188, 0.3);">
                        <div style="font-size: 15px; color: #6a1b9a; margin-bottom: 15px; font-weight: 800;">🏆 TYT Rekor Net</div>
                        <div style="font-size: 56px; font-weight: 900; color: #8e24aa;">${maxTytNet.net ? maxTytNet.net.toFixed(2) : "0.00"}</div>
                        ${
                          maxTytNet.exam_name
                            ? `
                        <div style="font-size: 13px; color: #6a1b9a; margin-top: 12px; font-weight: 600;">${maxTytNet.exam_name}</div>
                        <div style="font-size: 11px; color: #9e9e9e; margin-top: 6px;">${new Date(maxTytNet.exam_date).toLocaleDateString("tr-TR")}</div>
                        `
                            : ""
                        }
                      </div>
                    </td>
                    <td width="2%"></td>
                    <td width="49%" style="vertical-align: top;">
                      <div style="border: 5px solid #ef5350; border-radius: 18px; padding: 30px 25px; text-align: center; background: white; box-shadow: 0 6px 20px rgba(239, 83, 80, 0.3);">
                        <div style="font-size: 15px; color: #c62828; margin-bottom: 15px; font-weight: 800;">🏆 AYT Rekor Net</div>
                        <div style="font-size: 56px; font-weight: 900; color: #e53935;">${maxAytNet.net ? maxAytNet.net.toFixed(2) : "0.00"}</div>
                        ${
                          maxAytNet.exam_name
                            ? `
                        <div style="font-size: 13px; color: #c62828; margin-top: 12px; font-weight: 600;">${maxAytNet.exam_name}</div>
                        <div style="font-size: 11px; color: #9e9e9e; margin-top: 6px;">${new Date(maxAytNet.exam_date).toLocaleDateString("tr-TR")}</div>
                        `
                            : ""
                        }
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- BU AYIN REKOR BRANŞ DENEME NETLERİ -->
          ${
            Object.keys(branchRecords).length > 0
              ? `
          <tr>
            <td style="padding: 30px; background: #fafafa;">
              <div style="background: linear-gradient(135deg, rgba(255, 248, 225, 0.6) 0%, rgba(255, 236, 179, 0.6) 100%); border-radius: 20px; padding: 35px; border: 5px solid #ff9800; box-shadow: 0 10px 30px rgba(255, 152, 0, 0.3);">
                <div style="font-size: 22px; font-weight: 900; color: #e65100; margin-bottom: 30px; text-align: center; letter-spacing: 0.5px;">🏆 BU AYIN REKOR BRANŞ DENEME NETLERİ</div>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    ${Object.entries(branchRecords)
                      .slice(0, 2)
                      .map(
                        ([subject, record]: any, index: number) => `
                      ${index > 0 ? '<td width="2%"></td>' : ""}
                      <td width="49%" style="vertical-align: top;">
                        <div style="border: 5px solid ${index === 0 ? "#2196f3" : "#9c27b0"}; border-radius: 18px; padding: 30px 20px; text-align: center; background: white; box-shadow: 0 6px 20px rgba(0,0,0,0.15);">
                          <div style="font-size: 14px; color: #424242; margin-bottom: 12px; font-weight: 800;">🏆 ${subject}</div>
                          <div style="margin-bottom: 8px;"><span style="display: inline-block; padding: 4px 12px; background: ${index === 0 ? "#2196f3" : "#9c27b0"}; color: white; border-radius: 8px; font-size: 12px; font-weight: 700;">${record.examType || (index === 0 ? "TYT" : "AYT")} Branş</span></div>
                          <div style="font-size: 48px; font-weight: 900; color: ${index === 0 ? "#1565c0" : "#6a1b9a"};">${record.net}</div>
                          <div style="font-size: 12px; color: #424242; margin-top: 12px; font-weight: 600; line-height: 1.4;">${record.exam_name}</div>
                          <div style="font-size: 11px; color: #9e9e9e; margin-top: 6px; font-weight: 600;">${new Date(record.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</div>
                        </div>
                      </td>
                    `,
                      )
                      .join("")}
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- EN ÇOK SORU ÇÖZÜLEN TARİH -->
          ${
            mostQuestionsDate
              ? `
          <tr>
            <td style="padding: 30px; background: #fafafa;">
              <div style="background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%); border: 5px solid #ffc107; border-radius: 20px; padding: 35px; text-align: center; box-shadow: 0 10px 30px rgba(255, 193, 7, 0.3);">
                <div style="font-size: 16px; color: #e65100; margin-bottom: 15px; font-weight: 800; letter-spacing: 0.5px;">🗓️ EN ÇOK SORU ÇÖZÜLEN TARİH</div>
                <div style="font-size: 18px; color: #424242; font-weight: 700; margin-bottom: 15px;">${mostQuestionsDate}</div>
                <div style="font-size: 64px; color: #f57c00; font-weight: 900; margin: 15px 0;">${mostQuestionsCount}</div>
                <div style="font-size: 15px; color: #666; font-weight: 600;">soru çözdüm</div>
              </div>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- DERS İSTATİSTİKLERİ - TYT ve AYT Ayrı -->
          ${
            mostWrongSubjects.length > 0 ||
            mostSolvedSubjects.length > 0 ||
            mostCorrectSubjects.length > 0
              ? `
          <tr>
            <td style="padding: 30px; background: #fafafa;">
              ${
                mostWrongSubjects.length > 0
                  ? `
              <div style="border-radius: 20px; padding: 28px; background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); border: 4px solid #ef5350; margin-bottom: 25px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
                <div style="font-size: 18px; font-weight: 800; margin-bottom: 25px; color: #c62828; text-align: center;">📉 EN ÇOK HATA YAPILAN DERSLER</div>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td width="49%" style="vertical-align: top;">
                      <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #e3f2fd 100%); border-radius: 14px; padding: 20px; border: 3px solid #2196f3; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);">
                        <div style="text-align: center; margin-bottom: 15px; padding: 8px; background: #2196f3; color: white; border-radius: 8px; font-weight: 800; font-size: 14px;">📘 TYT</div>
                        ${
                          mostWrongSubjects
                            .filter(([key]: any) => key.includes("(TYT)"))
                            .slice(0, 3)
                            .map(([subjectKey, stats]: any, index) => {
                              const subjectName = subjectKey.split(" (")[0];
                              return `
                        <div style="font-size: 14px; color: #1a1a1a; font-weight: 600; padding: 14px; margin: 8px 0; background: white; border-radius: 10px; border: 2px solid #2196f3; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                          ${index + 1}. ${subjectName}<span style="font-weight: 900; font-size: 15px; color: #d32f2f; float: right;">${stats.wrong} hata</span>
                        </div>
                        `;
                            })
                            .join("") ||
                          '<div style="text-align: center; color: #666; padding: 20px; font-style: italic;">Veri bulunamadı</div>'
                        }
                      </div>
                    </td>
                    <td width="2%"></td>
                    <td width="49%" style="vertical-align: top;">
                      <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 50%, #f3e5f5 100%); border-radius: 14px; padding: 20px; border: 3px solid #9c27b0; box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2);">
                        <div style="text-align: center; margin-bottom: 15px; padding: 8px; background: #9c27b0; color: white; border-radius: 8px; font-weight: 800; font-size: 14px;">📗 AYT</div>
                        ${
                          mostWrongSubjects
                            .filter(([key]: any) => key.includes("(AYT)"))
                            .slice(0, 3)
                            .map(([subjectKey, stats]: any, index) => {
                              const subjectName = subjectKey.split(" (")[0];
                              return `
                        <div style="font-size: 14px; color: #1a1a1a; font-weight: 600; padding: 14px; margin: 8px 0; background: white; border-radius: 10px; border: 2px solid #9c27b0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                          ${index + 1}. ${subjectName}<span style="font-weight: 900; font-size: 15px; color: #d32f2f; float: right;">${stats.wrong} hata</span>
                        </div>
                        `;
                            })
                            .join("") ||
                          '<div style="text-align: center; color: #666; padding: 20px; font-style: italic;">Veri bulunamadı</div>'
                        }
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              `
                  : ""
              }
              ${
                mostSolvedSubjects.length > 0
                  ? `
              <div style="border-radius: 20px; padding: 28px; background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border: 4px solid #66bb6a; margin-bottom: 25px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
                <div style="font-size: 18px; font-weight: 800; margin-bottom: 25px; color: #2e7d32; text-align: center;">📚 EN ÇOK SORU ÇÖZÜLEN DERSLER</div>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td width="49%" style="vertical-align: top;">
                      <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #e3f2fd 100%); border-radius: 14px; padding: 20px; border: 3px solid #2196f3; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);">
                        <div style="text-align: center; margin-bottom: 15px; padding: 8px; background: #2196f3; color: white; border-radius: 8px; font-weight: 800; font-size: 14px;">📘 TYT</div>
                        ${
                          mostSolvedSubjects
                            .filter(([key]: any) => key.includes("(TYT)"))
                            .slice(0, 3)
                            .map(([subjectKey, stats]: any, index) => {
                              const subjectName = subjectKey.split(" (")[0];
                              return `
                        <div style="font-size: 14px; color: #1a1a1a; font-weight: 600; padding: 14px; margin: 8px 0; background: white; border-radius: 10px; border: 2px solid #2196f3; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                          ${index + 1}. ${subjectName}<span style="font-weight: 900; font-size: 15px; color: #2e7d32; float: right;">${stats.total} soru</span>
                        </div>
                        `;
                            })
                            .join("") ||
                          '<div style="text-align: center; color: #666; padding: 20px; font-style: italic;">Veri bulunamadı</div>'
                        }
                      </div>
                    </td>
                    <td width="2%"></td>
                    <td width="49%" style="vertical-align: top;">
                      <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 50%, #f3e5f5 100%); border-radius: 14px; padding: 20px; border: 3px solid #9c27b0; box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2);">
                        <div style="text-align: center; margin-bottom: 15px; padding: 8px; background: #9c27b0; color: white; border-radius: 8px; font-weight: 800; font-size: 14px;">📗 AYT</div>
                        ${
                          mostSolvedSubjects
                            .filter(([key]: any) => key.includes("(AYT)"))
                            .slice(0, 3)
                            .map(([subjectKey, stats]: any, index) => {
                              const subjectName = subjectKey.split(" (")[0];
                              return `
                        <div style="font-size: 14px; color: #1a1a1a; font-weight: 600; padding: 14px; margin: 8px 0; background: white; border-radius: 10px; border: 2px solid #9c27b0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                          ${index + 1}. ${subjectName}<span style="font-weight: 900; font-size: 15px; color: #2e7d32; float: right;">${stats.total} soru</span>
                        </div>
                        `;
                            })
                            .join("") ||
                          '<div style="text-align: center; color: #666; padding: 20px; font-style: italic;">Veri bulunamadı</div>'
                        }
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              `
                  : ""
              }
              ${
                mostCorrectSubjects.length > 0
                  ? `
              <div style="border-radius: 20px; padding: 28px; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border: 4px solid #ab47bc; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
                <div style="font-size: 18px; font-weight: 800; margin-bottom: 25px; color: #6a1b9a; text-align: center;">🏆 EN ÇOK DOĞRU YAPILAN DERSLER</div>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td width="49%" style="vertical-align: top;">
                      <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #e3f2fd 100%); border-radius: 14px; padding: 20px; border: 3px solid #2196f3; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);">
                        <div style="text-align: center; margin-bottom: 15px; padding: 8px; background: #2196f3; color: white; border-radius: 8px; font-weight: 800; font-size: 14px;">📘 TYT</div>
                        ${
                          mostCorrectSubjects
                            .filter(([key]: any) => key.includes("(TYT)"))
                            .slice(0, 3)
                            .map(([subjectKey, stats]: any, index) => {
                              const subjectName = subjectKey.split(" (")[0];
                              return `
                        <div style="font-size: 14px; color: #1a1a1a; font-weight: 600; padding: 14px; margin: 8px 0; background: white; border-radius: 10px; border: 2px solid #2196f3; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                          ${index + 1}. ${subjectName}<span style="font-weight: 900; font-size: 15px; color: #6a1b9a; float: right;">${stats.correct} doğru</span>
                        </div>
                        `;
                            })
                            .join("") ||
                          '<div style="text-align: center; color: #666; padding: 20px; font-style: italic;">Veri bulunamadı</div>'
                        }
                      </div>
                    </td>
                    <td width="2%"></td>
                    <td width="49%" style="vertical-align: top;">
                      <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 50%, #f3e5f5 100%); border-radius: 14px; padding: 20px; border: 3px solid #9c27b0; box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2);">
                        <div style="text-align: center; margin-bottom: 15px; padding: 8px; background: #9c27b0; color: white; border-radius: 8px; font-weight: 800; font-size: 14px;">📗 AYT</div>
                        ${
                          mostCorrectSubjects
                            .filter(([key]: any) => key.includes("(AYT)"))
                            .slice(0, 3)
                            .map(([subjectKey, stats]: any, index) => {
                              const subjectName = subjectKey.split(" (")[0];
                              return `
                        <div style="font-size: 14px; color: #1a1a1a; font-weight: 600; padding: 14px; margin: 8px 0; background: white; border-radius: 10px; border: 2px solid #9c27b0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                          ${index + 1}. ${subjectName}<span style="font-weight: 900; font-size: 15px; color: #6a1b9a; float: right;">${stats.correct} doğru</span>
                        </div>
                        `;
                            })
                            .join("") ||
                          '<div style="text-align: center; color: #666; padding: 20px; font-style: italic;">Veri bulunamadı</div>'
                        }
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              `
                  : ""
              }
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- GENEL DENEME DETAYLARI - Gerçek Veriler -->
          ${
            generalExams.length > 0
              ? `
          <tr>
            <td style="padding: 30px; background: #fafafa;">
              <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
                <div style="font-size: 20px; font-weight: 800; margin-bottom: 25px; color: #424242; text-align: center;">📋 DENEME DETAYLARI - Genel Denemeler</div>
                ${generalExams
                  .slice(0, 5)
                  .map((exam: any, examIndex: number) => {
                    const examNets = examSubjectNets.filter(
                      (n: any) => n.exam_id === exam.id,
                    );

                    // Calculate total net from examSubjectNets or fallback to tyt_net
                    let totalNet = 0;
                    if (examNets.length > 0) {
                      totalNet = examNets.reduce(
                        (sum: number, n: any) =>
                          sum + parseFloat(n.net_score || 0),
                        0,
                      );
                    } else {
                      totalNet = parseFloat(exam.tyt_net || 0);
                    }

                    const getSubjectData = (subjectName: string) => {
                      const subjectNet = examNets.find(
                        (n: any) =>
                          (n.subject || n.subject_name) === subjectName,
                      );
                      if (subjectNet) {
                        return {
                          dogru: parseInt(subjectNet.correct_count || "0"),
                          yanlis: parseInt(subjectNet.wrong_count || "0"),
                          bos: parseInt(subjectNet.blank_count || "0"),
                          net: parseFloat(subjectNet.net_score || "0"),
                        };
                      }
                      return null;
                    };

                    const getWrongTopics = (subject: string) => {
                      const subjectNet = examNets.find(
                        (n: any) => (n.subject || n.subject_name) === subject,
                      );
                      if (subjectNet && subjectNet.wrong_topics_json) {
                        try {
                          const topics = JSON.parse(
                            subjectNet.wrong_topics_json,
                          );
                          return topics.map((t: any) =>
                            typeof t === "string" ? t : t.topic || t,
                          );
                        } catch (e) {
                          return [];
                        }
                      }
                      return [];
                    };

                    // SORUN 5 ÇÖZÜMÜ: TYT için 4 ders, AYT için 4 ders (Matematik, Fizik, Kimya, Biyoloji)
                    const examType = exam.exam_type || "TYT";
                    const subjectNames =
                      examType.toUpperCase() === "TYT"
                        ? [
                            "Türkçe",
                            "Sosyal Bilimler",
                            "Matematik",
                            "Fen Bilimleri",
                          ]
                        : ["Matematik", "Fizik", "Kimya", "Biyoloji"];
                    const subjectEmojis: any = {
                      Türkçe: "📖",
                      "Sosyal Bilimler": "🌍",
                      Matematik: "🔢",
                      "Fen Bilimleri": "🔬",
                      Fizik: "⚛️",
                      Kimya: "🧪",
                      Biyoloji: "🧬",
                    };

                    const subjects = subjectNames
                      .map((name) => {
                        const data = getSubjectData(name);
                        return {
                          name,
                          emoji: subjectEmojis[name] || "📚",
                          dogru: data?.dogru,
                          yanlis: data?.yanlis,
                          bos: data?.bos,
                          net: data?.net,
                        };
                      })
                      .filter((s) => s.dogru !== undefined);

                    // Determine border color based on exam type: TYT = blue, AYT = orange
                    const borderColor =
                      examType.toUpperCase() === "TYT" ? "#2196f3" : "#ff9800";

                    // Show full details for first 3 exams, summary only for exams 4-5
                    const showFullDetails = examIndex < 3;

                    // For summary view: just show exam name, date, and total net
                    if (!showFullDetails) {
                      return `
                      <details style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border: 4px solid ${borderColor}; border-radius: 18px; padding: 22px; margin-bottom: 22px; box-shadow: 0 6px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06); cursor: pointer;">
                        <summary style="list-style: none; outline: none;">
                          <div style="color: #1565c0; font-size: 18px; font-weight: 800; margin-bottom: 8px; letter-spacing: 0.3px;">${exam.exam_name}</div>
                          <div style="color: #6c757d; font-size: 13px; margin-bottom: 12px; font-weight: 600;">📅 ${new Date(exam.exam_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} | 📚 ${examType}</div>
                          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 16px; border-radius: 10px; font-size: 17px; font-weight: 800; text-align: center; box-shadow: 0 4px 12px rgba(102,126,234,0.25);">Toplam Net: ${totalNet.toFixed(2)}</div>
                          <div style="text-align: center; margin-top: 12px; font-size: 12px; color: #9e9e9e; font-style: italic;">▼ Detayları görmek için tıklayın</div>
                        </summary>
                      </details>
                    `;
                    }

                    return `
                    <div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border: 5px solid ${borderColor}; border-radius: 20px; padding: 32px; margin-bottom: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 3px 8px rgba(0,0,0,0.1);">
                      <div style="color: #1565c0; font-size: 22px; font-weight: 900; margin-bottom: 12px; letter-spacing: 0.3px;">${exam.exam_name}</div>
                      <div style="color: #6c757d; font-size: 14px; margin-bottom: 20px; font-weight: 600;">📅 ${new Date(exam.exam_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} | 📚 ${examType}</div>
                      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 20px; border-radius: 12px; font-size: 19px; font-weight: 800; text-align: center; margin: 18px 0; box-shadow: 0 6px 18px rgba(102,126,234,0.3); letter-spacing: 0.3px;">Toplam Net: ${totalNet.toFixed(2)}</div>
                      
                      ${subjects
                        .map((sub) => {
                          if (sub.dogru === undefined) return "";
                          const wrongTopics = getWrongTopics(sub.name);
                          const subNet = (
                            sub.net !== undefined
                              ? sub.net
                              : (sub.dogru || 0) - (sub.yanlis || 0) * 0.25
                          ).toFixed(2);

                          return `
                        <div style="margin: 24px 0; padding: 20px; background: #dde1e7; border-radius: 16px; border: 4px solid #6b7280; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                          <div style="font-size: 15px; font-weight: 800; margin: 0 0 18px 0; color: #5e35b1; letter-spacing: 0.3px;">${sub.emoji} ${sub.name.toUpperCase()}</div>
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td width="23%" style="vertical-align: top;">
                                <div style="border: 3px solid #66bb6a; border-radius: 12px; padding: 14px 10px; text-align: center; background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%); box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
                                  <div style="font-size: 10px; margin-bottom: 8px; font-weight: 700; color: #2e7d32; letter-spacing: 0.5px;">✓ DOĞRU</div>
                                  <div style="font-size: 22px; font-weight: 900; color: #43a047;">${sub.dogru || 0}</div>
                                </div>
                              </td>
                              <td width="2%"></td>
                              <td width="23%" style="vertical-align: top;">
                                <div style="border: 3px solid #ef5350; border-radius: 12px; padding: 14px 10px; text-align: center; background: linear-gradient(135deg, #ffebee 0%, #fef1f1 100%); box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
                                  <div style="font-size: 10px; margin-bottom: 8px; font-weight: 700; color: #c62828; letter-spacing: 0.5px;">✗ YANLIŞ</div>
                                  <div style="font-size: 22px; font-weight: 900; color: #e53935;">${sub.yanlis || 0}</div>
                                </div>
                              </td>
                              <td width="2%"></td>
                              <td width="23%" style="vertical-align: top;">
                                <div style="border: 3px solid #ffa726; border-radius: 12px; padding: 14px 10px; text-align: center; background: linear-gradient(135deg, #fff3e0 0%, #fef8f1 100%); box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
                                  <div style="font-size: 10px; margin-bottom: 8px; font-weight: 700; color: #e65100; letter-spacing: 0.5px;">○ BOŞ</div>
                                  <div style="font-size: 22px; font-weight: 900; color: #fb8c00;">${sub.bos || 0}</div>
                                </div>
                              </td>
                              <td width="2%"></td>
                              <td width="23%" style="vertical-align: top;">
                                <div style="border: 3px solid #ab47bc; border-radius: 12px; padding: 14px 10px; text-align: center; background: linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%); color: white; box-shadow: 0 4px 12px rgba(171,71,188,0.3);">
                                  <div style="font-size: 10px; margin-bottom: 8px; font-weight: 700; opacity: 0.95; letter-spacing: 0.5px;">★ NET</div>
                                  <div style="font-size: 22px; font-weight: 900;">${subNet}</div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          ${
                            wrongTopics.length > 0
                              ? `
                          <div style="border-top: 1px solid #e0e0e0; padding-top: 14px; margin-top: 16px;">
                            <div style="font-size: 12px; color: #d32f2f; margin: 0 0 10px 0; font-weight: 700;">❌ Yanlış Yapılan Konular (${wrongTopics.length}):</div>
                            ${
                              wrongTopics.length <= 3
                                ? wrongTopics
                                    .map(
                                      (topic: string) => `
                            <div style="color: #424242; font-size: 12px; margin: 6px 0; font-weight: 500; padding-left: 8px;">• ${topic}</div>
                            `,
                                    )
                                    .join("")
                                : `
                            <details style="cursor: pointer;">
                              <summary style="list-style: none; outline: none; color: #666; font-size: 11px; font-style: italic; padding: 4px 0;">
                                ${wrongTopics
                                  .slice(0, 3)
                                  .map(
                                    (topic: string) => `
                                <div style="color: #424242; font-size: 12px; margin: 6px 0; font-weight: 500; padding-left: 8px;">• ${topic}</div>
                                `,
                                  )
                                  .join("")}
                                <div style="text-align: center; margin-top: 8px; color: #1565c0; font-weight: 600;">▼ +${wrongTopics.length - 3} konu daha göster</div>
                              </summary>
                              <div style="margin-top: 8px;">
                                ${wrongTopics
                                  .slice(3)
                                  .map(
                                    (topic: string) => `
                                <div style="color: #424242; font-size: 12px; margin: 6px 0; font-weight: 500; padding-left: 8px;">• ${topic}</div>
                                `,
                                  )
                                  .join("")}
                              </div>
                            </details>
                            `
                            }
                          </div>
                          `
                              : `
                          <div style="border-top: 1px solid #e0e0e0; padding-top: 14px; margin-top: 16px; text-align: center;">
                            <div style="font-size: 13px; color: #2e7d32; font-weight: 700; margin-bottom: 6px;">✓ Tebrikler, bu dersten hata yapılmamış!</div>
                          </div>
                          `
                          }
                        </div>
                        `;
                        })
                        .join("")}
                    </div>
                  `;
                  })
                  .join("")}
              </div>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- BRANŞ DENEME DETAYLARI - Gerçek Veriler -->
          ${
            branchExams.length > 0
              ? `
          <tr>
            <td style="padding: 30px; background: #fafafa;">
              <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
                <div style="font-size: 20px; font-weight: 800; margin-bottom: 25px; color: #424242; text-align: center;">📋 DENEME DETAYLARI - Branş Denemeler</div>
                ${branchExams
                  .slice(0, 5)
                  .map((exam: any) => {
                    const examNets = examSubjectNets.filter(
                      (n: any) => n.exam_id === exam.id,
                    );

                    // Get data from examSubjectNets if available
                    let subject, dogru, yanlis, bos, net;
                    if (examNets.length > 0) {
                      const subjectNet = examNets[0];
                      subject =
                        subjectNet.subject ||
                        exam.selected_subject ||
                        exam.exam_type;
                      dogru = parseInt(subjectNet.correct_count || 0);
                      yanlis = parseInt(subjectNet.wrong_count || 0);
                      bos = parseInt(subjectNet.blank_count || 0);
                      net = parseFloat(subjectNet.net_score || 0);
                    } else {
                      // Fallback if no examSubjectNets data
                      subject =
                        exam.selected_subject || exam.subject || exam.exam_type;
                      dogru = 0;
                      yanlis = 0;
                      bos = 0;
                      net = 0;
                    }

                    const wrongTopicsArr: string[] = [];
                    examNets.forEach((n: any) => {
                      if (n.wrong_topics_json) {
                        try {
                          const topics = JSON.parse(n.wrong_topics_json);
                          topics.forEach((t: any) => {
                            const topicStr =
                              typeof t === "string" ? t : t.topic || String(t);
                            if (topicStr) wrongTopicsArr.push(topicStr);
                          });
                        } catch (e) {}
                      }
                    });

                    // Determine border color for branch exams: TYT = green, AYT = purple
                    const examType = exam.exam_type || subject || "TYT";
                    const borderColor = examType.toUpperCase().includes("TYT")
                      ? "#4caf50"
                      : "#9c27b0";

                    return `
                    <div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border: 5px solid ${borderColor}; border-radius: 20px; padding: 32px; margin-bottom: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 3px 8px rgba(0,0,0,0.1);">
                      <div style="color: #1565c0; font-size: 22px; font-weight: 900; margin-bottom: 12px; letter-spacing: 0.3px;">${exam.exam_name}</div>
                      <div style="color: #6c757d; font-size: 14px; margin-bottom: 24px; font-weight: 600;">📅 ${new Date(exam.exam_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} | 📚 ${subject}</div>
                      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px 32px; border-radius: 18px; font-size: 28px; font-weight: 900; text-align: center; margin: 24px 0; box-shadow: 0 10px 28px rgba(102,126,234,0.35); letter-spacing: 0.5px;">${subject} Net: ${net.toFixed(2)}</div>
                      <div style="margin: 24px 0; padding: 20px; background: #dde1e7; border-radius: 16px; border: 4px solid #6b7280; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td width="23%" style="vertical-align: top;">
                              <div style="border: 3px solid #66bb6a; border-radius: 12px; padding: 14px 10px; text-align: center; background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%); box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
                                <div style="font-size: 10px; margin-bottom: 8px; font-weight: 700; color: #2e7d32; letter-spacing: 0.5px;">✓ DOĞRU</div>
                                <div style="font-size: 22px; font-weight: 900; color: #43a047;">${dogru}</div>
                              </div>
                            </td>
                            <td width="2%"></td>
                            <td width="23%" style="vertical-align: top;">
                              <div style="border: 3px solid #ef5350; border-radius: 12px; padding: 14px 10px; text-align: center; background: linear-gradient(135deg, #ffebee 0%, #fef1f1 100%); box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
                                <div style="font-size: 10px; margin-bottom: 8px; font-weight: 700; color: #c62828; letter-spacing: 0.5px;">✗ YANLIŞ</div>
                                <div style="font-size: 22px; font-weight: 900; color: #e53935;">${yanlis}</div>
                              </div>
                            </td>
                            <td width="2%"></td>
                            <td width="23%" style="vertical-align: top;">
                              <div style="border: 3px solid #ffa726; border-radius: 12px; padding: 14px 10px; text-align: center; background: linear-gradient(135deg, #fff3e0 0%, #fef8f1 100%); box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
                                <div style="font-size: 10px; margin-bottom: 8px; font-weight: 700; color: #e65100; letter-spacing: 0.5px;">○ BOŞ</div>
                                <div style="font-size: 22px; font-weight: 900; color: #fb8c00;">${bos}</div>
                              </div>
                            </td>
                            <td width="2%"></td>
                            <td width="23%" style="vertical-align: top;">
                              <div style="border: 3px solid #ab47bc; border-radius: 12px; padding: 14px 10px; text-align: center; background: linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%); color: white; box-shadow: 0 4px 12px rgba(171,71,188,0.3);">
                                <div style="font-size: 10px; margin-bottom: 8px; font-weight: 700; opacity: 0.95; letter-spacing: 0.5px;">★ NET</div>
                                <div style="font-size: 22px; font-weight: 900;">${net.toFixed(2)}</div>
                              </div>
                            </td>
                          </tr>
                        </table>
                        ${
                          wrongTopicsArr.length > 0
                            ? `
                        <div style="border-top: 1px solid #e0e0e0; padding-top: 14px; margin-top: 16px;">
                          <div style="font-size: 12px; color: #d32f2f; margin: 0 0 10px 0; font-weight: 700;">❌ Yanlış Yapılan Konular (${wrongTopicsArr.length}):</div>
                          ${
                            wrongTopicsArr.length <= 3
                              ? wrongTopicsArr
                                  .map(
                                    (topic: string) => `
                          <div style="color: #424242; font-size: 12px; margin: 6px 0; font-weight: 500; padding-left: 8px;">• ${topic}</div>
                          `,
                                  )
                                  .join("")
                              : `
                          <details style="cursor: pointer;">
                            <summary style="list-style: none; outline: none; color: #666; font-size: 11px; font-style: italic; padding: 4px 0;">
                              ${wrongTopicsArr
                                .slice(0, 3)
                                .map(
                                  (topic: string) => `
                              <div style="color: #424242; font-size: 12px; margin: 6px 0; font-weight: 500; padding-left: 8px;">• ${topic}</div>
                              `,
                                )
                                .join("")}
                              <div style="text-align: center; margin-top: 8px; color: #1565c0; font-weight: 600;">▼ +${wrongTopicsArr.length - 3} konu daha göster</div>
                            </summary>
                            <div style="margin-top: 8px;">
                              ${wrongTopicsArr
                                .slice(3)
                                .map(
                                  (topic: string) => `
                              <div style="color: #424242; font-size: 12px; margin: 6px 0; font-weight: 500; padding-left: 8px;">• ${topic}</div>
                              `,
                                )
                                .join("")}
                            </div>
                          </details>
                          `
                          }
                        </div>
                        `
                            : `
                        <div style="border-top: 1px solid #e0e0e0; padding-top: 14px; margin-top: 16px; text-align: center;">
                          <div style="font-size: 13px; color: #2e7d32; font-weight: 700; margin-bottom: 6px;">✓ Tebrikler, bu dersten hata yapılmamış!</div>
                        </div>
                        `
                        }
                      </div>
                    </div>
                  `;
                  })
                  .join("")}
              </div>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- TAMAMLANAN HATALI KONULAR GEÇMİŞİ -->
          ${
            completedTopicsHistory.length > 0
              ? `
          <tr>
            <td style="padding: 25px; background: #fafafa;">
              <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
                <div style="font-size: 17px; font-weight: 800; margin-bottom: 18px; color: #424242; text-align: center;">✅ Tamamlanan Hatalı Konular Geçmişi</div>
                <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border: 2px solid #66bb6a; border-radius: 12px; padding: 14px;">
                  ${completedTopicsHistory
                    .map((topic: any, index: number) => {
                      const topicDate = topic.completedAt
                        ? new Date(topic.completedAt)
                        : null;
                      const formattedDate =
                        topicDate && !isNaN(topicDate.getTime())
                          ? topicDate.toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Tarih bilinmiyor";
                      return `
                    <div style="background: white; border-left: 4px solid #43a047; border-radius: 8px; padding: 10px 14px; margin-bottom: ${index < completedTopicsHistory.length - 1 ? "10px" : "0"}; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
                      <div style="color: #2e7d32; font-size: 13px; font-weight: 700; margin-bottom: 4px;">✓ ${topic.title}</div>
                      <div style="color: #666; font-size: 11px; font-weight: 600; margin-bottom: 3px;">📚 ${topic.subject} ${topic.source ? `| 📋 ${topic.source}` : ""}</div>
                      <div style="color: #9e9e9e; font-size: 10px; font-weight: 500;">📅 ${formattedDate}</div>
                    </div>
                  `;
                    })
                    .join("")}
                </div>
              </div>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- FOOTER - KUTU İÇİNDE -->
          <tr>
            <td style="background: white; padding: 30px;">
              <div style="background: linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%); border-radius: 18px; padding: 28px; text-align: center; box-shadow: 0 10px 30px rgba(142, 36, 170, 0.4);">
                <div style="color: white; font-size: 15px; font-weight: 800; margin-bottom: 10px; letter-spacing: 0.5px;">${isManualRequest ? "👤 Kullanıcı Tarafından İstendi" : "🚀 Otomatik Olarak Oluşturuldu"}</div>
                <div style="color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 600;">🇹🇷 Berat Cankır Kişisel Analiz Sistemi 🇹🇷</div>
              </div>
            </td>
          </tr>
          
        </table>
        </div>
      </div>
    </body>
    </html>
  `;
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
