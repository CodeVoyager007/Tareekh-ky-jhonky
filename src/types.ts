export interface AnalysisResult {
  id: string;
  element_type: string;
  era: string;
  cultural_region: string;
  specific_name: string;
  confidence: 'high' | 'medium' | 'low';
  confidence_reason: string;
  story: string;
  folk_legend: string | null;
  sources_hint: string;
  date?: string;
  image?: string;
}

export type Language = 'English' | 'Urdu' | 'Chinese' | 'German';

export interface HeritageStamp {
  id: string;
  siteName: string;
  elementName: string;
  era: string;
  dateEarned: string;
  thumbnail: string;
}

export interface HeritageSite {
  id: string;
  name: string;
  urduName: string;
  city: string;
  region: string;
  description: string;
  image: string;
  unesco: boolean;
  elementsCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  elements: {
    name: string;
    era: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }[];
  waypoints?: Waypoint[];
}

export interface Waypoint {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface InscriptionResult {
  script_type: string;
  original_text: string;
  transliteration: string;
  translation: string;
  context: string;
}

export interface InstrumentResult {
  instrument_name: string;
  local_name: string;
  era: string;
  culture: string;
  playing_technique: string;
  sound_description: string;
  modern_equivalent: string;
  notes_suggested: string[];
  sound_type: 'string' | 'percussion' | 'wind' | 'drone';
  historical_significance: string;
}
