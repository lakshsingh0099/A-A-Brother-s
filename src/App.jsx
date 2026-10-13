import { useEffect, useRef, useState } from 'react';

const livingFiles = ['interior 01.jpg', 'interior 02.jpg', 'interior 03.jpg', 'interior 04.jpg', 'interior.jpg', 'interior05.jpg'];
const bedroomFiles = ['Bedroom 01.jpg', 'Bedroom 02.jpg', 'bedroom 03.jpg'];
const wallFiles = ['wall panel 01.jpg', 'wall panel 02.jpg', 'wall panel 03.jpg', 'wall panel 04.jpg'];
const ceilingFiles = Array.from({ length: 9 }, (_, index) => `fall ceiling ${String(index + 1).padStart(2, '0')}.mp4`);
const asset = (folder, file) => `/media/${folder}/${encodeURIComponent(file)}`;
const livingItems = livingFiles.map((file, index) => ({ category: 'living', kind: 'image', title: `Interior ${String(index + 1).padStart(2, '0')}`, type: 'Living room · A&A project', image: asset('living', file), full: asset('living', file) }));
const bedroomItems = bedroomFiles.map((file, index) => ({ category: 'bedroom', kind: 'image', title: `Bedroom ${String(index + 1).padStart(2, '0')}`, type: 'Bedroom · A&A project', image: asset('bedroom', file), full: asset('bedroom', file) }));
const wallItems = wallFiles.map((file, index) => ({ category: 'wall', kind: 'image', title: `Wall panel ${String(index + 1).padStart(2, '0')}`, type: 'Wall panels · A&A project', image: asset('wall', file), full: asset('wall', file) }));
const ceilingItems = ceilingFiles.map((file, index) => ({ category: 'ceiling', kind: 'video', title: `Ceiling design ${String(index + 1).padStart(2, '0')}`, type: 'Fall ceiling · Project footage', image: asset('living', livingFiles[index % livingFiles.length]), full: asset('living', livingFiles[index % livingFiles.length]), video: asset('ceiling', file) }));
const catalog = Array.from({ length: 9 }, (_, index) => [ceilingItems[index], livingItems[index], bedroomItems[index], wallItems[index]].filter(Boolean)).flat();
const categories = [['all', 'All'], ['ceiling', 'Fall Ceiling'], ['living', 'Living Rooms'], ['bedroom', 'Bedrooms'], ['wall', 'Wall Panels']];

function Brand() {
  return <a className="brand" href="#home" aria-label="A and A Brother's home"><span className="brand-mark">A&amp;A</span><span>Brother's</span></a>;
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', update, { passive: true }); update();
    return () => window.removeEventListener('scroll', update);
  }, []);
  const closeMenu = () => setMenuOpen(false);
  return <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
    <div className="header-inner"><Brand />
      <nav className={`nav${menuOpen ? ' open' : ''}`} aria-label="Main navigation">
        <a href="#home" onClick={closeMenu}>Home</a><a href="#catalog" onClick={closeMenu}>Catalog</a><a href="#contact" onClick={closeMenu}>Contact</a>
        <a className="btn" href="#enquiry" onClick={closeMenu}>Raise an Enquiry <span className="arrow">↗</span></a>
      </nav>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}><span /><span /></button>
    </div>
  </header>;
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add('in-view'); observer.disconnect(); }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Hero() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setOffset(window.innerWidth > 640 ? Math.min(window.scrollY * 0.18, 90) : 0));
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => { window.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
  }, []);
  return <section className="hero" id="home" aria-label="A and A Brother's">
    <div className="hero-photo" aria-hidden="true" style={{ transform: `translateY(${offset}px)` }} />
    <div className="hero-frame"><p className="hero-kicker">Interior design · Construction · Delhi NCR</p><h1 className="serif">Spaces with<br /><em>soul.</em></h1>
      <div className="hero-bottom"><div className="hero-copy">Considered interiors, made for living. From the first sketch to the final finish, we shape homes that feel entirely yours.<strong>Serving Delhi&nbsp; • &nbsp;Noida&nbsp; • &nbsp;Kanpur</strong></div><a className="btn btn-outline" href="#catalog">View Catalog <span className="arrow">↓</span></a></div>
    </div><span className="hero-side-note">Made thoughtfully · Built beautifully</span><a className="hero-scroll" href="#about">Scroll to explore</a>
  </section>;
}

function Intro() {
  return <section className="section" id="about"><div className="wrap intro">
    <Reveal className="intro-image"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85" alt="Sunlit interior with warm natural materials" loading="lazy" /></Reveal>
    <Reveal className="intro-text delay-1"><span className="eyebrow">The A&amp;A approach</span><h2 className="serif">A home should feel like <em>you.</em></h2><p>We bring thoughtful design and dependable construction together, creating rooms that work beautifully and welcome you in. Every detail is considered; every home is personal.</p><a className="text-link" href="#catalog">Explore our work <span>→</span></a></Reveal>
  </div></section>;
}

