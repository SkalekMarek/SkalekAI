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
          colorPrimary: isDarkMode ? '#ffffff' : '#000000',
          colorTextOnPrimaryBackground: isDarkMode ? '#000000' : '#ffffff',
          colorBackground: isDarkMode ? '#111111' : '#ffffff',
          colorInputBackground: isDarkMode ? '#1a1a1a' : '#f0f0f0',
          colorInputText: isDarkMode ? '#ffffff' : '#000000',
          colorText: isDarkMode ? '#ffffff' : '#000000',
          colorTextSecondary: isDarkMode ? '#cccccc' : '#555555',
          colorDanger: '#ff3333',
          colorWarning: '#c8f902',
          colorSuccess: '#c8f902'
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}
