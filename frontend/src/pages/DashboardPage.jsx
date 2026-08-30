import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Clock3, Plus, RefreshCw, Search, ShieldAlert, Sparkles } from 'lucide-react'
import { formatApiError, listCampaigns } from '../api/client'
import Reveal from '../components/Reveal'

const statusLabels = { draft: 'Draft', approved: 'Approved', rejected: 'Rejected' }

export default function DashboardPage({ onCreateCampaign, onOpenCampaign }) {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  async function loadCampaigns() {
    setError('')
    setLoading(true)
    try {
      setCampaigns(await listCampaigns())
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCampaigns() }, [])

  const visibleCampaigns = useMemo(
    () => filter === 'all' ? campaigns : campaigns.filter((item) => item.status === filter),
    [campaigns, filter],
  )
  const counts = campaigns.reduce((total, item) => ({ ...total, [item.status]: (total[item.status] || 0) + 1 }), {})

  return (
    <main className="dashboard" aria-labelledby="dashboard-heading">
      <Reveal className="dashboard-hero">
        <div className="hero-copy">
          <p className="eyebrow">Campaign workspace <span className="eyebrow-rule" /></p>
          <h1 id="dashboard-heading">Make the next<br /><em>move matter.</em></h1>
          <p>One clear brief in. Thoughtful, on-brand campaign systems out.</p>
        </div>
        <button className="button button-lime button-arrow hero-cta" type="button" onClick={onCreateCampaign}><span>Bring it to life</span><Plus size={17} /></button>
        <div className="hero-stamp" aria-hidden="true"><Sparkles size={15} /><span>01</span></div>
      </Reveal>

      <Reveal className="metric-grid" delay={70}>
        <Metric label="Total campaigns" value={campaigns.length} icon={Search} />
        <Metric label="Drafts" value={counts.draft || 0} icon={Clock3} tone="draft" />
        <Metric label="Approved" value={counts.approved || 0} icon={CheckCircle2} tone="approved" />
        <Metric label="Needs review" value={counts.rejected || 0} icon={ShieldAlert} tone="rejected" />
      </Reveal>

      <Reveal className="campaign-library" delay={120}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workspace library</p>
            <h2 id="campaign-library-heading">Campaigns in motion <span className="heading-count">{campaigns.length.toString().padStart(2, '0')}</span></h2>
          </div>
          <div className="library-actions">
            <label className="sr-only" htmlFor="campaign-filter">Filter campaigns</label>
            <select id="campaign-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="button button-quiet" type="button" onClick={loadCampaigns} disabled={loading}>
              <RefreshCw size={15} className={loading ? 'spin' : ''} /> <span>{loading ? 'Refreshing…' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {error && <p className="notice notice-error" role="alert">{error}</p>}
        {loading ? (
          <div className="empty-state loading-state"><span className="loading-line" /><span className="loading-line loading-line-short" /><span className="loading-line loading-line-short" /></div>
        ) : visibleCampaigns.length === 0 ? (
          <div className="empty-state empty-card">
            <span className="empty-icon"><Sparkles size={18} /></span>
            <h3>{campaigns.length ? 'No campaigns match this filter' : 'Your next campaign starts here'}</h3>
            <p>{campaigns.length ? 'Choose another status to see more work.' : 'Give BrandFlow a brief and turn a good idea into a campaign system.'}</p>
            {!campaigns.length && <button className="button button-primary button-arrow" type="button" onClick={onCreateCampaign}><span>Start a campaign</span><ArrowRight size={16} /></button>}
          </div>
        ) : (
          <div className="campaign-grid">
            {visibleCampaigns.map((campaign, index) => (
              <Reveal key={campaign.id} delay={Math.min(index * 45, 180)}>
                <article className="campaign-card">
                  <div className="campaign-card-topline">
                    <span className={`status status-${campaign.status}`}>{statusLabels[campaign.status] || campaign.status}</span>
                    {campaign.used_rag && <span className="context-tag">Brand context</span>}
                  </div>
                  <h3>{campaign.product}</h3>
                  <p className="campaign-objective">{campaign.objective}</p>
                  <dl className="campaign-details">
                    <div><dt>Audience</dt><dd>{campaign.audience}</dd></div>
                    <div><dt>Channel</dt><dd>{campaign.platform}</dd></div>
                    <div><dt>Tone</dt><dd>{campaign.tone}</dd></div>
                  </dl>
                  <div className="campaign-card-footer">
                    <span className={`verdict verdict-${campaign.validation_result?.final_verdict || 'unknown'}`}>
                      {campaign.validation_result?.final_verdict === 'pass' ? 'Validation passed' : campaign.validation_result?.final_verdict === 'fail' ? 'Validation flagged' : 'Validation pending'}
                    </span>
                    <button className="text-button" type="button" onClick={() => onOpenCampaign(campaign)}>Open <ArrowRight size={14} /></button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </Reveal>
    </main>
  )
}

function Metric({ label, value, icon: Icon, tone }) {
  return (
    <div className={`metric-card ${tone ? `metric-${tone}` : ''}`}>
      <div className="metric-topline"><span>{label}</span><Icon size={16} /></div>
      <strong>{value.toString().padStart(2, '0')}</strong>
    </div>
  )
}
