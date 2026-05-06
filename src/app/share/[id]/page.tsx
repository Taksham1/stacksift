import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Zap } from 'lucide-react';
import styles from '@/components/Audit/AuditResults.module.css';

interface Props {
  params: { id: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  
  if (!supabase) {
    return { title: 'AI Spend Audit - StackSift' };
  }

  // Fetch data to populate OG tags
  const { data: audit } = await supabase
    .from('audits')
    .select('data')
    .eq('id', id)
    .single();

  const savings = audit?.data?.totalAnnualSavings || 0;

  return {
    title: `AI Spend Audit - $${savings.toLocaleString()} Savings Found`,
    description: `See how this stack was optimized to save $${savings.toLocaleString()} per year with StackSift.`,
    openGraph: {
      title: 'AI Spend Audit Results',
      description: `Optimized stack found $${savings.toLocaleString()} in annual savings.`,
      images: ['/og-image.png'], // Placeholder for actual OG image generation
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Spend Audit Results',
      description: `Optimized stack found $${savings.toLocaleString()} in annual savings.`,
    },
  };
}

export default async function SharePage({ params }: Props) {
  if (!supabase) {
    return <div>Database connection missing. Local demo mode.</div>;
  }

  const { data: audit } = await supabase
    .from('audits')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!audit) {
    return <div>Audit not found</div>;
  }

  const { data } = audit;

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Zap size={32} color="#3b82f6" />
          <span style={{ fontSize: '2rem', fontWeight: 800 }}>StackSift</span>
        </div>
      </nav>

      <div className={styles.hero}>
        <div className={styles.savingsCard}>
          <div className={styles.savingsLabel}>Public Audit Results</div>
          <div className={`${styles.savingsAmount} savings-text`}>
            ${data.totalAnnualSavings.toLocaleString()}
          </div>
          <p style={{ color: 'var(--muted)' }}>Annualized savings across {data.tools.length} AI tools.</p>
        </div>
      </div>

      <div className={styles.toolGrid} style={{ marginTop: '4rem' }}>
        {data.tools.map((tool: any, i: number) => (
          <div key={i} className={`${styles.toolCard} glass`}>
            <div className={styles.toolHeader}>
              <div className={styles.toolName}>{tool.name}</div>
              <div className={styles.savingsBadge}>-${tool.savings}/mo</div>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
              Optimization found for the {tool.plan} plan.
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '6rem', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem' }}>Want to audit your own stack?</h3>
        <a href="/" style={{ 
          display: 'inline-block',
          padding: '1rem 2rem', 
          background: 'var(--primary)', 
          color: 'white', 
          borderRadius: '1rem',
          fontWeight: 600,
          textDecoration: 'none'
        }}>
          Run Free Audit
        </a>
      </div>
    </main>
  );
}
