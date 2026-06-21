import { useEffect } from 'react';
import QuoteCard from '@/components/QuoteCard';
import { useQuoteStore } from '@/store/useQuoteStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { themes } from '@/data/themes';
import { ExternalLink } from 'lucide-react';

export default function Widget() {
  const { currentQuote, currentTheme } = useQuoteStore();
  const { scheduleDailyCheck } = useNotificationStore();
  const theme = themes[currentTheme];

  useEffect(() => {
    const cleanup = scheduleDailyCheck();
    return cleanup;
  }, [scheduleDailyCheck]);

  const openFullView = () => {
    window.open('/', '_blank');
  };

  return (
    <div className={`min-h-screen ${theme.pageBg} transition-colors duration-500`}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <QuoteCard quote={currentQuote} theme={theme} size="small" />
        </div>

        <button
          onClick={openFullView}
          className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 hover:bg-white/90 text-stone-600 text-xs transition-all duration-200"
        >
          <ExternalLink size={12} />
          <span>打开完整页面</span>
        </button>
      </div>
    </div>
  );
}
