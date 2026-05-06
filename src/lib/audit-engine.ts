export type ToolName = 
  | 'Cursor' 
  | 'GitHub Copilot' 
  | 'Claude' 
  | 'ChatGPT' 
  | 'Anthropic API' 
  | 'OpenAI API' 
  | 'Gemini' 
  | 'Windsurf';

export type PlanType = string;

export interface ToolInput {
  name: ToolName;
  plan: PlanType;
  monthlySpend: number;
  seats: number;
}

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export interface ToolAuditResult {
  tool: ToolName;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

export interface AuditOutput {
  perToolBreakdown: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export function runAudit(input: AuditInput): AuditOutput {
  const perToolBreakdown: ToolAuditResult[] = input.tools.map(tool => auditTool(tool, input));
  
  const totalMonthlySavings = perToolBreakdown.reduce((acc, curr) => acc + curr.savings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    perToolBreakdown,
    totalMonthlySavings,
    totalAnnualSavings
  };
}

function auditTool(tool: ToolInput, input: AuditInput): ToolAuditResult {
  const { name, plan, monthlySpend, seats } = tool;
  
  // Default: No changes
  let result: ToolAuditResult = {
    tool: name,
    currentSpend: monthlySpend,
    recommendedAction: 'Keep current plan',
    savings: 0,
    reason: 'Your current configuration is optimal for your usage.'
  };

  switch (name) {
    case 'Cursor':
      if (plan === 'Business' && seats < 3) {
        result.recommendedAction = 'Switch to Pro';
        result.savings = monthlySpend - (20 * seats);
        result.reason = `With only ${seats} users, you're paying a premium for admin features you likely don't need. Pro offers the same AI capabilities at half the cost.`;
      } else if (plan === 'Ultra' && input.primaryUseCase !== 'coding') {
        result.recommendedAction = 'Downgrade to Pro';
        result.savings = monthlySpend - (20 * seats);
        result.reason = 'Ultra is specifically for AI-native power users. Your use case suggests Pro will provide identical value for 90% less spend.';
      }
      break;

    case 'GitHub Copilot':
      if (plan === 'Enterprise' && seats < 10 && input.primaryUseCase !== 'coding') {
        result.recommendedAction = 'Switch to Individual/Business';
        result.savings = monthlySpend - (19 * seats);
        result.reason = 'Enterprise features like custom model fine-tuning are overkill for small teams not doing heavy proprietary coding.';
      }
      break;

    case 'Claude':
      if (plan === 'Max (20x)' && seats === 1) {
        result.recommendedAction = 'Downgrade to Max (5x)';
        result.savings = monthlySpend - 100;
        result.reason = 'Unless you are hitting usage limits daily, the 5x Max plan provides ample headroom for most power users.';
      } else if (plan === 'Team' && seats < 2) {
        result.recommendedAction = 'Switch to Pro';
        result.savings = monthlySpend - 20;
        result.reason = 'Team plans require a minimum of 2 seats. As a solo user, Pro gives you the same model access for less.';
      }
      break;

    case 'ChatGPT':
      if (plan === 'Pro (Unlimited)') {
        result.recommendedAction = 'Switch to Plus or API';
        result.savings = monthlySpend - 20;
        result.reason = 'Unlimited usage is rarely reached by 95% of users. Plus is usually sufficient, or switch to API for pay-as-you-go.';
      }
      break;

    case 'OpenAI API':
    case 'Anthropic API':
      if (monthlySpend > 500) {
        result.recommendedAction = 'Apply for Startup Credits';
        result.savings = monthlySpend * 0.8; // Assume 80% savings through credits
        result.reason = 'At this spend level, you are eligible for AWS Activate or Google Cloud startup credits which cover up to $100k in API costs.';
      }
      break;

    case 'Gemini':
      if (plan === 'AI Ultra' && seats === 1) {
        result.recommendedAction = 'Switch to AI Pro';
        result.savings = monthlySpend - 19.99;
        result.reason = 'AI Pro offers the Gemini 1.5 Pro model which is highly capable; Ultra is a significant price jump for marginal gains.';
      }
      break;
  }

  return result;
}
