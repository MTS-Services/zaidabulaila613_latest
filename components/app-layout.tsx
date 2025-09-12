// components/AppLayout.tsx
'use client';
import { useLanguage } from '@/contexts/language-context';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  // Update document attributes after hydration to prevent hydration mismatches
  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
    document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr';

    // Update body classes - preserve existing classes that may be added by browser extensions
    const body = document.body;
    const existingClasses = body.className;

    // Remove our previous language-specific classes
    const cleanClasses = existingClasses
      .replace(/text-right/g, '')
      .replace(/font-sans/g, '')
      .replace(/pt-16/g, '')
      .trim();

    // Add our new classes
    const newClasses = `${cleanClasses} ${
      language === 'AR' ? 'text-right' : 'font-sans'
    } pt-16`.trim();

    body.className = newClasses;
  }, [language]);

  return <>{children}</>;
}
