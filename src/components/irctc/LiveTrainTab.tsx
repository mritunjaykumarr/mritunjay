import React, { useState } from 'react';
import { Loader2, Clock, MapPin, AlertCircle, CheckCircle2, Navigation, Compass } from 'lucide-react';
import { fetchLiveTrainStatus, type LiveTrainData, type ApiResponse } from '../../lib/irctcService';

export default function LiveTrainTab() {
  const [trainNo, setTrainNo] = useState('12002');
  const [startDay, setStartDay] = useState('0');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse<LiveTrainData> | null>(null);

  const handleSearch = async (e?: React.FormEvent, customNo?: string) => {
    if (e) e.preventDefault();
    const targetNo = customNo !== undefined ? customNo : trainNo;
    if (!targetNo.trim()) return;

    setLoading(true);
    try {
      const res = await fetchLiveTrainStatus(targetNo, startDay);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const trainData = result?.data;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--text)' }}>
          Live Train Running Status & Route Radar
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Track real-time GPS coordinates, delay minutes, platform allocations, and upcoming stations for any active Indian Railways train.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={(e) => handleSearch(e)} className="irctc-search-form">
        <div className="irctc-field-group">
          <label className="irctc-label">5-Digit Train Number</label>
          <input
            type="text"
            className="irctc-input"
            value={trainNo}
            onChange={(e) => setTrainNo(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="e.g. 12002"
            maxLength={5}
          />
        </div>

        <div className="irctc-field-group">
          <label className="irctc-label">Journey Start Day</label>
          <select
            className="irctc-select"
            value={startDay}
            onChange={(e) => setStartDay(e.target.value)}
          >
            <option value="0">Today (Day 0)</option>
            <option value="1">Yesterday (Day 1)</option>
            <option value="2">2 Days Ago (Day 2)</option>
          </select>
        </div>

        <button type="submit" disabled={loading || trainNo.length < 5} className="irctc-submit-btn">
          {loading ? <Loader2 size={16} className="spin" /> : <Navigation size={16} />}
          <span>Spot Train Live</span>
        </button>
      </form>

      {/* Presets */}
      <div className="irctc-presets">
        <span className="irctc-presets-label">Popular Express Trains:</span>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setTrainNo('12002');
            handleSearch(undefined, '12002');
          }}
        >
          12002 (Bhopal Shatabdi)
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setTrainNo('22222');
            handleSearch(undefined, '22222');
          }}
        >
          22222 (CSMT Rajdhani)
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setTrainNo('12951');
            handleSearch(undefined, '12951');
          }}
        >
          12951 (Mumbai Rajdhani)
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setTrainNo('17221');
            handleSearch(undefined, '17221');
          }}
        >
          17221 (COA LTT Express)
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

      {/* Live Running Status Result */}
      {trainData && (
        <div className="irctc-ticket">
          {/* Header Banner */}
          <div className="irctc-ticket-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="irctc-train-badge">{trainData.train_number}</span>
              <div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>{trainData.train_name}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Current: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{trainData.current_station_name} ({trainData.current_station_code})</span>
                </div>
              </div>
            </div>

            <div>
              <span style={{
                fontSize: '0.82rem',
                padding: '5px 12px',
                borderRadius: '6px',
                fontWeight: 600,
                background: trainData.delay <= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: trainData.delay <= 0 ? '#34d399' : '#fbbf24',
                border: `1px solid ${trainData.delay <= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <Clock size={14} />
                {trainData.delay <= 0 ? 'Right on Time' : `Delayed by ${trainData.delay} mins`}
              </span>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            padding: '1.25rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.15)',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS MESSAGE</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginTop: '2px' }}>
                {trainData.status_message}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DISTANCE COVERED</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', marginTop: '2px' }}>
                {trainData.distance_from_source} km / {trainData.total_distance} km
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UPDATED AS OF</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginTop: '2px' }}>
                {trainData.status_as_of}
              </div>
            </div>
          </div>

          {/* Route Milestones Timeline */}
          <div style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text)' }}>
              Station Halt Milestones
            </h4>

            <div className="irctc-timeline">
              {trainData.stations.map((st, idx) => {
                const isPassed = st.has_departed || st.has_arrived;
                const isCurrent = st.is_current_station;
                const stepClass = isCurrent ? 'current' : isPassed ? 'completed' : '';

                return (
                  <div key={`${st.station_code}-${idx}`} className={`irctc-timeline-step ${stepClass}`}>
                    <div className="irctc-timeline-dot">
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 size={12} color="#ffffff" />
                      ) : isCurrent ? (
                        <Compass size={12} color="#ffffff" />
                      ) : (
                        <MapPin size={10} color="var(--text-muted)" />
                      )}
                    </div>

                    <div className={`irctc-station-row ${isCurrent ? 'current' : ''}`}>
                      <div>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text)' }}>
                          {st.station_name}
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px', fontFamily: 'monospace' }}>
                          [{st.station_code}]
                        </span>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                          Platform {st.platform || 1} • {st.distance} km • Halt: {st.halt || 2} min
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text)' }}>
                          Arr: {st.eta || '--:--'} | Dep: {st.etd || '--:--'}
                        </div>
                        {st.delay_in_arrival !== undefined && st.delay_in_arrival > 0 ? (
                          <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                            +{st.delay_in_arrival}m late
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
                            On-Time
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
