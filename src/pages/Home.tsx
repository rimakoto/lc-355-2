import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shuffle, Heart, Palette, BookMarked, Settings, Clock, CheckCircle2 } from 'lucide-react';
import QuoteCard from '@/components/QuoteCard';
import ThemeSelector from '@/components/ThemeSelector';
import SettingsPanel from '@/components/SettingsPanel';
import { useQuoteStore } from '@/store/useQuoteStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { themes } from '@/data/themes';

export default function Home() {
  const { currentQuote, currentTheme, setRandomQuote, toggleFavorite, isFavorite } = useQuoteStore();
  const { scheduleDailyCheck, scheduleLaterReminder } = useNotificationStore();
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [laterScheduled, setLaterScheduled] = useState(false);

  const theme = themes[currentTheme];
  const isLiked = isFavorite(currentQuote.id);

  useEffect(() => {
    const cleanup = scheduleDailyCheck();
    return cleanup;
  }, [scheduleDailyCheck]);

  const handleShuffle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setRandomQuote();
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  const handleLater = () => {
    scheduleLaterReminder(currentQuote, 30);
    setLaterScheduled(true);
    setTimeout(() => setLaterScheduled(false), 2000);
  };

  return (
    <div className={`min-h-screen ${theme.pageBg} transition-colors duration-500`}>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <header className="w-full max-w-xl mb-8 flex justify-between items-center">
          <h1 className="text-xl font-medium text-stone-700">每日名言</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white/80 text-stone-600 transition-all duration-200 text-sm"
            >
              <Settings size={18} />
              <span>设置</span>
            </button>
            <Link
              to="/favorites"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white/80 text-stone-600 transition-all duration-200 text-sm"
            >
              <BookMarked size={18} />
              <span>收藏夹</span>
            </Link>
          </div>
        </header>

        <div className="w-full max-w-xl flex-1 flex items-center justify-center">
          <div
            className={`w-full transition-all duration-300 ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <QuoteCard quote={currentQuote} theme={theme} />
          </div>
        </div>

        <div className="w-full max-w-xl mt-8">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={handleShuffle}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white shadow-md hover:shadow-lg text-stone-700 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Shuffle size={20} />
              <span>换一句</span>
            </button>

            <button
              onClick={() => toggleFavorite(currentQuote)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${
                isLiked
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-stone-700 hover:bg-rose-50'
              }`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              <span>{isLiked ? '已收藏' : '收藏'}</span>
            </button>

            <button
              onClick={handleLater}
              className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${
                laterScheduled
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-stone-700 hover:bg-amber-50'
              }`}
            >
              {laterScheduled ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>30分钟后提醒</span>
                </>
              ) : (
                <>
                  <Clock size={20} />
                  <span>稍后再看</span>
                </>
              )}
            </button>

            <button
              onClick={() => setThemeSelectorOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white shadow-md hover:shadow-lg text-stone-700 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Palette size={20} />
              <span>主题</span>
            </button>
          </div>
        </div>

        <footer className="mt-8 text-center text-stone-400 text-sm">
          <p>每天一句有分量的话</p>
        </footer>
      </div>

      <ThemeSelector isOpen={themeSelectorOpen} onClose={() => setThemeSelectorOpen(false)} />
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
