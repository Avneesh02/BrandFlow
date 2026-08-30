import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Check, FileText, Gauge, Layers3, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react'
import AuthPage from './AuthPage'
import MonoHomeHero from '../components/MonoHomeHero'

export default function LandingPage({ onAuth }) {
  return (
    <main className="landing-page mono-page">
      <Preloader />
      <nav className="mono-nav" aria-label="Main navigation">
        <a className="mono-brand magnetic-link" href="#top"><span className="mono-brand-mark">B</span>BrandFlow</a>
        <div className="mono-nav-meta"><span>Creative operations / 2026</span><a className="mono-nav-cta magnetic-link" href="#start">Start a brief <ArrowUpRight size={13} /></a></div>
      </nav>

      <div id="top"><MonoHomeHero /></div>

      <Reveal className="mono-intro-section">
        <div className="mono-section-number">01 <span>/ 04</span></div>
        <div className="mono-intro-copy"><span className="mono-label">The premise</span><h2>Good work<br />has a <em>signal.</em></h2><p>BrandFlow gives your team a shared point of view before the first line is written. Bring the context. Find the clear move.</p><a className="mono-text-link magnetic-link" href="#workflow">See the system <ArrowDownRight size={15} /></a></div>
        <div className="mono-intro-statement">AI should<br /><span>sharpen</span><br />the idea.</div>
      </Reveal>

      <Reveal id="signal" className="mono-signal-section">
        <div className="mono-signal-copy"><span className="mono-label">Signal report / 001</span><h2>Keep the<br /><em>thread.</em></h2><p>Every campaign is scored against the brand context that made it worth making.</p><div className="mono-signal-stat"><strong>98</strong><span>consistency<br />score</span></div></div>
        <div className="mono-chart-card"><div className="mono-chart-top"><span><i className="mono-live-dot" /> Brand signal</span><span>Current campaign</span></div><div className="mono-chart"><div className="mono-chart-grid"><i /><i /><i /><i /></div><div className="mono-chart-bars"><i style={{ '--height': '35%' }} /><i style={{ '--height': '47%' }} /><i style={{ '--height': '42%' }} /><i style={{ '--height': '61%' }} /><i style={{ '--height': '58%' }} /><i style={{ '--height': '73%' }} /><i className="active" style={{ '--height': '92%' }} /></div></div><div className="mono-chart-axis"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span><span>07</span></div><div className="mono-chart-foot"><span>Voice / Audience / Rules</span><span>↑ +12%</span></div></div>
      </Reveal>

      <section id="workflow" className="mono-workflow-section"><Reveal className="mono-section-heading"><span className="mono-label">The workflow</span><h2>From blank page<br />to <em>clear move.</em></h2></Reveal><div className="mono-workflow-grid"><Reveal className="mono-workflow-item"><span className="mono-step">01</span><FileText size={19} /><h3>Context</h3><p>Upload your brand doc or set the signal with a focused quick form.</p></Reveal><Reveal className="mono-workflow-item"><span className="mono-step">02</span><WandSparkles size={19} /><h3>Direction</h3><p>Give the idea an audience, an objective, and a reason to exist.</p></Reveal><Reveal className="mono-workflow-item"><span className="mono-step">03</span><Gauge size={19} /><h3>Validation</h3><p>Review strategy, content, visuals, and compliance in one clean view.</p></Reveal></div></section>

      <Reveal className="mono-proof-section"><div className="mono-proof-copy"><span className="mono-label">Less prompting. More point of view.</span><h2>Stop asking AI<br />to <em>guess.</em></h2><p>BrandFlow turns the invisible rules behind your best work into a usable creative system.</p></div><div className="mono-proof-list"><div><span>01</span><p>Brand context travels with every brief.</p><Check size={16} /></div><div><span>02</span><p>Every output gets a strategic reason.</p><Check size={16} /></div><div><span>03</span><p>Validation happens before launch day.</p><Check size={16} /></div></div></Reveal>

      <section id="start" className="mono-auth-section"><div className="mono-auth-copy"><span className="mono-label"><Sparkles size={12} /> Workspace access</span><h2>Make the next<br /><em>move obvious.</em></h2><p>Your campaign studio is ready when you are.</p><div className="mono-auth-note"><ShieldCheck size={16} /><span>Context-aware by default.<br />Quietly powerful by design.</span></div></div><div className="mono-auth-panel"><div className="mono-auth-panel-top"><span>BF</span><span>01 / access</span></div><AuthPage onAuth={onAuth} /></div></section>

      <footer className="mono-footer"><span className="mono-brand"><span className="mono-brand-mark">B</span>BrandFlow</span><span>Creative operations, with a point of view.</span><span>© {new Date().getFullYear()}</span></footer>
    </main>
  )
}

function Preloader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDone(true); return undefined }
    const start = performance.now(); let frame = 0
    const tick = (now) => { const next = Math.min(100, Math.round((now - start) / 6.6)); setProgress(next); if (next < 100) frame = requestAnimationFrame(tick); else window.setTimeout(() => setDone(true), 110) }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])
  if (done) return null
  return <div className="mono-preloader" role="status" aria-live="polite"><div className="mono-preloader-top"><span>BF / 001</span><span>BrandFlow</span></div><div className="mono-preloader-count">{String(progress).padStart(2, '0')}<sup>%</sup></div><div className="mono-preloader-bottom"><span>Loading the signal</span><span className="mono-preloader-line"><i style={{ transform: `scaleX(${progress / 100})` }} /></span></div></div>
}

function Reveal({ children, className = '', id }) {
  const ref = useRef(null)
  useEffect(() => { const element = ref.current; if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { element?.classList.add('is-visible'); return undefined }; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { element.classList.add('is-visible'); observer.disconnect() } }, { threshold: .12 }); observer.observe(element); return () => observer.disconnect() }, [])
  return <section id={id} ref={ref} className={`mono-reveal ${className}`}>{children}</section>
}
