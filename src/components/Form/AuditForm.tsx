'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolName, AuditInput, ToolInput, UseCase } from '@/lib/audit-engine';
import styles from './AuditForm.module.css';

const AVAILABLE_TOOLS: ToolName[] = [
  'Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 'Anthropic API', 'OpenAI API', 'Gemini', 'Windsurf'
];

const USE_CASES: UseCase[] = ['coding', 'writing', 'data', 'research', 'mixed'];

export default function AuditForm({ onAudit }: { onAudit: (input: AuditInput) => void }) {
  const [tools, setTools] = useState<ToolInput[]>([]);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [primaryUseCase, setPrimaryUseCase] = useState<UseCase>('coding');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('stacksift-form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTools(parsed.tools || []);
        setTeamSize(parsed.teamSize || 1);
        setPrimaryUseCase(parsed.primaryUseCase || 'coding');
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('stacksift-form', JSON.stringify({ tools, teamSize, primaryUseCase }));
  }, [tools, teamSize, primaryUseCase]);

  const addTool = () => {
    const nextTool = AVAILABLE_TOOLS.find(t => !tools.find(existing => existing.name === t)) || AVAILABLE_TOOLS[0];
    setTools([...tools, { name: nextTool, plan: 'Pro', monthlySpend: 20, seats: 1 }]);
  };

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const updateTool = (index: number, updates: Partial<ToolInput>) => {
    const newTools = [...tools];
    newTools[index] = { ...newTools[index], ...updates };
    setTools(newTools);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAudit({ tools, teamSize, primaryUseCase });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <div className={styles.header}>
          <h2 className="gradient-text">Your AI Stack</h2>
          <p>Tell us what you're paying for today.</p>
        </div>

        <div className={styles.toolList}>
          <AnimatePresence>
            {tools.map((tool, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`${styles.toolCard} glass`}
              >
                <div className={styles.toolGrid}>
                  <div className={styles.field}>
                    <label>Tool</label>
                    <select 
                      value={tool.name} 
                      onChange={(e) => updateTool(index, { name: e.target.value as ToolName })}
                    >
                      {AVAILABLE_TOOLS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label>Plan</label>
                    <input 
                      type="text" 
                      value={tool.plan} 
                      placeholder="e.g. Pro, Team"
                      onChange={(e) => updateTool(index, { plan: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Monthly Spend ($)</label>
                    <input 
                      type="number" 
                      value={tool.monthlySpend} 
                      onChange={(e) => updateTool(index, { monthlySpend: Number(e.target.value) })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Seats</label>
                    <input 
                      type="number" 
                      value={tool.seats} 
                      onChange={(e) => updateTool(index, { seats: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <button 
                  type="button" 
                  className={styles.removeBtn}
                  onClick={() => removeTool(index)}
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <button type="button" className={styles.addBtn} onClick={addTool}>
            <Plus size={20} /> Add Tool
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.header}>
          <h2 className="gradient-text">Team Context</h2>
          <p>Help us calibrate your recommendations.</p>
        </div>
        
        <div className={styles.contextGrid}>
          <div className={styles.field}>
            <label>Total Team Size</label>
            <input 
              type="number" 
              value={teamSize} 
              onChange={(e) => setTeamSize(Number(e.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label>Primary Use Case</label>
            <select 
              value={primaryUseCase} 
              onChange={(e) => setPrimaryUseCase(e.target.value as UseCase)}
            >
              {USE_CASES.map(u => (
                <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button type="submit" className={styles.submitBtn}>
        Run Audit <ArrowRight size={20} />
      </button>
    </form>
  );
}
