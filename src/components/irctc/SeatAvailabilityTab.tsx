import React, { useState } from 'react';
import { Loader2, Calendar, AlertCircle, CheckCircle2, Armchair, Sparkles } from 'lucide-react';
import { fetchSeatAvailability, type SeatAvailabilityData, type ApiResponse } from '../../lib/irctcService';

export default function SeatAvailabilityTab() {
  const [trainNo, setTrainNo] = useState('12002');
  const [fromStation, setFromStation] = useState('NDLS');
  const [toStation, setToStation] = useState('BPL');
  const [classType, setClassType] = useState('CC');
  const [quota, setQuota] = useState('GN');
  const [travelDate, setTravelDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    return tomorrow.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse<SeatAvailabilityData> | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trainNo.trim() || !fromStation.trim() || !toStation.trim()) return;

    setLoading(true);
    try {
      const res = await fetchSeatAvailability({
        trainNo,
        fromStationCode: fromStation,
        toStationCode: toStation,
        classType,
        quota,
        date: travelDate,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const seatData = result?.data;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--text)' }}>
          Seat Availability & Confirmation Radar
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Check berth availability across travel classes, Tatkal/General quotas, and multiday date windows with AI confirmation chances.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSearch} className="irctc-search-form" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr)) auto' }}>
        <div className="irctc-field-group">
          <label className="irctc-label">Train No</label>
          <input
            type="text"
            className="irctc-input"
            value={trainNo}
            onChange={(e) => setTrainNo(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="12002"
            maxLength={5}
          />
        </div>

        <div className="irctc-field-group">
          <label className="irctc-label">From Station</label>
          <input
            type="text"
            className="irctc-input"
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value.toUpperCase())}
            placeholder="NDLS"
            maxLength={6}
          />
        </div>

        <div className="irctc-field-group">
          <label className="irctc-label">To Station</label>
          <input
            type="text"
            className="irctc-input"
            value={toStation}
            onChange={(e) => setToStation(e.target.value.toUpperCase())}
            placeholder="BPL"
            maxLength={6}
          />
        </div>

        <div className="irctc-field-group">
          <label className="irctc-label">Class</label>
          <select className="irctc-select" value={classType} onChange={(e) => setClassType(e.target.value)}>
            <option value="CC">AC Chair Car (CC)</option>
            <option value="EC">Executive Chair (EC)</option>
            <option value="3A">AC 3 Tier (3A)</option>
            <option value="2A">AC 2 Tier (2A)</option>
            <option value="1A">AC 1st Class (1A)</option>
            <option value="SL">Sleeper (SL)</option>
            <option value="2S">Second Sitting (2S)</option>
          </select>
        </div>

        <div className="irctc-field-group">
          <label className="irctc-label">Quota</label>
          <select className="irctc-select" value={quota} onChange={(e) => setQuota(e.target.value)}>
            <option value="GN">General Quota (GN)</option>
            <option value="TQ">Tatkal Quota (TQ)</option>
            <option value="PT">Premium Tatkal (PT)</option>
            <option value="LD">Ladies Quota (LD)</option>
            <option value="SS">Senior Citizen (SS)</option>
          </select>
        </div>

        <div className="irctc-field-group">
          <label className="irctc-label">Journey Date</label>
          <input
            type="date"
            className="irctc-input"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className="irctc-submit-btn">
          {loading ? <Loader2 size={16} className="spin" /> : <Armchair size={16} />}
          <span>Check Seats</span>
        </button>
      </form>

      {/* Presets */}
      <div className="irctc-presets">
        <span className="irctc-presets-label">Popular Queries:</span>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setTrainNo('12002');
            setFromStation('NDLS');
            setToStation('BPL');
            setClassType('CC');
            setQuota('GN');
          }}
        >
          12002 (NDLS ➔ BPL) CC
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setTrainNo('22222');
            setFromStation('NZM');
            setToStation('CSMT');
            setClassType('3A');
            setQuota('GN');
          }}
        >
          22222 (NZM ➔ CSMT) 3A
        </button>
      </div>

      {/* Notice */}
      {result?.message && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          background: result.isDemo ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${result.isDemo ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
          color: result.isDemo ? '#f59e0b' : '#10b981',
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '1.5rem',
        }}>
          {result.isDemo ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          <span>{result.message}</span>
        </div>
      )}

      {/* Results grid */}
      {seatData && (
        <div className="irctc-ticket">
          <div className="irctc-ticket-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="irctc-train-badge">{seatData.train_number}</span>
              <div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>{seatData.train_name}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {seatData.from_station} ➔ {seatData.to_station} • Class: {seatData.class_type} • Quota: {seatData.quota}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem',
          }}>
            {seatData.availability.map((item, idx) => {
              const isAvail = item.status.includes('AVAILABLE') || item.status.includes('AVBL');
              const isRac = item.status.includes('RAC');
              const statusClass = isAvail ? 'badge-status-cnf' : isRac ? 'badge-status-rac' : 'badge-status-wl';

              return (
                <div
                  key={`${item.ticket_date}-${idx}`}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} style={{ color: 'var(--accent)' }} />
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{item.ticket_date}</strong>
                    </div>
                    {item.fare && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                        ₹{item.fare}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className={statusClass} style={{ width: '100%', justifyContent: 'center', padding: '8px' }}>
                      {item.status}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <Sparkles size={13} style={{ color: '#10b981' }} />
                    <span>Confirmation: <strong style={{ color: 'var(--text)' }}>{item.chance || 'High'}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
