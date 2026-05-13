import { useState } from 'react';

export default function Pricing() {
  const [isRetainer, setIsRetainer] = useState(false);

  const togglePricing = () => {
    setIsRetainer(!isRetainer);
  };

  return (
    <section id="pricing" className="section pricing">
      <div className="container">
        <div className="section-eyebrow">08 · Pricing</div>
        <h2 className="section-title reveal">Investment <span className="grad">Options</span></h2>
        
        <div className="pricing-toggle-wrap reveal">
          <span className={`pricing-toggle-label ${!isRetainer ? 'active-label' : ''}`}>Project Based</span>
          <button 
            className={`pricing-toggle ${isRetainer ? 'on' : ''}`} 
            onClick={togglePricing}
            aria-label="Toggle Pricing"
            style={{ border: 'none', background: 'none', padding: 0 }}
          >
            <div className="pricing-toggle-knob"></div>
          </button>
          <span className={`pricing-toggle-label ${isRetainer ? 'active-label' : ''}`}>Monthly Retainer</span>
          <span className="pricing-save-badge">Save 15%</span>
        </div>

        <div className="pricing-grid">
          {/* Weekly */}
          <div className="pricing-card reveal">
            <div className="pricing-card-header">
              <div className="pricing-icon"><i className="fa-solid fa-bolt"></i></div>
              <div className="pricing-author-info">
                <h3 className="pricing-plan">Weekly</h3>
                <p className="pricing-desc">For quick tasks & fixes</p>
              </div>
            </div>
            <div className="pricing-price-wrap">
              <span className="pricing-price">₹{isRetainer ? '4,500' : '5,000'}</span>
              <span className="pricing-period">{isRetainer ? '/week' : '/task'}</span>
            </div>
            <ul className="pricing-features">
              <li><i className="fa-solid fa-check"></i> Bug Fixes & Optimisation</li>
              <li><i className="fa-solid fa-check"></i> Minor UI Adjustments</li>
              <li><i className="fa-solid fa-check"></i> Performance Audit</li>
              <li><i className="fa-solid fa-check"></i> 24h Response Time</li>
            </ul>
            <a href="#contact" className="btn-ghost pricing-btn">Get Started</a>
          </div>

          {/* One-time */}
          <div className="pricing-card p-popular reveal">
            <div className="pricing-popular-badge">Recommended</div>
            <div className="pricing-card-header">
              <div className="pricing-icon pricing-icon-popular"><i className="fa-solid fa-rocket"></i></div>
              <div className="pricing-author-info">
                <h3 className="pricing-plan">One-time</h3>
                <p className="pricing-desc">For complete projects</p>
              </div>
            </div>
            <div className="pricing-price-wrap">
              <span className="pricing-price">₹{isRetainer ? '12,000' : '15,000'}</span>
              <span className="pricing-period">/project</span>
            </div>
            <ul className="pricing-features">
              <li><i className="fa-solid fa-check"></i> Full Website Development</li>
              <li><i className="fa-solid fa-check"></i> Custom Design & Branding</li>
              <li><i className="fa-solid fa-check"></i> SEO & Performance Ready</li>
              <li><i className="fa-solid fa-check"></i> 1 Month Free Support</li>
            </ul>
            <a href="#contact" className="btn-glow pricing-btn">Start Project</a>
          </div>

          {/* Monthly */}
          <div className="pricing-card reveal">
            <div className="pricing-card-header">
              <div className="pricing-icon"><i className="fa-solid fa-crown"></i></div>
              <div className="pricing-author-info">
                <h3 className="pricing-plan">Monthly</h3>
                <p className="pricing-desc">For ongoing partnership</p>
              </div>
            </div>
            <div className="pricing-price-wrap">
              <span className="pricing-price">₹{isRetainer ? '25,000' : '30,000'}</span>
              <span className="pricing-period">{isRetainer ? '/month' : '/month'}</span>
            </div>
            <ul className="pricing-features">
              <li><i className="fa-solid fa-check"></i> Dedicated Development Time</li>
              <li><i className="fa-solid fa-check"></i> Regular Updates & Maintenance</li>
              <li><i className="fa-solid fa-check"></i> Priority Feature Requests</li>
              <li><i className="fa-solid fa-check"></i> Unlimited Consultations</li>
            </ul>
            <a href="#contact" className="btn-ghost pricing-btn">Partner Up</a>
          </div>
        </div>
      </div>
    </section>
  );
}
