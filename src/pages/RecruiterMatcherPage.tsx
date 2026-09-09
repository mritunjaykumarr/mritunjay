import RecruiterMatcher from '../components/RecruiterMatcher';
import { useSEO } from '../lib/useSEO';

export default function RecruiterMatcherPage() {
  useSEO({
    title: 'Recruiter JD Matcher & ATS Scorecard | Mritunjay Kumar',
    description:
      'Evaluate Mritunjay Kumar against your job description in real-time. Instant ATS match calculation, skill overlap analysis, and verified portfolio proof.',
    keywords:
      'Recruiter JD Matcher, ATS Scorecard, Hire Mritunjay Kumar, Full Stack Candidate Match, React Developer Screening, AI Engineer Assessment',
  });

  return (
    <main className="section page-wrapper" style={{ minHeight: '85vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <RecruiterMatcher />
    </main>
  );
}
