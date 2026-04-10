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
          colorBackground: isDarkMode ? '#1a1a1a' : '#ffffff',
          colorInputBackground: isDarkMode ? '#252525' : '#f5f5f5',
          colorInputText: isDarkMode ? '#ffffff' : '#000000',
          colorText: isDarkMode ? '#ffffff' : '#000000',
          colorTextSecondary: isDarkMode ? '#888888' : '#666666',
          colorDanger: '#ff3333',
          colorWarning: '#c8f902',
          colorSuccess: '#c8f902',
          borderRadius: '12px',
          fontFamily: "'Outfit', 'Inter', sans-serif"
        },
        elements: {
          card: {
            boxShadow: 'none',
            background: 'transparent',
            border: 'none',
          },
          headerTitle: { 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            letterSpacing: '-0.02em', 
            color: isDarkMode ? '#ffffff' : '#000000' 
          },
          headerSubtitle: { 
            fontSize: '0.95rem',
            color: isDarkMode ? '#888888' : '#666666' 
          },
          socialButtonsBlockButton: {
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(255,255,255,0.05)',
              borderColor: '#c8f902'
            }
          },
          formButtonPrimary: {
            fontSize: '0.95rem',
            fontWeight: '700',
            textTransform: 'none',
            backgroundColor: '#c8f902',
            color: '#000000',
            boxShadow: '0 4px 12px rgba(200, 249, 2, 0.2)',
            '&:hover': {
              backgroundColor: '#d9ff4d',
              boxShadow: '0 6px 20px rgba(200, 249, 2, 0.4)'
            }
          },
          footerActionLink: {
            color: '#c8f902',
            fontWeight: '600'
          }
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}
