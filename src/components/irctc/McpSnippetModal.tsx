import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Key, RefreshCw } from 'lucide-react';
import {
  DEFAULT_RAPIDAPI_KEY,
  RAPIDAPI_HOST,
  getStoredApiKey,
  setStoredApiKey,
  isForceDemoMode,
  setForceDemoMode
} from '../../lib/irctcService';

interface McpSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export default function McpSnippetModal({ isOpen, onClose, onConfigUpdated }: McpSnippetModalProps) {
  const [apiKeyInput, setApiKeyInput] = useState(() => getStoredApiKey());
  const [isDemo, setIsDemo] = useState(() => isForceDemoMode());
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentKey = apiKeyInput.trim() || DEFAULT_RAPIDAPI_KEY;

  const mcpConfigJson = JSON.stringify(
    {
      mcpServers: {
        'RapidAPI Hub - IRCTC': {
          command: 'npx',
          args: [
            'mcp-remote',
            'https://mcp.rapidapi.com',
            '--header',
            `x-api-host: ${RAPIDAPI_HOST}`,
            '--header',
            `x-api-key: ${currentKey}`,
          ],
        },
      },
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(mcpConfigJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKeyInput.trim());
    setForceDemoMode(isDemo);
    setSavedSuccess(true);
    onConfigUpdated();
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    setApiKeyInput(DEFAULT_RAPIDAPI_KEY);
    setStoredApiKey(DEFAULT_RAPIDAPI_KEY);
    setIsDemo(false);
    setForceDemoMode(false);
    onConfigUpdated();
  };

  return (
    <div className="irctc-modal-overlay" onClick={onClose}>
      <div className="irctc-modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text)' }}>
              MCP Server & RapidAPI Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Configure your RapidAPI key for real-time IRCTC endpoints or copy the Model Context Protocol (MCP) server definition into your AI agent environment.
        </p>

        {/* API Settings Form */}
        <form onSubmit={handleSave} style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="irctc-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Key size={13} />
              <span>RapidAPI Key</span>
            </label>
            <input
              type="text"
              className="irctc-input"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={DEFAULT_RAPIDAPI_KEY}
              style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={isDemo}
                onChange={(e) => setIsDemo(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
              />
              <span>Force High-Fidelity Demo Mode (bypasses quota limits)</span>
            </label>

            <button
              type="button"
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <RefreshCw size={12} />
              Reset Key
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="submit" className="irctc-submit-btn" style={{ padding: '8px 18px', height: 'auto', fontSize: '0.85rem' }}>
              Save API Settings
            </button>
            {savedSuccess && (
              <span style={{ color: '#10b981', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} /> Saved!
              </span>
            )}
          </div>
        </form>

        {/* MCP Server JSON snippet */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span className="irctc-label">MCP Server Definition (mcpServers)</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Antigravity / Claude / Cursor</span>
          </div>

          <div className="irctc-code-block">
            <button
              type="button"
              onClick={handleCopy}
              className="irctc-copy-btn"
              title="Copy JSON to clipboard"
            >
              {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy Config'}</span>
            </button>
            <pre style={{ margin: 0, paddingRight: '80px' }}>{mcpConfigJson}</pre>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text)' }}>How to use:</strong> Add this block to your agent's MCP settings file (<code style={{ color: 'var(--accent)' }}>antigravity.mcp.json</code> or Claude Desktop config) to allow your AI agents to directly query live IRCTC APIs.
        </div>
      </div>
    </div>
  );
}
