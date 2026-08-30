import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Lightbulb, UploadCloud, WandSparkles } from 'lucide-react'
import { generateCampaign, formatApiError } from '../api/client'
import CampaignResult from '../components/CampaignResult'
import Reveal from '../components/Reveal'

export default function CampaignPage({ initialCampaign, onBack, onCampaignGenerated, onUpdateBrandContext }) {
  const [product, setProduct] = useState('')
  const [audience, setAudience] = useState('')
  const [objective, setObjective] = useState('')
  const [platform, setPlatform] = useState('Instagram')
  const [tone, setTone] = useState('Professional')
  const [extra, setExtra] = useState('')
  const [result, setResult] = useState(initialCampaign || null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { setResult(initialCampaign || null) }, [initialCampaign])

  async function handleGenerate(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await generateCampaign({
        product,
        audience,
        objective,
        platform,
        tone,
        additional_requirements: extra || null,
      })
      setResult(data)
      onCampaignGenerated?.(data)
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="campaign-page" aria-labelledby="campaign-heading">
      <div className="campaign-page-toprow">
        <button className="text-button back-link" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to library</button>
        {onUpdateBrandContext && (
          <button className="text-button" type="button" onClick={onUpdateBrandContext}>
            <UploadCloud size={15} /> Update brand context
          </button>
        )}
      </div>
      <Reveal className="page-heading">
        <div>
          <p className="eyebrow">Campaign studio <span className="eyebrow-rule" /></p>
          <h1 id="campaign-heading">Bring your campaign<br /><em>to life.</em></h1>
          <p>Tell us what you’re moving, who it’s for, and where it needs to land.</p>
        </div>
        <div className="heading-note"><Lightbulb size={17} /><span>Specific briefs make<br />stronger work.</span></div>
      </Reveal>

      <Reveal className="campaign-form-wrap" delay={80}>
        <div className="form-topline"><span className="step-count">Campaign brief <span>/ 01</span></span><span>All fields marked by context matter</span></div>
        <form className="campaign-form" onSubmit={handleGenerate}>
          <label className="field-label">Product or offer<input placeholder="e.g. Hydration supplement" value={product} onChange={(e) => setProduct(e.target.value)} required /></label>
          <label className="field-label">Audience<input placeholder="e.g. Busy professionals" value={audience} onChange={(e) => setAudience(e.target.value)} required /></label>
          <label className="field-label form-wide">Objective<input placeholder="e.g. Drive product discovery" value={objective} onChange={(e) => setObjective(e.target.value)} required /></label>
          <label className="field-label">Platform<input placeholder="e.g. Instagram" value={platform} onChange={(e) => setPlatform(e.target.value)} required /></label>
          <label className="field-label">Tone<input placeholder="e.g. Professional" value={tone} onChange={(e) => setTone(e.target.value)} required /></label>
          <label className="field-label form-wide">Additional requirements <span className="field-optional">Optional</span><textarea placeholder="Add calls to action, constraints, proof points, or anything else we should know." value={extra} onChange={(e) => setExtra(e.target.value)} /></label>
          {error && <p className="notice notice-error form-wide" role="alert">{error}</p>}
          <div className="form-submit-row form-wide">
            <p><WandSparkles size={15} /> BrandFlow will generate strategy, content, creative direction, and validation.</p>
            <button className="button button-primary button-arrow" type="submit" disabled={loading} aria-busy={loading}><span>{loading ? 'Crafting your campaign…' : 'Create campaign'}</span><ArrowRight size={17} /></button>
          </div>
        </form>
      </Reveal>

      {result && <Reveal className="result-reveal" delay={100}><CampaignResult campaign={result} onUpdate={setResult} /></Reveal>}
    </main>
  )
}
