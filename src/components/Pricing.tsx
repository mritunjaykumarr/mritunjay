import { useState } from 'react';
import { Zap, Rocket, Crown, Check } from 'lucide-react';

export default function Pricing() {
  const [isRetainer, setIsRetainer] = useState(false);

  return (
    <section id="pricing" className="section pricing">
      <div className="container">
        <div className="section-eyebrow">Pricing</div>
        <h2 className="section-title reveal">Investment <span className="grad">Options</span></h2>

        <div className="pricing-toggle-wrap reveal">
          <span className={`pricing-toggle-label ${!isRetainer ? 'active-label' : ''}`}>Project Based</span>
          <button
            className={`pricing-toggle ${isRetainer ? 'on' : ''}`}
            onClick={() => setIsRetainer(!isRetainer)}
            aria-label="Toggle pricing mode"
          >
            <div className="pricing-toggle-knob" />
          </button>
          <span className={`pricing-toggle-label ${isRetainer ? 'active-label' : ''}`}>Monthly Retainer</span>
          <span className="pricing-save-badge">Save 15%</span>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card reveal">
            <div className="pricing-card-header">
              <div className="pricing-icon"><Zap size={18} /></div>
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
              <li><Check size={16} /> Bug Fixes & Optimisation</li>
              <li><Check size={16} /> Minor UI Adjustments</li>
              <li><Check size={16} /> Performance Audit</li>
              <li><Check size={16} /> 24h Response Time</li>
            </ul>
            <a href="#contact" className="btn-outline pricing-btn">Get Started</a>
          </div>

          <div className="pricing-card p-popular reveal">
            <div className="pricing-popular-badge">Recommended</div>
            <div className="pricing-card-header">
              <div className="pricing-icon pricing-icon-popular"><Rocket size={18} /></div>
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
              <li><Check size={16} /> Full Website Development</li>
              <li><Check size={16} /> Custom Design & Branding</li>
              <li><Check size={16} /> SEO & Performance Ready</li>
              <li><Check size={16} /> 1 Month Free Support</li>
            </ul>
            <a href="#contact" className="btn-primary pricing-btn">Start Project</a>
          </div>

          <div className="pricing-card reveal">
            <div className="pricing-card-header">
              <div className="pricing-icon"><Crown size={18} /></div>
              <div className="pricing-author-info">
                <h3 className="pricing-plan">Monthly</h3>
                <p className="pricing-desc">For ongoing partnership</p>
              </div>
            </div>
            <div className="pricing-price-wrap">
              <span className="pricing-price">₹{isRetainer ? '25,000' : '30,000'}</span>
              <span className="pricing-period">/month</span>
            </div>
            <ul className="pricing-features">
              <li><Check size={16} /> Dedicated Development Time</li>
              <li><Check size={16} /> Regular Updates & Maintenance</li>
              <li><Check size={16} /> Priority Feature Requests</li>
              <li><Check size={16} /> Unlimited Consultations</li>
            </ul>
            <a href="#contact" className="btn-outline pricing-btn">Partner Up</a>
          </div>
        </div>
      </div>
    </section>
  );
}
