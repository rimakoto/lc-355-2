import { X } from 'lucide-react';
import { ThemeId } from '@/types';
import { themeList } from '@/data/themes';
import { useQuoteStore } from '@/store/useQuoteStore';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeSelector({ isOpen, onClose }: ThemeSelectorProps) {
  const { currentTheme, setTheme } = useQuoteStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-slideUp">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">选择主题</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {themeList.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setTheme(theme.id as ThemeId);
                onClose();
              }}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                currentTheme === theme.id
                  ? 'border-stone-800 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-lg ${theme.cardBg} border ${theme.borderStyle} flex items-center justify-center`}
              >
                <span className={`text-lg ${theme.cardText}`}>文</span>
              </div>
              <div className="text-left flex-1">
                <div className="font-medium text-gray-800">{theme.name}</div>
                <div className="text-sm text-gray-500">
                  {theme.id === 'minimal' && '极简现代，干净利落'}
                  {theme.id === 'vintage' && '怀旧温暖，书卷气息'}
                  {theme.id === 'ink' && '水墨意境，东方韵味'}
                </div>
              </div>
              {currentTheme === theme.id && (
                <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
