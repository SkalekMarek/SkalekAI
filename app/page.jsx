'use client';

import { useState, useRef, useEffect } from 'react';
import { Show, SignIn, UserButton, useUser, useAuth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import ArtifactPreview from './components/ArtifactPreview';
import ArtifactPreview from './components/ArtifactPreview';

// Pre-load Highlight JS in a simple way for React
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function ChatApp() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // HARD REFRESH LOGIC:
    // If a user signs in, we want to force ONE full page refresh to ensure
    // all cached contexts, singletons, and local states are wiped clean.
    if (isLoaded && user?.id) {
      const refreshKey = `skalek_refreshed_${user.id}`;
      const hasRefreshed = sessionStorage.getItem(refreshKey);

      if (!hasRefreshed) {
        sessionStorage.setItem(refreshKey, 'true');
        window.location.reload();
      }
    }
    
    // Clear flags for other users when signing out
    if (isLoaded && !user) {
      // Find all skalek refresh keys and remove them so they can refresh again on next login
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('skalek_refreshed_')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }, [user?.id, isLoaded]);

  if (!isLoaded) return null;

  return <ChatContent key={user?.id || 'visitor'} />;
}

function ChatContent() {
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLightMode, setIsLightMode] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const [currentArtifact, setCurrentArtifact] = useState(null);
  
  const mainRef = useRef(null);
  const centerInputRef = useRef(null);
  const bottomInputRef = useRef(null);

  useEffect(() => {
    // Add light-mode class to body manually to preserve all old CSS behaviors exactly
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  useEffect(() => {
    // Inject external CDNs that the old UI relied on
    if (!document.getElementById('hljs-script')) {
      const script = document.createElement('script');
      script.id = 'hljs-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
      document.head.appendChild(script);
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css';
      document.head.appendChild(link);
    }
    
    // Auto-focus on load
    if (centerInputRef.current && !active) {
      centerInputRef.current.focus();
    }
  }, [active]);


  const handleSend = async (source, overrideText = null) => {
    const text = overrideText || inputText.trim();
    if (!text || isLoading) return;

    if (source === 'center' || source === 'bottom') {
      setInputText('');
    }

    if (!active) {
      setActive(true);
      setTimeout(() => {
        if (bottomInputRef.current) bottomInputRef.current.focus();
      }, 450);
    }

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const sessionToken = await getToken();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          sessionToken
        })
      });
      
      const data = await response.json();
      
      if (data.choices) {
        const aiMessage = data.choices[0].message.content;
        setMessages([...newMessages, { role: 'assistant', content: aiMessage }]);

        // AUTO-OPEN LOGIC: If the message contains a full code block, auto-preview it
        if (/```(html|js|javascript|svg|xml)/i.test(aiMessage) && !currentArtifact) {
          setTimeout(() => {
            const defaultLang = aiMessage.includes('```html') ? 'html' : 'javascript';
            handlePreview(aiMessage, defaultLang);
          }, 800);
        }
      } else {
        setMessages([...newMessages, { role: 'assistant', content: "Error: " + (data.error || "Problem") }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: "Network error occurred." }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (bottomInputRef.current) bottomInputRef.current.focus();
      }, 100);
    }
  };

  const resetChat = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);
    setMessages([]);
    setActive(false);
    setInputText('');
    setTimeout(() => {
      if (centerInputRef.current) centerInputRef.current.focus();
    }, 100);
  };


  const handleKeyDown = (e, source) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(source);
    }
  };

  const toggleMode = () => {
    setIsLightMode(!isLightMode);
  };

  // Heuristic from Vanilla logic: wrap unfenced code
  const preprocessText = (text) => {
    if (/```/.test(text)) return text;
    const lines = text.split('\n');
    const codeLineRe = /^\s*(<!DOCTYPE|<[a-zA-Z]|<\/|import |from .+ import|def |class |function |const |let |var |if |for |while |return |#|\{|\}|\[|\]|<\?php|\/\/|\/\*|\*\/|\s{2,}\S)/;
    let codeCount = lines.filter(l => codeLineRe.test(l)).length;
    if (codeCount >= Math.max(3, lines.length * 0.4) || text.includes(';') || text.includes('=')) {
      return '```\n' + text + '\n```';
    }
    return text;
  };

  const handlePreview = (messageText, targetLang) => {
    const codeBlockRe = /```([\w-]*)\n([\s\S]*?)(?:```|$)/g;
    const blocks = [];
    let match;
    while ((match = codeBlockRe.exec(messageText)) !== null) {
      blocks.push({ lang: (match[1] || 'code').toLowerCase(), code: match[2] });
    }

    // Combine HTML, CSS, JS
    let combinedCode = '';
    const htmlBlock = blocks.find(b => ['html', 'xml'].includes(b.lang));
    const cssBlocks = blocks.filter(b => b.lang === 'css');
    const jsBlocks = blocks.filter(b => ['javascript', 'js'].includes(b.lang));
    const svgBlock = blocks.find(b => b.lang === 'svg');

    if (htmlBlock) {
      combinedCode = htmlBlock.code;
      // Inject CSS
      if (cssBlocks.length > 0) {
        const styles = cssBlocks.map(b => b.code).join('\n');
        if (combinedCode.includes('</head>')) {
          combinedCode = combinedCode.replace('</head>', `<style>${styles}</style></head>`);
        } else {
          combinedCode = `<style>${styles}</style>` + combinedCode;
        }
      }
      // Inject JS
      if (jsBlocks.length > 0) {
        const scripts = jsBlocks.map(b => b.code).join('\n');
        if (combinedCode.includes('</body>')) {
          combinedCode = combinedCode.replace('</body>', `<script>${scripts}</script></body>`);
        } else {
          combinedCode = combinedCode + `<script>${scripts}</script>`;
        }
      }
      setCurrentArtifact({ language: 'html', code: combinedCode, title: 'Live Preview' });
    } else if (svgBlock) {
      setCurrentArtifact({ language: 'svg', code: svgBlock.code, title: 'SVG Preview' });
    } else {
      // Just preview the specific target
      const target = blocks.find(b => b.lang === targetLang.toLowerCase());
      if (target) {
        setCurrentArtifact({ language: target.lang, code: target.code, title: target.lang.toUpperCase() });
      }
    }
  };

  // Parses markdown fences and renders raw text and code blocks
  const renderMessageContent = (rawText) => {
    const text = preprocessText(rawText);
    const elements = [];
    let lastIndex = 0;
    const codeBlockRe = /```([\w-]*)\n([\s\S]*?)(?:```|$)/g;
    
    let match;
    while ((match = codeBlockRe.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(<span key={`text-${lastIndex}`} style={{ whiteSpace: 'pre-wrap' }}>{text.slice(lastIndex, match.index)}</span>);
      }
      
      const lang = match[1] || 'code';
      const code = match[2];
      
      // Attempt HLJS processing if available
      let highlightedHTML = code;
      if (typeof window !== 'undefined' && window.hljs) {
        try {
          const hlLang = window.hljs.getLanguage(lang) ? lang : null;
          if (hlLang) {
            highlightedHTML = window.hljs.highlight(code, { language: hlLang, ignoreIllegals: true }).value;
          } else {
            const auto = window.hljs.highlightAuto(code);
            if (auto.relevance > 5) highlightedHTML = auto.value;
          }
        } catch (e) {
          // fallback
        }
      }

      const isPreviewable = ['html', 'javascript', 'js', 'svg', 'xml', 'css'].includes(lang.toLowerCase());

      elements.push(
        <div key={`code-${match.index}`} className="code-window">
          <div className="code-bar">
            <span className="code-lang">{lang.toUpperCase()}</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {isPreviewable && (
                <button className="code-preview-btn" onClick={() => handlePreview(text, lang)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Preview
                </button>
              )}
              <button className="code-copy-btn" onClick={(e) => {
              navigator.clipboard.writeText(code);
              const btn = e.currentTarget;
              btn.style.color = 'var(--accent)';
              setTimeout(() => btn.style.color = '', 1400);
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 16V4C3 2.89543 3.89543 2 5 2H15M9 22H18C19.1046 22 20 21.1046 20 20V8C20 6.89543 19.1046 6 18 6H9C7.89543 6 7 6.89543 7 8V20C7 21.1046 7.89543 22 9 22Z"/></svg>
            </button>
            </div>
          </div>
          <pre>
            <code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedHTML }} />
          </pre>
        </div>
      );
      
      lastIndex = codeBlockRe.lastIndex;
    }
    
    if (lastIndex < text.length) {
      elements.push(<span key={`text-${lastIndex}`} style={{ whiteSpace: 'pre-wrap' }}>{text.slice(lastIndex)}</span>);
    }
    
    return elements;
  };

  return (
    <div id="root" className={currentArtifact ? 'artifact-open' : ''}>
      {/* AUTH OVERLAY */}
      <Show when="signed-out">
        <div id="auth-overlay">
          <div className="glow-orb"></div>
          <div className="glow-orb secondary"></div>
          <img src="/svg/logo.svg" className="auth-logo" alt="Skalek AI" />
          <h2>Welcome to Skalek AI</h2>
          <p className="auth-sub">Sign in to start chatting</p>
          <div id="clerk-signin"><SignIn routing="hash" /></div>
        </div>
      </Show>

      <Show when="signed-in">
        <div id="main" ref={mainRef}>
          <header>
            {/* Left side actions */}
            <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserButton />
              </div>
            </div>

            <img src="/svg/logo.svg" alt="Skalek AI" className="logo-img" />
            <h1>Skalek AI</h1>

            {/* Right side actions */}
            <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button className={`icon-btn ${isSpinning ? 'spinning' : ''}`} id="reset-btn" onClick={resetChat} title="Reset chat" style={{ position: 'static', transform: 'none', margin: 0 }}>
                <svg viewBox="0 0 1920 1920" fill="currentColor">
                  <path d="M960 0v112.941c467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059-467.125 0-847.059-379.934-847.059-847.059 0-267.106 126.607-515.915 338.824-675.727v393.374h112.94V112.941H0v112.941h342.89C127.058 407.38 0 674.711 0 960c0 529.355 430.645 960 960 960s960-430.645 960-960S1489.355 0 960 0" fillRule="evenodd"/>
                </svg>
              </button>
              <button className="icon-btn" id="mode-btn" onClick={toggleMode} title="Toggle theme" style={{ position: 'static', transform: 'none', margin: 0 }}>
                {isLightMode ? (
                  <svg id="mode-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                ) : (
                  <svg id="mode-icon" viewBox="0 0 24 24" style={{ fill: 'none' }} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                )}
              </button>
            </div>
          </header>

          <div id="content">
            <div id="chat">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role === 'user' ? 'user' : 'ai'}`}>
                  {m.role === 'user' ? (
                    <div className="msg-bubble">{m.content}</div>
                  ) : (
                    <div className="ai-row">
                      <img src="/svg/logo.svg" alt="" className="ai-icon" />
                      <div className="ai-text">
                        {renderMessageContent(m.content)}
                      </div>
                    </div>
                  )}
                  {m.role === 'assistant' && (
                    <div className="ai-actions">
                      <button className="ai-action-btn" title="Copy" onClick={(e) => {
                        navigator.clipboard.writeText(m.content);
                        const svg = e.currentTarget.querySelector('svg');
                        if (svg) { svg.style.stroke = 'var(--accent)'; setTimeout(()=>svg.style.stroke='currentColor', 1000); }
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="msg ai" id="typing">
                  <div className="ai-row">
                    <img src="/svg/logo.svg" alt="" className="ai-icon" />
                    <div className="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div id="bottom-bar" className={active ? 'visible' : ''}>
              <div className="input-wrap">
                <label className="file-label" title="Attach file">
                  <input type="file" id="file-input-bottom" />
                  <svg viewBox="0 0 24 24"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-1.38-1.12-2.5-2.5-2.5S8 3.62 8 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
                </label>
                <textarea
                  className="msg-input"
                  id="bottom-input"
                  ref={bottomInputRef}
                  placeholder="Ask Skalek AI..."
                  rows="1"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={(e) => handleKeyDown(e, 'bottom')}
                />
                <button className="send-btn" onClick={() => handleSend('bottom')}>
                  <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
              <div className="hint">Skalek AI can make mistakes. Check important info.</div>
            </div>
          </div>
        </div>

        {/* CENTER OVERLAY FOR NEW CHATS */}
        {(!active && messages.length === 0) && (
          <div id="center-overlay" className={active ? 'fade-out' : ''}>
            <div id="welcome">
              <img src="/svg/logo.svg" alt="Skalek AI" className="big-avatar" />
              <h2>Skalek AI</h2>
            </div>
            <div id="center-input-wrap">
              <div className="input-wrap">
                <label className="file-label" title="Attach file">
                  <input type="file" id="file-input-center" />
                  <svg viewBox="0 0 24 24"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-1.38-1.12-2.5-2.5-2.5S8 3.62 8 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
                </label>
                <textarea
                  className="msg-input"
                  id="center-input"
                  ref={centerInputRef}
                  placeholder="Ask Skalek AI..."
                  rows="1"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={(e) => handleKeyDown(e, 'center')}
                />
                <button className="send-btn" onClick={() => handleSend('center')}>
                  <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

      </Show>

      <ArtifactPreview 
        artifact={currentArtifact} 
        onClose={() => setCurrentArtifact(null)} 
      />
    </div>
  );
}
