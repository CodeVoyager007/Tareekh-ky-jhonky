import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Heart, X, Info, Sparkles, MapPin, Camera, Calendar, Map, Headphones } from 'lucide-react';

const EXPLORE_DATA = [
  {
    id: 'exp1',
    specific_name: 'Shalamar Gardens',
    element_type: 'Mughal Architecture',
    era: '1637 CE',
    image: '/api/place-photo?query=Shalamar Gardens',
    story: 'Factual structural analysis of Shalamar reveals a 17th-century engineering feat: water was brought from 160km away via the "Shah Nahar" canal. The 410 fountains operate purely on gravity, utilizing the 15-foot height difference between the three-level terraces.',
    cultural_region: 'Lahore, Punjab'
  },
  {
    id: 'exp2',
    specific_name: 'Mohenjo-daro Dancing Girl',
    element_type: 'Bronze Figurine',
    era: '2300-1750 BCE',
    image: '/api/place-photo?query=Mohenjo-daro',
    story: 'Found in 1926 by Ernest Mackay, this bronze masterpiece uses the "lost wax" technique. Her 25 bangles on one arm and confident stance are practical evidence of a society with advanced metallurgy and distinct social roles for women.',
    cultural_region: 'Sindh'
  },
  {
    id: 'exp3',
    specific_name: 'Badshahi Mosque',
    element_type: 'Religious Architecture',
    era: '1673 CE',
    image: '/api/place-photo?query=Badshahi Mosque',
    story: 'Archaeological surveys of the mosque highlight its massive 276,000 sq ft courtyard. The interior acoustics were practically designed to allow the Imam\'s voice to echo through the arched prayer halls, reaching over 50,000 worshippers without modern speakers.',
    cultural_region: 'Lahore, Punjab'
  },
  {
    id: 'exp4',
    specific_name: 'Peshawari Chappal',
    element_type: 'Artisanal Craft',
    era: '19th Century',
    image: '/api/place-photo?query=Peshawari Chappal',
    story: 'Originating from the Khyber Pakhtunkhwa region, this semi-closed footwear is a symbol of Pashtun identity. Each pair is hand-stitched by master cobblers.',
    cultural_region: 'Peshawar, KPK'
  },
  {
    id: 'exp5',
    specific_name: 'Taxila Stupa',
    element_type: 'Buddhist Heritage',
    era: '2nd Century BCE',
    image: '/api/place-photo?query=Taxila Museum',
    story: 'Taxila was a global center of learning where Greco-Buddhist art flourished. The Dharmarajika Stupa once housed relics of the Buddha himself.',
    cultural_region: 'Rawalpindi, Punjab'
  },
  {
    id: 'exp6',
    specific_name: 'Baltit Fort',
    element_type: 'Defense Architecture',
    era: '8th Century CE',
    image: '/api/place-photo?query=Baltit Fort',
    story: 'A practical discovery during the 1990s restoration was the indigenous "crib-work" technique—placing heavy wooden beams inside stone walls to provide flexibility during the region\'s frequent earthquakes.',
    cultural_region: 'Hunza, Gilgit-Baltistan'
  },
  {
    id: 'exp7',
    specific_name: 'Ajrak Print',
    element_type: 'Textile Art',
    era: 'Indus Valley Origin',
    image: '/api/place-photo?query=Ajrak Print',
    story: 'Ajrak is a unique form of block printing found in Sindh. The complex 21-step process uses natural dyes to create geometric patterns representing the universe.',
    cultural_region: 'Sindh'
  },
  {
    id: 'exp13',
    specific_name: 'Noor Mahal',
    element_type: 'Neoclassical Palace',
    era: '1872 CE',
    image: '/api/place-photo?query=Noor Mahal Bahawalpur',
    story: 'Built by state engineer Mr. Heennan, factual records show the palace was commissioned by the Nawab for his wife. Technically, it is a rare South Asian example of pure neoclassical architecture using imported Italian materials.',
    cultural_region: 'Bahawalpur, Punjab'
  },
  {
    id: 'exp14',
    specific_name: 'Harappa Excavations',
    element_type: 'Archaeological Site',
    era: '2600-1900 BCE',
    image: '/api/place-photo?query=Harappa archaeological site',
    story: 'Practical excavations led by Mortimer Wheeler revealed Harappa\'s advanced grain storage systems and standardized city grids, proving the existence of a central government with strict urban regulations 4,000 years ago.',
    cultural_region: 'Sahiwal, Punjab'
  },
  {
    id: 'exp15',
    specific_name: 'Ranikot Fort Theories',
    element_type: 'Massive Wall',
    era: '1812 CE (Current form)',
    image: '/api/place-photo?query=Ranikot Fort',
    story: 'Known as the "Great Wall of Sindh," Ranikot is the world\'s largest fort with a 32km circumference. Its location in the remote Kirthar Mountains suggests it was a final sanctuary for the Talpur Mirs.',
    cultural_region: 'Jamshoro, Sindh'
  },
  {
    id: 'exp16',
    specific_name: 'Frere Hall Mural',
    element_type: 'Art Heritage',
    era: '1986 CE (Mural)',
    image: '/api/place-photo?query=Frere Hall Karachi Mural',
    story: 'The massive "Arz-o-Samawat" ceiling mural by the legendary artist Sadequain is a masterpiece of calligraphic surrealism, conveying the struggle of humanity to touch the cosmic truth.',
    cultural_region: 'Karachi, Sindh'
  },
  {
    id: 'exp17',
    specific_name: 'Rohtas Fort',
    element_type: 'Lodi Architecture',
    era: '1541 CE',
    image: '/api/place-photo?query=Rohtas Fort Jhelum',
    story: 'A garrison fort built by Sher Shah Suri, Rohtas was never taken by force. Its massive walls and 12 gates were designed to be impenetrable to both elephants and armies.',
    cultural_region: 'Jhelum, Punjab'
  },
  {
    id: 'exp18',
    specific_name: 'Hiran Minar',
    element_type: 'Mughal Pavilion',
    era: '1606 CE',
    image: '/api/place-photo?query=Hiran Minar Sheikhupura',
    story: 'A monument of love for a pet antelope, this site features a massive water tank and a central pavilion. It served as a hunting retreat for Emperor Jahangir.',
    cultural_region: 'Sheikhupura, Punjab'
  },
  {
    id: 'exp19',
    specific_name: 'Mohatta Palace',
    element_type: 'Anglo-Indian Style',
    era: '1927 CE',
    image: '/api/place-photo?query=Mohatta Palace Karachi',
    story: 'Built with pink Jodhpur stone and yellow Gizri stone, Mohatta Palace is a blend of Rajput and Mughal styles. It was a residence for various political figures, including the "Mother of the Nation" Fatima Jinnah.',
    cultural_region: 'Karachi, Sindh'
  }
];