function CatalogCard({ item, index, onOpen, onEnquire, hoverVideo, setHoverVideo }) {
  const hasPreview = hoverVideo === index;
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [posterReady, setPosterReady] = useState(false);
  useEffect(() => {
    const node = cardRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add('in-view'); setPosterReady(true); observer.disconnect(); }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (hasPreview) video.play().catch(() => {});
    else { video.pause(); if (video.readyState > 0) video.currentTime = 0.05; }
  }, [hasPreview]);
  return <article ref={cardRef} className={`card reveal${index % 3 ? ` delay-${index % 3}` : ''}`}>
    <div className="card-media" onClick={() => onOpen(item)} onPointerEnter={() => item.kind === 'video' && window.matchMedia('(hover: hover)').matches && setHoverVideo(index)} onPointerLeave={() => hasPreview && setHoverVideo(null)} role="button" tabIndex="0" aria-label={`Open ${item.title}`} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpen(item); }}>
      {item.kind === 'video' ? <video ref={videoRef} className="catalog-video-frame" src={posterReady ? item.video : undefined} poster={item.image} muted loop playsInline preload={posterReady ? 'metadata' : 'none'} onLoadedData={e => { if (!hasPreview) e.currentTarget.currentTime = 0.05; }} /> : <img src={item.image} alt={item.type} loading="lazy" />}
      {item.kind === 'video' && <><span className="card-badge">Preview film</span><span className="play-icon" aria-hidden="true">▶</span></>}
    </div>
    <div className="card-caption"><div><span className="card-title">{item.title}</span><span className="card-type">{item.type}</span></div><a className="card-enquire" href="#enquiry" onClick={() => onEnquire(item.category)}>Enquire ↗</a></div>
  </article>;
}

function Viewer({ item, onClose, onNext, onPrevious }) {
  const touchStart = useRef(0);
  useEffect(() => {
    if (!item) return undefined;
    document.body.classList.add('locked');
    const onKey = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNext();
      if (event.key === 'ArrowLeft') onPrevious();
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('locked'); document.removeEventListener('keydown', onKey); };
  }, [item, onClose, onNext, onPrevious]);
  if (!item) return null;
  return <div className="viewer open" role="dialog" aria-modal="true" aria-label="Catalog viewer" onMouseDown={e => e.target === e.currentTarget && onClose()} onTouchStart={e => { touchStart.current = e.changedTouches[0].screenX; }} onTouchEnd={e => { const dx = e.changedTouches[0].screenX - touchStart.current; if (Math.abs(dx) > 65) (dx < 0 ? onNext : onPrevious)(); }}>
    <button className="viewer-close" aria-label="Close viewer" onClick={onClose}>×</button><button className="viewer-arrow viewer-prev" aria-label="Previous item" onClick={onPrevious}>←</button>
    <div className="viewer-content">{item.kind === 'video' ? <video src={item.video} poster={item.full} controls autoPlay playsInline /> : <img src={item.full} alt={item.title} />}</div>
    <button className="viewer-arrow viewer-next" aria-label="Next item" onClick={onNext}>→</button><div className="viewer-caption">{item.title}</div>
  </div>;
}

function Catalog({ onEnquire }) {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [hoverVideo, setHoverVideo] = useState(null);
  const visible = catalog.filter(item => filter === 'all' || item.category === filter);
  const next = direction => setSelected(current => {
    const index = visible.indexOf(current);
    return visible[(index + direction + visible.length) % visible.length];
  });
  return <section className="catalog" id="catalog"><div className="wrap">
    <Reveal className="section-head"><div><span className="eyebrow">A collection of spaces</span><h2 className="serif">Made to <em>live in.</em></h2></div><p>Explore the details, materials and moods that shape an A&amp;A home.</p></Reveal>
    <div className="filters" role="group" aria-label="Filter catalog">{categories.map(([value, label]) => <button key={value} className={`filter${filter === value ? ' active' : ''}`} onClick={() => { setFilter(value); setHoverVideo(null); }}>{label}</button>)}</div>
    <div className="gallery">{visible.map((item, index) => <CatalogCard key={item.title} item={item} index={index} onOpen={setSelected} onEnquire={onEnquire} hoverVideo={hoverVideo} setHoverVideo={setHoverVideo} />)}</div>
    <div className="catalog-note"><span>Interiors made with intention</span><span>Delhi · Noida · Kanpur</span></div>
  </div><Viewer item={selected} onClose={() => setSelected(null)} onNext={() => next(1)} onPrevious={() => next(-1)} /></section>;
}

function Statement() {
  return <section className="statement"><Reveal className="wrap statement-inner"><div><span className="eyebrow">From first idea to final finish</span><h2 className="serif">Good design is felt<br /><em>every day.</em></h2></div><div><p>Design and construction, thoughtfully brought together for a home that feels as good as it looks.</p><a className="btn btn-outline" href="#enquiry">Start a conversation <span className="arrow">↗</span></a></div></Reveal></section>;
}

