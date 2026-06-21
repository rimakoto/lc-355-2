import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quote } from '@/types';
import { getQuoteOfDay } from '@/data/quotes';
import { sendQuoteNotification, sendLaterReminder } from '@/utils/notification';

interface PendingReminder {
  quote: Quote;
  scheduledAt: number;
  id: string;
}

interface NotificationState {
  pushEnabled: boolean;
  pushTime: string;
  lastPushDate: string | null;
  pendingReminders: PendingReminder[];
  setPushEnabled: (enabled: boolean) => void;
  setPushTime: (time: string) => void;
  scheduleDailyCheck: () => () => void;
  scheduleLaterReminder: (quote: Quote, minutes?: number) => void;
  processPendingReminders: () => void;
  checkAndPushDaily: () => void;
}

const LATER_REMINDER_MINUTES = 30;

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function parseTime(timeStr: string): { hour: number; minute: number } {
  const [hour, minute] = timeStr.split(':').map(Number);
  return { hour, minute };
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      pushEnabled: false,
      pushTime: '08:00',
      lastPushDate: null,
      pendingReminders: [],

      setPushEnabled: (enabled) => set({ pushEnabled: enabled }),

      setPushTime: (time) => set({ pushTime: time }),

      scheduleDailyCheck: () => {
        const interval = setInterval(() => {
          get().checkAndPushDaily();
          get().processPendingReminders();
        }, 60 * 1000);

        get().checkAndPushDaily();
        get().processPendingReminders();

        return () => clearInterval(interval);
      },

      scheduleLaterReminder: (quote, minutes = LATER_REMINDER_MINUTES) => {
        const reminder: PendingReminder = {
          quote,
          scheduledAt: Date.now() + minutes * 60 * 1000,
          id: `later-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        };
        set((state) => ({
          pendingReminders: [...state.pendingReminders, reminder],
        }));
      },

      processPendingReminders: () => {
        const { pendingReminders } = get();
        const now = Date.now();
        const due = pendingReminders.filter((r) => r.scheduledAt <= now);
        const remaining = pendingReminders.filter((r) => r.scheduledAt > now);

        due.forEach((reminder) => {
          sendLaterReminder(reminder.quote);
        });

        if (due.length > 0) {
          set({ pendingReminders: remaining });
        }
      },

      checkAndPushDaily: () => {
        const { pushEnabled, pushTime, lastPushDate } = get();
        if (!pushEnabled) return;

        const today = getTodayString();
        if (lastPushDate === today) return;

        const { hour, minute } = parseTime(pushTime);
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        if (currentHour > hour || (currentHour === hour && currentMinute >= minute)) {
          const quote = getQuoteOfDay(new Date());
          sendQuoteNotification(quote);
          set({ lastPushDate: today });
        }
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        pushEnabled: state.pushEnabled,
        pushTime: state.pushTime,
        lastPushDate: state.lastPushDate,
        pendingReminders: state.pendingReminders,
      }),
    }
  )
);
