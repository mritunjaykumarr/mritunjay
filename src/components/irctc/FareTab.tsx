import React, { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle2, Receipt, ArrowRight } from 'lucide-react';
import { fetchFare, type FareData, type ApiResponse } from '../../lib/irctcService';

export default function FareTab() {
  const [trainNo, setTrainNo] = useState('12002');
  const [fromStation, setFromStation] = useState('NDLS');
  const [toStation, setToStation] = useState('BPL');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse<FareData> | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trainNo.trim() || !fromStation.trim() || !toStation.trim()) return;

    setLoading(true);
    try {
      const res = await fetchFare(trainNo, fromStation, toStation);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fareData = result?.data;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--text)' }}>
          Fare Enquiry & Ticket Breakdown
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Inspect official IRCTC ticket fares across passenger classes with granular breakdowns for base fare, reservation fee, superfast charge, and GST.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSearch} className="irctc-search-form">
        <div className="irctc-field-group">
          <label className="irctc-label">Train Number</label>
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
          <label className="irctc-label">Source Station</label>
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
          <label className="irctc-label">Destination Station</label>
          <input
            type="text"
            className="irctc-input"
            value={toStation}
            onChange={(e) => setToStation(e.target.value.toUpperCase())}
            placeholder="BPL"
            maxLength={6}
          />
        </div>

        <button type="submit" disabled={loading} className="irctc-submit-btn">
          {loading ? <Loader2 size={16} className="spin" /> : <Receipt size={16} />}
          <span>Calculate Fares</span>
        </button>
      </form>

      {/* Presets */}
      <div className="irctc-presets">
        <span className="irctc-presets-label">Quick Routes:</span>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setTrainNo('12002');
            setFromStation('NDLS');
            setToStation('BPL');
          }}
        >
          12002 (NDLS ➔ BPL)
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setTrainNo('22222');
            setFromStation('NZM');
            setToStation('CSMT');
          }}
        >
          22222 (NZM ➔ CSMT)
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setTrainNo('17221');
            setFromStation('CCT');
            setToStation('SC');
          }}
        >
          17221 (CCT ➔ SC)
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

      {/* Fares Display */}
      {fareData && (
        <div className="irctc-ticket">
          <div className="irctc-ticket-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="irctc-train-badge">{fareData.trainNumber}</span>
              <div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>
                  {fareData.fromStation} <ArrowRight size={14} style={{ display: 'inline', margin: '0 4px' }} /> {fareData.toStation}
                </strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Standard General Ticket Pricing Matrix
                </div>
              </div>
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {fareData.classes.map((cls) => (
              <div
                key={cls.classType}
                style={{
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: 'var(--accent)',
                  }}>
                    {cls.classType}
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>
                    ₹{cls.fare}
                  </div>
                </div>

                {cls.breakup && (
                  <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.82rem',
                  }}>
                    {cls.breakup.map((b, bi) => (
                      <div key={bi} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span>{b.title}</span>
                        <span style={{ color: 'var(--text)' }}>₹{b.cost}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
