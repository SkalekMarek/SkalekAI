'use client';

import { useState, useEffect } from 'react';

export default function ArtifactPreview({ artifact, onClose }) {
  const [view, setView] = useState('preview'); // 'preview' or 'code'
  const [iframeKey, setIframeKey] = useState(0);

  if (!artifact) return null;

  const { language, title, code } = artifact;
  const [highlightedCode, setHighlightedCode] = useState('');

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  useEffect(() => {
    // Apply syntax highlighting to the code view
    if (view === 'code') {
      if (typeof window !== 'undefined' && window.hljs) {
        try {
          const lang = window.hljs.getLanguage(language) ? language : 'javascript';
          const highlighted = window.hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
          setHighlightedCode(highlighted);
        } catch (e) {
          setHighlightedCode(escapeHtml(code));
        }
      } else {
        // Fallback to manual escaping if highlight.js is not loaded yet
        setHighlightedCode(escapeHtml(code));
      }
    }
  }, [view, code, language]);

  const getSrcDoc = () => {
    if (language === 'html' || language === 'xml') {
      return code;
    }
    if (language === 'svg') {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0; 
                background: #fdfdfd; 
              }
              svg { max-width: 90%; max-height: 90%; }
            </style>
          </head>
          <body>${code}</body>
        </html>
      `;
    }
    // For JS/Python, we might need more complex wrappers, but for now:
    if (['javascript', 'js', 'react', 'jsx', 'ts', 'tsx'].includes(language.toLowerCase())) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 24px; line-height: 1.5; color: #333; }
              #root { border: 1px solid #eee; border-radius: 8px; padding: 16px; min-height: 100px; background: #fafafa; }
              h1, h2 { margin-top: 0; }
            </style>
          </head>
          <body>
            <h3>Live JS Execution</h3>
            <div id="root"></div>
            <script>
              const root = document.getElementById('root');
              const log = (msg) => {
                const p = document.createElement('p');
                p.textContent = '> ' + msg;
                p.style.fontFamily = 'monospace';
                p.style.margin = '4px 0';
                root.appendChild(p);
              };
              console.log = log;
              try {
                ${code}
              } catch (e) {
                const err = document.createElement('div');
                err.style.color = 'red';
                err.style.padding = '10px';
                err.style.background = '#fff0f0';
                err.style.borderRadius = '4px';
                err.textContent = 'Runtime Error: ' + e.message;
                document.body.appendChild(err);
              }
            </script>
          </body>
        </html>
      `;
    }
    return `<!DOCTYPE html><html><body style="font-family: monospace; padding: 20px; white-space: pre-wrap; background: #f8f9fa;">${code}</body></html>`;
  };

  const reload = () => setIframeKey(k => k + 1);

  return (
    <div className={`artifact-panel ${artifact ? 'open' : ''}`}>
      <div className="artifact-header">
        <div className="artifact-title">
          <span className="artifact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
          </span>
          <h3>{title || 'Generated Artifact'}</h3>
        </div>
        <div className="artifact-actions">
          <div className="toggle-group">
            <button 
              className={view === 'preview' ? 'active' : ''} 
              onClick={() => setView('preview')}
            >
              Preview
            </button>
            <button 
              className={view === 'code' ? 'active' : ''} 
              onClick={() => setView('code')}
            >
              Code
            </button>
          </div>
          <button className="icon-btn" onClick={reload} title="Reload">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>
          <button className="icon-btn close-btn" onClick={onClose} title="Close Artifact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      
      <div className="artifact-body">
        {view === 'preview' ? (
          <iframe
            key={iframeKey}
            srcDoc={getSrcDoc()}
            sandbox="allow-scripts"
            className="preview-iframe"
            title="Artifact Preview"
          />
        ) : (
          <div className="code-view">
            <pre><code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedCode }} /></pre>
          </div>
        )}
      </div>
    </div>
  );
}
