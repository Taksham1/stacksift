'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import AuditForm from '@/components/Form/AuditForm';
import AuditResults from '@/components/Audit/AuditResults';
import { runAudit, AuditInput, AuditOutput } from '@/lib/audit-engine';

export default function Home() {
  const [view, setView] = useState<'form' | 'results'>('form');
  const [auditInput, setAuditInput] = useState<AuditInput | null>(null);
  const [auditData, setAuditData] = useState<AuditOutput | null>(null);

  const handleAudit = (input: AuditInput) => {
    setAuditInput(input);
    const results = runAudit(input);
    setAuditData(results);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (!auditData || !auditInput) return;
    
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        body: JSON.stringify({ input: auditInput, results: auditData })
      });
      const { id } = await res.json();
      const url = `${window.location.origin}/share/${id}`;
      navigator.clipboard.writeText(url);
      alert(`Public report URL copied to clipboard: ${url}`);
    } catch (e) {
      console.error('Failed to generate share URL');
    }
  };

  const handleLeadSubmit = async (email: string, details: any) => {
    try {
      await fetch('/api/lead', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          ...details,
          teamSize: auditInput?.teamSize,
          useCase: auditInput?.primaryUseCase
        })
      });
    } catch (e) {
      console.error('Failed to capture lead');
    }
  };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem' }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto 4rem auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'var(--primary)', 
            padding: '0.5rem', 
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Zap size={24} fill="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            StackSift
          </span>
        </div>
        <button 
          onClick={() => setView('form')}
          style={{ color: 'var(--muted)', fontSize: '0.875rem', fontWeight: 500 }}
        >
          {view === 'results' ? '← Back to Editor' : ''}
        </button>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {view === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }} className="gradient-text">
                  Optimize your AI spend in seconds.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto' }}>
                  Stop overpaying for seats you don't use and plans you don't need. 
                  Get a defensible audit and save thousands.
                </p>
              </div>
              <AuditForm onAudit={handleAudit} />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {auditData && auditInput && (
                <AuditResults 
                  input={auditInput}
                  results={auditData} 
                  onShare={handleShare}
                  onLeadSubmit={handleLeadSubmit}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer style={{ 
        textAlign: 'center', 
        marginTop: '8rem', 
        padding: '4rem 0',
        borderTop: '1px solid var(--border)',
        color: 'var(--muted)',
        fontSize: '0.875rem'
      }}>
        <p>&copy; 2026 StackSift by Credex. All rights reserved.</p>
      </footer>
    </main>
  );
}
