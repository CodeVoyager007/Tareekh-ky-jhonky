import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Volume2, Timer, Sparkles, ChevronRight, Globe, X, Loader2, AlertCircle } from 'lucide-react';
import { THEME } from '../constants';
import { Language } from '../types';
import { translateStory } from '../lib/gemini';
import { speakStory, stopSpeech } from '../lib/voice';

// 30 Daily elements
const DAILY_ELEMENTS = [
  {
    id: 'daily1',
    name: 'Wazir Khan Mosque Tilework',
    urduName: 'کاشی کاری - مسجد وزیر خان',
    era: 'Mughal, 1634 CE',
    image: '/api/place-photo?query=Wazir Khan Mosque',
    story: 'The tilework of Wazir Khan Mosque, known as "Qashani," represents a high point in Mughal decorative arts. Unlike the red sandstone of the Badshahi Mosque, this structure is made of small, kiln-fired bricks decorated with Kashi-kari (tile mosaics) and Fresco-al-Naqsh (painting on wet plaster). A unique local feature is the "Calligrapher\'s Bazaar" integrated into the entrance, which original architect Wazir Khan designed to provide a steady income for the mosque\'s upkeep through rents from 22 integrated shops.'
  },
  {
    id: 'daily2',
    name: 'Priest-King of Mohenjo-daro',
    urduName: 'موئن جو دڑو کا پروہت راجہ',
    era: 'Bronze Age, 2000 BCE',
    image: '/api/place-photo?query=Mohenjo-daro',
    story: 'Discovered in 1927 by archaeologist Kashinath Narayan Dikshit in the DK-G area of Mohenjo-daro, this 17.5cm soapstone figure is a pinnacle of Indus Valley sculpture. Factual analysis shows the trefoil motif on his cloak was originally inlaid with red paste. The fillet on his head and the matching armband indicate a position of high authority, while the half-closed eyes suggest he might be in a state of yogic meditation, a discovery that links ancient spiritual practices across millennia.'
  },
  {
    id: 'daily3',
    name: 'Taxila Stupa',
    urduName: 'ٹیکسلا کا اسٹوپا',
    era: 'Kushan Empire, 2nd Century',
    image: '/api/place-photo?query=Taxila Museum',
    story: 'The Dharmarajika Stupa in Taxila is a monumental structure that was first established by Emperor Ashoka. Practical excavations revealed that the stupa was built using a "wheel-and-spoke" structural plan to provide stability. Archaeologists found silver and gold relics of the Buddha inside a central chamber. The site was once a massive university campus, where the scholar Panini is believed to have standardized the Sanskrit grammar.'
  },
  {
    id: 'daily4',
    name: 'Shalimar Gardens Fountains',
    urduName: 'شالیمار باغ کے فوارے',
    era: 'Mughal, 1641 CE',
    image: '/api/place-photo?query=Shalamar Gardens',
    story: 'The gardens feature 410 fountains powered by a sophisticated 17th-century hydraulic system. Water was brought from 160km away near Rajpur via the "Shah Nahar" (Royal Canal). The system used precise gravity-fed pressure to ensure the fountains in the lower level (Hayat Baksh) stayed active. Local history remembers the "Sawan Bhadon" pavilions, where water fell behind marble niches lit by candles to create a shimmering rain-like effect.'
  },
  {
    id: 'daily5',
    name: 'Katas Raj Temples',
    urduName: 'کٹاس راج مندر',
    era: '7th - 10th Century CE',
    image: '/api/place-photo?query=Katas Raj Temples',
    story: 'The Katas Raj Temples are a complex of several Hindu temples connected to one another by walkways. Surrounded by a pond named Katas, which is believed by Hindus to have been created from the teardrops of Lord Shiva, the temples represent a vibrant multi-millennial history of the region.'
  },
  {
    id: 'daily6',
    name: 'Khewra Salt Mine',
    urduName: 'کھیوڑہ نمک کی کان',
    era: '320 BCE (Alexandrian era)',
    image: '/api/place-photo?query=Khewra Salt Mine',
    story: 'Known as the world\'s second largest salt mine, Khewra was discovered by the horses of Alexander the Great. Today, it features a small mosque made entirely of salt bricks and complex tunnels that glow with pink Himalayan salt.'
  },
  {
    id: 'daily7',
    name: 'Hiran Minar',
    urduName: 'ہرن مینار',
    era: 'Mughal, 1606 CE',
    image: '/api/place-photo?query=Hiran Minar',
    story: 'Built by Emperor Jahangir as a monument to his beloved pet antelope, Mansiraj. It features a unique 100-foot tower and a massive water tank with a central pavilion, designed as a royal hunting retreat and a place of quiet reflection.'
  },
  {
    id: 'daily8',
    name: 'Derawar Fort',
    urduName: 'قلعہ دراوڑ',
    era: '9th Century CE',
    image: '/api/place-photo?query=Derawar Fort',
    story: 'Rising from the Cholistan Desert, the massive bastions of Derawar Fort are visible for miles. Built by Rai Jajja Bhatti, it was later reclaimed and rebuilt by the Nawabs of Bahawalpur. It remains a powerful symbol of desert resilience and royal power.'
  },
  {
    id: 'daily9',
    name: 'Makli Necropolis',
    urduName: 'مکلی کا قبرستان',
    era: '14th - 18th Century CE',
    image: '/api/place-photo?query=Makli Necropolis',
    story: 'Makli is a silent encyclopedia of Sindhi history, housing over a million tombs. Factual study of the Samma and Tarkhan monuments reveals a rare masonry style where stone was carved like wood. The tomb of Mirza Jani Beg is particularly famous for its glazed tilework and brick-and-stone hybrid construction, representing a transition from local Sindhi styles to Persian influence.'
  },
  {
    id: 'daily10',
    name: 'Mazar-e-Quaid',
    urduName: 'مزارِ قائد',
    era: 'Modern, 1970 CE',
    image: '/api/place-photo?query=Mazar-e-Quaid',
    story: 'Designed by Indian-born architect Yahya Merchant, Mazar-e-Quaid is a masterpiece of modern Islamic architecture. Factual documentation shows it was inspired by the Samanid Mausoleum in Uzbekistan. The structure uses pure white marble from the Mianwali district. A practical discovery worth noting is the stunning crystal chandelier inside the hall, which was a gift from the Islamic Association of China. It is 10 meters long, weighs over 400kg, and contains 8 layers of gold-plated copper and crystal beads, symbolizing the deep-rooted ties between Pakistan and the wider Silk Road heritage.'
  },
  {
    id: 'daily11',
    name: 'Shah Jahan Mosque, Thatta',
    urduName: 'شاہجہاں مسجد ٹھٹہ',
    era: 'Mughal, 1647 CE',
    image: '/api/place-photo?query=Shah Jahan Mosque Thatta',
    story: 'Factual research into the Shah Jahan Mosque in Thatta reveals a unique architectural focus on acoustics. The mosque has 93 domes but no minarets; the domes are specifically arranged so that a speaker at the mihrab can be heard in every corner of the courtyard through a natural echo system. The red brickwork, imported from the Makli hills, is laid in complex geometric patterns using Persian-style mortar that has kept the structure stable despite being in an earthquake-prone zone for nearly 400 years.'
  },
  {
    id: 'daily12',
    name: 'Altit Fort',
    urduName: 'قلعہ التیت',
    era: '8th Century CE',
    image: '/api/place-photo?query=Altit Fort',
    story: 'Altit Fort is an ancient fort in the Hunza Valley, restored by the Aga Khan Cultural Service. Factual archaeological study highlights its stone and timber construction, which uses an indigenous earthquake-resistant method known as "crib-work." The fort’s Shikari Tower, which overlooks the Karakoram Highway, was used for centuries to control the trade routes between China and South Asia.'
  },
  {
    id: 'daily13',
    name: 'Mohatta Palace',
    urduName: 'موہٹہ پیلس',
    era: '1927 CE',
    image: '/api/place-photo?query=Mohatta Palace',
    story: 'Built by Shivratan Chandraratan Mohatta, a wealthy Marwari businessman, this palace was designed by architect Agha Ahmed Hussain. Practical structural study reveals a blend of Jodhpur yellow stone and local pink stone from Gizri. Local stories often mention a secret underground tunnel—a factual element designed for the family to safely access a nearby Hindu temple. The palace domes are distinctively Rajput style, featuring "Chhatris" that were rarely seen in coastal Sindh architecture before this period.'
  },
  {
    id: 'daily14',
    name: 'Noor Mahal',
    urduName: 'نور محل',
    era: '1872 CE',
    image: '/api/place-photo?query=Noor Mahal Bahawalpur',
    story: 'Designed by state engineer Mr. Heennan for Nawab Sadiq Muhammad Khan IV of Bahawalpur, Noor Mahal is a fusion of Neoclassical and Gothic-Islamic styles. Factual historical records indicate that the palace was built in honor of the Nawab\'s wife, but she supposedly spent only a single night there because she found the views of the nearby graveyard unsettling. Technically, the palace is unique for its massive 5-dome structure and the use of imported Venetian glass in its chandeliers and windows.'
  },
  {
    id: 'daily15',
    name: 'Ranikot Fort',
    urduName: 'رانی کوٹ قلعہ',
    era: '17th Century CE (Current form)',
    image: '/api/place-photo?query=Ranikot Fort',
    story: 'While legends often attribute Ranikot to Alexander the Great, factual research suggests the current walls were built by the Talpur dynasty in 1812 CE at a cost of 1.2 million rupees. However, the site is likely far older, possibly serving as a Sassanid or Scythian outpost. With a circumference of 32km, it is the world\'s largest fort. Its purpose remains a mystery, as it is located in a remote part of the Kirthar Mountains with no major population center to defend.'
  },
  {
    id: 'daily16',
    name: 'Khyber Pass Gate',
    urduName: 'بابِ خیبر',
    era: 'Modern, 1964 CE',
    image: '/api/place-photo?query=Khyber Pass Gate',
    story: 'Bab-e-Khyber is a monument at the entrance of the Khyber Pass. For millennia, this pass served as the gateway for invaders, traders, and travelers between Central and South Asia, including the forces of Alexander and the Mughals.'
  },
  {
    id: 'daily17',
    name: 'Empress Market',
    urduName: 'ایمپریس مارکیٹ',
    era: 'British Raj, 1889 CE',
    image: '/api/place-photo?query=Empress Market Karachi',
    story: 'Built to commemorate Queen Victoria, Empress Market is a marketplace in the Saddar Town area of Karachi. It was constructed on the site where several native sepoys were executed after the 1857 uprising.'
  },
  {
    id: 'daily18',
    name: 'Tooba Mosque',
    urduName: 'مسجد طوبٰی',
    era: 'Modern, 1969 CE',
    image: '/api/place-photo?query=Tooba Mosque Karachi',
    story: 'Also known as Gol Masjid, it is a single-dome mosque in Karachi. It is claimed to be the largest single-dome mosque in the world, with a diameter of 72 meters and no central pillars supporting it.'
  },
  {
    id: 'daily19',
    name: 'Frere Hall',
    urduName: 'فریئر ہال',
    era: 'British Raj, 1865 CE',
    image: '/api/place-photo?query=Frere Hall Karachi',
    story: 'A building in Karachi that served as a town hall. It features Venetian-Gothic architecture and its ceiling is adorned with a world-famous mural by the legendary Pakistani artist Sadequain.'
  },
  {
    id: 'daily20',
    name: 'Tomb of Jahangir',
    urduName: 'مقبرہ جہانگیر',
    era: 'Mughal, 1637 CE',
    image: '/api/place-photo?query=Tomb of Jahangir',
    story: 'The mausoleum built for the Mughal Emperor Jahangir. Located in Shahdara Bagh in Lahore, the tomb is famous for its garden-style architecture and the extensive use of marble and pietra dura inlay work.'
  },
  {
    id: 'daily21',
    name: 'Kharphocho Fort',
    urduName: 'قلعہ کھرپوچو',
    era: '16th Century CE',
    image: '/api/place-photo?query=Kharphocho Fort Skardu',
    story: 'Standing tall over Skardu, Kharphocho Fort, meaning "The King of Forts," was built by Ali Sher Khan Anchan. Its strategic location offers a panoramic view of the Indus River and the Skardu valley, serving as a reminder of the Maqpon dynasty\'s power.'
  },
  {
    id: 'daily22',
    name: 'Uch Sharif Tombs',
    urduName: 'اچ شریف کے مقبرے',
    era: '12th - 15th Century CE',
    image: '/api/place-photo?query=Uch Sharif Tombs',
    story: 'Uch Sharif is home to some of the most beautiful Sufi shrines in Pakistan. The Tomb of Bibi Jawindi, with its blue and white glazed tilework, is a masterpiece of Central Asian-influenced architecture, even in its partially ruined state.'
  },
  {
    id: 'daily23',
    name: 'Satpara Buddha',
    urduName: 'ستپارہ بدھ',
    era: '7th Century CE',
    image: '/api/place-photo?query=Satpara Buddha Skardu',
    story: 'Carved directly into a granite rock face near Skardu, the Satpara Buddha is a silent witness to the region\'s Buddhist past. It depicts a meditating Maitreya Buddha, a relic from the era when Gilgit-Baltistan was a major center for Buddhist learning.'
  },
  {
    id: 'daily24',
    name: 'Tomb of Asif Khan',
    urduName: 'مقبرہ آصف خان',
    era: 'Mughal, 1645 CE',
    image: '/api/place-photo?query=Tomb of Asif Khan Lahore',
    story: 'Built for the brother of Empress Nur Jahan, this tomb was once covered in expensive marble and tiles, much of which was later removed. Its remaining brickwork and massive dome still showcase the grand scale of Mughal funerary architecture.'
  },
  {
    id: 'daily25',
    name: 'Harappa - The Lost City',
    urduName: 'ہڑپہ - قدیم شہر',
    era: '2500 - 1900 BCE',
    image: '/api/place-photo?query=Harappa archaeological site',
    story: 'Harappa was one of the two major cities of the Indus Valley Civilization. Its standardized weight system, advanced sewage, and grid-like streets suggest a highly organized society that traded with distant lands like Mesopotamia.'
  },
  {
    id: 'daily26',
    name: 'Jaulian Monastery',
    urduName: 'جولیاں خانقاہ',
    era: '2nd Century CE',
    image: '/api/place-photo?query=Jaulian Taxila',
    story: 'Located on a hilltop in Taxila, Jaulian was a world-renowned university and monastery. It is famous for its well-preserved stucco sculptures and an "healing" stupa that pilgrims believed could cure ailments.'
  },
  {
    id: 'daily27',
    name: 'Kot Diji Fort',
    urduName: 'کوٹ ڈیجی قلعہ',
    era: 'Prehistoric to 18th Century',
    image: '/api/place-photo?query=Kot Diji Fort',
    story: 'Kot Diji is a critical site for understanding the origins of the Indus Valley. Practical excavations revealed a "Kot Dijian" phase that predates the Harappan culture. Archaeologists found a deep "burn layer," suggesting the city was destroyed by a massive fire before being rebuilt. The fort crowning the hill today was built by the Talpur Mirs in the 1790s to guard the strategic passes of upper Sindh.'
  },
  {
    id: 'daily28',
    name: 'Traditional Hunza Kitchen',
    urduName: 'ہنزہ کا روایتی باورچی خانہ',
    era: 'Heritage Custom',
    image: '/api/place-photo?query=Baltit Fort Interior',
    story: 'The traditional kitchen in a Hunza home, like the one seen in Baltit Fort, was the heart of the household. It featured a central skylight (the "sum"), wooden pillars with symbolic carvings, and low seating around a central fire pit for warmth and community.'
  },
  {
    id: 'daily29',
    name: 'Faiz Mahal',
    urduName: 'فیض محل',
    era: '1798 CE',
    image: '/api/place-photo?query=Faiz Mahal Khairpur',
    story: 'Faiz Mahal in Khairpur is a majestic palace built by the Talpur Dynasty. With its classical arches and sprawling lawns, it served as the sovereign court for the rulers of the Khairpur State and remains a symbol of Sindhi royal history.'
  },
  {
    id: 'daily30',
    name: 'Wazir Khan Mosque Hujras',
    urduName: 'مسجد وزیر خان کے حجرے',
    era: '1634 CE',
    image: '/api/place-photo?query=Wazir Khan Mosque Lahore',
    story: 'The small rooms or "hujras" lining the courtyard of Wazir Khan Mosque were once filled with students and scholars. Today, they still echo the spiritual and educational legacy of this "Architectural Ornament of Lahore."'
  }
];

