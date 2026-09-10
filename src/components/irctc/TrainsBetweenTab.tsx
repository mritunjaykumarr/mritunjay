import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchTrainsBetweenStations, type TrainBetweenItem, type ApiResponse } from '../../lib/irctcService';

export default function TrainsBetweenTab() {
  const [fromStation, setFromStation] = useState('NDLS');
  const [toStation, setToStation] = useState('BPL');
  const [dateOfJourney, setDateOfJourney] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse<TrainBetweenItem[]> | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fromStation.trim() || !toStation.trim()) return;

    setLoading(true);
    try {
      const res = await fetchTrainsBetweenStations(fromStation, toStation, dateOfJourney);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const trainList = result?.data;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--text)' }}>
          Trains Between Stations
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Find all direct, superfast, Rajdhani, Shatabdi, and Vande Bharat trains running between any two railway hubs.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSearch} className="irctc-search-form">
        <div className="irctc-field-group">
          <label className="irctc-label">From Station Code</label>
          <input
            type="text"
            className="irctc-input"
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value.toUpperCase())}
            placeholder="e.g. NDLS"
            maxLength={6}
          />
        </div>

        <div className="irctc-field-group">
          <label className="irctc-label">To Station Code</label>
          <input
            type="text"
            className="irctc-input"
            value={toStation}
            onChange={(e) => setToStation(e.target.value.toUpperCase())}
            placeholder="e.g. BPL"
            maxLength={6}
          />
        </div>

        <div className="irctc-field-group">
          <label className="irctc-label">Date of Journey</label>
          <input
            type="date"
            className="irctc-input"
            value={dateOfJourney}
            onChange={(e) => setDateOfJourney(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className="irctc-submit-btn">
          {loading ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
          <span>Find Trains</span>
        </button>
      </form>

      {/* Presets */}
      <div className="irctc-presets">
        <span className="irctc-presets-label">Corridors:</span>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setFromStation('NDLS');
            setToStation('BPL');
          }}
        >
          NDLS ➔ BPL (New Delhi - Bhopal)
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setFromStation('NZM');
            setToStation('CSMT');
          }}
        >
          NZM ➔ CSMT (Delhi - Mumbai)
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setFromStation('CCT');
            setToStation('SC');
          }}
        >
          CCT ➔ SC (Kakinada - Secunderabad)
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

      {/* Train list */}
      {trainList && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Found <strong style={{ color: 'var(--text)' }}>{trainList.length} direct trains</strong> connecting {fromStation} and {toStation}:
          </div>

          {trainList.map((t) => (
            <div
              key={t.train_number}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="irctc-train-badge">{t.train_number}</span>
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>{t.train_name}</strong>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Departs on: {Array.isArray(t.run_days) ? t.run_days.join(' ') : 'Daily'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  <span>Duration: <strong style={{ color: 'var(--text)' }}>{t.duration}</strong></span>
                </div>
              </div>

              {/* Station Timing Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '10px 14px',
                borderRadius: '10px',
              }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)' }}>
                    {t.from_std}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {t.from_station_name} ({t.from_station_code})
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <ArrowRight size={16} style={{ color: 'var(--accent)' }} />
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)' }}>
                    {t.to_std || t.to_sta}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {t.to_station_name} ({t.to_station_code})
                  </div>
                </div>
              </div>

              {/* Class Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginRight: '4px' }}>Classes:</span>
                {t.class_type?.map((c) => (
                  <span
                    key={c}
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
