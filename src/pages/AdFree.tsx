import React from 'react';

export default function AdFree() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <iframe 
        src="/adfree.html" 
        style={{ width: '100%', height: '100%', border: 'none' }} 
        title="Ad-Free Experience"
      />
    </div>
  );
}