export const DailyHeritage = () => {
  const [dayIndex, setDayIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('userLanguage') as Language) || 'English');
  const [displayStory, setDisplayStory] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  const current = DAILY_ELEMENTS[dayIndex];

  useEffect(() => {
    if (!current) return;
    
    // Stop playback when moving or changing language
    stopSpeech();
    setIsPlaying(false);
    setTranslationError(null);

    if (language === 'English') {
      setDisplayStory(current.story);
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    setDisplayStory(''); 
    translateStory(current.story, language)
      .then(translated => {
        if (translated) setDisplayStory(translated);
        else setDisplayStory(current.story);
      })
      .catch((err) => {
        console.error('Daily Translation Error:', err);
        setTranslationError(err.message || 'Translation failed');
        setDisplayStory(current.story);
      })
      .finally(() => setIsTranslating(false));
  }, [language, current]);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    setDayIndex(dayOfYear % DAILY_ELEMENTS.length);

    const lastVisit = localStorage.getItem('lastDailyVisit');
    const today = now.toDateString();
    
    const userStreak = parseInt(localStorage.getItem('streakCounter') || '0');
    if (lastVisit !== today) {
       const newStreak = userStreak + 1;
       setStreak(newStreak);
       localStorage.setItem('streakCounter', newStreak.toString());
       localStorage.setItem('lastDailyVisit', today);
    } else {
       setStreak(userStreak);
    }

    const timer = setInterval(() => {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diffMs = tomorrow.getTime() - new Date().getTime();
      const h = Math.floor(diffMs / (1000 * 60 * 60));
      const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => {
       clearInterval(timer);
       stopSpeech();
    };
  }, []);

  const handleListen = () => {
    if (!current || isTranslating) return;
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      const textToSpeak = displayStory || current.story;
      if (!textToSpeak) return;

      setIsPlaying(true);
      const langMap: Record<Language, string> = {
        'English': 'en',
        'Urdu': 'ur',
        'Chinese': 'zh',
        'German': 'de'
      };
      speakStory(textToSpeak, langMap[language] || 'en', () => setIsPlaying(false));
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary overflow-y-auto no-scrollbar pb-32">
       {/* Cinematic Background */}
       <div className="fixed inset-0 pointer-events-none">
          <img 
            src={current.image} 
            className="w-full h-full object-cover opacity-10 grayscale scale-110 blur-xl" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary" />
       </div>

       <div className="relative min-h-screen px-8 pt-20 flex flex-col items-center">
          <header className="w-full text-center space-y-12 mb-16">
             <div className="flex flex-col items-center gap-4">
                <div className="w-[1px] h-12 bg-accent-gold" />
                <span className="text-[11px] font-black tracking-[0.4em] text-blue-primary uppercase">Daily Site</span>
             </div>

             <div className="space-y-6">
                <p className="text-[10px] font-mono font-bold tracking-widest text-text-muted uppercase">{current.era}</p>
                <div className="space-y-3">
                   <h1 className="text-6xl font-bold antique-text text-blue-dark leading-none tracking-tighter">
                      {current.name}
                   </h1>
                   <p className="text-2xl antique-text italic text-accent-gold urdu-text leading-tight">{current.urduName}</p>
                </div>
             </div>
          </header>

          <main className="max-w-xl mx-auto space-y-16">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border-2 border-white santorini-shadow"
             >
                <img src={current.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-dark/40 to-transparent" />
             </motion.div>

             <div className="bg-white santorini-card p-10 space-y-10">
                <p className="text-xl leading-relaxed text-text-secondary font-medium text-center selection:bg-blue-light selection:text-blue-dark">
                   {isTranslating ? "Searching history..." : (displayStory || current.story)}
                </p>

                {translationError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="text-red-500 shrink-0" size={18} />
                    <p className="text-xs text-red-700 font-medium">{translationError}</p>
                  </div>
                )}

                <div className="flex justify-center gap-8 pt-8 border-t border-border-warm">
                   <button 
                     onClick={handleListen}
                     disabled={isTranslating}
                     className="group relative flex flex-col items-center gap-4"
                   >
                      <div className={`w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-700 santorini-shadow border-2
                        ${isPlaying ? 'bg-blue-primary border-blue-primary text-white shadow-lg shadow-blue-primary/30' : 'bg-white border-blue-primary/10 text-blue-primary hover:border-blue-primary shadow-xl'}
                        ${isTranslating ? 'opacity-50 grayscale cursor-wait' : ''}
                      `}>
                         {isTranslating ? (
                           <Loader2 size={36} className="animate-spin text-blue-primary" />
                         ) : (
                           <Volume2 size={36} strokeWidth={1.5} className={isPlaying ? 'animate-pulse' : ''} />
                         )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-primary group-hover:text-blue-dark transition-colors">
                        {isTranslating ? 'Readying' : (isPlaying ? 'Stop' : 'Listen')}
                      </span>
                   </button>

                   <button 
                     onClick={() => setShowLanguageSheet(true)}
                     className="group relative flex flex-col items-center gap-4"
                   >
                      <div className="w-28 h-28 rounded-3xl bg-blue-dark border border-blue-dark/10 flex items-center justify-center text-white hover:bg-blue-dark/90 shadow-xl shadow-blue-dark/20 transition-all duration-700">
                         <Globe size={36} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-dark group-hover:text-blue-primary transition-colors">
                        Language
                      </span>
                   </button>
                </div>
             </div>
          </main>

          <footer className="mt-40 mb-20 flex flex-col items-center space-y-10">
             <div className="flex items-center gap-6 bg-blue-light/50 px-10 py-5 rounded-2xl border border-blue-light/50 santorini-shadow">
                <Timer size={18} className="text-blue-primary" />
                <p className="text-[11px] font-bold tracking-widest text-blue-dark uppercase leading-none">
                  Cycle Ends: {timeLeft}
                </p>
             </div>
             <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-0.5 bg-accent-gold opacity-30" />
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-text-muted">{streak} Day Streak</p>
             </div>
          </footer>
       </div>

       <AnimatePresence>
        {showLanguageSheet && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLanguageSheet(false)} className="fixed inset-0 z-[150] bg-blue-dark/40 backdrop-blur-md" />
            <motion.div 
               initial={{ y: '100%' }} 
               animate={{ y: 0 }} 
               exit={{ y: '100%' }} 
               className="fixed bottom-0 left-0 right-0 z-[160] bg-white rounded-t-[3rem] p-10 pb-16 santorini-shadow border-t border-border-warm"
            >
               <div className="w-12 h-1 bg-border-warm rounded-full mx-auto mb-10" />
               <div className="space-y-3">
                  {(['English', 'Urdu', 'Chinese', 'German'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); localStorage.setItem('userLanguage', lang); setShowLanguageSheet(false); }}
                      className={`w-full p-6 flex justify-between items-center rounded-2xl transition-all
                        ${language === lang ? 'bg-blue-light text-blue-primary' : 'hover:bg-bg-secondary text-text-muted'}
                      `}
                    >
                      <span className="text-2xl font-bold antique-text">
                        {lang === 'Urdu' ? 'اردو' : lang === 'Chinese' ? '中文' : lang}
                      </span>
                      {language === lang && <div className="w-2.5 h-2.5 rounded-full bg-blue-primary" />}
                    </button>
                  ))}
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
