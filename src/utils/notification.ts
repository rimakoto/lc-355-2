import { Quote } from '@/types';
import { getQuoteOfDay } from '@/data/quotes';

const NOTIFICATION_TITLE = '每日名言';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  return await Notification.requestPermission();
}

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function sendQuoteNotification(quote: Quote): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  const truncatedText = quote.text.length > 50 ? quote.text.slice(0, 50) + '…' : quote.text;

  const notification = new Notification(NOTIFICATION_TITLE, {
    body: `${truncatedText}\n— ${quote.author}`,
    icon: '/favicon.svg',
    tag: 'daily-quote',
    requireInteraction: false,
  });

  notification.onclick = () => {
    window.focus();
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
    notification.close();
  };

  return notification;
}

export function sendDailyQuoteNotification(): Notification | null {
  const quote = getQuoteOfDay(new Date());
  return sendQuoteNotification(quote);
}

export function sendLaterReminder(quote: Quote): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  const truncatedText = quote.text.length > 50 ? quote.text.slice(0, 50) + '…' : quote.text;

  const notification = new Notification(`${NOTIFICATION_TITLE} - 稍后再看`, {
    body: `${truncatedText}\n— ${quote.author}`,
    icon: '/favicon.svg',
    tag: `later-quote-${Date.now()}`,
    requireInteraction: false,
  });

  notification.onclick = () => {
    window.focus();
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
    notification.close();
  };

  return notification;
}
