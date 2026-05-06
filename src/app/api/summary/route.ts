import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function POST(req: Request) {
  try {
    const { totalMonthlySpend, totalAnnualSavings, useCase, teamSize, toolBreakdown } = await req.json();

    if (!anthropic) {
      throw new Error('Missing API Key');
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 250,
      system: "You are a senior financial consultant specializing in AI infrastructure optimization at Credex. Provide a 100-word summary of the audit. Be professional and data-driven.",
      messages: [
        {
          role: 'user',
          content: `Analyze this audit:
            Total Monthly Spend: $${totalMonthlySpend}
            Total Annual Savings: $${totalAnnualSavings}
            Use Case: ${useCase}
            Team Size: ${teamSize}
            Breakdown: ${JSON.stringify(toolBreakdown)}`
        }
      ],
    });

    const summary = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ summary });

  } catch (error) {
    console.error('AI Summary Error:', error);
    
    // Fallback Summary
    return NextResponse.json({ 
      summary: "Based on your current stack, there are significant opportunities to streamline your AI operations. By adjusting your seat allocations and moving to more appropriate tiers for your team size, you can realize immediate monthly savings without sacrificing capability. We recommend starting with the top-priority actions identified in your breakdown."
    });
  }
}
