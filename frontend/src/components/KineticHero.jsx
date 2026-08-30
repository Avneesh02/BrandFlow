import { useEffect, useRef } from 'react'
import { ArrowDownRight, Sparkles } from 'lucide-react'

export default function KineticHero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const root = heroRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(max-width: 620px)').matches) return undefined

    let frame = 0
    let pointerX = 0
    let pointerY = 0

    function handlePointerMove(event) {
      const bounds = root.getBoundingClientRect()
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12
      if (!frame) frame = requestAnimationFrame(() => {
        root.style.setProperty('--pointer-x', pointerX.toFixed(2))
        root.style.setProperty('--pointer-y', pointerY.toFixed(2))
        frame = 0
      })
    }

    function resetPointer() {
      root.style.setProperty('--pointer-x', '0')
      root.style.setProperty('--pointer-y', '0')
    }

    root.addEventListener('pointermove', handlePointerMove, { passive: true })
    root.addEventListener('pointerleave', resetPointer)
    return () => {
      root.removeEventListener('pointermove', handlePointerMove)
      root.removeEventListener('pointerleave', resetPointer)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="parallax kinetic-hero" ref={heroRef}>
      <section className="parallax__header" aria-labelledby="hero-title">
        <div className="parallax__visuals">
          <div className="parallax__grid" aria-hidden="true" />
          <div data-parallax-layers className="parallax__layers">
            <div data-parallax-layer="1" className="parallax__layer parallax__layer--back" aria-hidden="true">
              <div className="artifact-grid" />
              <span className="artifact-stamp">BF / 001</span>
              <span className="artifact-word">momentum</span>
            </div>
            <div data-parallax-layer="2" className="parallax__layer parallax__layer--middle" aria-hidden="true">
              <div className="campaign-card-art campaign-card-art--violet">
                <span className="mini-label">Campaign direction</span>
                <strong>Make the next<br />move obvious.</strong>
                <span className="mini-line" />
                <small>BrandFlow / creative system</small>
              </div>
              <div className="swatch-stack"><span /><span /><span /></div>
            </div>
            <div data-parallax-layer="3" className="parallax__layer parallax__layer--title">
              <span className="hero-kicker"><Sparkles size={12} /> AI campaign studio / 01</span>
              <h1 id="hero-title">Brand<span>Flow</span></h1>
              <p>Give every idea a point of view.</p>
            </div>
            <div data-parallax-layer="4" className="parallax__layer parallax__layer--front" aria-hidden="true">
              <div className="campaign-card-art campaign-card-art--lime">
                <span className="mini-label">Validation signal</span>
                <strong>Ready to<br />ship.</strong>
                <div className="signal-row"><i /><span>On-brand</span><b>98</b></div>
              </div>
            </div>
          </div>
          <div className="parallax__fade" />
        </div>
        <div className="parallax__header-copy">
          <div className="hero-intro">
            <span className="eyebrow eyebrow-light">A sharper way to go from brief to launch</span>
            <p>Brand context, creative direction, and validation in one focused flow.</p>
          </div>
          <div className="hero-scroll-note"><span className="scroll-dot" /> Native scroll, zero drag</div>
        </div>
      </section>
      <section className="parallax__content" aria-label="BrandFlow promise">
        <div className="parallax__content-mark">BF</div>
        <div><span className="eyebrow">From signal to story</span><p>Build campaigns that sound like you, faster.</p></div>
        <div className="hero-signal-graph" aria-label="Brand consistency score: 98 percent"><div className="hero-signal-bars"><i /><i /><i /><i /><i /></div><span>Brand consistency <strong>98%</strong></span></div>
        <ArrowDownRight className="content-arrow" size={22} aria-hidden="true" />
      </section>
    </div>
  )
}
