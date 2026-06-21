import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Heart } from 'lucide-react';
import QuoteCard from '@/components/QuoteCard';
import { useQuoteStore } from '@/store/useQuoteStore';
import { themes } from '@/data/themes';

export default function Favorites() {
  const { favorites, currentTheme, removeFavorite } = useQuoteStore();
  const theme = themes[currentTheme];

  return (
    <div className={`min-h-screen ${theme.pageBg} transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 rounded-full bg-white/50 hover:bg-white/80 text-stone-600 transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-medium text-stone-700">我的收藏</h1>
          <span className="text-stone-400 text-sm">({favorites.length} 条)</span>
        </header>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/50 mb-6">
              <Heart size={40} className="text-stone-300" />
            </div>
            <p className="text-stone-500 text-lg mb-2">还没有收藏任何名言</p>
            <p className="text-stone-400 text-sm mb-6">遇到喜欢的句子，点击收藏按钮保存吧</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-800 text-white hover:bg-stone-700 transition-colors"
            >
              <span>去看看</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((quote) => (
              <div key={quote.id} className="relative">
                <QuoteCard quote={quote} theme={theme} showDate={false} size="small" />
                <button
                  onClick={() => removeFavorite(quote.id)}
                  className="absolute top-2 right-2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-md opacity-60 hover:opacity-100 hover:bg-white hover:text-rose-500 text-stone-500 transition-all duration-200 hover:scale-110"
                  title="删除收藏"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
