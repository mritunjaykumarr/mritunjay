import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, AlertCircle, Users, Clock, ShieldCheck } from 'lucide-react';
import { fetchPnrStatus, type PnrData, type ApiResponse } from '../../lib/irctcService';

export default function PnrTab() {
  const [pnrInput, setPnrInput] = useState('4335734389');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse<PnrData> | null>(null);

  const handleSearch = async (e?: React.FormEvent, customPnr?: string) => {
    if (e) e.preventDefault();
    const queryPnr = customPnr !== undefined ? customPnr : pnrInput;
    if (!queryPnr.trim()) return;

    setLoading(true);
    try {
      const res = await fetchPnrStatus(queryPnr);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pnrData = result?.data;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--text)' }}>
          PNR Current Status & Passenger Chart
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Check real-time confirmation probabilities, coach/berth allotments, and chart preparation status directly from CRIS/IRCTC servers.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={(e) => handleSearch(e)} className="irctc-search-form">
        <div className="irctc-field-group">
          <label className="irctc-label">10-Digit PNR Number</label>
          <input
            type="text"
            className="irctc-input"
            value={pnrInput}
            onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="e.g. 4335734389"
            maxLength={10}
          />
        </div>
        <button type="submit" disabled={loading || pnrInput.length < 10} className="irctc-submit-btn">
          {loading ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
          <span>Get PNR Status</span>
        </button>
      </form>

      {/* Presets */}
      <div className="irctc-presets">
        <span className="irctc-presets-label">Quick Test PNRs:</span>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setPnrInput('4335734389');
            handleSearch(undefined, '4335734389');
          }}
        >
          4335734389 (COA LTT Express)
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setPnrInput('6542189032');
            handleSearch(undefined, '6542189032');
          }}
        >
          6542189032 (Rajdhani 3A)
        </button>
      </div>

      {/* Quota / Status Notice */}
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

      {/* PNR Result Display */}
      {pnrData && (
        <div className="irctc-ticket">
          {/* Header */}
          <div className="irctc-ticket-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="irctc-train-badge">{pnrData.TrainNo}</span>
              <div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>{pnrData.TrainName}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  PNR: <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{pnrData.Pnr}</span> • Class: {pnrData.Class} • Quota: {pnrData.Quota}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.8rem',
                padding: '4px 10px',
                borderRadius: '6px',
                background: pnrData.ChartPrepared ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: pnrData.ChartPrepared ? '#34d399' : '#fbbf24',
                border: `1px solid ${pnrData.ChartPrepared ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}>
                <ShieldCheck size={14} />
                {pnrData.ChartPrepared ? 'Chart Prepared' : 'Chart Not Prepared'}
              </span>
            </div>
          </div>

          {/* Route details */}
          <div className="irctc-station-route-row">
            <div className="irctc-station-block">
              <span className="irctc-station-code">{pnrData.From}</span>
              <span className="irctc-station-name">{pnrData.BoardingStationName || pnrData.From}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                DOJ: {pnrData.Doj}
              </span>
            </div>

            <div className="irctc-route-connector">
              <div className="irctc-route-line" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                Direct Track
              </span>
            </div>

            <div className="irctc-station-block end">
              <span className="irctc-station-code">{pnrData.To}</span>
              <span className="irctc-station-name">{pnrData.ReservationUptoName || pnrData.To}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Est Arrival: {pnrData.DestinationDoj || pnrData.Doj}
              </span>
            </div>
          </div>

          {/* Passenger Table */}
          <div className="irctc-passengers-card">
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} style={{ color: 'var(--accent)' }} />
              <strong style={{ fontSize: '0.86rem', color: 'var(--text)' }}>Passenger Information & Berth Allotment</strong>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="irctc-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Booking Status</th>
                    <th>Current Status</th>
                    <th>Coach</th>
                    <th>Berth</th>
                    <th>Prediction</th>
                  </tr>
                </thead>
                <tbody>
                  {pnrData.PassengerStatus?.map((pass) => (
                    <tr key={pass.Number}>
                      <td>{pass.Number}</td>
                      <td>
                        <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                          {pass.BookingStatus}
                        </span>
                      </td>
                      <td>
                        <span className={
                          pass.CurrentStatus.includes('CNF') ? 'badge-status-cnf' :
                          pass.CurrentStatus.includes('RAC') ? 'badge-status-rac' : 'badge-status-wl'
                        }>
                          {pass.CurrentStatus}
                        </span>
                      </td>
                      <td><strong>{pass.Coach || '--'}</strong></td>
                      <td><strong>{pass.Berth || '--'}</strong></td>
                      <td>
                        <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.82rem' }}>
                          {pass.Prediction || `${pass.PredictionPercentage || 100}%`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer stats */}
          <div style={{
            padding: '12px 1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} />
              <span>Booked on: {pnrData.BookingDate}</span>
            </div>
            <div>
              <span>Status: <strong style={{ color: 'var(--text)' }}>{pnrData.TrainStatus || 'Normal Operation'}</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
