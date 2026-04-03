import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion, X, Loader2 } from 'lucide-react';
import api from '../utils/api';

const FakeNewsChecker = ({ isOpen, onClose, initialContent = '', initialSource = '', onResult }) => {
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
      setSource(initialSource);
      setResult(null);
    }
  }, [isOpen, initialContent, initialSource]);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      // Simulate progress bar time
      const res = await api.post('/fakenews/analyze', { content, source });
      setResult(res.data);
      if (onResult) {
        onResult(res.data);
      }
    } catch (error) {
      console.error("Failed to analyze", error);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictIcon = () => {
    if (!result) return <Shield size={48} className="text-[var(--accent)] mb-4" />;
    if (result.color === 'green') return <ShieldCheck size={48} className="text-green-500 mb-4" />;
    if (result.color === 'yellow') return <ShieldQuestion size={48} className="text-yellow-500 mb-4" />;
    return <ShieldAlert size={48} className="text-red-500 mb-4" />;
  };
  
  const getVerdictColor = () => {
    if (!result) return '';
    if (result.color === 'green') return 'text-green-500';
    if (result.color === 'yellow') return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-modal-fade">
      <div className="bg-[var(--surface)] text-[var(--text)] border border-[var(--accent)] rounded-2xl w-full max-w-lg shadow-[0_0_40px_rgba(232,197,71,0.15)] flex flex-col max-h-[90vh] overflow-hidden animate-modal-scale">
        
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-[var(--surface2)]">
          <div className="flex items-center gap-3">
            <Shield className="text-[var(--accent)]" size={24} />
            <h2 className="font-playfair text-xl font-bold tracking-wide">AI Fact Checker</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--surface)] transition-colors text-[var(--text-muted)] hover:text-[var(--text)]">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!result ? (
            <div className="space-y-5 flex flex-col">
              <div>
                <label className="block text-sm font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wide">Content to Analyze</label>
                <textarea
                  className="w-full p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all resize-none h-32 text-sm font-sans"
                  placeholder="Paste article text or title here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wide">Source (Optional)</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all text-sm font-sans"
                  placeholder="e.g. BBC, Reuters, unknown website..."
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={loading || !content.trim()}
                className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-[#1a1a2e] font-bold text-lg shadow-[0_4px_14px_rgba(232,197,71,0.4)] hover:shadow-[0_6px_20px_rgba(232,197,71,0.6)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                {loading ? 'Analyzing...' : 'Analyze Credibility'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center animate-stagger-fade-up">
              {getVerdictIcon()}
              
              <div className="relative w-32 h-32 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" className="stroke-[var(--surface2)] fill-none" strokeWidth="12" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    className={`fill-none stroke-current ${getVerdictColor()}`}
                    strokeWidth="12" 
                    strokeLinecap="round"
                    strokeDasharray="351.86"
                    style={{ strokeDashoffset: 351.86 - (351.86 * result.score) / 100, transition: 'stroke-dashoffset 1s ease-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-black font-mono ${getVerdictColor()}`}>
                    {result.score}
                  </span>
                </div>
              </div>

              <h3 className={`font-playfair text-3xl font-black mb-2 tracking-wide ${getVerdictColor()}`}>
                {result.verdict}
              </h3>

              <div className="w-full mt-6 text-left">
                <h4 className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-3">Analysis Reasons</h4>
                <ul className="space-y-2">
                  {result.reasons?.map((reason, idx) => (
                    <li key={idx} className="flex items-start text-sm bg-[var(--surface2)] p-3 rounded-lg border border-[var(--border)]">
                      <span className="mr-2 mt-0.5 text-[var(--accent)]">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => setResult(null)}
                className="mt-8 border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface2)] px-6 py-2.5 rounded-full font-bold transition-colors"
              >
                Analyze Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FakeNewsChecker;
