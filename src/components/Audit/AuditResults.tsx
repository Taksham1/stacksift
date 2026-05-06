'use client';

import React, { useState } from 'react';
import { Share2, Mail, ExternalLink, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuditOutput, ToolAuditResult } from '@/lib/audit-engine';
import styles from './AuditResults.module.css';

interface AuditResultsProps {
  input: any; // Original input for AI context
  results: AuditOutput;
  onShare: () => void;
  onLeadSubmit: (email: string, details: any) => void;
}

export default function AuditResults({ input, results, onShare, onLeadSubmit }: AuditResultsProps) {
  const { perToolBreakdown, totalMonthlySavings, totalAnnualSavings } = results;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(true);

  React.useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          body: JSON.stringify({
            totalMonthlySpend: perToolBreakdown.reduce((acc, curr) => acc + curr.currentSpend, 0),
            totalAnnualSavings,
            useCase: input.primaryUseCase,
            teamSize: input.teamSize,
            toolBreakdown: perToolBreakdown
          })
        });
        const data = await res.json();
        setSummary(data.summary);
      } catch (e) {
        console.error('Failed to fetch summary');
      } finally {
        setLoadingSummary(false);
      }
    }
    fetchSummary();
  }, [results, input]);

  const isHighSavings = totalMonthlySavings > 500;
  const isOptimal = totalMonthlySavings < 100;

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const honeypot = formData.get('honeypot') as string;
    
    if (honeypot) {
      console.warn('Bot detected via honeypot');
      return;
    }

    onLeadSubmit(email, {});
    setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.savingsCard}
        >
          <div className={styles.savingsLabel}>Potential Annual Savings</div>
          <div className={`${styles.savingsAmount} savings-text`}>
            ${totalAnnualSavings.toLocaleString()}
          </div>
          <div className={styles.monthlyNote}>
            That's <span>${totalMonthlySavings.toLocaleString()}</span> back in your pocket every month.
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={styles.summaryBox}
        >
          {loadingSummary ? (
            <div className={styles.skeleton}>Analyzing your stack...</div>
          ) : (
            <p>"{summary}"</p>
          )}
        </motion.div>

        {isHighSavings && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.credexPromo}
          >
            <Zap className={styles.promoIcon} />
            <div className={styles.promoContent}>
              <h3>High Savings Detected</h3>
              <p>You're eligible for a free Credex optimization strategy to capture even more hidden credits.</p>
              <button className={styles.bookBtn}>Book Consultation</button>
            </div>
          </motion.div>
        )}
      </header>

      <div className={styles.grid}>
        <section className={styles.breakdown}>
          <h2>Tool-by-Tool Audit</h2>
          <div className={styles.toolGrid}>
            {perToolBreakdown.map((item, index) => (
              <ToolCard key={index} item={item} />
            ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={`${styles.card} glass`}>
            <h3>{isOptimal ? 'Keep it up!' : 'Get the Full Report'}</h3>
            <p>
              {isOptimal 
                ? "Your stack is already lean. We'll notify you when new optimizations apply to your specific tools."
                : "We've generated a detailed 12-page optimization roadmap for your team."}
            </p>
            
            {!submitted ? (
              <form onSubmit={handleLeadSubmit} className={styles.leadForm}>
                <div style={{ display: 'none' }}>
                  <input type="text" name="honeypot" />
                </div>
                <div className={styles.field}>
                  <label>Work Email</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="you@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className={styles.captureBtn}>
                  {isOptimal ? 'Notify Me' : 'Send My Report'}
                </button>
              </form>
            ) : (
              <div className={styles.success}>
                <CheckCircle className={styles.successIcon} />
                <p>Report sent! Check your inbox.</p>
              </div>
            )}
          </div>

          <button onClick={onShare} className={styles.shareBtn}>
            <Share2 size={18} /> Share Results
          </button>
        </aside>
      </div>
    </div>
  );
}

function ToolCard({ item }: { item: ToolAuditResult }) {
  const isSaving = item.savings > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${styles.toolCard} glass`}
    >
      <div className={styles.toolHeader}>
        <div className={styles.toolName}>{item.tool}</div>
        {isSaving ? (
          <div className={styles.savingsBadge}>-${item.savings}/mo</div>
        ) : (
          <div className={styles.optimalBadge}>Optimal</div>
        )}
      </div>
      
      <div className={styles.toolAction}>
        <div className={styles.actionLabel}>Recommended Action</div>
        <div className={styles.actionValue}>{item.recommendedAction}</div>
      </div>

      <p className={styles.toolReason}>{item.reason}</p>
    </motion.div>
  );
}
