export default function PrinceAI() {
  const prompts = [
    'Draft a premium landing page concept',
    'Review my portfolio for UX improvements',
    'Generate a project pitch in a sharp tone',
    'Plan a conversion-focused contact flow',
  ];

  const features = [
    {
      title: 'Fast ideation',
      desc: 'Turn rough ideas into polished product direction with concise, production-ready recommendations.',
    },
    {
      title: 'Code-aware thinking',
      desc: 'Structure content, layout, and interaction guidance with the discipline of a senior frontend engineer.',
    },
    {
      title: 'OpenRouter AI ready',
      desc: 'Designed with modern AI workflows and routing-friendly product storytelling in mind.',
    },
    {
      title: 'Client-friendly output',
      desc: 'Produce explanations, prompts, and design notes that are clear enough for stakeholders and engineers.',
    },
  ];

  return (
    <section id="prince-ai" className="section prince-ai">
      <div className="container prince-ai-shell">
        <div className="section-eyebrow">10 · Prince AI</div>
        <h2 className="section-title reveal">Prince <span className="grad">AI</span></h2>
        <p className="section-sub reveal">
          A premium AI assistant concept for product strategy, content generation, and engineering-friendly guidance, presented with a clean OpenRouter AI-inspired experience.
        </p>

        <div className="prince-ai-grid">
          <article className="ai-panel ai-intro reveal">
            <p className="ai-kicker">Assistant overview</p>
            <h3>Smart, focused, and built for real work.</h3>
            <p>
              Prince AI helps convert ideas into sharper decisions, clearer copy, and better digital experiences while keeping the presentation elegant and modern.
            </p>
            <div className="ai-badges">
              <span>OpenRouter AI</span>
              <span>Product Thinking</span>
              <span>Portfolio Strategy</span>
            </div>
          </article>

          <article className="ai-panel ai-preview reveal reveal-right">
            <div className="ai-preview-head">
              <div>
                <p className="ai-kicker">Chat preview</p>
                <h3>Conversation sample</h3>
              </div>
              <span className="ai-live-dot">Online</span>
            </div>

            <div className="ai-chat">
              <div className="ai-message ai-message-user">
                Can you make my portfolio feel more premium and modern?
              </div>
              <div className="ai-message ai-message-ai">
                Focus on a tighter visual hierarchy, better spacing, sharp typography, and a consistent red-and-white system.
              </div>
              <div className="ai-message ai-message-user">
                What should I highlight first?
              </div>
              <div className="ai-message ai-message-ai">
                Lead with your strongest project, then show your process, credibility, and a direct contact path.
              </div>
            </div>
          </article>

          <article className="ai-panel ai-features reveal">
            <p className="ai-kicker">Capabilities</p>
            <div className="ai-feature-grid">
              {features.map((feature) => (
                <div key={feature.title} className="ai-feature-card">
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="ai-panel ai-prompts reveal reveal-right">
            <p className="ai-kicker">Suggested prompts</p>
            <div className="ai-prompt-list">
              {prompts.map((prompt) => (
                <button key={prompt} className="ai-prompt-btn" type="button">
                  {prompt}
                </button>
              ))}
            </div>
            <div className="ai-cta-row">
              <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="btn-glow">
                <span>Explore OpenRouter AI</span>
                <i className="fa-solid fa-arrow-right"></i>
              </a>
              <a href="#contact" className="btn-ghost">
                <span>Start a conversation</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}