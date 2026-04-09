'use client';

import { useState, useEffect } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export function ClerkClientProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setIsDarkMode(!document.body.classList.contains('light-mode'));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(!document.body.classList.contains('light-mode'));
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <ClerkProvider appearance={{ baseTheme: isDarkMode ? dark : undefined }}>
      {children}
    </ClerkProvider>
  );
}
