import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { AlertTriangle, User, Lock, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateCybersecurityResponse } from '../services/ai';
import { motion, AnimatePresence } from 'framer-motion';

const Assistant = () => {
  const { isAuthenticated } = useAuth();
  const { warning } = useToast();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (input === '' && textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
    }
  }, [input]);

  const sanitizeInput = (text) => {
    return text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .trim();
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const sanitizedInput = sanitizeInput(input);
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: sanitizedInput,
      isWarning: false
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateCybersecurityResponse(updatedMessages);

      if (response.isWarning) {
        warning('Please follow ethical guidelines');
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: response.content,
        isWarning: response.isWarning
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: "I encountered an error connecting to my neural core. Please try again later.",
        isWarning: false
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResizeTextarea = (e) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-dark pt-24 text-brand-text flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-surface border border-brand-text/10 p-12 rounded-3xl text-center max-w-md w-full backdrop-blur-xl shadow-2xl"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4 font-display">Join to chat with WFD</h2>
          <p className="text-brand-muted mb-8 text-sm leading-relaxed">
            Create an account to access our advanced AI cybersecurity mentor.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/signup"
              className="w-full py-3 bg-brand-primary text-brand-dark font-semibold rounded-full hover:bg-cyan-400 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="w-full py-3 bg-transparent border border-brand-text/20 text-brand-text font-semibold rounded-full hover:bg-brand-surface transition-colors"
            >
              Log In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const isChatEmpty = messages.length === 0;

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text flex flex-col font-sans mb-0">

      {/* Dynamic Main Content Area */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col relative justify-between pt-24">

        {/* Chat History */}
        <div className={`flex-1 overflow-y-auto pb-40 transition-all duration-500 ease-in-out scrollbar-hide ${isChatEmpty ? 'opacity-0 hidden' : 'opacity-100 pt-4'}`}>
          <div className="space-y-8">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'user' ? (
                  // User Message Style
                  <div className="bg-brand-surface border border-brand-text/10 text-brand-text px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] sm:max-w-[75%] text-[15px] leading-relaxed break-words shadow-sm">
                    {msg.content}
                  </div>
                ) : (
                  // WFD AI Message Style
                  <div className="flex gap-4 w-full max-w-[90%]">
                    <div className="w-8 h-8 rounded-full bg-brand-primary text-brand-dark flex items-center justify-center shrink-0 font-bold text-xs tracking-tighter mt-1 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                      WFD
                    </div>
                    <div className="flex-1 min-w-0">
                      {msg.isWarning && (
                        <div className="flex items-center gap-2 text-red-400 mb-3 bg-red-400/10 border border-red-400/20 px-3 py-1.5 rounded-lg w-fit">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">Ethical Safety Warning</span>
                        </div>
                      )}
                      <div className="text-brand-text leading-relaxed prose prose-invert max-w-none text-[15px]">
                        {msg.content.split('\n').map((line, i) => {
                          let processed = line
                            .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-brand-primary font-semibold">$1</strong>')
                            .replace(/`([^`]+)`/g, '<code class="bg-brand-surface px-1.5 py-0.5 rounded text-brand-secondary border border-brand-text/10 font-mono text-[13px]">$1</code>');

                          if (line.trim().startsWith('-')) {
                            return <div key={i} className="ml-4 mb-2 flex gap-2 w-full"><span className="text-brand-primary">•</span> <span dangerouslySetInnerHTML={{ __html: processed.substring(1) }} /></div>;
                          }
                          return <p key={i} className={`mb-3 last:mb-0 w-full ${!line.trim() ? 'h-2' : ''}`} dangerouslySetInnerHTML={{ __html: processed }} />;
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 w-full max-w-[90%]"
              >
                <div className="w-8 h-8 rounded-full bg-brand-primary text-brand-dark flex items-center justify-center shrink-0 font-bold text-xs tracking-tighter mt-1 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  WFD
                </div>
                <div className="flex items-center h-10 gap-1.5">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                    className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', delay: 0.2 }}
                    className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', delay: 0.4 }}
                    className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                  />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Dynamic Input Container */}
        <motion.div
          layout
          initial={false}
          animate={{
            justifyContent: isChatEmpty ? 'center' : 'flex-end',
            paddingBottom: isChatEmpty ? '20vh' : '2rem'
          }}
          className="absolute inset-x-4 top-0 bottom-0 pointer-events-none flex flex-col items-center z-10"
        >
          {/* Splash Text */}
          <AnimatePresence>
            {isChatEmpty && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="text-center mb-8 pointer-events-auto"
              >
                <h1 className="text-5xl sm:text-7xl font-bold font-display tracking-tighter text-brand-primary mb-4 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">WFD</h1>
                <p className="text-brand-muted text-lg sm:text-xl font-medium tracking-wide">How can I help you today?</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Box */}
          <motion.div
            layout
            className="w-full max-w-3xl pointer-events-auto bg-brand-surface rounded-3xl border border-brand-text/10 shadow-2xl overflow-hidden backdrop-blur-md transition-shadow focus-within:ring-1 focus-within:ring-brand-primary/50 focus-within:border-brand-primary/50 focus-within:shadow-[0_0_30px_rgba(34,211,238,0.15)] bg-opacity-80"
          >
            <div className="flex items-end p-2 gap-2 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoResizeTextarea(e);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask WFD anything..."
                className="flex-1 bg-transparent text-brand-text px-4 py-3 rounded-2xl max-h-[200px] min-h-[52px] resize-none outline-none border-none focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-brand-muted/50 text-[15px] leading-relaxed overflow-y-auto"
                disabled={isTyping}
                maxLength={2000}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="shrink-0 mb-1 mr-1 p-2.5 rounded-full bg-brand-primary text-brand-dark disabled:bg-brand-surface disabled:border disabled:border-brand-text/10 disabled:text-brand-muted hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center h-10 w-10"
              >
                <ArrowUp className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>

          <motion.p layout className="text-center text-[11px] text-brand-muted mt-4 pointer-events-auto">
            WFD can make mistakes. Consider verifying critical cybersecurity information.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Assistant;
