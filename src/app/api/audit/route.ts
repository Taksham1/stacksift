import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const { input, results } = await req.json();
    
    // Strip identifying details (handled by only saving what's needed)
    const publicData = {
      tools: input.tools.map((t: any) => ({ name: t.name, plan: t.plan, savings: results.perToolBreakdown.find((b: any) => b.tool === t.name)?.savings })),
      totalMonthlySavings: results.totalMonthlySavings,
      totalAnnualSavings: results.totalAnnualSavings,
      primaryUseCase: input.primaryUseCase
    };

    const id = nanoid(10);
    
    if (supabase) {
      const { error } = await supabase
        .from('audits')
        .insert([{ id, data: publicData }]);
      
      if (error) throw error;
    }

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Save Audit Error:', error);
    return NextResponse.json({ id: 'fallback-id' });
  }
}
