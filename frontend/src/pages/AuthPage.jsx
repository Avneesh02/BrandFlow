import { useState } from 'react'
import { ArrowRight, Check, LockKeyhole, Sparkles } from 'lucide-react'
import { login, register, formatApiError } from '../api/client'
import Reveal from '../components/Reveal'

const proofPoints = [
  'Turn a brief into a complete campaign system',
  'Keep every idea aligned to your brand context',
  'Validate before anything leaves the workspace',
]

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        await register(email, password, company)
      }
      await login(email, password)
      onAuth()
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const isRegister = mode === 'register'

  return (
    <main className="auth-layout">
      <section className="auth-showcase" aria-labelledby="welcome-heading">
        <div className="auth-showcase-inner">
          <div className="brand brand-static">
            <span className="brand-mark">B</span>
            <span>BrandFlow</span>
          </div>

          <div className="showcase-copy">
            <Reveal>
              <p className="eyebrow eyebrow-light"><Sparkles size={14} /> AI campaign direction</p>
              <h1 id="welcome-heading">Make the next<br /><em>move</em> make sense.</h1>
              <p className="showcase-intro">BrandFlow turns sharp thinking into on-brand campaigns your team can actually ship.</p>
            </Reveal>
          </div>

          <Reveal className="showcase-proof" delay={100}>
            <p className="proof-label">A clearer path from insight to output</p>
            <ul>
              {proofPoints.map((point) => (
                <li key={point}><span className="proof-icon"><Check size={13} /></span>{point}</li>
              ))}
            </ul>
          </Reveal>

          <div className="showcase-footer">
            <span>Brand intelligence, in flow.</span>
            <span className="showcase-index">01 / 01</span>
          </div>
        </div>
      </section>

      <section className="auth-panel" aria-label={isRegister ? 'Create your BrandFlow account' : 'Log in to BrandFlow'}>
        <div className="auth-panel-inner">
          <div className="mobile-brand brand">
            <span className="brand-mark">B</span>
            <span>BrandFlow</span>
          </div>

          <div className="auth-heading">
            <p className="eyebrow">Workspace access</p>
            <h2>{isRegister ? 'Start with a clear brief.' : 'Welcome back.'}</h2>
            <p>{isRegister ? 'Create your workspace and make your brand context useful.' : 'Pick up where your best campaign thinking left off.'}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="field-label">
                Company <span className="field-optional">Optional</span>
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company name" autoComplete="organization" />
              </label>
            )}
            <label className="field-label">
              Email address
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required autoComplete="email" />
            </label>
            <label className="field-label">
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8} autoComplete={isRegister ? 'new-password' : 'current-password'} />
            </label>

            {error && <p className="notice notice-error" role="alert">{error}</p>}

            <button className="button button-primary button-full button-arrow" type="submit" disabled={loading}>
              <span>{loading ? 'Working…' : isRegister ? 'Create workspace' : 'Enter workspace'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="auth-security"><LockKeyhole size={14} /> Your workspace is private by default.</div>

          <button className="auth-toggle" type="button" onClick={() => { setMode(isRegister ? 'login' : 'register'); setError('') }}>
            {isRegister ? 'Already have an account? Log in' : 'Need an account? Create one'}
          </button>
        </div>
      </section>
    </main>
  )
}
