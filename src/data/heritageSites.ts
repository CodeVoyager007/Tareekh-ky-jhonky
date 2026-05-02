import { HeritageSite } from '../types';

export const HERITAGE_SITES: HeritageSite[] = [
  {
    id: 'site1',
    name: 'Lahore Fort',
    urduName: 'شاہی قلعہ',
    city: 'Lahore',
    region: 'Punjab',
    description: 'The Shahi Qila (Lahore Fort) is a citadel that houses 21 notable monuments representing the peak of Mughal architectural evolution. Excavations in 1959 by the Department of Archaeology revealed a "pre-Mughal" layer, confirming the fort existed long before Akbar\'s 1566 reconstruction. Key architectural feats include the Sheesh Mahal (Palace of Mirrors), which uses thousands of tiny convex mirrors to reflect light, and the massive elephant path designed specifically for the royal entrance.',
    image: '/api/place-photo?query=Lahore Fort',
    unesco: true,
    elementsCount: 21,
    coordinates: { lat: 31.588, lng: 74.314 },
    elements: [
      { name: 'Elephant Gate', era: 'Mughal, 17th Century', difficulty: 'Easy' },
      { name: 'Sheesh Mahal Ceiling', era: 'Mughal, 1632', difficulty: 'Medium' },
      { name: 'Picture Wall', era: 'Mughal, 16th Century', difficulty: 'Hard' }
    ],
    waypoints: [
      { id: 'w1', name: 'Alamgiri Gate', description: 'The massive entrance built by Aurangzeb.', order: 1 },
      { id: 'w2', name: 'Diwan-i-Aam', description: 'The hall of public audience where kings met commoners.', order: 2 },
      { id: 'w3', name: 'Sheesh Mahal', description: 'The Palace of Mirrors, built for the Empress.', order: 3 }
    ]
  },
  {
    id: 'site2',
    name: 'Badshahi Mosque',
    urduName: 'بادشاہی مسجد',
    city: 'Lahore',
    region: 'Punjab',
    description: 'Built between 1671 and 1673 by Emperor Aurangzeb, the Badshahi Mosque was the largest mosque in the world for over 300 years. Its design features a red sandstone facade with marble inlay and three massive white marble domes. Technically, the mosque is famous for its vast courtyard (276,000 sq ft) and the unique echo acoustics in the prayer hall, which allowed the Imam\'s voice to carry to thousands of followers without modern amplification.',
    image: '/api/place-photo?query=Badshahi Mosque',
    unesco: true,
    elementsCount: 15,
    coordinates: { lat: 31.588, lng: 74.311 },
    elements: [
      { name: 'Main Dome Calligraphy', era: '17th Century', difficulty: 'Medium' },
      { name: 'Entrance Archway', era: '1673', difficulty: 'Easy' },
      { name: 'Courtyard Floor Pattern', era: '17th Century', difficulty: 'Hard' }
    ],
    waypoints: [
      { id: 'bw1', name: 'Gateway', description: 'The grand entrance stairs and portal.', order: 1 },
      { id: 'bw2', name: 'Main Prayer Hall', description: 'Famous for its acoustics and stucco work.', order: 2 }
    ]
  },
  {
    id: 'site3',
    name: 'Mohenjo-daro',
    urduName: 'موئن جو دڑو',
    city: 'Larkana',
    region: 'Sindh',
    description: 'Mohenjo-daro ("Mound of the Dead Men") is a pinnacle of ancient urban planning from the Indus Valley Civilization (c. 2500 BCE). Archaeological discoveries show it featured one of the world\'s first public baths (The Great Bath) and a sophisticated drainage system where every house was connected to a street sewer. The city was abandoned around 1900 BCE, likely due to a change in the course of the Indus River.',
    image: '/api/place-photo?query=Mohenjo-daro',
    unesco: true,
    elementsCount: 40,
    coordinates: { lat: 27.329, lng: 68.138 },
    elements: [
      { name: 'Great Bath', era: '2500 BCE', difficulty: 'Easy' },
      { name: 'Priest-King Bust (Replica)', era: 'Bronze Age', difficulty: 'Medium' },
      { name: 'Drainage Channel', era: '2500 BCE', difficulty: 'Hard' }
    ]
  },
  {
    id: 'site4',
    name: 'Shrine of Shah Rukn-e-Alam',
    urduName: 'شاہ رکن عالم',
    city: 'Multan',
    region: 'Punjab',
    description: 'The mausoleum of Sufi saint Sheikh Rukn-ud-Din Abul Fateh is a landmark of Tughluq architecture. Factual studies highlight its octagonal plan (a rarity in Pakistani mausoleums) and its unique sloping walls (tapering), which provide seismic stability. The interior is decorated with stunning Multani blue tiles (Kashi-kari) and intricate woodwork that has survived for 700 years.',
    image: '/api/place-photo?query=Shrine of Shah Rukn-e-Alam',
    unesco: false,
    elementsCount: 12,
    coordinates: { lat: 30.198, lng: 71.479 },
    elements: [
      { name: 'Blue Iznik Tiles', era: 'Tughluq, 14th Century', difficulty: 'Easy' },
      { name: 'Wooden Dome Structure', era: '14th Century', difficulty: 'Hard' }
    ]
  },
  {
    id: 'site5',
    name: 'Rohtas Fort',
    urduName: 'قلعہ روہتاس',
    city: 'Jhelum',
    region: 'Punjab',
    description: 'Rohtas Fort is a 16th-century fortress located near the city of Jhelum. Built by Sher Shah Suri to suppress the local Gakkhar tribes, it is one of the largest and most formidable examples of military architecture in Central and South Asia.',
    image: '/api/place-photo?query=Rohtas Fort',
    unesco: true,
    elementsCount: 25,
    coordinates: { lat: 32.966, lng: 73.583 },
    elements: [
      { name: 'Suhail Gate', era: 'Suri, 1541', difficulty: 'Easy' },
      { name: 'Step Well (Baoli)', era: '16th Century', difficulty: 'Medium' }
    ]
  },
  {
    id: 'site6',
    name: 'Minar-e-Pakistan',
    urduName: 'مینارِ پاکستان',
    city: 'Lahore',
    region: 'Punjab',
    description: 'Minar-e-Pakistan is a national monument located in Lahore. The tower was built in the 1960s on the site where the All-India Muslim League passed the Lahore Resolution on 23 March 1940.',
    image: '/api/place-photo?query=Minar-e-Pakistan',
    unesco: false,
    elementsCount: 8,
    coordinates: { lat: 31.592, lng: 74.309 },
    elements: [
      { name: 'Base Inscriptions', era: '1960-1968', difficulty: 'Easy' }
    ]
  },
  {
    id: 'site7',
    name: 'Faisal Mosque',
    urduName: 'فیصل مسجد',
    city: 'Islamabad',
    region: 'ICT',
    description: 'The Faisal Mosque is the national mosque of Pakistan. Located on the foothills of Margalla Hills in Islamabad, it is the largest mosque in the country and is known for its contemporary desert tent-like design.',
    image: '/api/place-photo?query=Faisal Mosque',
    unesco: false,
    elementsCount: 10,
    coordinates: { lat: 33.729, lng: 73.037 },
    elements: []
  },
  {
    id: 'site8',
    name: 'Taxila Museum',
    urduName: 'ٹیکسلا میوزیم',
    city: 'Taxila',
    region: 'Punjab',
    description: 'Taxila is a significant archaeological site containing the ruins of the Gandhara city of Takshasila, an important Hindu and Buddhist center. The museum houses a rich collection of Gandharan art.',
    image: '/api/place-photo?query=Taxila Museum',
    unesco: true,
    elementsCount: 50,
    coordinates: { lat: 33.746, lng: 72.825 },
    elements: []
  },
  {
    id: 'site9',
    name: 'Ranikot Fort',
    urduName: 'رانی کوٹ قلعہ',
    city: 'Jamshoro',
    region: 'Sindh',
    description: 'Often described as the Great Wall of Sindh, Ranikot is one of the world\'s largest forts with a circumference of approximately 32 kilometers. The fort\'s massive stone walls follow the natural contours of the Kirthar Mountains.',
    image: '/api/place-photo?query=Ranikot Fort',
    unesco: false,
    elementsCount: 45,
    coordinates: { lat: 25.897, lng: 67.902 },
    elements: [
      { name: 'Sann Gate', era: 'Talpur, 17th Century', difficulty: 'Easy' },
      { name: 'Miri Fort Inner Structures', era: '18th Century', difficulty: 'Medium' },
      { name: 'Bastion Watchtower', era: '17th Century', difficulty: 'Medium' }
    ]
  },
  {
    id: 'site10',
    name: 'Shah Jahan Mosque',
    urduName: 'شاہ جہاں مسجد',
    city: 'Thatta',
    region: 'Sindh',
    description: 'A 17th-century mosque that serves as a gift to the people of Sindh for their hospitality. It is famous for its geometric brickwork and the absence of minarets, featuring 93 domes designed for acoustics.',
    image: '/api/place-photo?query=Shah Jahan Mosque Thatta',
    unesco: true,
    elementsCount: 18,
    coordinates: { lat: 24.747, lng: 67.922 },
    elements: [
      { name: 'Blue Tilework Ceiling', era: 'Mughal, 1647', difficulty: 'Medium' },
      { name: 'Acoustic Prayer Niche', era: 'Mughal', difficulty: 'Hard' },
      { name: 'Geometric Brick Facade', era: 'Mughal', difficulty: 'Easy' }
    ]
  },
  {
    id: 'site11',
    name: 'Noor Mahal',
    urduName: 'نور محل',
    city: 'Bahawalpur',
    region: 'Punjab',
    description: 'Noor Mahal is a neoclassical palace built in 1872 by the Nawab of Bahawalpur, Nawab Sadiq Muhammad Khan IV. Designed by state engineer Mr. Heennan, it features a fusion of Italianate and Islamic arches. Factual historical records show the state went into significant debt to fund its construction, leading to the palace being auctioned off shortly after completion. Today, the 20-room palace is a museum showcasing the "Nawabi" era artifacts including period furniture and royal weaponry.',
    image: '/api/place-photo?query=Noor Mahal Bahawalpur',
    unesco: false,
    elementsCount: 20,
    coordinates: { lat: 29.395, lng: 71.661 },
    elements: [
      { name: 'Crystal Chandeliers', era: '1872', difficulty: 'Easy' },
      { name: 'Stucco Ceiling Patterns', era: 'Victorian-Islamic', difficulty: 'Medium' },
      { name: 'Grand Piano Heritage', era: 'Late 19th Century', difficulty: 'Hard' }
    ]
  },
  {
    id: 'site12',
    name: 'Mazar-e-Quaid',
    urduName: 'مزارِ قائد',
    city: 'Karachi',
    region: 'Sindh',
    description: 'Designed by architect Yahya Merchant and completed in 1970, Mazar-e-Quaid is the final resting place of Muhammad Ali Jinnah. The structure is a modern interpretation of the 10th-century Samanid Mausoleum in Uzbekistan. Practical structural details include the use of pure white marble from Mianwali and a massive 81-foot high interior hall. A notable feature is the 10-meter long crystal chandelier, a symbolic gift from the Islamic Association of China, which hangs above the cenotaph.',
    image: '/api/place-photo?query=Mazar-e-Quaid',
    unesco: false,
    elementsCount: 5,
    coordinates: { lat: 24.874, lng: 67.041 },
    elements: [
      { name: 'Copper Chandelier', era: '1970', difficulty: 'Medium' },
      { name: 'Curved Marble Arches', era: 'Modern Heritage', difficulty: 'Easy' }
    ]
  },
  {
    id: 'site13',
    name: 'Baltit Fort',
    urduName: 'قلعہ بلتت',
    city: 'Hunza',
    region: 'Gilgit-Baltistan',
    description: 'Baltit Fort is a 700-year-old landmark in the Hunza Valley, originally built to serve as a residence for the Mirs of Hunza. A major restoration by the Aga Khan Cultural Service in the 1990s revealed "crib-bing" (wooden frames within stone walls), an indigenous earthquake-resistant structural technique. The fort\'s design was significantly influenced by the Tibetan and Ladakhi architectural styles, a result of the marriage of a Hunza Mir to a Balti princess.',
    image: '/api/place-photo?query=Baltit Fort',
    unesco: false,
    elementsCount: 14,
    coordinates: { lat: 36.331, lng: 74.671 },
    elements: [
      { name: 'Stained Glass Windows', era: '14th-16th Century', difficulty: 'Medium' },
      { name: 'Traditional Tibetan Pillars', era: '14th Century', difficulty: 'Hard' },
      { name: 'Old Library Archives', era: 'Pre-modern', difficulty: 'Medium' }
    ]
  }
];
