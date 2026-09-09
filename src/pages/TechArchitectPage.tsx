import TechStackArchitect from '../components/TechStackArchitect';
import { useSEO } from '../lib/useSEO';

export default function TechArchitectPage() {
  useSEO({
    title: 'Startup Tech Stack Architect | Mritunjay Kumar',
    description:
      'Generate production system architecture, tech stack blueprints, and cloud cost estimations for any web application or AI idea in seconds.',
    keywords:
      'Tech Stack Architect, System Design Tool, Cloud Architecture Planner, AI App Stack, Cost Estimator, Mritunjay Kumar',
  });

  return (
    <main className="section page-wrapper" style={{ minHeight: '85vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <TechStackArchitect />
    </main>
  );
}
