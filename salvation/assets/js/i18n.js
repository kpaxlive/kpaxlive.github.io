/* Turkish and English. Loaded in <head>, before the page paints: picks the
   language (saved choice, else the browser's first language), and once the
   page is parsed fills every [data-i18n] element from the strings below.
   The HTML ships with the Turkish text, for visitors without JavaScript and
   for search engines. */
(function () {
  "use strict";

  const STRINGS = {
    tr: {
      "meta.title.home": "Scroll Quran · Günün ayetleri, Dua Odası ve Kur’an",
      "meta.desc.home": "Günün ayetlerini kaydırarak oku, Dua Odası’nda birlikte âmin de, 114 sureyi kelime kelime takip ederek dinle. iPhone için Scroll Quran.",
      "meta.title.privacy": "Gizlilik Politikası · Scroll Quran",
      "meta.desc.privacy": "Scroll Quran’ın hangi verileri neden işlediği ve hakların.",
      "meta.title.terms": "Kullanım Koşulları · Scroll Quran",
      "meta.desc.terms": "Scroll Quran’ı kullanırken geçerli olan koşullar.",
      "meta.title.404": "Sayfa bulunamadı · Scroll Quran",

      skip: "İçeriğe geç",
      "nav.verses": "Günün Ayetleri",
      "nav.prayer": "Dua Odası",
      "nav.quran": "Kur’an",
      "nav.contact": "İletişim",
      "nav.download": "İndir",
      "nav.menu": "Menü",
      "nav.home": "Ana sayfa",
      "nav.privacy": "Gizlilik",
      "nav.terms": "Koşullar",

      "store.small": "App Store’dan",
      "store.big": "İndirin",

      "hero.eyebrow": "<span lang=\"en\">iPhone</span> için Kur’an uygulaması",
      "hero.title": "Her güne Kur’an’dan bir ışık.",
      "hero.lead": "Scroll Quran; günün ayetlerini kaydırarak okuduğun, Dua Odası’nda başkalarının dualarına âmin dediğin ve 114 sureyi kelime kelime takip ederek dinlediğin sade bir Kur’an uygulaması.",
      "hero.how": "Nasıl çalışır",
      "hero.scroll": "Kaydır",
      "hero.f1": "<strong>114</strong>sure",
      "hero.f2": "<strong>6.236</strong>ayet",
      "hero.f3": "<strong>4</strong>okuyuş",

      "manifesto.text": "Telefonu her elimize aldığımızda bir şey bizi bekliyor: bildirimler, haberler, bitmeyen akışlar. Scroll Quran o anın küçük bir kısmını geri istiyor. <span class=\"accent\">Birkaç ayet. Bir dua. Bir sure.</span> O kadar.",
      "manifesto.meal": "“Bilesiniz ki, kalpler ancak Allah’ı anmakla huzur bulur.” <span>Ra’d Suresi · 28. Ayet</span>",

      "ch1.eyebrow": "01 — Günün Ayetleri",
      "ch1.title": "Kaydır. Dur. Düşün.",
      "ch1.body": "Her gün on kısa ayet; her biri tek nefeste okunacak kadar. Akış herkes için aynı ve her gece yarısı yenileniyor. Bir sonraki ayete geçmek için yukarı kaydırman yeterli.",
      "ch1.li1": "Beğendiğin ayetler Beğendiklerim’de toplanır.",
      "ch1.li2": "Her ayeti seçtiğin okuyuşla dinleyebilirsin.",
      "ch1.li3": "Paylaş’a dokun; ayet, hikâyende paylaşabileceğin bir görsele dönüşür.",
      "ch1.live": "Telefondakiler <b>bugünün ayetleri</b>.",

      "ch2.eyebrow": "02 — Dua Odası",
      "ch2.title": "Herkes aynı anda, aynı duada.",
      "ch2.body": "Dua Odası’nda dualar bir zincir gibi akar. Her dua beş dakika ekranda kalır ve o beş dakika boyunca dünyanın her yerinde aynı dua okunur. Âmin dediğinde, o anda orada olan herkesle birlikte demiş olursun.",
      "ch2.li1": "Kalbinle destekle ya da “bu dua için dua ediyorum” de.",
      "ch2.li2": "Kaç kişinin âmin dediğini canlı olarak görürsün.",
      "ch2.li3": "Sırada kaç duanın beklediğini görürsün; birkaç dakikada bir yenisi gelir.",
      "ch2.live": "Şu an odada: <b data-live-topic>…</b> · <span class=\"tabular\" data-live-left>5:00</span> kaldı",

      "ch3.eyebrow": "03 — Kur’an",
      "ch3.title": "Dinle, kelime kelime takip et.",
      "ch3.body": "114 surenin tamamı, Arapça aslı ve mealiyle. Okuyuşu dinlerken okunan kelime parlar; nerede olduğunu hiç kaybetmezsin. Sureleri indirip internet olmadan da dinleyebilirsin.",
      "ch3.listen": "Fâtiha’yı dinle",
      "ch3.pause": "Durdur",
      "ch3.listen_note": "Sesi aç; telefondaki kelimeler okuyuşla birlikte parlar.",
      "ch3.reciters": "Dört okuyuş arasından seç",
      "rec.1": "Tertil · Ahenkli",
      "rec.2": "Tertil · Klasik",
      "rec.3": "Tertil · Öğretici",
      "rec.4": "Tertil · Hüzünlü",

      "details.eyebrow": "Ayrıntılar",
      "details.title": "Küçük şeyler, özenle.",
      "details.lead": "Bir uygulamayı her gün açılası kılan, çoğu zaman kimsenin fark etmediği ayrıntılardır.",
      "d1.t": "Kaldığın yer",
      "d1.p": "Kur’an’da en son okuduğun ya da dinlediğin ayet kaydedilir; döndüğünde oradan devam edersin.",
      "d2.t": "İndirilenler",
      "d2.p": "Sureleri bir kez indir; uçakta, yolda, internet yokken dinle.",
      "d3.t": "Ekran kapalıyken",
      "d3.p": "Okuyuş arka planda sürer; kilit ekranından durdurabilir, ayet atlayabilirsin.",
      "d4.t": "Beğendiklerim",
      "d4.p": "Kalbine dokunan ayetler, istediğin zaman dönebileceğin tek bir listede.",
      "d5.t": "Hikâye görseli",
      "d5.p": "Paylaştığın ayet, Instagram hikâyesi ölçüsünde, kırpılmayan sade bir görsel olur.",
      "d6.t": "Türkçe ve İngilizce",
      "d6.p": "Arayüz de meal de seçtiğin dilde; Dua Odası’ndaki dualar da.",

      "promise.eyebrow": "Gizlilik",
      "promise.title": "Hesap yok. Sadece sen ve Kur’an.",
      "promise.body": "Scroll Quran’ı kullanmak için hesap açmana gerek yok. Adını, e-postanı ya da telefon numaranı hiç sormuyoruz.",
      "promise.k1": "Cihazında kalır",
      "promise.v1": "Beğendiğin ayetler, kaldığın yer, dil ve okuyuş tercihlerin, indirdiğin sureler.",
      "promise.k2": "Asla",
      "promise.v2": "Reklam için kullanılmaz, satılmaz. Seni başka uygulamalarda takip etmeyiz.",
      "promise.k3": "Yalnızca",
      "promise.v3": "Uygulamayı iyileştirmek için anonim kullanım istatistikleri ve çökme raporları.",
      "promise.link": "Gizlilik politikasını oku",

      "cta.title": "Bugünün ayetleri seni bekliyor.",
      "cta.lead": "Scroll Quran’ı iPhone’una indir; ilk ayet bir kaydırma uzağında.",
      "cta.note": "iOS 15 ve üzeri · Türkçe, English",

      "footer.tag": "Günün ayetleri, Dua Odası ve Kur’an; tek, sakin bir uygulamada.",
      "footer.app": "Uygulama",
      "footer.legal": "Yasal",
      "footer.privacy": "Gizlilik Politikası",
      "footer.terms": "Kullanım Koşulları",
      "footer.contact": "İletişim",
      "footer.sources": "Arapça metin: <a href=\"https://tanzil.net\" rel=\"noopener\">Tanzil Projesi</a> (CC BY 3.0, değiştirilmeden). Türkçe, Endonezce, Malayca, Fransızca, Almanca, İspanyolca, Rusça, Hintçe, Bengalce ve Urduca mealler ile Arapça tefsir: <a href=\"https://quranenc.com\" rel=\"noopener\">QuranEnc</a> (değiştirilmeden). İngilizce meal: Talal Itani, <a href=\"https://www.clearquran.com\" rel=\"noopener\">ClearQuran</a>. Tilavetler: <a href=\"https://alquran.cloud\" rel=\"noopener\">Islamic Network</a>. Kelime zamanlamaları: <a href=\"https://github.com/cpfair/quran-align\" rel=\"noopener\">quran-align</a>.",
      "footer.copy": "© 2026 Scroll Quran",

      "contact.title": "Bize yaz",
      "contact.body": "Soru, öneri ya da bir hata bildirimi için bize e-posta gönderebilirsin.",
      "contact.copy": "Kopyala",
      "contact.copied": "Kopyalandı",
      "contact.send": "E-posta gönder",
      "contact.close": "Kapat",

      "legal.toc": "Bu sayfada",
      "legal.privacy": "Gizlilik Politikası",
      "legal.privacy_lead": "Hangi verinin neden işlendiğini ve haklarını sade bir dille anlattık.",
      "legal.terms": "Kullanım Koşulları",
      "legal.terms_lead": "Scroll Quran’ı kullanırken geçerli olan kurallar.",
      "legal.credits": "Kaynaklar",
      "legal.credits_lead": "Uygulamadaki Kur’an metni, mealler ve tilavetlerin kaynakları.",
      "meta.title.credits": "Kaynaklar · Scroll Quran",
      "meta.desc.credits": "Scroll Quran’daki Kur’an metni, mealler ve tilavetlerin kaynakları.",
      "footer.credits": "Kaynaklar",

      "404.title": "Aradığın sayfa burada değil.",
      "404.back": "Ana sayfaya dön",

      // The phone's screens, in the app's own words.
      "ui.verses_title": "Günün Ayetleri",
      "ui.ref": "{s} Suresi · {n}. Ayet",
      "ui.like": "Beğen",
      "ui.listen": "Dinle",
      "ui.share": "Paylaş",
      "ui.next_hint": "Sıradaki ayet · yukarı kaydır",
      "ui.nav_verses": "Ayetler",
      "ui.nav_prayer": "Dua Odası",
      "ui.nav_quran": "Kur’an",
      "ui.prayer_title": "Dua Odası",
      "ui.prayer_sub": "Birlikte dua edelim",
      "ui.support": "Kalbimle\ndestekliyorum",
      "ui.praying": "Bu dua için\ndua ediyorum",
      "ui.amin": "Âmin",
      "ui.first_amin": "İlk âmini sen de",
      "ui.you_amin": "Âmin dedin · Allah kabul etsin",
      "ui.queue": "Sırada 4 dua var",
      "ui.amin_hint": "Dokun, âmin de",
      "ui.quran": "Kur’an",
      "ui.surah": "{s} Suresi",
      "ui.listening": "<b>{n}. Ayet</b> · Tertil · Ahenkli",
      "ui.date_pattern": "{day} {weekday}",

      "cat.aile": "Aile için",
      "cat.anne_baba": "Anne baba için",
      "cat.evlat": "Evlat için",
      "cat.sifa": "Şifa için",
      "cat.rizik": "Rızık için",
      "cat.borc": "Borçtan kurtuluş için",
      "cat.ilim": "İlim için",
      "cat.hidayet": "Hidayet için",
      "cat.tovbe": "Tövbe",
      "cat.sabir": "Sabır için",
      "cat.huzur": "Huzur için",
      "cat.sukur": "Şükür",
      "cat.evlilik": "Hayırlı bir yuva için",
      "cat.ahiret": "Ahiret için",
      "cat.ummet": "Ümmet için",
      "cat.ibadet": "İbadet için",
      "cat.ahlak": "Güzel ahlak için",
      "cat.yolculuk": "Yolculuk için",
      "cat.dostluk": "Dostluk için",
      "cat.kabul": "Kabul için",
    },

    en: {
      "meta.title.home": "Scroll Quran · Daily verses, the Prayer Room and the Quran",
      "meta.desc.home": "Scroll through the day's verses, say ameen together in the Prayer Room, and listen to all 114 surahs word by word. Scroll Quran for iPhone.",
      "meta.title.privacy": "Privacy Policy · Scroll Quran",
      "meta.desc.privacy": "Which data Scroll Quran processes, why, and your rights.",
      "meta.title.terms": "Terms of Use · Scroll Quran",
      "meta.desc.terms": "The terms that apply when you use Scroll Quran.",
      "meta.title.404": "Page not found · Scroll Quran",

      skip: "Skip to content",
      "nav.verses": "Daily Verses",
      "nav.prayer": "Prayer Room",
      "nav.quran": "Quran",
      "nav.contact": "Contact",
      "nav.download": "Download",
      "nav.menu": "Menu",
      "nav.home": "Home",
      "nav.privacy": "Privacy",
      "nav.terms": "Terms",

      "store.small": "Download on the",
      "store.big": "App Store",

      "hero.eyebrow": "A Quran app for iPhone",
      "hero.title": "A light from the Quran for every day.",
      "hero.lead": "Scroll Quran is a simple Quran app: scroll through the day’s verses, say ameen to other people’s prayers in the Prayer Room, and listen to all 114 surahs while following along word by word.",
      "hero.how": "How it works",
      "hero.scroll": "Scroll",
      "hero.f1": "<strong>114</strong>surahs",
      "hero.f2": "<strong>6,236</strong>verses",
      "hero.f3": "<strong>4</strong>recitations",

      "manifesto.text": "Every time we pick up our phones, something is waiting: notifications, headlines, feeds that never end. Scroll Quran asks for a small part of that moment back. <span class=\"accent\">A few verses. A prayer. A surah.</span> That’s all.",
      "manifesto.meal": "“Surely, it is in the remembrance of Allah that hearts find comfort.” <span>Surah Ra’d · Verse 28</span>",

      "ch1.eyebrow": "01 — Verses of the Day",
      "ch1.title": "Scroll. Pause. Reflect.",
      "ch1.body": "Ten short verses every day, each short enough to read in a single breath. Everyone gets the same feed, and it renews at midnight. To move on to the next verse, just swipe up.",
      "ch1.li1": "The verses you like are gathered in Liked Verses.",
      "ch1.li2": "Listen to any verse in the recitation you’ve chosen.",
      "ch1.li3": "Tap Share and the verse becomes an image ready for your story.",
      "ch1.live": "The phone is showing <b>today’s verses</b>.",

      "ch2.eyebrow": "02 — Prayer Room",
      "ch2.title": "Everyone, the same prayer, the same moment.",
      "ch2.body": "In the Prayer Room, prayers flow like a chain. Each stays for five minutes, and for those five minutes the same prayer is on every screen around the world. When you say ameen, you say it together with everyone who is there at that moment.",
      "ch2.li1": "Support it with your heart, or let them know you’re praying for it.",
      "ch2.li2": "See live how many people have said ameen.",
      "ch2.li3": "See how many prayers are waiting in line; a new one comes every few minutes.",
      "ch2.live": "In the room now: <b data-live-topic>…</b> · <span class=\"tabular\" data-live-left>5:00</span> left",

      "ch3.eyebrow": "03 — Quran",
      "ch3.title": "Listen, and follow every word.",
      "ch3.body": "All 114 surahs, in the original Arabic with a translation. As the recitation plays, the word being recited lights up, so you never lose your place. Download surahs to listen without a connection.",
      "ch3.listen": "Listen to Al-Fatiha",
      "ch3.pause": "Pause",
      "ch3.listen_note": "Turn your sound on; the words on the phone light up with the recitation.",
      "ch3.reciters": "Choose from four recitations",
      "rec.1": "Murattal · Melodic",
      "rec.2": "Murattal · Classic",
      "rec.3": "Murattal · Instructive",
      "rec.4": "Murattal · Tender",

      "details.eyebrow": "The details",
      "details.title": "Small things, done with care.",
      "details.lead": "It’s usually the details nobody notices that make an app worth opening every day.",
      "d1.t": "Where you left off",
      "d1.p": "The last verse you read or listened to is saved, so you pick up right there when you return.",
      "d2.t": "Downloads",
      "d2.p": "Download a surah once; listen on a plane, on the road, offline.",
      "d3.t": "With the screen off",
      "d3.p": "Recitation keeps playing in the background; pause or skip from the lock screen.",
      "d4.t": "Liked Verses",
      "d4.p": "The verses that touched your heart, in one list to come back to whenever you like.",
      "d5.t": "Story images",
      "d5.p": "A verse you share becomes a clean image sized for Instagram stories, never cropped.",
      "d6.t": "Turkish and English",
      "d6.p": "The interface and the translation in the language you choose, and the prayers too.",

      "promise.eyebrow": "Privacy",
      "promise.title": "No account. Just you and the Quran.",
      "promise.body": "You don’t need an account to use Scroll Quran. We never ask for your name, email address or phone number.",
      "promise.k1": "Stays on your device",
      "promise.v1": "The verses you like, where you left off, your language and recitation choices, your downloads.",
      "promise.k2": "Never",
      "promise.v2": "Used for advertising or sold. We don’t track you across other apps.",
      "promise.k3": "Only",
      "promise.v3": "Anonymous usage statistics and crash reports, to make the app better.",
      "promise.link": "Read the privacy policy",

      "cta.title": "Today’s verses are waiting for you.",
      "cta.lead": "Download Scroll Quran for your iPhone. The first verse is one swipe away.",
      "cta.note": "iOS 15 or later · English, Türkçe",

      "footer.tag": "The day’s verses, the Prayer Room and the Quran, in one quiet app.",
      "footer.app": "App",
      "footer.legal": "Legal",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Use",
      "footer.contact": "Contact",
      "footer.sources": "Arabic text: <a href=\"https://tanzil.net\" rel=\"noopener\">Tanzil Project</a> (CC BY 3.0, unmodified). Turkish, Indonesian, Malay, French, German, Spanish, Russian, Hindi, Bengali and Urdu translations and the Arabic tafsir: <a href=\"https://quranenc.com\" rel=\"noopener\">QuranEnc</a> (unmodified). English translation: Talal Itani, <a href=\"https://www.clearquran.com\" rel=\"noopener\">ClearQuran</a>. Recitations: <a href=\"https://alquran.cloud\" rel=\"noopener\">Islamic Network</a>. Word timings: <a href=\"https://github.com/cpfair/quran-align\" rel=\"noopener\">quran-align</a>.",
      "footer.copy": "© 2026 Scroll Quran",

      "contact.title": "Write to us",
      "contact.body": "For questions, suggestions or to report a bug, send us an email.",
      "contact.copy": "Copy",
      "contact.copied": "Copied",
      "contact.send": "Send an email",
      "contact.close": "Close",

      "legal.toc": "On this page",
      "legal.privacy": "Privacy Policy",
      "legal.privacy_lead": "What data is processed, why, and what your rights are, in plain language.",
      "legal.terms": "Terms of Use",
      "legal.terms_lead": "The rules that apply when you use Scroll Quran.",
      "legal.credits": "Sources",
      "legal.credits_lead": "Where the Quran text, translations and recitations in the app come from.",
      "meta.title.credits": "Sources · Scroll Quran",
      "meta.desc.credits": "The sources of the Quran text, translations and recitations in Scroll Quran.",
      "footer.credits": "Sources",

      "404.title": "The page you’re looking for isn’t here.",
      "404.back": "Back to the home page",

      "ui.verses_title": "Verses of the Day",
      "ui.ref": "Surah {s} · Verse {n}",
      "ui.like": "Like",
      "ui.listen": "Listen",
      "ui.share": "Share",
      "ui.next_hint": "Next verse · swipe up",
      "ui.nav_verses": "Verses",
      "ui.nav_prayer": "Prayer Room",
      "ui.nav_quran": "Quran",
      "ui.prayer_title": "Prayer Room",
      "ui.prayer_sub": "Let’s pray together",
      "ui.support": "I support\nwith my heart",
      "ui.praying": "I’m praying\nfor this",
      "ui.amin": "Ameen",
      "ui.first_amin": "Be the first to say ameen",
      "ui.you_amin": "You said ameen · May it be accepted",
      "ui.queue": "4 prayers in queue",
      "ui.amin_hint": "Tap to say ameen",
      "ui.quran": "Quran",
      "ui.surah": "Surah {s}",
      "ui.listening": "<b>Verse {n}</b> · Murattal · Melodic",
      "ui.date_pattern": "{weekday}, {day}",

      "cat.aile": "For family",
      "cat.anne_baba": "For parents",
      "cat.evlat": "For children",
      "cat.sifa": "For healing",
      "cat.rizik": "For provision",
      "cat.borc": "For relief from debt",
      "cat.ilim": "For knowledge",
      "cat.hidayet": "For guidance",
      "cat.tovbe": "Repentance",
      "cat.sabir": "For patience",
      "cat.huzur": "For peace",
      "cat.sukur": "Gratitude",
      "cat.evlilik": "For a blessed marriage",
      "cat.ahiret": "For the hereafter",
      "cat.ummet": "For the Ummah",
      "cat.ibadet": "For worship",
      "cat.ahlak": "For good character",
      "cat.yolculuk": "For travel",
      "cat.dostluk": "For friendship",
      "cat.kabul": "For acceptance",
    },
  };

  const STORAGE_KEY = "salvation.lang";
  const root = document.documentElement;

  // The legal pages come in every language the app has; the app opens them
  // with ?lang=<its language>. The rest of the site is Turkish or English.
  const LEGAL_LANGUAGES = ["tr", "en", "ar", "id", "ms", "fr", "de", "es", "ru", "hi", "bn", "ur"];
  const asked = new URLSearchParams(location.search).get("lang");
  let legalLang = LEGAL_LANGUAGES.includes(asked) ? asked : null;

  function detect() {
    if (legalLang === "tr" || legalLang === "en") return legalLang;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "tr" || saved === "en") return saved;
    } catch (_) {}
    const first = (navigator.languages && navigator.languages[0]) || navigator.language || "tr";
    return /^tr\b/i.test(first) ? "tr" : "en";
  }

  let lang = detect();
  root.lang = lang;
  if (lang !== "tr") {
    // The HTML is Turkish: hide it until the English is in (and never
    // longer than a moment, should something fail).
    root.classList.add("i18n-pending");
    setTimeout(() => root.classList.remove("i18n-pending"), 1500);
  }

  /** The string [key] in the current language, {name}s filled from [vars]. */
  function t(key, vars) {
    let value = STRINGS[lang][key] ?? STRINGS.tr[key] ?? key;
    if (vars) value = value.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? vars[name] : ""));
    return value;
  }

  function apply() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = STRINGS[lang][el.dataset.i18n];
      if (value != null && el.innerHTML !== value) el.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      for (const pair of el.dataset.i18nAttr.split(";")) {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key && STRINGS[lang][key] != null) el.setAttribute(attr, STRINGS[lang][key]);
      }
    });
    const shown = legalLang || lang;
    let article = null;
    document.querySelectorAll("[data-lang-block]").forEach((el) => {
      el.hidden = el.dataset.langBlock !== shown;
      if (!el.hidden) article = el;
    });
    // A language the site itself lacks: the heading in that language too,
    // without the Turkish or English line under it.
    const own = shown !== lang && article;
    document.querySelectorAll("[data-legal-title]").forEach((el) => {
      if (own) el.textContent = article.dataset.title;
      el.lang = own ? article.lang : "";
      el.dir = own ? article.dir : "";
    });
    document.querySelectorAll("[data-legal-lead]").forEach((el) => {
      el.hidden = Boolean(own);
    });
    document.querySelectorAll("[data-legal-lang]").forEach((link) => {
      if (link.dataset.legalLang === shown) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
    });
    root.classList.remove("i18n-pending");
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  function set(next) {
    if (!STRINGS[next] || (next === lang && !legalLang)) return;
    // Choosing Turkish or English shows the legal text in it too.
    if (legalLang) {
      legalLang = null;
      history.replaceState(null, "", location.pathname + location.hash);
    }
    lang = next;
    root.lang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (_) {}
    apply();
  }

  window.I18N = {
    get lang() {
      return lang;
    },
    t,
    set,
    apply,
  };

  document.addEventListener("DOMContentLoaded", apply);
})();