const QUICK_ACTIONS = [
  { path: '/daily', icon: Calendar, label: 'Daily', color: '#C5A059' },
  { path: '/nearby', icon: MapPin, label: 'Nearby', color: '#8C4A32' },
  { path: '/walk', icon: Headphones, label: 'Walks', color: '#1A237E' }
];

interface CardProps {
  data: typeof EXPLORE_DATA[0];
  onSwipe: (dir: string) => void;
  index: number;
}

const Card: React.FC<CardProps> = ({ data, onSwipe, index }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-8, 8]);
  const opacity = useTransform(x, [-150, -50, 0, 50, 150], [0, 1, 1, 1, 0]);
  const goldScale = useTransform(x, [0, 100], [0.5, 1.2]);
  const crossScale = useTransform(x, [0, -100], [0.5, 1.2]);

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: 100 - index }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe('right');
        if (info.offset.x < -100) onSwipe('left');
      }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing p-4"
    >
      <div className="w-full h-full relative group bg-black overflow-hidden border border-white/10">
           {/* High Contrast Visual */}
           <img 
              src={data.image} 
              alt={data.specific_name} 
              className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-1000 scale-100 group-hover:scale-105" 
           />
           
           {/* Absolute Black Gradient */}
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

           {/* Bold Narrative Information */}
           <div className="absolute bottom-0 left-0 right-0 p-10 space-y-6">
              <div className="space-y-4">
                 <motion.h2 
                    className="text-5xl md:text-7xl font-black uppercase leading-[0.8] tracking-tighter text-white break-words"
                 >
                    {data.specific_name}
                 </motion.h2>
                 <div className="flex items-center gap-4 text-heritage-gold font-bold uppercase tracking-[0.2em] text-[10px]">
                    <span>{data.era}</span>
                    <div className="w-4 h-[1px] bg-heritage-gold" />
                    <span>{data.cultural_region}</span>
                 </div>
              </div>
              
              <p className="text-white/60 text-xs leading-relaxed max-w-[80%] font-sans uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                 {data.story}
              </p>
           </div>

           {/* Design Accents */}
           <div className="absolute top-10 left-10 text-white/20 font-black text-6xl tracking-tighter select-none">
              {(index + 1).toString().padStart(2, '0')}
           </div>
      </div>
    </motion.div>
  );
};

