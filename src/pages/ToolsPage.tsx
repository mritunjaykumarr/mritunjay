import { Link } from 'react-router-dom';
import ToolOutRedirectCard from '../components/ToolOutRedirectCard';
import { useSEO } from '../lib/useSEO';

export default function ToolsPage() {
  useSEO({
    title: 'Developer Micro-Tools Suite | ToolOut by Mritunjay',
    description:
      'Developer utilities have moved to ToolOut (toolout.online): OpenGraph previewer, JSON to TypeScript generator, UUID/Base64/Hash utils, and Domain WHOIS RDAP lookup.',
    keywords:
      'ToolOut, Developer Tools, OpenGraph Previewer, JSON to TypeScript, UUID Generator, Domain WHOIS, Mritunjay Kumar',
  });

  return (
    <main className="section page-wrapper" style={{ minHeight: '85vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--text)' }}>Developer Tools</span>
        </div>
      </div>
      <ToolOutRedirectCard toolName="Developer Micro-Tools Suite" targetUrl="https://toolout.online" />
    </main>
  );
}
