import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quote, ThemeId } from '@/types';
import { getQuoteOfDay, getRandomQuote, quotes } from '@/data/quotes';
import { themes } from '@/data/themes';

interface QuoteState {
  currentQuote: Quote;
  favorites: Quote[];
  currentTheme: ThemeId;
  setCurrentQuote: (quote: Quote) => void;
  setRandomQuote: () => void;
  toggleFavorite: (quote: Quote) => void;
  removeFavorite: (quoteId: string) => void;
  isFavorite: (quoteId: string) => boolean;
  setTheme: (themeId: ThemeId) => void;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      currentQuote: getQuoteOfDay(new Date()),
      favorites: [],
      currentTheme: 'minimal',

      setCurrentQuote: (quote) => set({ currentQuote: quote }),

      setRandomQuote: () => {
        const currentId = get().currentQuote.id;
        let newQuote = getRandomQuote();
        while (newQuote.id === currentId && quotes.length > 1) {
          newQuote = getRandomQuote();
        }
        set({ currentQuote: newQuote });
      },

      toggleFavorite: (quote) => {
        const favorites = get().favorites;
        const exists = favorites.some((q) => q.id === quote.id);
        if (exists) {
          set({ favorites: favorites.filter((q) => q.id !== quote.id) });
        } else {
          set({ favorites: [...favorites, quote] });
        }
      },

      removeFavorite: (quoteId) => {
        set({ favorites: get().favorites.filter((q) => q.id !== quoteId) });
      },

      isFavorite: (quoteId) => {
        return get().favorites.some((q) => q.id === quoteId);
      },

      setTheme: (themeId) => {
        if (themes[themeId]) {
          set({ currentTheme: themeId });
        }
      },
    }),
    {
      name: 'quote-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        currentTheme: state.currentTheme,
      }),
    }
  )
);
