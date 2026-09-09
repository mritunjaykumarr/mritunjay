import Guestbook from '../components/Guestbook';
import { useSEO } from '../lib/useSEO';

export default function GuestbookPage() {
  useSEO({
    title: 'Community Guestbook & Peer Endorsements | Mritunjay Kumar',
    description:
      'Sign the developer guestbook. Read verified reviews, peer endorsements, and client testimonials for Mritunjay Kumar.',
    keywords:
      'Developer Guestbook, Client Testimonials, Peer Endorsements, Mritunjay Kumar Reviews, Web Engineer Recommendations',
  });

  return (
    <main className="section page-wrapper" style={{ minHeight: '85vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <Guestbook />
    </main>
  );
}
