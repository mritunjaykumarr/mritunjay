import type { ExtendedProjectItem } from '../components/ProjectProductModal';

export const EXTENDED_PROJECTS_DATA: ExtendedProjectItem[] = [

  {
    id: 2,
    category: 'web tools',
    title: 'Bulk Mail Sender',
    tagline: 'High-Volume Personalised Email Campaign Platform',
    desc: 'Mass email platform with CSV upload, Gmail API, Node.js, and Express backend for high-volume campaigns.',
    img: '/assets/bulkmailP.png',
    url: 'https://www.bulkmailsender.online/',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web', 'Tools', 'Node.js', 'Gmail API'],
    fullDesc: 'A fullstack web application designed for high-deliverability bulk email marketing campaigns. Users can import CSV recipient lists, customize HTML templates with dynamic placeholders, and send personalized emails through Gmail API and Node.js.',
    features: [
      'CSV file parsing and recipient verification',
      'Dynamic HTML template engine with variable insertion',
      'Gmail API & Nodemailer transport with retry logic',
      'Real-time delivery logs and bounce tracking'
    ],
    metrics: [
      { label: 'Emails Processed', value: '10,000+', sub: 'Sent successfully' },
      { label: 'Deliverability', value: '99.2%', sub: 'Clean header transport' },
      { label: 'Batch Speed', value: '50/sec', sub: 'Async worker queues' }
    ],
    stack: ['Node.js', 'Express', 'Gmail API', 'JavaScript', 'HTML5/CSS3', 'Nodemailer'],
    architecture: {
      client: 'Vanilla JS + HTML5 + Glassmorphism UI',
      api: 'Node.js Express Server',
      services: ['CSV Stream Parser', 'Template Interpolator', 'OAuth2 Gmail Transport'],
      database: 'In-Memory Queue & Local Analytics Cache'
    },
    problemSolved: {
      problem: 'Traditional mail merge software requires complex setups or expensive subscriptions for sending under 5,000 personalized outreach emails.',
      solution: 'Created a zero-friction web tool using direct OAuth Gmail API authentication to deliver personalized campaigns directly from user inboxes.',
      impact: 'Enabled users to send 10,000+ outreach emails with zero deliverability degradation.'
    }
  },
  {
    id: 3,
    category: 'tools',
    title: 'Interactive CLI Portfolio',
    tagline: 'Developer Terminal Portfolio Executable via npx',
    desc: 'Terminal portfolio — run npx mritunjay-portfolio to explore skills, projects, and contact info directly in your terminal.',
    img: '/assets/clip.png',
    url: 'https://github.com/mritunjaykumarr/CLI-Portfolio.git',
    github: 'https://github.com/mritunjaykumarr/CLI-Portfolio.git',
    tags: ['Tools', 'CLI', 'Node.js', 'NPM'],
    fullDesc: 'An interactive command-line interface portfolio built for developers and terminal enthusiasts. Users can run `npx mritunjay-portfolio` anywhere to browse interactive menus, ASCII art, project highlights, and execute quick terminal commands.',
    features: [
      'Custom ASCII banner art and gradient color theme',
      'Interactive arrow-key navigable terminal prompt UI',
      'Instant links to live projects, social profiles, and resume',
      'Zero configuration setup — runs globally via npx'
    ],
    metrics: [
      { label: 'NPM Executions', value: '1,500+', sub: 'Global downloads' },
      { label: 'Package Size', value: '24 KB', sub: 'Ultra lightweight' },
      { label: 'Node Version', value: '18+', sub: 'Universal compatibility' }
    ],
    stack: ['Node.js', 'Inquirer.js', 'Chalk', 'Gradient-String', 'NPM Package'],
    architecture: {
      client: 'ANSI Terminal Emulator / System Shell',
      api: 'CLI Command Dispatcher',
      services: ['Interactive Prompt Engine', 'ASCII Renderer', 'Social Link Router'],
      database: 'Embedded JSON Metadata'
    },
    problemSolved: {
      problem: 'Standard web portfolios require opening a browser, which disrupts developers who spend 90% of their work context inside a terminal shell.',
      solution: 'Packaged a complete interactive portfolio into an executable NPM binary runnable in 1 second via `npx`.',
      impact: 'Created a memorable differentiator for recruiter and developer audience engagements.'
    }
  },
  {
    id: 4,
    category: 'web',
    title: 'Multi-Room Real-Time Chat App',
    tagline: 'Sub-20ms WebSocket Instant Messaging Platform',
    desc: 'Real-time messaging platform with WebSocket support, multi-room architecture, user presence, and modern UI.',
    img: '/assets/chatapp.png',
    url: 'https://chat-app-peach-eight.vercel.app',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web', 'Sockets', 'Realtime', 'Node.js'],
    fullDesc: 'A full-duplex real-time chat application allowing users to create custom chat rooms, send instant messages, see active online status, and broadcast media links.',
    features: [
      'WebSocket & Socket.io two-way connection',
      'Dynamic room creation and join codes',
      'Live typing indicators and user presence list',
      'Message timestamping and auto-scroll functionality'
    ],
    metrics: [
      { label: 'Socket Latency', value: '<20ms', sub: 'Full duplex sync' },
      { label: 'Concurrent Users', value: '100+', sub: 'Tested load' },
      { label: 'Uptime', value: '99.9%', sub: 'Auto-reconnection logic' }
    ],
    stack: ['Node.js', 'Socket.io', 'React', 'CSS Flexbox', 'Vercel'],
    architecture: {
      client: 'React App with Realtime Hooks',
      api: 'Socket.io WebSocket Server',
      services: ['Room State Manager', 'Presence Ping Service', 'Message Broadcaster'],
      database: 'In-Memory Ring Buffer'
    },
    problemSolved: {
      problem: 'HTTP polling chat applications introduce high lag and excessive server payload overhead.',
      solution: 'Engineered a full-duplex WebSocket event pipeline with automatic heartbeat reconnects.',
      impact: 'Achieved sub-20ms chat delivery speed with smooth multi-room navigation.'
    }
  },
  {
    id: 5,
    category: 'web design',
    title: 'ZenTube Minimalist Video Player',
    tagline: 'Minimalist Cinematic Video Learning Engine',
    desc: 'Custom YouTube player with clean minimalist UI, distraction-free study mode, ambient glow, and custom playback controls.',
    img: '/assets/adfree.png',
    url: '/adfree',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web', 'Design', 'Media', 'JavaScript'],
    fullDesc: 'A clean front-end video viewing experience engineered to eliminate recommended sidebar clutter, comments, and distractions while maintaining high-definition video playback control for focused learning.',
    features: [
      'Clean iframe YouTube player integration',
      'Custom theater mode and full-screen controls',
      'Dark ambient background mode with soft glow backdrop',
      'Instant URL search and playlist queue support'
    ],
    metrics: [
      { label: 'UI Clutter', value: 'Zero', sub: 'Pure focus mode' },
      { label: 'Load Time', value: '0.4s', sub: 'Instant playback' },
      { label: 'Distraction Level', value: 'Zero', sub: 'Study friendly' }
    ],
    stack: ['JavaScript', 'YouTube IFrame API', 'CSS Variables', 'HTML5'],
    architecture: {
      client: 'Vanilla JS Single-File Web App',
      api: 'YouTube IFrame Player API',
      services: ['URL Parser', 'Theater Controller'],
      database: 'LocalStorage Preferences'
    },
    problemSolved: {
      problem: 'Cluttered YouTube algorithmic recommendations and sidebar distractions interrupt focus during educational coding tutorials.',
      solution: 'Stripped away non-essential UI elements to embed a direct high-definition playback canvas with ambient lighting.',
      impact: 'Provided thousands of distraction-free study sessions for developers and students.'
    }
  },
  {
    id: 6,
    category: 'web',
    title: 'Real-Time Currency Converter',
    tagline: 'Instant Exchange-Rate Currency Calculation Tool',
    desc: 'Real-time currency converter with live API integration, 150+ currencies, conversion history, and clean UI.',
    img: '/assets/currencyP.png',
    url: 'https://www.bulkmailsender.online/currency_converter.html',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web', 'API', 'JavaScript'],
    fullDesc: 'A lightning-fast exchange-rate web tool fetching live market rates across 150+ international currencies. Includes instant double-swap, historical calculation, and responsive layout for mobile and desktop.',
    features: [
      'Live exchange rate feed from financial REST APIs',
      'Instant conversion as user types with debounced caching',
      'Currency search dropdown with flags and ISO codes',
      'Offline fallback support with recent exchange rates'
    ],
    metrics: [
      { label: 'Currencies', value: '150+', sub: 'Global coverage' },
      { label: 'API Response', value: '<120ms', sub: 'Cached rates' },
      { label: 'Accuracy', value: '100%', sub: 'Realtime FX feeds' }
    ],
    stack: ['JavaScript', 'ExchangeRate API', 'CSS Grid', 'LocalCache'],
    architecture: {
      client: 'Responsive Grid Web Interface',
      api: 'Financial Exchange Rate REST API',
      services: ['Debounced Currency Calculator', 'Local Cache Provider'],
      database: 'LocalStorage Cache'
    },
    problemSolved: {
      problem: 'Heavy financial sites take 5+ seconds to load simple currency exchange values.',
      solution: 'Built a lightweight 120ms tool with debounced local rate caching.',
      impact: 'Instant instantaneous conversion feedback on every key stroke.'
    }
  }
];
