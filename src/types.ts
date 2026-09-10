// Application types and game definitions

export type GameScreen = 'walking' | 'coloring' | 'pattern' | 'photo' | 'memory';

export type LionAnimationState = 'idle' | 'walk' | 'run' | 'jump' | 'roar' | 'celebrate';

export interface Milestone {
  id: string;
  distance: number; // distance in meters/steps along the trail
  title: string;
  game: GameScreen;
  iconName: string;
  color: string;
  badge: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
}

export interface CollectibleItem {
  id: number;
  type: 'paw' | 'star' | 'mango' | 'flower';
  x: number; // relative distance in the world
  y: number; // height offset
  collected: boolean;
}

export interface SafariAnimalFriend {
  id: string;
  name: string;
  x: number;
  emoji: string;
  greeting: string;
  species: string;
  reaction: string;
}

// Coloring game types
export interface ColoringPart {
  id: string;
  name: string;
  path: string;
  defaultColor?: string;
  layer?: number;
}

export interface ColoringTemplate {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  viewBox: string;
  parts: ColoringPart[];
  backgroundDetails?: string[];
}

// Pattern matching game types
export interface AnimalPatternQuestion {
  id: string;
  animalName: string;
  patternName: string;
  patternType: 'stripes' | 'spots' | 'mesh' | 'scales' | 'feathers' | 'fur';
  patternSvgSnippet: string; // SVG pattern definition / render
  animalEmoji: string;
  animalDescription: string;
  options: {
    id: string;
    name: string;
    emoji: string;
    color: string;
  }[];
  correctOptionId: string;
  fact: string;
}

export interface SequencePatternLevel {
  id: string;
  title: string;
  sequence: { emoji: string; name: string }[];
  missingIndex: number;
  options: { id: string; emoji: string; name: string }[];
  correctId: string;
}

// Animal photo detective game types
export interface PhotoDetectiveItem {
  id: string;
  animalName: string;
  title: string;
  clue: string;
  funFact: string;
  photoSvg: string; // Visual stylized SVG photo scene
  soundText: string;
  options: { id: string; name: string; emoji: string }[];
  correctOptionId: string;
  starsReward: number;
}

// Memory card game types
export interface MemoryCard {
  id: number;
  pairId: string;
  name: string;
  emoji: string;
  color: string;
  sound: string;
  isFlipped: boolean;
  isMatched: boolean;
}
