import { useState } from 'react'
import {
  ArrowRight, ArrowUpRight, BadgeCheck, BarChart3, Calendar, Check, CheckCircle2, CircleAlert,
  Clapperboard, Dna, FileCheck2, FileText, Hash, Image as ImageIcon, Layers3, Megaphone,
  MessageSquareQuote, MousePointerClick, Palette, Pencil, RefreshCw, ShieldAlert, ShieldCheck,
  Smartphone, Wallet, X,
} from 'lucide-react'
import { generateCampaign, updateCampaignContent, updateCampaignStatus, formatApiError } from '../api/client'
import MarkdownText from './MarkdownText'

export default function CampaignResult({ campaign, onUpdate }) {
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const [editingContent, setEditingContent] = useState(null)

  async function setStatus(newStatus) {
    setBusy(true)
    setActionError('')
    try {
      const updated = await updateCampaignStatus(campaign.id, newStatus)
      // PATCH returns full CampaignOut — merge to preserve creative_assets etc.
      onUpdate({ ...campaign, ...updated })
    } catch (err) {
      setActionError(formatApiError(err))
    } finally {
      setBusy(false)
    }
  }

  async function regenerate() {
    setBusy(true)
    setActionError('')
    try {
      const data = await generateCampaign({
        product: campaign.product,
        audience: campaign.audience,
        objective: campaign.objective,
        platform: campaign.platform,
        tone: campaign.tone,
        additional_requirements: campaign.additional_requirements,
        skip_cache: true,
      })
      onUpdate(data)
    } catch (err) {
      setActionError(formatApiError(err))
    } finally {
      setBusy(false)
    }
  }

  function startEditingContent() {
    setActionError('')
    setEditingContent(JSON.parse(JSON.stringify(campaign.content || {})))
  }

  function cancelEditingContent() {
    setEditingContent(null)
    setActionError('')
  }

  function changeContent(key, index, value) {
    setEditingContent((current) => ({
      ...current,
      [key]: Array.isArray(current[key])
        ? current[key].map((item, itemIndex) => itemIndex === index ? value : item)
        : value,
    }))
  }

  async function saveAndValidateContent() {
    setBusy(true)
    setActionError('')
    try {
      const updated = await updateCampaignContent(campaign.id, editingContent)
      onUpdate({ ...campaign, ...updated })
      setEditingContent(null)
    } catch (err) {
      setActionError(formatApiError(err))
    } finally {
      setBusy(false)
    }
  }

  const validation = campaign.validation_result || {}
  const image = campaign.creative_assets?.image || {}
  const storyboard = campaign.creative_assets?.video_storyboard
  const strategyEntries = campaign.strategy ? Object.entries(campaign.strategy) : []
  const contentEntries = (editingContent || campaign.content) ? Object.entries(editingContent || campaign.content) : []

  return (
    <section className="result-shell" aria-labelledby="result-heading">
      <div className="result-heading">
        <div>
          <p className="eyebrow">Generated output <span className="eyebrow-rule" /></p>
          <h2 id="result-heading">A campaign with<br /><em>somewhere to go.</em></h2>
        </div>
        <span className="result-id">BF / {String(campaign.id).padStart(4, '0')}</span>
      </div>

      <div className="result-status-bar">
        <div className="result-status-group">
          <span className={`status status-${campaign.status}`}>{campaign.status}</span>
          {campaign.cached && <span className="context-tag">Cached result</span>}
          <span className={`rag-tag ${campaign.used_rag ? 'is-active' : ''}`}>{campaign.used_rag ? 'Brand context active' : 'No brand context'}</span>
        </div>
        <span className="result-status-copy">{campaign.used_rag ? 'Grounded in your brand system' : 'Generated from your campaign brief'}</span>
      </div>

      {actionError && <p className="notice notice-error" role="alert">{actionError}</p>}

      <div className="result-actions" aria-label="Campaign actions">
        <button className="button button-action button-approve" disabled={busy || campaign.status === 'approved'} onClick={() => setStatus('approved')}><Check size={15} /> {busy ? 'Working…' : 'Approve'}</button>
        <button className="button button-action button-draft" disabled={busy || campaign.status === 'draft'} onClick={() => setStatus('draft')}><Pencil size={14} /> Mark draft</button>
        <button className="button button-action button-regenerate" disabled={busy} onClick={regenerate}><RefreshCw size={14} className={busy ? 'spin' : ''} /> Regenerate</button>
        <button className="button button-action button-reject" disabled={busy || campaign.status === 'rejected'} onClick={() => setStatus('rejected')}><X size={15} /> Reject</button>
      </div>

      <section className="result-card creative-card">
        <SectionHeading icon={ImageIcon} label="Creative image" detail="Visual direction" />
        {image.status === 'ok' && image.url ? (
          <figure className="creative-figure">
            <img src={image.url} alt="Generated campaign visual" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            <figcaption><span>Generated campaign visual</span><a href={image.url} target="_blank" rel="noopener noreferrer">Open full image <ArrowUpRight size={13} /></a></figcaption>
          </figure>
        ) : (
          <div className="result-empty"><ImageIcon size={18} /><p>Image {image.status === 'unavailable' ? 'unavailable (Pollinations timeout)' : image.error || 'not generated'}</p></div>
        )}
      </section>

      <div className="result-columns">
        <section className="result-card strategy-card">
          <SectionHeading icon={BadgeCheck} label="Strategy" detail="The thinking behind the work" />
          <div className="strategy-list">
            {strategyEntries.length ? strategyEntries.map(([key, value]) => (
              <div className="strategy-row" key={key}>
                <span>{formatKey(key)}</span>
                {typeof value === 'string' ? <MarkdownText className="strategy-value" text={value} /> : <strong>{formatValue(value)}</strong>}
              </div>
            )) : <p className="muted-copy">No strategy details were returned.</p>}
          </div>
        </section>

        <section className="result-card compliance-card">
          <SectionHeading icon={ShieldCheck} label="Validation" detail="Ready for a closer look" />
          <div className="validation-summary">
            <ValidationCheck label="Rule check" passed={validation.rule_check?.passed} detail={validation.rule_check?.violations?.length ? `${validation.rule_check.violations.length} violation${validation.rule_check.violations.length !== 1 ? 's' : ''}` : 'No pattern violations'} />
            <ValidationCheck label="LLM judge" passed={validation.llm_judge?.passed} detail={validation.llm_judge?.score != null ? `Score ${validation.llm_judge.score}/10` : 'Qualitative review'} />
            <div className={`final-verdict ${validation.final_verdict === 'pass' ? 'is-pass' : validation.final_verdict === 'fail' ? 'is-fail' : 'is-pending'}`}><span>Final verdict</span><strong>{validation.final_verdict?.toUpperCase() || 'PENDING'}</strong></div>
          </div>
          {validation.rule_check?.violations?.length > 0 && <div className="validation-issues"><strong>Rule check notes</strong><ul>{validation.rule_check.violations.map((violation, i) => <li key={i}>{violation.pattern}</li>)}</ul></div>}
          {validation.llm_judge?.issues?.length > 0 && <div className="validation-issues"><strong>Judge notes</strong><ul>{validation.llm_judge.issues.map((issue, i) => <li key={i}>{issue}</li>)}</ul></div>}
        </section>
      </div>

      <section className="result-card content-card">
        <div className="content-block-header">
          <SectionHeading icon={FileCheck2} label="Generated content" detail="Ready to adapt and ship" />
          {!editingContent ? (
            <button className="button button-action button-draft" type="button" disabled={busy || !contentEntries.length} onClick={startEditingContent}><Pencil size={14} /> Edit</button>
          ) : (
            <div className="result-actions" aria-label="Content editing actions">
              <button className="button button-action button-draft" type="button" disabled={busy} onClick={cancelEditingContent}>Cancel</button>
              <button className="button button-action button-approve" type="button" disabled={busy} onClick={saveAndValidateContent} aria-busy={busy}><Check size={15} /> {busy ? 'Saving…' : 'Save & Validate'}</button>
            </div>
          )}
        </div>
        <div className="content-list content-list-stacked">
          {contentEntries.length ? contentEntries.map(([key, value], index) => {
            const Icon = getContentIcon(key)
            return (
              <div className="content-block" key={key}>
                <div className="content-block-header">
                  <span className="content-block-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="content-block-icon"><Icon size={16} /></span>
                  <h3>{formatKey(key)}</h3>
                </div>
                {Array.isArray(value) ? (
                  <ul className="content-block-list">{value.map((item, i) => (
                    <li key={i}>{editingContent && typeof item === 'string' ? <label className="field-label"><textarea aria-label={`${formatKey(key)} ${i + 1}`} value={item} onChange={(event) => changeContent(key, i, event.target.value)} /></label> : typeof item === 'string' ? <MarkdownText text={item} /> : formatValue(item)}</li>
                  ))}</ul>
                ) : typeof value === 'string' ? (
                  editingContent ? <label className="field-label"><textarea aria-label={formatKey(key)} value={value} onChange={(event) => changeContent(key, null, event.target.value)} /></label> : <MarkdownText text={value} />
                ) : (
                  <p>{formatValue(value)}</p>
                )}
              </div>
            )
          }) : <p className="muted-copy">No generated content was returned.</p>}
        </div>
      </section>

      {storyboard && storyboard.scenes?.length > 0 && (
        <section className="result-card storyboard-card">
          <SectionHeading icon={Clapperboard} label={`Video storyboard — ${storyboard.title}`} detail={`${storyboard.scenes.length} scenes`} />
          <div className="storyboard-list">
            {storyboard.scenes.map((scene, index) => (
              <article className="scene" key={index}><span className="scene-number">{String(scene.scene_number).padStart(2, '0')}</span><div><h3>Scene {scene.scene_number}</h3><p><strong>Visual</strong>{scene.visual}</p><p><strong>Voiceover</strong>{scene.voiceover}</p></div><span className="scene-duration">{scene.duration_seconds}s</span></article>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}

function SectionHeading({ icon: Icon, label, detail }) {
  return <div className="result-section-heading"><span className="result-section-icon"><Icon size={16} /></span><div><h3>{label}</h3><p>{detail}</p></div></div>
}

function ValidationCheck({ label, passed, detail }) {
  const pending = passed == null
  return <div className={`validation-check ${pending ? 'is-pending' : passed ? 'is-pass' : 'is-fail'}`}><span className="validation-icon">{pending ? <CircleAlert size={16} /> : passed ? <CheckCircle2 size={16} /> : <CircleAlert size={16} />}</span><div><strong>{label}</strong><span>{pending ? 'Pending' : passed ? 'Passed' : 'Failed'} · {detail}</span></div></div>
}

const CONTENT_ICON_RULES = [
  [/overview|summary|brief/i, FileText],
  [/audience|demograph|persona/i, Dna],
  [/budget|cost|spend/i, Wallet],
  [/timeline|schedule|calendar|phase|week/i, Calendar],
  [/channel|platform|distribution/i, Smartphone],
  [/creative|visual|design|palette|mood/i, Palette],
  [/hashtag|tag/i, Hash],
  [/kpi|metric|measure|analytic/i, BarChart3],
  [/risk|caution|warning/i, ShieldAlert],
  [/message|caption|copy|quote|tagline/i, MessageSquareQuote],
  [/cta|call.to.action|action/i, MousePointerClick],
  [/promo|campaign|launch|announce/i, Megaphone],
]

function getContentIcon(key) {
  const match = CONTENT_ICON_RULES.find(([pattern]) => pattern.test(key))
  return match ? match[1] : Layers3
}

function formatKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatValue(value) {
  if (value == null) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
