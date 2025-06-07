import NotificationsPage from '@/app/notifications/page';

interface LocaleNotificationsPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleNotifications({ params }: LocaleNotificationsPageProps) {
  return <NotificationsPage />;
} 