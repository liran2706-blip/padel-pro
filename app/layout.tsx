import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Padel Pro — מערכת ניהול טורנירים',
  description: 'פלטפורמה מקצועית לניהול טורנירי פאדל',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-slate-950 text-white min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
