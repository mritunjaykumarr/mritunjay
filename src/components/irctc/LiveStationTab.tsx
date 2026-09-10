import React, { useState } from 'react';
import { Loader2, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchLiveStationBoard, type LiveStationTrainItem, type ApiResponse } from '../../lib/irctcService';

export default function LiveStationTab() {
  const [stationCode, setStationCode] = useState('NDLS');
  const [hours, setHours] = useState(4);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse<LiveStationTrainItem[]> | null>(null);

  const handleSearch = async (e?: React.FormEvent, customStation?: string) => {
    if (e) e.preventDefault();
    const stn = customStation !== undefined ? customStation : stationCode;
    if (!stn.trim()) return;

    setLoading(true);
    try {
      const res = await fetchLiveStationBoard(stn, hours);
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
          Live Station Departures & Arrivals Board
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Monitor live platform movements, upcoming train arrivals, and departures over the next 2 to 8 hours for any station.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={(e) => handleSearch(e)} className="irctc-search-form">
        <div className="irctc-field-group">
          <label className="irctc-label">Station Code</label>
          <input
            type="text"
            className="irctc-input"
            value={stationCode}
            onChange={(e) => setStationCode(e.target.value.toUpperCase())}
            placeholder="e.g. NDLS"
            maxLength={6}
          />
        </div>

        <div className="irctc-field-group">
          <label className="irctc-label">Time Window</label>
          <select className="irctc-select" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
            <option value={2}>Next 2 Hours</option>
            <option value={4}>Next 4 Hours</option>
            <option value={8}>Next 8 Hours</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="irctc-submit-btn">
          {loading ? <Loader2 size={16} className="spin" /> : <Building2 size={16} />}
          <span>View Station Board</span>
        </button>
      </form>

      {/* Presets */}
      <div className="irctc-presets">
        <span className="irctc-presets-label">Major Hubs:</span>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setStationCode('NDLS');
            handleSearch(undefined, 'NDLS');
          }}
        >
          NDLS (New Delhi)
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setStationCode('CSMT');
            handleSearch(undefined, 'CSMT');
          }}
        >
          CSMT (Mumbai)
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setStationCode('HWH');
            handleSearch(undefined, 'HWH');
          }}
        >
          HWH (Howrah)
        </button>
        <button
          type="button"
          className="irctc-preset-chip"
          onClick={() => {
            setStationCode('BPL');
            handleSearch(undefined, 'BPL');
          }}
        >
          BPL (Bhopal)
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

      {/* Table */}
      {trainList && (
        <div className="irctc-passengers-card" style={{ margin: 0 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
              Station Activity: {stationCode} (Next {hours} Hours)
            </strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {trainList.length} scheduled movements
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="irctc-table">
              <thead>
                <tr>
                  <th>Train</th>
                  <th>Sch. Arr</th>
                  <th>Sch. Dep</th>
                  <th>Exp. Arr</th>
                  <th>Exp. Dep</th>
                  <th>Status</th>
                  <th>Platform</th>
                </tr>
              </thead>
              <tbody>
                {trainList.map((t) => (
                  <tr key={t.train_number}>
                    <td>
                      <div>
                        <span className="irctc-train-badge" style={{ fontSize: '0.8rem', padding: '2px 6px' }}>
                          {t.train_number}
                        </span>
                        <div style={{ fontWeight: 600, fontSize: '0.86rem', marginTop: '3px' }}>
                          {t.train_name}
                        </div>
                      </div>
                    </td>
                    <td>{t.sta}</td>
                    <td>{t.std}</td>
                    <td><strong style={{ color: 'var(--text)' }}>{t.eta}</strong></td>
                    <td><strong style={{ color: 'var(--text)' }}>{t.etd}</strong></td>
                    <td>
                      {t.delay_arr <= 0 ? (
                        <span className="badge-status-cnf">On Time</span>
                      ) : (
                        <span className="badge-status-rac">+{t.delay_arr}m Delay</span>
                      )}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                      }}>
                        PF {t.platform}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
