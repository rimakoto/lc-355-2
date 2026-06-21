import { Quote, Theme } from '@/types';
import { formatDate, getWeekday } from '@/utils/date';

interface QuoteCardProps {
  quote: Quote;
  theme: Theme;
  showDate?: boolean;
  size?: 'normal' | 'small';
}

export default function QuoteCard({ quote, theme, showDate = true, size = 'normal' }: QuoteCardProps) {
  const today = new Date();
  const isSmall = size === 'small';

  return (
    <div
      className={`relative ${theme.cardBg} ${theme.borderStyle} rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${
        isSmall ? 'p-6' : 'p-10 md:p-14'
      }`}
      style={{ fontFamily: theme.fontFamily }}
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-noise" />

      {theme.decoration === 'vintage' && (
        <>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-amber-300/50" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-amber-300/50" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b border-l border-amber-300/50" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-amber-300/50" />
        </>
      )}

      {theme.decoration === 'ink' && (
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-5 bg-slate-900 blur-2xl" />
      )}

      {showDate && (
        <div className={`relative mb-8 ${theme.cardAccent}`}>
          <div className={`${isSmall ? 'text-sm' : 'text-base'} tracking-widest font-medium`}>
            {formatDate(today)}
          </div>
          <div className={`${isSmall ? 'text-xs' : 'text-sm'} mt-1 opacity-60`}>
            {getWeekday(today)}
          </div>
          <div className={`mt-4 w-12 h-px ${theme.borderStyle} bg-current opacity-30`} />
        </div>
      )}

      <div className="relative">
        <span className={`absolute -left-1 -top-2 ${theme.cardAccent} opacity-15 font-serif ${isSmall ? 'text-4xl' : 'text-6xl'}`}>
          「
        </span>
        <p
          className={`${theme.cardText} leading-loose font-medium relative ${
            isSmall ? 'text-base' : 'text-xl md:text-2xl'
          }`}
        >
          {quote.text}
        </p>
        <span className={`absolute -right-1 -bottom-6 ${theme.cardAccent} opacity-15 font-serif ${isSmall ? 'text-4xl' : 'text-6xl'}`}>
          」
        </span>
      </div>

      <div className={`relative mt-10 text-right ${theme.cardAccent}`}>
        <span className={`${isSmall ? 'text-sm' : 'text-base'} opacity-80`}>
          — {quote.author}
        </span>
      </div>

      {theme.decoration === 'vintage' && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-amber-300/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            <div className="w-8 h-px bg-amber-300/50" />
          </div>
        </div>
      )}

      {theme.decoration === 'ink' && (
        <div className="mt-8 flex justify-end">
          <div className="w-10 h-10 rounded-full border border-slate-300/50 flex items-center justify-center">
            <span className="text-slate-400 text-xs">印</span>
          </div>
        </div>
      )}
    </div>
  );
}
