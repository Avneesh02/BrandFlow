import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, FileText, FormInput, SkipForward, UploadCloud } from 'lucide-react'
import { submitQuickBrand, uploadPdf, formatApiError } from '../api/client'
import Reveal from './Reveal'

export default function BrandContextForm({ onDone, onSkip, onCancel, isRevisit = false }) {
  // No default mode is pre-selected — the user explicitly picks how they
  // want to add brand context every single time this screen is shown,
  // whether that's the first login or before a later campaign.
  const [mode, setMode] = useState(null) // pdf | quick | skip | null
  const [file, setFile] = useState(null)
  const [tone, setTone] = useState('')
  const [dos, setDos] = useState('')
  const [donts, setDonts] = useState('')
  const [audienceNotes, setAudienceNotes] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      if (mode === 'pdf') {
        if (!file) {
          setMsg('Pick a PDF first')
          return
        }
        const res = await uploadPdf(file)
        setMsg(res.message)
      } else if (mode === 'quick') {
        const res = await submitQuickBrand({
          tone,
          dos,
          donts,
          audience_notes: audienceNotes || null,
        })
        setMsg(res.message)
      }
      onDone()
    } catch (err) {
      setMsg(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const options = [
    { id: 'pdf', icon: UploadCloud, title: 'Upload a brand doc', detail: 'Let BrandFlow learn from your existing guidelines.' },
    { id: 'quick', icon: FormInput, title: 'Use a quick brief', detail: 'Set the essentials in under two minutes.' },
    { id: 'skip', icon: SkipForward, title: 'Start from a blank slate', detail: 'No context yet? You can add it later.' },
  ]

  return (
    <main className="onboarding-page" aria-labelledby="brand-context-heading">
      <div className="onboarding-orbit" aria-hidden="true" />
      {isRevisit && onCancel && (
        <button className="text-button back-link" type="button" onClick={onCancel}><ArrowLeft size={15} /> Back to dashboard</button>
      )}
      <Reveal className="onboarding-heading">
        <p className="eyebrow">{isRevisit ? 'Update your brand context' : 'First, a little context'}</p>
        <h1 id="brand-context-heading">Give your ideas<br /><em>somewhere to land.</em></h1>
        <p>
          {isRevisit
            ? 'Switch how BrandFlow learns your brand — upload a fresh PDF, write a quick brief, or skip for this round.'
            : 'BrandFlow uses your point of view to make every generated campaign feel like it belongs to you.'}
        </p>
      </Reveal>

      <Reveal className="context-card" delay={80}>
        <div className="context-card-topline">
          <span className="step-count">01 <span>/ 01</span></span>
          <span className="context-note"><Check size={13} /> Private to your workspace</span>
        </div>
        <div className="mode-grid" role="radiogroup" aria-label="Choose how to add brand context">
          {options.map(({ id, icon: Icon, title, detail }) => (
            <button
              className={`mode-card ${mode === id ? 'is-selected' : ''}`}
              type="button"
              role="radio"
              aria-checked={mode === id}
              key={id}
              onClick={() => { setMode(id); setMsg('') }}
            >
              <span className="mode-icon"><Icon size={19} /></span>
              <span className="mode-copy"><strong>{title}</strong><small>{detail}</small></span>
              <span className="mode-radio" aria-hidden="true">{mode === id && <span />}</span>
            </button>
          ))}
        </div>

        {mode === null && (
          <p className="mode-placeholder-hint">Pick one of the options above to continue.</p>
        )}

        {mode === 'skip' && (
          <div className="context-action-row">
            <div><strong>That’s okay for now.</strong><p>You can refine your brand context whenever you’re ready.</p></div>
            <button className="button button-primary button-arrow" type="button" onClick={onSkip}><span>Continue</span><ArrowRight size={16} /></button>
          </div>
        )}

        {(mode === 'pdf' || mode === 'quick') && (
          <form className="context-form" onSubmit={handleSubmit}>
            {mode === 'pdf' && (
              <label className={`file-drop ${file ? 'has-file' : ''}`} htmlFor="brand-pdf">
                <input id="brand-pdf" className="sr-only" type="file" accept=".pdf,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <span className="file-drop-icon">{file ? <FileText size={22} /> : <UploadCloud size={22} />}</span>
                <span><strong>{file ? file.name : 'Choose a PDF to upload'}</strong><small>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Ready to upload` : 'PDF only · Brand guidelines, messaging, or a brief'}</small></span>
                <span className="file-drop-action">{file ? 'Change file' : 'Browse'}</span>
              </label>
            )}
            {mode === 'quick' && (
              <div className="quick-form-grid">
                <label className="field-label form-wide">Brand tone<input placeholder="e.g. Direct, warm, optimistic" value={tone} onChange={(e) => setTone(e.target.value)} required /></label>
                <label className="field-label"><span>Do’s</span><textarea placeholder="What should every message lean into?" value={dos} onChange={(e) => setDos(e.target.value)} required /></label>
                <label className="field-label"><span>Don’ts</span><textarea placeholder="What should every message avoid?" value={donts} onChange={(e) => setDonts(e.target.value)} required /></label>
                <label className="field-label form-wide"><span>Audience notes <span className="field-optional">Optional</span></span><textarea placeholder="Anything useful about who you’re speaking to?" value={audienceNotes} onChange={(e) => setAudienceNotes(e.target.value)} /></label>
              </div>
            )}
            {msg && <p className="notice notice-error" role="alert">{msg}</p>}
            <div className="context-submit-row">
              <p>We’ll use this context to ground your generated work.</p>
              <button className="button button-primary button-arrow" type="submit" disabled={loading}><span>{loading ? 'Saving…' : 'Save context'}</span><ArrowRight size={16} /></button>
            </div>
          </form>
        )}
        {mode === 'skip' && msg && <p className="notice notice-error" role="alert">{msg}</p>}
      </Reveal>
      <p className="onboarding-footnote">You’re in control. Brand context can be changed later.</p>
    </main>
  )
}
