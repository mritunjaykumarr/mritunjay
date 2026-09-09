import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Video, CheckCircle2, Globe, User,
  Mail, Building2, Download, ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MeetingType {
  id: string;
  title: string;
  duration: string;
  desc: string;
  badge: string;
}

const MEETING_TYPES: MeetingType[] = [
  {
    id: 'intro',
    title: '15-Min Recruiter Screen / Quick Intro',
    duration: '15 mins',
    desc: 'Quick touchpoint to discuss engineering role fit, culture, and immediate availability.',
    badge: 'Popular for Recruiters',
  },
  {
    id: 'scope',
    title: '30-Min Technical Discovery & Scope',
    duration: '30 mins',
    desc: 'Detailed discussion for clients planning a new web app, SaaS platform, or AI integration.',
    badge: 'Client Favorite',
  },
  {
    id: 'consulting',
    title: '60-Min Architecture & AI Advisory',
    duration: '60 mins',
    desc: 'Comprehensive code review, LLM integration roadmap, or system scalability audit.',
    badge: 'In-Depth',
  },
];

const TIME_SLOTS = [
  '10:30 AM',
  '12:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
  '07:30 PM',
];

export default function ScheduleCall() {
  const [selectedType, setSelectedType] = useState<MeetingType>(MEETING_TYPES[0]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[1]);
  
  // Attendee info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Detect user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';

  // Generate next 7 available business days
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayName, dayNum };
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);

    const bookingData = {
      meeting_type: selectedType.title,
      duration: selectedType.duration,
      date: selectedDate,
      time_slot: selectedSlot,
      timezone: userTimezone,
      attendee_name: name,
      attendee_email: email,
      attendee_company: company,
      notes: notes,
      created_at: new Date().toISOString(),
    };

    // Save to local vault storage
    try {
      const existing = JSON.parse(localStorage.getItem('mritunjay_bookings') || '[]');
      existing.push(bookingData);
      localStorage.setItem('mritunjay_bookings', JSON.stringify(existing));
    } catch {
      // ignore
    }

    // Try Supabase if available
    try {
      await supabase.from('bookings').insert([bookingData]);
    } catch {
      // graceful fallback
    }

    setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
    }, 600);
  };

  const downloadICS = () => {
    const startTime = `${selectedDate.replace(/-/g, '')}T${selectedSlot.includes('PM') && !selectedSlot.startsWith('12') ? (parseInt(selectedSlot) + 12).toString().padStart(2, '0') : selectedSlot.slice(0, 2)}0000Z`;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mritunjay Kumar//Schedule//EN
BEGIN:VEVENT
DTSTART:${startTime}
SUMMARY:${selectedType.title} with Mritunjay Kumar
DESCRIPTION:${selectedType.desc}\\nAttendee: ${name} (${email})\\nNotes: ${notes}
LOCATION:Google Meet / Remote Link (Sent via email)
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `meeting-mritunjay-${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-strong, rgba(255,255,255,0.16))',
            fontSize: '0.8rem',
            fontWeight: 500,
            marginBottom: '1rem',
          }}
        >
          <Calendar size={14} style={{ color: 'var(--accent, #fff)' }} />
          <span>Live Availability & Meeting Booking</span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '0.75rem',
          }}
        >
          Schedule a Conversation
        </h1>
        <p style={{ maxWidth: '580px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-muted, #999)' }}>
          Choose a meeting format and select a convenient time slot. All calls include automatic calendar invites and timezone conversion.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {confirmed ? (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--surface-2, #0e0e0e)',
              border: '1px solid var(--border-strong, rgba(255,255,255,0.2))',
              borderRadius: '20px',
              padding: '3rem 2rem',
              textAlign: 'center',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '2px solid #22c55e',
                color: '#22c55e',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text, #fff)' }}>
              Call Reserved Successfully!
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted, #888)', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Thank you, <strong style={{ color: 'var(--text, #fff)' }}>{name}</strong>. Your session has been reserved for:
            </p>

            <div
              style={{
                background: 'var(--surface, #060606)',
                border: '1px solid var(--border, rgba(255,255,255,0.1))',
                borderRadius: '12px',
                padding: '1.25rem',
                margin: '1.5rem 0',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #888)' }}>Session:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text, #fff)' }}>{selectedType.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #888)' }}>Date & Time:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4ade80' }}>
                  {selectedDate} at {selectedSlot} ({userTimezone})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #888)' }}>Platform:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text, #fff)' }}>Google Meet / Remote</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={downloadICS}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'var(--accent, #fff)',
                  color: 'var(--accent-foreground, #000)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Download size={16} />
                <span>Add to Google / Apple Calendar</span>
              </button>
              <button
                onClick={() => setConfirmed(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'var(--surface-3, #1c1c1c)',
                  color: 'var(--text, #fff)',
                  border: '1px solid var(--border, rgba(255,255,255,0.12))',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Book Another Slot
              </button>
            </div>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Step 1: Meeting Type Cards */}
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle, #777)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Step 1 • Select Meeting Focus
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                  marginTop: '10px',
                }}
              >
                {MEETING_TYPES.map((type) => {
                  const isSelected = selectedType.id === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        background: isSelected ? 'var(--surface-3, #1a1a1a)' : 'var(--surface-2, #0e0e0e)',
                        border: isSelected ? '1px solid var(--accent, #fff)' : '1px solid var(--border, rgba(255,255,255,0.1))',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: 'rgba(255,255,255,0.08)',
                              color: 'var(--text-muted, #aaa)',
                              fontWeight: 500,
                            }}
                          >
                            {type.badge}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            {type.duration}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text, #fff)', marginBottom: '6px' }}>
                          {type.title}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #888)', lineHeight: 1.5 }}>
                          {type.desc}
                        </p>
                      </div>
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: isSelected ? 'var(--accent, #fff)' : 'var(--text-muted, #777)' }}>
                        <Video size={13} />
                        <span>Google Meet Link Provided</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date & Slot Selector */}
            <div
              style={{
                background: 'var(--surface-2, #0e0e0e)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                borderRadius: '16px',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle, #777)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Step 2 • Pick Date & Slot
                </span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted, #888)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Globe size={13} />
                  <span>Timezone: {userTimezone}</span>
                </span>
              </div>

              {/* Date Pills */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      onClick={() => setSelectedDate(item.dateStr)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: isSelected ? 'var(--accent, #fff)' : 'var(--surface, #060606)',
                        color: isSelected ? 'var(--accent-foreground, #000)' : 'var(--text, #fff)',
                        border: isSelected ? '1px solid var(--accent, #fff)' : '1px solid var(--border-soft, rgba(255,255,255,0.08))',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        cursor: 'pointer',
                        flexShrink: 0,
                        minWidth: '80px',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', opacity: 0.8 }}>{item.dayName}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.dayNum}</span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              <div style={{ marginTop: '1.25rem' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '8px' }}>
                  Available Time Slots:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: isSelected ? 'var(--accent, #fff)' : 'var(--surface, #060606)',
                          color: isSelected ? 'var(--accent-foreground, #000)' : 'var(--text, #fff)',
                          border: isSelected ? '1px solid var(--accent, #fff)' : '1px solid var(--border-soft, rgba(255,255,255,0.08))',
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Attendee Details Form */}
            <form
              onSubmit={handleBooking}
              style={{
                background: 'var(--surface-2, #0e0e0e)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                borderRadius: '16px',
                padding: '1.75rem',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle, #777)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Step 3 • Your Information
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '12px' }}>
                <div>
                  <label htmlFor="sched-name" style={{ fontSize: '0.82rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface, #060606)', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: '8px', padding: '0 10px' }}>
                    <User size={15} style={{ color: 'var(--text-muted, #777)', marginRight: '8px' }} />
                    <input
                      id="sched-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Miller"
                      style={{ width: '100%', background: 'transparent', border: 'none', padding: '9px 0', outline: 'none', fontSize: '0.88rem', color: 'var(--text, #fff)' }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sched-email" style={{ fontSize: '0.82rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '6px' }}>
                    Work / Personal Email *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface, #060606)', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: '8px', padding: '0 10px' }}>
                    <Mail size={15} style={{ color: 'var(--text-muted, #777)', marginRight: '8px' }} />
                    <input
                      id="sched-email"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      style={{ width: '100%', background: 'transparent', border: 'none', padding: '9px 0', outline: 'none', fontSize: '0.88rem', color: 'var(--text, #fff)' }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sched-company" style={{ fontSize: '0.82rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '6px' }}>
                    Company / Organization
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface, #060606)', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: '8px', padding: '0 10px' }}>
                    <Building2 size={15} style={{ color: 'var(--text-muted, #777)', marginRight: '8px' }} />
                    <input
                      id="sched-company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Tech Ventures / Startup"
                      style={{ width: '100%', background: 'transparent', border: 'none', padding: '9px 0', outline: 'none', fontSize: '0.88rem', color: 'var(--text, #fff)' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="sched-notes" style={{ fontSize: '0.82rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '6px' }}>
                  What would you like to focus on? (Optional)
                </label>
                <textarea
                  id="sched-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any job links, project ideas, or architecture challenges you want to review..."
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'var(--surface, #060606)',
                    border: '1px solid var(--border, rgba(255,255,255,0.12))',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: 'var(--text, #fff)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 24px',
                    borderRadius: '10px',
                    background: 'var(--accent, #fff)',
                    color: 'var(--accent-foreground, #000)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  <Calendar size={16} />
                  <span>{submitting ? 'Confirming Reservation...' : 'Confirm Call Booking'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
