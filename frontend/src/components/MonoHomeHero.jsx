import { ArrowDownRight, ArrowUpRight, CircleDot, MoveUpRight } from 'lucide-react'

export default function MonoHomeHero() {
  return (
    <section className="mono-hero" aria-labelledby="mono-hero-title">
      <div className="mono-hero-index">BF / 01<span>BrandFlow</span></div>
      <div className="mono-hero-main">
        <p className="mono-kicker"><CircleDot size={10} /> AI campaign studio</p>
        <h1 id="mono-hero-title">Make every<br /><span>idea</span> unmistakable.</h1>
        <div className="mono-hero-under"><p>Brand context, creative direction, and validation for teams that refuse to sound generic.</p><a className="mono-hero-link magnetic-link" href="#start">Enter the studio <ArrowUpRight size={14} /></a></div>
      </div>
      <div className="mono-hero-side"><span className="mono-side-label">Scroll to explore</span><ArrowDownRight size={22} /><span className="mono-side-count">01—05</span></div>
      <div className="mono-signal-art" aria-label="Brand signal visualization">
        <div className="mono-art-label">Signal / live</div>
        <div className="mono-art-bars"><i /><i /><i /><i className="active" /><i /><i /><i /><i /></div>
        <div className="mono-art-axis"><span>context</span><span>clarity</span><span>confidence</span></div>
        <div className="mono-art-corner">98<span>%</span></div>
      </div>
      <div className="mono-hero-footer"><span>Ideas in. Noise out.</span><span>Native scroll / refined motion</span><MoveUpRight size={15} /></div>
    </section>
  )
}
