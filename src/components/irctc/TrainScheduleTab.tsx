import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchTrainSchedule, type TrainScheduleData, type ApiResponse } from '../../lib/irctcService';

export default function TrainScheduleTab() {
  const [trainNo, setTrainNo] = useState('12002');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse<TrainScheduleData> | null>(null);

  const handleSearch = async (e?: React.FormEvent, customNo?: string) => {
    if (e) e.preventDefault();
    const targetNo = customNo !== undefined ? customNo : trainNo;
    if (!targetNo.trim()) return;

    setLoading(true);
    try {
      const res = await fetchTrainSchedule(targetNo);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scheduleData = result?.data;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--text)' }}>
          Train Timetable & Route Itinerary
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          View full operational itineraries, scheduled halt times, station platforms, and service days for any express or passenger train.
        </p>
      </div>

      {/* Search Bar */}
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
        <button type="submit" disabled={loading || trainNo.length < 5} className="irctc-submit-btn">
          {loading ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
          <span>View Timetable</span>
        </button>
      </form>

      {/* Presets */}
      <div className="irctc-presets">
        <span className="irctc-presets-label">Popular Timetables:</span>
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

      {/* Schedule Table Result */}
      {scheduleData && (
        <div className="irctc-ticket">
          {/* Header Banner */}
          <div className="irctc-ticket-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="irctc-train-badge">{scheduleData.trainNumber}</span>
              <div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>{scheduleData.trainName}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {scheduleData.trainType} • {scheduleData.source} ➔ {scheduleData.destination}
                </div>
              </div>
            </div>

            {/* Run Days */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const runs = scheduleData.runDays.some(d => d.toLowerCase().startsWith(day.slice(0, 2).toLowerCase()));
                return (
                  <span
                    key={day}
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      padding: '3px 6px',
                      borderRadius: '4px',
                      background: runs ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: runs ? 'var(--accent)' : 'var(--text-muted)',
                      border: `1px solid ${runs ? 'rgba(59, 130, 246, 0.4)' : 'transparent'}`,
                    }}
                  >
                    {day.slice(0, 1)}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Full Station Itinerary Table */}
          <div style={{ padding: '1rem', overflowX: 'auto' }}>
            <table className="irctc-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Station Name</th>
                  <th>Code</th>
                  <th>Arr Time</th>
                  <th>Dep Time</th>
                  <th>Halt</th>
                  <th>Distance</th>
                  <th>Day</th>
                  <th>Platform</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.stationList.map((st, i) => (
                  <tr key={`${st.station_code}-${i}`}>
                    <td>{i + 1}</td>
                    <td>
                      <strong>{st.station_name}</strong>
                      {st.state_name && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{st.state_name}</div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 600 }}>
                        {st.station_code}
                      </span>
                    </td>
                    <td>{st.arrival_time}</td>
                    <td>{st.departure_time}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {st.halt_time}
                      </span>
                    </td>
                    <td>{st.distance} km</td>
                    <td>Day {st.day}</td>
                    <td><strong>{st.platform || '1'}</strong></td>
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
