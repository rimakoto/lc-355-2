export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
}

export interface Theme {
  id: string;
  name: string;
  cardBg: string;
  cardText: string;
  cardAccent: string;
  pageBg: string;
  borderStyle: string;
  fontFamily: string;
  decoration?: string;
}

export type ThemeId = 'minimal' | 'vintage' | 'ink';
