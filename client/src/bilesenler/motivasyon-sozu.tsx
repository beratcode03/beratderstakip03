// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";

const ATATURK_QUOTES = [
  {
    quote: "Ey Türk gençliği! Birinci vazifen, Türk istiklalini, Türk Cumhuriyetini, ilelebet muhafaza ve müdafaa etmektir.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Gençliğe hitap ediyorum. Geleceği yarın değil, bugünden kurmaya başlamalısınız.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Çalışmak ve üretmek bütün millet fertlerine, kabiliyetleri derecesinde fırsat ve imkan hazırlayan bir hukuk sistemine dayanır.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Başarmak, elbette en büyük zevktir. Fakat benim için, başarmış olmaktan çok başarmak yolunda bulunmak daha zevklidir.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Millet için en kıymetli, en kuvvetli varlık gençliktir.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Sizler, yani yeni Türkiye'nin genç evlâtları, yorulsanız da beni izleyeceksiniz... Dinlenmemek üzere yürümeye karar verenler asla ve asla yorulmazlar. Türk gençliği gayeye, bizim yüksek idealimize durmadan, yorulmadan yürüyecektir.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Başarısızlıktan yılmamak gerekir. En kötü vaziyetlerde bile ümidi asla kaybetmemelidir.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Hayatta en hakiki mürşit ilimdir, fendir.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Gençler! Sizler her şeysiniz. Sizler, Türkiye Cumhuriyetini yaşatacak ve yükseltecek sizlersiniz.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Bir milletin en önemli sermayesi, gençliktir.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Hayatta en hakiki mürşit ilimdir, fendir. İlim ve fennin haricinde mürşit aramak gaflettir, cehalettir, delalettir.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Eğitim, insanlık aleminin karanlıktan aydınlığa çıkmasını sağlayan tek yoldur.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "İlim ve fenle alakası olmayan düşünceler, karanlıktan başka bir şey değildir.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Gelecek bugünden hazırlanır.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "İradeniz kadarlık hedefleriniz olsun.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Benim hayatta en hakiki mürşidim, ilimdir.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Geleceğin emniyet ve selametini sağlayan tek yol, ilim ve fendir.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Büyük hayaller kurmaktan korkmayın, çünkü büyük hayaller büyük insanlar yaratır.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Türk gençliği! Birinci vazifenin Türk istiklalini, Türk Cumhuriyetini sonsuza kadar korumak ve savunmaktır.",
    author: "Mustafa Kemal Atatürk"
  },
  {
    quote: "Başarı, küçük çabaların tekrar edilmesi, gün be gün, saat be saat yapılan şeylerdir.",
    author: "Robert Collier"
  },
  {
    quote: "Eğitim geleceğin anahtarıdır. Yarın, bugün hazırlanan insanlarındır.",
    author: "Malcolm X"
  },
  {
    quote: "Başarı, hazırlanma fırsatı ile karşılaştığında ortaya çıkar.",
    author: "Bobby Unser"
  },
  {
    quote: "Öğrenme asla zihnin kapasitesini tüketmez.",
    author: "Leonardo da Vinci"
  },
  {
    quote: "Çalışkan olmak yetenekten daha önemlidir.",
    author: "Tim Notke"
  },
  {
    quote: "Başarısızlık, yeniden başlamanın daha akıllı bir yoludur.",
    author: "Henry Ford"
  },
  {
    quote: "Yarın yapmayı planladığınız şeyi bugün, bugün yapmayı planladığınız şeyi şimdi yapın.",
    author: "Benjamin Franklin"
  },
  {
    quote: "Başarı son nokta değil, başarısızlık ölümcül değil: önemli olan devam etme cesareti.",
    author: "Winston Churchill"
  },
  {
    quote: "Çalışmayan doymaz, çalışkan beklemez.",
    author: "Türk Atasözü"
  },
  {
    quote: "İmkansız, sadece büyük düşünmeyenlerin sözlüğünde vardır.",
    author: "Napoléon Bonaparte"
  },
  {
    quote: "Başarının %90'ı ortaya çıkmakla ilgilidir.",
    author: "Woody Allen"
  },
  {
    quote: "Zor günler güçlü insanlar yaratır.",
    author: "G. Michael Hopf"
  },
  {
    quote: "Her gün biraz daha iyileş, her gün biraz daha öğren.",
    author: "Türk Atasözü"
  },
  {
    quote: "Azim ve kararlılık her engeli aşar.",
    author: "Leonardo da Vinci"
  },
  {
    quote: "Başarı, başarısızlığa rağmen devam etme yetisidir.",
    author: "Charles Kettering"
  },
  {
    quote: "Her başarı hikayesi, bir hayalle başlar.",
    author: "Türk Atasözü"
  },
  {
    quote: "Zorluklar seni güçlendirir, kolaylıklar seni zayıflatır.",
    author: "Türk Atasözü"
  },
  {
    quote: "Bugünün yorgunluğu, yarının başarısıdır.",
    author: "Motivasyon"
  },
  {
    quote: "Her problem, içinde çözümünü barındırır.",
    author: "Einstein"
  },
  {
    quote: "Çalışmayan el, bereketli olmaz.",
    author: "Türk Atasözü"
  },
  {
    quote: "Başarı, hazırlık ile fırsatın buluşmasıdır.",
    author: "Seneca"
  },
  {
    quote: "Çalışkan eli bereketli kılar Tanrı.",
    author: "Türk Atasözü"
  },
  {
    quote: "Bugünkü çabanız, gelecekteki gururunuzdur.",
    author: "Motivasyon"
  },
  {
    quote: "Zeka önemlidir ama azim daha önemlidir.",
    author: "Angela Duckworth"
  },
  {
    quote: "Kendine inan, dünya da sana inanacak.",
    author: "Motivasyon"
  },
  {
    quote: "Başarı merdiveni, eliniz cebinizde çıkılmaz.",
    author: "Henry Ford"
  },
  {
    quote: "Çaba göstermeyen kimse, zafer tadını bilemez.",
    author: "Türk Atasözü"
  },
  {
    quote: "Büyük hedefler, büyük cesaretler gerektirir.",
    author: "Motivasyon"
  },
  {
    quote: "Zorluklarla mücadele etmek, seni güçlendirir.",
    author: "Motivasyon"
  },
  {
    quote: "Her düşen tekrar kalkar, her kaybeden tekrar kazanır.",
    author: "Türk Atasözü"
  },
  {
    quote: "Çalışkan insan kaderini değiştirebilir.",
    author: "Türk Atasözü"
  },
  {
    quote: "Hedefe giden yolda her adım önemlidir.",
    author: "Motivasyon"
  },
  {
    quote: "Çaba eden, hedefine ulaşır.",
    author: "Motivasyon"
  },
  {
    quote: "Yarının liderleri, bugünün öğrencileridir.",
    author: "Motivasyon"
  },
  {
    quote: "Her yeni bilgi, seni daha güçlü yapar.",
    author: "Motivasyon"
  },
  {
    quote: "Başarı yolunda her engel, seni daha güçlü yapar.",
    author: "Motivasyon"
  },
  {
    quote: "Bugünkü fedakarlığınız, yarınki mutluluğunuzdur.",
    author: "Motivasyon"
  },
  {
    quote: "Çalışan el dolu olur, tembel el boş kalır.",
    author: "Türk Atasözü"
  },
  {
    quote: "Her başarılı insanın arkasında, büyük bir çaba vardır.",
    author: "Motivasyon"
  },
  {
    quote: "Vazgeçmeyin, çünkü büyük şeyler zaman alır.",
    author: "Motivasyon"
  },
  {
    quote: "Başarı planla gelir, şansla değil.",
    author: "Benjamin Franklin"
  },
  {
    quote: "Çalışkan olmak, şanslı olmaktan daha önemlidir.",
    author: "Gary Player"
  },
  {
    quote: "Bugün atılan her adım, geleceğin temelini atar.",
    author: "Motivasyon"
  },
  {
    quote: "Cesaret eksikliği, başarının en büyük düşmanıdır.",
    author: "Motivasyon"
  },
  {
    quote: "Azim dağları yerinden oynatır.",
    author: "Türk Atasözü"
  },
  {
    quote: "Bugünkü eksiğiniz, yarınki eksiğiniz olmasın.",
    author: "Motivasyon"
  },
  {
    quote: "Çalışmak hayatın en büyük zevkidir.",
    author: "Khalil Gibran"
  },
  {
    quote: "Sebat eden mutlaka kazanır.",
    author: "Türk Atasözü"
  },
  {
    quote: "Öğrenmek, en değerli yatırımdır.",
    author: "Benjamin Franklin"
  },
  {
    quote: "Her çaba, sizi hedefe biraz daha yaklaştırır.",
    author: "Motivasyon"
  },
  {
    quote: "Başarı, kesin kararlılığın ürünüdür.",
    author: "Motivasyon"
  },
  {
    quote: "Çalışma azmi, başarının garantisidir.",
    author: "Motivasyon"
  },
  {
    quote: "Hedefine odaklan, başaracaksın.",
    author: "Motivasyon"
  },
  {
    quote: "Çaba gösterenin yolu açık olur.",
    author: "Türk Atasözü"
  },
  {
    quote: "Başarı, istikrarlı çalışmanın meyvesidir.",
    author: "Motivasyon"
  },
  {
    quote: "Başarı için çalışmaktan başka yol yoktur.",
    author: "Thomas Edison"
  },
  {
    quote: "Azim ile başarılmayacak hiçbir şey yoktur.",
    author: "Motivasyon"
  },
  {
    quote: "Her gün yeni bir sayfa, yeni bir şans.",
    author: "Motivasyon"
  },
  {
    quote: "Çalışkan ol, başarılı ol, mutlu ol.",
    author: "Motivasyon"
  },
  {
    quote: "Hedefiniz net olsun, çabanız sürekli olsun.",
    author: "Motivasyon"
  },
  {
    quote: "Zorluklar büyütür, kolaylıklar küçültür.",
    author: "Türk Atasözü"
  },
  {
    quote: "Başarı, işe odaklanmakla gelir.",
    author: "Bill Gates"
  },
  {
    quote: "Çaba sarf etmeyen, zafer tadını bilmez.",
    author: "Motivasyon"
  },
  {
    quote: "Her adım sizi hedefinize biraz daha yaklaştırır.",
    author: "Motivasyon"
  },
  {
    quote: "Başarı yolunda her günün kendine has değeri vardır.",
    author: "Motivasyon"
  },
  {
    quote: "Azimli olan, asla yenilmez.",
    author: "Napoléon Bonaparte"
  },
  {
    quote: "Çalışmanın karşılığı mutlaka alınır.",
    author: "Türk Atasözü"
  },
  {
    quote: "Bugün ekilen tohum, yarın hasat edilir.",
    author: "Motivasyon"
  },
  {
    quote: "Her çaba, sizi hedefe bir adım daha yaklaştırır.",
    author: "Motivasyon"
  },
  {
    quote: "Başarı sabır ister, sabır da azim.",
    author: "Türk Atasözü"
  },
  {
    quote: "Hedeflerinizi büyük tutun, çabalarınızı büyütün.",
    author: "Motivasyon"
  },
  {
    quote: "Çaba gösterenin yolu açılır.",
    author: "Türk Atasözü"
  },
  {
    quote: "Başarı, hazırlanmış olanların eseridir.",
    author: "Louis Pasteur"
  },
  {
    quote: "Her gün yeni bir fırsat, yeni bir başlangıç.",
    author: "Motivasyon"
  },
  {
    quote: "Azim, en büyük yetenektir.",
    author: "Grit"
  },
  {
    quote: "Çalışmanın meyvesi tatlıdır.",
    author: "Türk Atasözü"
  },
  {
    quote: "Hedefine ulaşmak isteyenin durması yasak.",
    author: "Motivasyon"
  },
  {
    quote: "Her zorluk, sizi daha güçlü yapar.",
    author: "Motivasyon"
  },
  {
    quote: "Çaba eden hiçbir zaman pişman olmaz.",
    author: "Türk Atasözü"
  },
  {
    quote: "Başarı, tutarlı çabanın sonucudur.",
    author: "Motivasyon"
  },
  {
    quote: "Her adım sizi zirveye biraz daha yaklaştırır.",
    author: "Motivasyon"
  },
  {
    quote: "Sebat eden, galip gelir.",
    author: "Türk Atasözü"
  },
  {
    quote: "Hedefleriniz kadar büyük hayaller kurun.",
    author: "Motivasyon"
  },
  {
    quote: "Başarıya giden yolda durmak yoktur.",
    author: "Motivasyon"
  },
  {
    quote: "YKS bir maraton değil, disiplinli bir yürüyüştür. Her gün bir adım daha atın.",
    author: "Motivasyon"
  },
  {
    quote: "Bugün çözdüğünüz her soru, yarınki başarınızın tuğlasıdır.",
    author: "Motivasyon"
  },
  {
    quote: "Ders çalışmak yorucu olabilir, ama başarısızlık daha yorucudur.",
    author: "Motivasyon"
  },
  {
    quote: "Hedeflediğiniz üniversite, bugünkü çalışmanızın karşılığıdır.",
    author: "Motivasyon"
  },
  {
    quote: "Her deneme, sınavın provası değil, başarının anahtarıdır.",
    author: "Motivasyon"
  },
  {
    quote: "Matematik zor değil, sadece pratik ister. Çözdükçe kolaylaşır.",
    author: "Motivasyon"
  },
  {
    quote: "Yorgunluk geçicidir, başarı kalıcıdır.",
    author: "Motivasyon"
  },
  {
    quote: "Her yanlış konu, bir fırsat demektir. Tekrar et, öğren, başar.",
    author: "Motivasyon"
  },
  {
    quote: "Sınav günü panik yapmak için değil, hazırlığınızı göstermek içindir.",
    author: "Motivasyon"
  },
  {
    quote: "Gençliğin en güzel yatırımı, kendine yapılan eğitim yatırımıdır.",
    author: "Motivasyon"
  },
  {
    quote: "Çalışma saatleriniz az olabilir, ama veriminiz yüksek olsun.",
    author: "Motivasyon"
  },
  {
    quote: "YKS'de başarı tesadüf değil, planın ürünüdür.",
    author: "Motivasyon"
  },
  {
    quote: "Her soru çözümü, zihninizi bir adım daha güçlendirir.",
    author: "Motivasyon"
  },
  {
    quote: "Başarısız deneme olmaz, sadece öğrenme fırsatları vardır.",
    author: "Motivasyon"
  },
  {
    quote: "Hedefiniz net, çalışmanız düzenli olsun. Başarı kendiliğinden gelir.",
    author: "Motivasyon"
  },
  {
    quote: "Bugün vazgeçerseniz, yarın pişman olursunuz. Devam edin!",
    author: "Motivasyon"
  },
  {
    quote: "Sınav stresi değil, hazırlık eksikliği korkutur. Çalışın, rahat olun.",
    author: "Motivasyon"
  },
  {
    quote: "Her gün biraz daha ilerleyin, gerisi kendiliğinden gelir.",
    author: "Motivasyon"
  },
  {
    quote: "Disiplin, motivasyondan daha güçlüdür. Disiplinli olun.",
    author: "Motivasyon"
  },
  {
    quote: "Başarı bir gecede gelmez, ama her gece çalışarak yaklaşırsınız.",
    author: "Motivasyon"
  }
];

export function MotivationalQuote() {
  // Her sayfa yüklendiğinde rastgele bir söz seç - interval yok
  const currentQuote = useMemo(() => {
    return ATATURK_QUOTES[Math.floor(Math.random() * ATATURK_QUOTES.length)];
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 flex-1">
      <span className="text-sm italic text-muted-foreground">
        "{currentQuote.quote}"
      </span>
      <span className="text-xs text-purple-600 dark:text-purple-400">
        — {currentQuote.author}
      </span>
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
