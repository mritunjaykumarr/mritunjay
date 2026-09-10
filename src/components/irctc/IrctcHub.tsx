import React, { useState } from 'react';
import {
  Ticket,
  Navigation,
  Calendar,
  Armchair,
  Receipt,
  TrainFront,
  Building2,
  Terminal
} from 'lucide-react';
import PnrTab from './PnrTab';
import LiveTrainTab from './LiveTrainTab';
import TrainScheduleTab from './TrainScheduleTab';
import SeatAvailabilityTab from './SeatAvailabilityTab';
import FareTab from './FareTab';
import TrainsBetweenTab from './TrainsBetweenTab';
import LiveStationTab from './LiveStationTab';
import McpSnippetModal from './McpSnippetModal';
import { isForceDemoMode, RAPIDAPI_HOST } from '../../lib/irctcService';

type TabKey = 'pnr' | 'live' | 'schedule' | 'seats' | 'fare' | 'between' | 'station';

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  endpoint: string;
}

const tabs: TabItem[] = [
  { key: 'pnr', label: 'PNR Status V3', icon: Ticket, endpoint: 'GET /api/v3/getPNRStatus' },
  { key: 'live', label: 'Live Train Radar', icon: Navigation, endpoint: 'GET /api/v1/liveTrainStatus' },
  { key: 'schedule', label: 'Train Schedule', icon: Calendar, endpoint: 'GET /api/v1/getTrainSchedule' },
  { key: 'seats', label: 'Seat Availability', icon: Armchair, endpoint: 'GET /api/v1/checkSeatAvailability' },
  { key: 'fare', label: 'Fare Calculator', icon: Receipt, endpoint: 'GET /api/v2/getFare' },
  { key: 'between', label: 'Trains Between Stations', icon: TrainFront, endpoint: 'GET /api/v3/trainBetweenStations' },
  { key: 'station', label: 'Live Station Board', icon: Building2, endpoint: 'GET /api/v3/getLiveStation' },
];

export default function IrctcHub() {
  const [activeTab, setActiveTab] = useState<TabKey>('pnr');
  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false);
  const [demoState, setDemoState] = useState(() => isForceDemoMode());

  const handleConfigUpdated = () => {
    setDemoState(isForceDemoMode());
  };

  return (
    <div className="irctc-container">
      {/* Top Control Bar */}
      <div className="irctc-control-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className={`irctc-status-pill ${demoState ? 'demo' : 'live'}`}>
            <span className="irctc-status-dot" />
            <span>{demoState ? 'Demo Fallback Mode' : 'Live RapidAPI Connected'}</span>
          </div>

          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Host: {RAPIDAPI_HOST}
          </span>
        </div>

        <div className="irctc-actions-group">
          <button
            type="button"
            className="irctc-btn-secondary"
            onClick={() => setIsMcpModalOpen(true)}
            title="Configure RapidAPI Key & View MCP Server config"
          >
            <Terminal size={14} />
            <span>MCP Config & API Key</span>
          </button>
        </div>
      </div>

      {/* Tabs Scroller */}
      <div className="irctc-tabs-scroller">
        <nav className="irctc-tabs-nav" aria-label="IRCTC Endpoints Navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                className={`irctc-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                aria-selected={isActive}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Tab Panel */}
      <div className="irctc-panel-card">
        {activeTab === 'pnr' && <PnrTab />}
        {activeTab === 'live' && <LiveTrainTab />}
        {activeTab === 'schedule' && <TrainScheduleTab />}
        {activeTab === 'seats' && <SeatAvailabilityTab />}
        {activeTab === 'fare' && <FareTab />}
        {activeTab === 'between' && <TrainsBetweenTab />}
        {activeTab === 'station' && <LiveStationTab />}
      </div>

      {/* MCP Configuration Modal */}
      <McpSnippetModal
        isOpen={isMcpModalOpen}
        onClose={() => setIsMcpModalOpen(false)}
        onConfigUpdated={handleConfigUpdated}
      />
    </div>
  );
}
