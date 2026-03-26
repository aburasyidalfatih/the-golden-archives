export interface PosterConcept {
  title: string;
  tagline: string;
  description: string;
  visualPrompt: string;
  videoPrompt: string; // New field for Text-to-Video generation
  voiceOverScript: string; // New field for Audio Narration
  colorPalette: string[];
  infographicTitle: string;
  infographicPoints: string[];
  socialCaption: string;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING_CONCEPT = 'GENERATING_CONCEPT',
  REVIEW_CONCEPT = 'REVIEW_CONCEPT',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR'
}