import { describe, it, expect } from 'vitest';
import { runAudit, AuditInput } from './audit-engine';

describe('Audit Engine', () => {
  it('identifies optimal stacks with 0 savings', () => {
    const input: AuditInput = {
      tools: [{ name: 'Cursor', plan: 'Pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      primaryUseCase: 'coding'
    };
    const results = runAudit(input);
    expect(results.totalMonthlySavings).toBe(0);
  });

  it('recommends downgrading Cursor Business for solo users', () => {
    const input: AuditInput = {
      tools: [{ name: 'Cursor', plan: 'Business', monthlySpend: 40, seats: 1 }],
      teamSize: 1,
      primaryUseCase: 'coding'
    };
    const results = runAudit(input);
    const cursorAudit = results.perToolBreakdown.find(t => t.tool === 'Cursor');
    expect(cursorAudit?.savings).toBe(20);
    expect(cursorAudit?.recommendedAction).toBe('Switch to Pro');
  });

  it('recommends Pro for solo users on Claude Team', () => {
    const input: AuditInput = {
      tools: [{ name: 'Claude', plan: 'Team', monthlySpend: 50, seats: 1 }],
      teamSize: 1,
      primaryUseCase: 'writing'
    };
    const results = runAudit(input);
    const claudeAudit = results.perToolBreakdown.find(t => t.tool === 'Claude');
    expect(claudeAudit?.savings).toBe(30);
  });

  it('flags high API spend for startup credits', () => {
    const input: AuditInput = {
      tools: [{ name: 'OpenAI API', plan: 'Usage', monthlySpend: 1000, seats: 1 }],
      teamSize: 5,
      primaryUseCase: 'mixed'
    };
    const results = runAudit(input);
    const apiAudit = results.perToolBreakdown.find(t => t.tool === 'OpenAI API');
    expect(apiAudit?.savings).toBe(800);
    expect(apiAudit?.recommendedAction).toBe('Apply for Startup Credits');
  });

  it('calculates annual savings correctly', () => {
    const input: AuditInput = {
      tools: [{ name: 'ChatGPT', plan: 'Pro (Unlimited)', monthlySpend: 200, seats: 1 }],
      teamSize: 1,
      primaryUseCase: 'research'
    };
    const results = runAudit(input);
    expect(results.totalAnnualSavings).toBe(results.totalMonthlySavings * 12);
  });
});