function Enquiry({ project, setProject }) {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  async function submit(event) {
    event.preventDefault(); setStatus(''); setSending(true);
    const form = event.currentTarget;
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) throw new Error('Supabase configuration is missing');
      const { _subject, _template, ...enquiry } = Object.fromEntries(new FormData(form));
      const response = await fetch(`${supabaseUrl}/rest/v1/enquiries`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(enquiry),
      });
      if (!response.ok) throw new Error(`Supabase rejected the enquiry (${response.status})`);
      setStatus('success'); form.reset(); setProject('');
    } catch (error) {
      console.error('Enquiry submission failed:', error);
      setStatus('error');
    } finally { setSending(false); }
  }
  return <section className="section enquiry" id="enquiry"><div className="wrap enquiry-grid">
    <div className="enquiry-aside"><span className="eyebrow">Tell us what you're imagining</span><h2 className="serif">Let's make<br />room for <em>you.</em></h2><p>Share a little about your project and our team will be in touch to discuss the next steps.</p><div className="contact-mini"><a href="tel:+916389069245">+91 63890 69245</a><a href="mailto:amirhamjak538@gmail.com">amirhamjak538@gmail.com</a></div></div>
    <form className="form-grid" onSubmit={submit}>
      <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" required placeholder="Name" /></div>
      <div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" autoComplete="tel" required placeholder="+91" /></div>
      <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></div>
      <div className="field"><label htmlFor="project">Project type</label><select id="project" name="project_type" required value={project} onChange={e => setProject(e.target.value)}><option value="" disabled>Select a project</option>{['Fall Ceiling', 'Living Room', 'Bedroom', 'Wall Panel', 'Full Home Interior', 'Other'].map(value => <option key={value}>{value}</option>)}</select></div>
      <div className="field"><label htmlFor="location">Preferred location</label><select id="location" name="preferred_location" required defaultValue=""><option value="" disabled>Select a location</option>{['Delhi', 'Noida', 'Kanpur'].map(value => <option key={value}>{value}</option>)}</select></div>
      <div className="field full"><label htmlFor="message">A few words about your project</label><textarea id="message" name="message" required placeholder="What would you love to create?" /></div>
      
      <div className="form-actions"><button className="btn" type="submit" disabled={sending}>{sending ? 'Sending…' : <>Send enquiry <span className="arrow">↗</span></>}</button><span className="form-note">We’ll get back to you as soon as we can.</span></div>
      {status === 'success' && <div className="success show" role="status">Thank you — your enquiry has been saved. We’ll be in touch soon.</div>}{status === 'error' && <div className="error show" role="alert">We couldn’t save that just now. Please try again or email us directly at amirhamjak538@gmail.com.</div>}
    </form>
  </div></section>;
}

function Contact() {
  return <section className="contact" id="contact"><div className="wrap"><div className="contact-top"><div><span className="eyebrow">A&amp;A Brother's</span><h2 className="serif">We'd love to<br />hear from you.</h2></div><div className="contact-details"><a href="tel:+916389069245">+91 63890 69245</a><a href="mailto:amirhamjak538@gmail.com">Email us ↗</a><a href="https://wa.me/916389069245" target="_blank" rel="noreferrer">WhatsApp ↗</a></div></div><div className="locations"><span className="locations-label">Serving with care</span>{['Delhi', 'Noida', 'Kanpur'].map(city => <span className="location" key={city}>{city}</span>)}</div></div></section>;
}

function Footer() {
  return <footer className="footer"><div className="wrap"><div className="footer-grid"><div className="footer-about"><Brand /><p>Thoughtful interiors and beautifully built spaces, made for the way you live.</p><div className="socials"><a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">ig</a><a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">f</a><a href="https://pinterest.com" aria-label="Pinterest" target="_blank" rel="noreferrer">p</a></div></div><div><h3>Explore</h3><div className="footer-links"><a href="#home">Home</a><a href="#catalog">Catalog</a><a href="#enquiry">Raise an Enquiry</a><a href="#contact">Contact</a></div></div><div><h3>Get in touch</h3><div className="footer-contact"><a href="tel:+916389069245">+91 63890 69245</a><a href="mailto:amirhamjak538@gmail.com">amirhamjak538@gmail.com</a><span>Available in Delhi · Noida · Kanpur</span></div></div></div><div className="copyright"><span>© 2026 A &amp; A Brother's. All rights reserved.</span><span>Thoughtfully imagined. Beautifully built.</span></div></div></footer>;
}

export default function App() {
  const [project, setProject] = useState('');
  function selectProject(category) {
    setProject(({ ceiling: 'Fall Ceiling', living: 'Living Room', bedroom: 'Bedroom', wall: 'Wall Panel' })[category] || '');
  }
  useEffect(() => { document.documentElement.style.scrollBehavior = 'smooth'; return () => { document.documentElement.style.scrollBehavior = ''; }; }, []);
  return <><Header /><main><Hero /><Intro /><Catalog onEnquire={selectProject} /><Statement /><Enquiry project={project} setProject={setProject} /><Contact /></main><Footer /></>;
}
