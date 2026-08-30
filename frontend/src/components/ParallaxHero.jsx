import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger)

export default function ParallaxHero() {
  const parallaxRef = useRef(null)

  useEffect(() => {
    const root = parallaxRef.current
    const triggerElement = root?.querySelector('[data-parallax-layers]')
    if (!root || !triggerElement) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compactViewport = window.matchMedia('(max-width: 620px)').matches
    let lenis
    let ticker

    const context = gsap.context(() => {
      if (!reducedMotion && !compactViewport) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: '0% 0%',
            end: '100% 0%',
            scrub: 0.25,
            invalidateOnRefresh: true,
          },
        })

        ;[
          { layer: '1', yPercent: 64 },
          { layer: '2', yPercent: 48 },
          { layer: '3', yPercent: 28 },
          { layer: '4', yPercent: 10 },
        ].forEach((layerObj, index) => {
          timeline.to(
            triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
            { yPercent: layerObj.yPercent, ease: 'none' },
            index === 0 ? undefined : '<',
          )
        })

        lenis = new Lenis({ smoothWheel: true, lerp: 0.12 })
        lenis.on('scroll', ScrollTrigger.update)
        ticker = (time) => lenis.raf(time * 1000)
        gsap.ticker.add(ticker)
      }
    }, root)

    return () => {
      if (ticker) gsap.ticker.remove(ticker)
      if (lenis) lenis.destroy()
      context.revert()
    }
  }, [])

  return (
    <div className="parallax" ref={parallaxRef}>
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
              <span className="hero-kicker">AI campaign studio / 01</span>
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
          <div className="hero-scroll-note"><span className="scroll-dot" /> Scroll to explore</div>
        </div>
      </section>
      <section className="parallax__content" aria-label="BrandFlow promise">
        <div className="parallax__content-mark">BF</div>
        <div><span className="eyebrow">From signal to story</span><p>Build campaigns that sound like you, faster.</p></div>
        <div className="hero-signal-graph" aria-label="Brand consistency score: 98 percent"><div className="hero-signal-bars"><i /><i /><i /><i /><i /></div><span>Brand consistency <strong>98%</strong></span></div>
        <span className="content-arrow" aria-hidden="true">↘</span>
      </section>
    </div>
  )
}
