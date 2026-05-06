import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { email, company, role, teamSize, auditId } = await req.json();
    
    // 1. Store in Supabase
    if (supabase) {
      const { error } = await supabase
        .from('leads')
        .insert([{ email, company_name: company, role, team_size: teamSize, audit_id: auditId }]);
      
      if (error) throw error;
    }

    // 2. Send Email
    if (resend) {
      await resend.emails.send({
        from: 'StackSift <audits@stacksift.ai>',
        to: email,
        subject: 'Your AI Spend Audit Report',
        html: `<h1>Your StackSift Audit is Ready</h1><p>We've analyzed your stack and found significant potential savings. A Credex advisor will reach out shortly to help you implement these optimizations.</p>`
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead Capture Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