export const Explore = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState(EXPLORE_DATA);

  const handleSwipe = (direction: string) => {
    const card = cards[0];
    if (direction === 'right') {
      const saved = localStorage.getItem('savedDiscoveries');
      const savedItems = saved ? JSON.parse(saved) : [];
      if (!savedItems.find((i: any) => i.id === card.id)) {
         localStorage.setItem('savedDiscoveries', JSON.stringify([{
           ...card,
           id: card.id,
           date: new Date().toLocaleDateString('en-GB'),
           confidence: 'high'
         }, ...savedItems]));
      }
    }
    setCards(cards.slice(1));
  };

  const openFullStory = (card: typeof EXPLORE_DATA[0]) => {
     sessionStorage.setItem('lastResult', JSON.stringify({
        ...card,
        confidence: 'high',
        confidence_reason: 'Curated historical library content.',
        sources_hint: 'Official Archaeological Archives',
        date: 'Exhibition Collection'
     }));
     navigate('/result');
  };

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-40">
      <header className="mb-16 space-y-4 px-6 md:px-0">
         <h2 className="text-7xl font-bold antique-text text-blue-dark tracking-tighter leading-none">Explore</h2>
         <p className="text-[11px] uppercase font-black tracking-[0.4em] text-accent-gold">Explore History</p>
      </header>

      <section className="grid grid-cols-3 gap-8 mb-20 px-6 md:px-0">
         {QUICK_ACTIONS.map(action => (
            <button 
              key={action.path}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-4 group"
            >
               <div className="w-full aspect-square bg-white border border-border-warm flex items-center justify-center text-blue-primary/40 group-hover:text-blue-primary group-hover:border-blue-primary group-hover:shadow-lg group-hover:shadow-blue-primary/10 transition-all rounded-[2rem] santorini-shadow active:scale-95">
                  <action.icon size={28} strokeWidth={1.5} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-blue-dark transition-colors">{action.label}</span>
            </button>
         ))}
      </section>

      <div className="space-y-12 px-6 md:px-0">
        <div className="flex items-center gap-6 mb-8">
           <h3 className="text-2xl font-bold antique-text text-text-primary">History List</h3>
           <div className="h-[1px] flex-1 bg-border-warm" />
        </div>

        {EXPLORE_DATA.map((site, idx) => (
          <motion.div
            key={site.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => openFullStory(site)}
            className="relative h-[65vh] w-full rounded-[3.5rem] overflow-hidden group cursor-pointer border-2 border-white santorini-shadow bg-white"
          >
            <div className="absolute inset-0">
               <img 
                 src={site.image} 
                 className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-blue-dark/80 via-blue-dark/20 to-transparent" />
            </div>

            <div className="absolute top-10 left-10 flex items-center gap-3">
               <div className="px-4 py-2 bg-blue-light/80 backdrop-blur-md border border-white/40 rounded-full">
                  <span className="text-[9px] font-bold tracking-widest text-blue-dark uppercase">{site.era}</span>
               </div>
               {site.id === 'exp1' || site.id === 'exp3' || site.id === 'exp5' ? (
                 <div className="px-4 py-2 bg-accent-gold text-white rounded-full space-x-2 flex items-center shadow-lg shadow-accent-gold/20">
                    <Sparkles size={11} fill="currentColor" />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">UNESCO</span>
                 </div>
               ) : null}
            </div>

            <div className="absolute bottom-12 left-12 right-12 space-y-5">
               <div className="space-y-2">
                  <p className="text-[10px] font-mono font-bold tracking-[0.4em] text-accent-gold uppercase leading-none">{site.cultural_region}</p>
                  <h4 className="text-5xl font-bold antique-text text-white leading-[0.9] tracking-tighter">
                     {site.specific_name}
                  </h4>
               </div>
               <div className="w-16 h-[3px] bg-accent-gold group-hover:w-full transition-all duration-1000 rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 mb-10 flex flex-col items-center gap-4 opacity-30">
         <div className="w-px h-12 bg-accent-gold" />
         <div className="text-[9px] font-black uppercase tracking-[1em] text-blue-dark">History Gallery</div>
      </div>
    </div>
  );
};
