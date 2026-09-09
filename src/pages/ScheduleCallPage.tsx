import ScheduleCall from '../components/ScheduleCall';
import { useSEO } from '../lib/useSEO';

export default function ScheduleCallPage() {
  useSEO({
    title: 'Schedule a Call / Consultation | Mritunjay Kumar',
    description:
      'Book a 15-minute recruiter screen, 30-minute project discovery session, or 60-minute technical architecture consultation directly with Mritunjay Kumar.',
    keywords:
      'Schedule Call, Book Meeting, Hire Mritunjay Kumar, Technical Consultation, Recruiter Screen, Full Stack Advisory',
  });

  return (
    <main className="section page-wrapper" style={{ minHeight: '85vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <ScheduleCall />
    </main>
  );
}
