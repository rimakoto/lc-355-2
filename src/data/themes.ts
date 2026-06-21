import { Theme, ThemeId } from '@/types';

export const themes: Record<ThemeId, Theme> = {
  minimal: {
    id: 'minimal',
    name: '简洁素雅',
    cardBg: 'bg-stone-50',
    cardText: 'text-stone-800',
    cardAccent: 'text-stone-500',
    pageBg: 'bg-stone-100',
    borderStyle: 'border-stone-200',
    fontFamily: '"Noto Serif SC, serif',
  },
  vintage: {
    id: 'vintage',
    name: '复古羊皮纸',
    cardBg: 'bg-amber-50',
    cardText: 'text-amber-900',
    cardAccent: 'text-amber-700',
    pageBg: 'bg-amber-100',
    borderStyle: 'border-amber-200',
    fontFamily: '"ZCOOL XiaoWei, serif',
    decoration: 'vintage',
  },
  ink: {
    id: 'ink',
    name: '水墨东方',
    cardBg: 'bg-slate-50',
    cardText: 'text-slate-900',
    cardAccent: 'text-slate-600',
    pageBg: 'bg-slate-100',
    borderStyle: 'border-slate-300',
    fontFamily: '"Ma Shan Zheng, cursive',
    decoration: 'ink',
  },
};

export const themeList = Object.values(themes);
