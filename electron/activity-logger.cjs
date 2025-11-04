// BERAT CANKIR
// BERAT BİLAL CANKIR
// CANKIR


// Kullanıcı aktivitelerini takip eden sistem

const fs = require('fs');
const path = require('path');

class ActivityLogger {
  constructor() {
    this.activities = [];
    this.maxActivities = 200; // Son 200 aktiviteyi sakla
  }

  // Türkçe tarih formatlama
  formatDate(date = new Date()) {
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `[${day} ${month} ${year} - Saat ${hours}:${minutes}:${seconds}]`;
  }

  // Aktivite ekle
  log(activity, description = '') {
    const timestamp = this.formatDate();
    const logEntry = description 
      ? `${timestamp} ${activity} ---> ${description}`
      : `${timestamp} ${activity}`;
    
    this.activities.push(logEntry);
    
    // Maksimum sayıyı geçerse en eskisini sil
    if (this.activities.length > this.maxActivities) {
      this.activities.shift();
    }
    
    console.log(logEntry);
    return logEntry;
  }

  // Tüm aktiviteleri al
  getAll() {
    return this.activities;
  }

  // Aktiviteleri temizle
  clear() {
    this.activities = [];
  }

  // Ders kodunu Türkçe ders adına çevir
  getSubjectName(subjectCode) {
    const subjectMap = {
      'turkce': 'Türkçe',
      'sosyal': 'Sosyal Bilimler',
      'matematik': 'Matematik',
      'fizik': 'Fizik',
      'kimya': 'Kimya',
      'biyoloji': 'Biyoloji',
      'tyt-geometri': 'TYT Geometri',
      'ayt-matematik': 'AYT Matematik',
      'ayt-fizik': 'AYT Fizik',
      'ayt-kimya': 'AYT Kimya',
      'ayt-biyoloji': 'AYT Biyoloji',
      'ayt-geometri': 'AYT Geometri',
      'genel': 'Genel'
    };
    return subjectMap[subjectCode] || subjectCode || 'Konu belirtilmemiş';
  }

  // HTTP isteğini parse edip anlamlı log oluştur
  parseHttpRequest(method, path, body) {
    try {
      // POST istekleri - Yeni veri eklemeleri
      if (method === 'POST') {
        if (path === '/api/tasks') {
          const title = body.title || 'Başlıksız Görev';
          return this.log('Görev Eklendi', title);
        }
        if (path === '/api/exam-results') {
          const examName = body.exam_name || body.display_name || 'İsimsiz Deneme';
          return this.log('Deneme Sınav Eklendi', examName);
        }
        if (path === '/api/question-logs') {
          const subjectName = this.getSubjectName(body.subject);
          const correctCount = parseInt(body.correct_count) || 0;
          const wrongCount = parseInt(body.wrong_count) || 0;
          const blankCount = parseInt(body.blank_count) || 0;
          const totalQuestions = correctCount + wrongCount + blankCount;
          
          // Eğer toplam soru 0 ise log atla
          if (totalQuestions === 0) {
            return null;
          }
          
          return this.log('Soru Kaydı Eklendi', `${totalQuestions} soru - ${subjectName}`);
        }
        if (path === '/api/study-hours') {
          const hours = body.hours || 0;
          const minutes = body.minutes || 0;
          const subjectName = body.subject ? this.getSubjectName(body.subject) : '';
          const timeStr = hours > 0 ? `${hours} saat ${minutes} dakika` : `${minutes} dakika`;
          return this.log('Çalışma Saati Eklendi', `${timeStr}${subjectName ? ' - ' + subjectName : ''}`);
        }
        if (path === '/api/moods') {
          const mood = body.mood || 'belirlenmemiş';
          return this.log('Ruh Hali Kaydedildi', mood);
        }
      }
      
      // PATCH istekleri - Güncellemeler
      if (method === 'PATCH') {
        if (path.includes('/tasks/') && path.includes('/toggle')) {
          return this.log('Görev Durumu Değiştirildi', 'Tamamlandı/Beklemede');
        }
        if (path.includes('/tasks/') && path.includes('/archive')) {
          return this.log('Görev Arşivlendi');
        }
        if (path.includes('/tasks/') && path.includes('/unarchive')) {
          return this.log('Görev Geri Yüklendi', 'Arşivden çıkarıldı');
        }
      }
      
      // PUT istekleri - Düzenlemeler
      if (method === 'PUT') {
        if (path.includes('/api/tasks/')) {
          return this.log('Görev Düzenlendi');
        }
        if (path.includes('/api/exam-results/')) {
          return this.log('Deneme Sınav Düzenlendi');
        }
        if (path.includes('/api/question-logs/')) {
          return this.log('Soru Kaydı Düzenlendi');
        }
        if (path.includes('/api/study-hours/')) {
          return this.log('Çalışma Saati Düzenlendi');
        }
      }
      
      // DELETE istekleri - Silmeler
      if (method === 'DELETE') {
        if (path === '/api/tasks/all') {
          return this.log('❌ TÜM GÖREVLER SİLİNDİ', 'Toplu silme işlemi');
        }
        if (path === '/api/exam-results/all') {
          return this.log('❌ TÜM DENEMELER SİLİNDİ', 'Toplu silme işlemi');
        }
        if (path === '/api/question-logs/all') {
          return this.log('❌ TÜM SORU KAYITLARI SİLİNDİ', 'Toplu silme işlemi');
        }
        if (path === '/api/study-hours/all') {
          return this.log('❌ TÜM ÇALIŞMA SAATLERİ SİLİNDİ', 'Toplu silme işlemi');
        }
        if (path.includes('/api/tasks/')) {
          return this.log('Görev Silindi');
        }
        if (path.includes('/api/exam-results/')) {
          return this.log('Deneme Sınav Silindi');
        }
        if (path.includes('/api/question-logs/')) {
          return this.log('Soru Kaydı Silindi');
        }
        if (path.includes('/api/study-hours/')) {
          return this.log('Çalışma Saati Silindi');
        }
      }
      
      return null; // Log oluşturulmadı
    } catch (error) {
      console.error('Activity parse hatası:', error);
      return null;
    }
  }
}

module.exports = new ActivityLogger();


// BERAT CANKIR
// BERAT BİLAL CANKIR
// CANKIR
