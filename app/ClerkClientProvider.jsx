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
    <ClerkProvider 
      appearance={{ 
        baseTheme: isDarkMode ? dark : undefined,
        variables: {
          colorPrimary: '#c8f902',
          colorTextOnPrimaryBackground: '#000000',
          colorBackground: isDarkMode ? '#1a1a1a' : '#eeeeee',
          colorInputBackground: isDarkMode ? '#111111' : '#f7f7f7',
          colorInputText: isDarkMode ? '#e8e8e8' : '#1a1a1a',
          colorText: isDarkMode ? '#e8e8e8' : '#1a1a1a',
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}
