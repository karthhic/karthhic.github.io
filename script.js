
const app = document.getElementById('app');

const ICONS = {
  linkedin: '<svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path></svg>',
  github: '<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"></path></svg>',
  email: '<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.3 1L6.6 10.8z"></path></svg>',
  location: '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>',
  website: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>'
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(url, prefix = 'https://') {
  if (!url) return '#';
  return /^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url) ? url : `${prefix}${url}`;
}

function initialsFromName(name) {
  return (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(part => part[0].toUpperCase())
    .join('');
}

function firstName(name) {
  return (name || '').trim().split(/\s+/)[0] || '';
}

function calcYearsOfExperience(experience = []) {
  const years = [];
  const nowYear = new Date().getFullYear();
  experience.forEach(item => {
    const matches = String(item.duration || '').match(/\b(19|20)\d{2}\b/g);
    if (matches) matches.forEach(year => years.push(Number(year)));
    if (/present/i.test(String(item.duration || ''))) years.push(nowYear);
  });
  if (!years.length) return `${experience.length}+`;
  return `${Math.max(1, nowYear - Math.min(...years))}+`;
}

function buildInfoRow(icon, label, valueHtml) {
  return `<div class="info-row"><div class="info-icon">${icon}</div><div><span class="info-lbl">${label}</span><span class="info-val">${valueHtml}</span></div></div>`;
}

function listItems(items = []) {
  return items.map(item => `<div class="ht-item">${escapeHtml(item)}</div>`).join('');
}

function renderPortfolio(data) {
  const personal = data.personalInfo || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skillGroups = data.skillGroups || {};
  const projects = data.projects || [];
  const hobbies = data.hobbies || [];
  const languages = data.languages || [];
  const travel = data.travel || [];
  const licenses = data.licenses || [];
  const references = data.references || [];

  const displayName = personal.name || 'Portfolio';
  const location = experience[0]?.location || '';
  const yearsExp = calcYearsOfExperience(experience);
  const currentYear = new Date().getFullYear();
  const siteUrl = safeUrl(personal.website);
  const linkedinUrl = personal.linkedin ? safeUrl(`linkedin.com/in/${personal.linkedin}`) : '#';
  const githubUrl = personal.github ? safeUrl(`github.com/${personal.github}`) : '#';
  document.title = displayName;

  const navLinks = [
    ['hero', 'Home'],
    ['about', 'About'],
    ['experience', 'Experience'],
    ['education', 'Education'],
    ['skills', 'Skills'],
    ['projects', 'Projects'],
    ['contact', 'Contact']
  ];

  const skillMarkup = Object.entries(skillGroups).map(([group, items]) => `
    <div class="sg reveal rd1 visible">
      <div class="sg-lbl">${escapeHtml(group)}</div>
      <div class="badges">${(items || []).map(item => `<span class="badge">${escapeHtml(item)}</span>`).join('')}</div>
    </div>
  `).join('');

  const appHtml = `
    <nav id="nav">
      <a href="#hero" class="nav-brand">${escapeHtml(initialsFromName(displayName))}<em>.</em></a>
      <ul class="nav-links">${navLinks.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('')}</ul>
      <a href="#contact" class="nav-cta">Get in Touch</a>
      <div class="hamburger" id="hbg" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></div>
    </nav>
    <div class="mob-menu" id="mob">${navLinks.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}</div>

    <section id="hero">
      <div class="hero-left">
        <div class="hero-badge"><span class="hdot"></span>Automation Professional</div>
        <h1 class="hero-title">
          <span class="line hn">${escapeHtml(firstName(displayName))}</span>
          <span class="line hr1">${escapeHtml(personal.title || '')}</span>
          <span class="line hr2">Portfolio</span>
        </h1>
        <p class="hero-desc">${escapeHtml(personal.profile || '')}</p>
        <div class="hero-btns">
          <a href="#projects" class="btn btn-p">View Projects →</a>
          <a href="#contact" class="btn btn-o">Get in Touch</a>
        </div>
        <div class="hero-soc">
          <a href="${linkedinUrl}" target="_blank" rel="noreferrer" class="soc" title="LinkedIn">${ICONS.linkedin}</a>
          <a href="${githubUrl}" target="_blank" rel="noreferrer" class="soc" title="GitHub">${ICONS.github}</a>
          <a href="mailto:${escapeHtml(personal.email || '')}" class="soc" title="Email">${ICONS.email}</a>
        </div>
      </div>
      <div class="hero-right">
        <div class="photo-wrap">
          <div class="photo-glow"></div>
          <div class="photo-ring"></div>
          <div class="photo-mask"></div>
          <div class="photo-inner"><img src="me2.png" alt="My Photo"></div>
        </div>
        <div class="stats-card">
          <div class="stat"><span class="stat-n">${yearsExp}</span><span class="stat-l">Years Exp.</span></div>
          <div class="stat"><span class="stat-n">${projects.length}+</span><span class="stat-l">Projects</span></div>
          <div class="stat"><span class="stat-n">${experience.length}+</span><span class="stat-l">Roles</span></div>
        </div>
      </div>
    </section>

    <section id="about" class="sec sec-alt">
      <div class="sec-inner">
        <div class="sec-lbl reveal visible">About</div>
        <h2 class="sec-title reveal rd1 visible">Who <span>I Am</span></h2>
        <div class="about-grid">
          <div class="reveal rd1 visible">
            <p class="about-text">${escapeHtml(personal.profile || '')}</p>
            <div class="about-pills">
              ${location ? `<span class="pill"><span class="pi">📍</span> ${escapeHtml(location)}</span>` : ''}
              ${travel.length ? `<span class="pill"><span class="pi">✈️</span> ${travel.length} Travel Docs</span>` : ''}
              ${languages.length ? `<span class="pill"><span class="pi">🌐</span> ${languages.length} Languages</span>` : ''}
              ${licenses.length ? `<span class="pill"><span class="pi">🔐</span> ${licenses.length} License${licenses.length > 1 ? 's' : ''}</span>` : ''}
            </div>
          </div>
          <div class="info-list reveal rd2 visible">
            ${buildInfoRow(ICONS.email, 'Email', `<a href="mailto:${escapeHtml(personal.email || '')}">${escapeHtml(personal.email || '')}</a>`)}
            <!--${buildInfoRow(ICONS.phone, 'Phone', escapeHtml(personal.phone || ''))}-->
            ${buildInfoRow(ICONS.phone,'Phone',`<a href="tel:${escapeHtml(personal.phone || '')}">${escapeHtml(personal.phone || '')}</a>`)}
            <!--${location ? buildInfoRow(ICONS.location, 'Location', escapeHtml(location)) : ''}-->
            ${location ? buildInfoRow(ICONS.location,'Location',`<a href="https://www.google.com/maps/search/${encodeURIComponent(location)}" target="_blank" rel="noreferrer">${escapeHtml(location)}</a>`) : ''}
            ${buildInfoRow(ICONS.website, 'Website', `<a href="${siteUrl}" target="_blank" rel="noreferrer">${escapeHtml(personal.website || '')}</a>`)}
            ${buildInfoRow(ICONS.linkedin, 'LinkedIn', `<a href="${linkedinUrl}" target="_blank" rel="noreferrer">linkedin.com/in/${escapeHtml(personal.linkedin || '')}</a>`)}
            ${buildInfoRow(ICONS.github, 'GitHub', `<a href="${githubUrl}" target="_blank" rel="noreferrer">github.com/${escapeHtml(personal.github || '')}</a>`)}
          </div>
        </div>
      </div>
    </section>

    <section id="experience" class="sec">
      <div class="sec-inner">
        <div class="sec-lbl reveal visible">Career</div>
        <h2 class="sec-title reveal rd1 visible">Work <span>Experience</span></h2>
        <div class="timeline">
          ${experience.map((item, index) => `
            <div class="titem reveal rd${(index % 4) + 1} visible">
              <div class="titem-header">
                <span class="titem-title">${escapeHtml(item.title)}</span>
                <span class="titem-dur">${escapeHtml(item.duration)}</span>
              </div>
              <div class="titem-company">${escapeHtml(item.company)}</div>
              <div class="titem-loc">📍 ${escapeHtml(item.location || '')}</div>
              <div class="titem-desc">${escapeHtml(item.description || '')}</div>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <section id="education" class="sec sec-alt">
      <div class="sec-inner">
        <div class="sec-lbl reveal visible">Learning</div>
        <h2 class="sec-title reveal rd1 visible">Education <span>Background</span></h2>
        <div class="edu-grid">
          ${education.map(item => `
            <div class="edu-card reveal rd1 visible">
              <div class="edu-deg">${escapeHtml(item.degree)}</div>
              <div class="edu-name">${escapeHtml(item.major || '')}</div>
              <div class="edu-inst">${escapeHtml(item.institution || '')}</div>
              <div class="edu-meta">${escapeHtml(item.location || '')}</div>
              <div class="edu-dur">${escapeHtml(item.duration || '')}</div>
              <div class="edu-thesis"><strong>Thesis:</strong> ${escapeHtml(item.thesis || '')}</div>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <section id="skills" class="sec">
      <div class="sec-inner">
        <div class="sec-lbl reveal visible">Capabilities</div>
        <h2 class="sec-title reveal rd1 visible">Skills &amp; <span>Tools</span></h2>
        <div class="skill-groups">${skillMarkup}</div>
      </div>
    </section>

    <section id="projects" class="sec sec-alt">
      <div class="sec-inner">
        <div class="sec-lbl reveal visible">Portfolio</div>
        <h2 class="sec-title reveal rd1 visible">Selected <span>Projects</span></h2>
        <div class="proj-grid">
          ${projects.map((item, index) => `
            <div class="proj-card reveal rd${(index % 4) + 1} visible">
              <span class="proj-from">${escapeHtml(item.from || '')}</span>
              <div class="proj-name">${escapeHtml(item.name || '')}</div>
              <div class="proj-desc-t">${escapeHtml(item.description || '')}</div>
              <div class="proj-role"><strong>My Role:</strong> ${escapeHtml(item.role || '')}</div>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <section id="personal" class="sec">
      <div class="sec-inner">
        <div class="sec-lbl reveal visible">Personal</div>
        <h2 class="sec-title reveal rd1 visible">Beyond <span>Engineering</span></h2>
        <div class="ht-grid">
          <div class="ht-card reveal rd1 visible">
            <div class="ht-card-title"><span class="ht-ico">🎯</span> Hobbies</div>
            <div class="ht-list">${listItems(hobbies)}</div>
          </div>
          <div class="ht-card reveal rd2 visible">
            <div class="ht-card-title"><span class="ht-ico">🌐</span> Languages</div>
            <div class="ht-list">${listItems(languages)}</div>
          </div>
          <div class="ht-card reveal rd3 visible">
            <div class="ht-card-title"><span class="ht-ico">✈️</span> Travel &amp; Licenses</div>
            <div class="ht-list">${listItems([...travel, ...licenses.map(item => `🔐 ${item}`)])}</div>
          </div>
        </div>
      </div>
    </section>
<!--
    <section id="references" class="sec sec-alt">
      <div class="sec-inner">
        <div class="sec-lbl reveal visible">Recommendations</div>
        <h2 class="sec-title reveal rd1 visible"><span class="v">References</span> &amp; Testimonials</h2>
        <div class="ref-grid">
          ${references.map((item, index) => `
            <div class="ref-card reveal rd${(index % 4) + 1} visible">
              <div class="ref-name">${escapeHtml(item.name || '')}</div>
              <div class="ref-role">${escapeHtml(item.title || '')}</div>
              <div class="ref-org">${escapeHtml(item.organization || '')}</div>
              <div class="ref-contact">
                ${item.email ? `<a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a>` : ''}
                ${item.phone ? `<span>${escapeHtml(item.phone)}</span>` : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>
    </section>
-->
    <section id="contact" class="sec">
      <div class="sec-inner">
        <div class="sec-lbl reveal visible">Contact</div>
        <h2 class="sec-title reveal rd1 visible">Let's <span>Connect</span></h2>
        <div class="contact-wrap">
          <div class="contact-card reveal rd1 visible">
            <div class="contact-copy">Interested in automation, industrial software, product development, or commissioning work? Reach out directly.</div>
            <div class="contact-items">
              <div class="c-item"><div class="c-icon">${ICONS.email}</div><div><span class="c-lbl">Email</span><span class="c-val"><a href="mailto:${escapeHtml(personal.email || '')}">${escapeHtml(personal.email || '')}</a></span></div></div>
              <div class="c-item"><div class="c-icon">${ICONS.phone}</div><div><span class="c-lbl">Phone</span><span class="c-val">${escapeHtml(personal.phone || '')}</span></div></div>
              <div class="c-item"><div class="c-icon">${ICONS.website}</div><div><span class="c-lbl">Website</span><span class="c-val"><a href="${siteUrl}" target="_blank" rel="noreferrer">${escapeHtml(personal.website || '')}</a></span></div></div>
              <div class="c-item"><div class="c-icon">${ICONS.linkedin}</div><div><span class="c-lbl">LinkedIn</span><span class="c-val"><a href="${linkedinUrl}" target="_blank" rel="noreferrer">linkedin.com/in/${escapeHtml(personal.linkedin || '')}</a></span></div></div>
              <div class="c-item"><div class="c-icon">${ICONS.github}</div><div><span class="c-lbl">GitHub</span><span class="c-val"><a href="${githubUrl}" target="_blank" rel="noreferrer">github.com/${escapeHtml(personal.github || '')}</a></span></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <span class="foot-txt">© ${currentYear} <span class="foot-ac">${escapeHtml(displayName)}</span>. All rights reserved.</span>
      <div class="foot-links">${navLinks.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}</div>
    </footer>
  `;

  app.innerHTML = appHtml;
  setupInteractions();
}

function setupInteractions() {
  const nav = document.getElementById('nav');
  const hbg = document.getElementById('hbg');
  const mob = document.getElementById('mob');
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a, .mob-menu a'));
  const sections = Array.from(document.querySelectorAll('section[id]'));

  const updateScrolled = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };

  const updateActiveSection = () => {
    const offset = window.scrollY + 140;
    let current = sections[0]?.id || 'hero';
    sections.forEach(section => {
      if (section.offsetTop <= offset) current = section.id;
    });
    navAnchors.forEach(link => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href === `#${current}`);
    });
  };

  hbg?.addEventListener('click', () => {
    const open = mob.classList.toggle('open');
    hbg.setAttribute('aria-expanded', String(open));
  });

  mob?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mob.classList.remove('open');
      hbg?.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('scroll', () => {
    updateScrolled();
    updateActiveSection();
  }, { passive: true });

  updateScrolled();
  updateActiveSection();
}

async function init() {
  try {
    const response = await fetch('./data.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Unable to load data.json (${response.status})`);
    const data = await response.json();
    renderPortfolio(data);
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <div class="loading-shell">
        <div class="error-card">
          <h2>Could not load portfolio data</h2>
          <p>${escapeHtml(error.message)}</p>
        </div>
      </div>`;
  }
}

init();
