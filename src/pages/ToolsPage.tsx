import ToolsHub from '../components/ToolsHub';
import { useSEO } from '../lib/useSEO';

export default function ToolsPage() {
  useSEO({
    title: 'Developer Micro-Tools Suite | Mritunjay Kumar',
    description:
      'Explore free developer utilities: Social OpenGraph visualizer, JSON to TypeScript interface generator, UUID generator, and Domain WHOIS lookup.',
    keywords:
      'Developer Tools, OpenGraph Previewer, JSON to TypeScript, UUID Generator, Meta Tag Tester, Mritunjay Kumar Tools',
  });

  return (
    <main className="section page-wrapper" style={{ minHeight: '85vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <ToolsHub />
    </main>
  );
}
