import { useEffect, useState } from 'react'
import { ArrowLeft, LayoutDashboard, LogOut, Plus, UploadCloud } from 'lucide-react'
import { getMe, logout } from './api/client'
import AuthPage from './pages/AuthPage'
import BrandContextForm from './components/BrandContextForm'
import CampaignPage from './pages/CampaignPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  const [user, setUser] = useState(null)
  const [brandStepDone, setBrandStepDone] = useState(false)
  const [checking, setChecking] = useState(true)
  const [view, setView] = useState('dashboard')
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setChecking(false)
      return
    }
    getMe()
      .then(setUser)
      .catch(() => logout())
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return (
      <main className="loading-screen">
        <span className="loading-mark">B</span>
        <p>Opening your workspace<span className="loading-dots">...</span></p>
      </main>
    )
  }

  if (!user) {
    return <AuthPage onAuth={() => getMe().then(setUser)} />
  }

  function goToDashboard() {
    setView('dashboard')
    setSelectedCampaign(null)
  }

  function openBrandContext() {
    setView('brand-context')
  }

  function finishBrandContext() {
    setBrandStepDone(true)
    goToDashboard()
  }

  function handleLogout() {
    logout()
    setUser(null)
    setBrandStepDone(false)
    setSelectedCampaign(null)
    setView('dashboard')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="brand" type="button" onClick={goToDashboard} aria-label="Go to BrandFlow dashboard">
          <span className="brand-mark">B</span>
          <span>BrandFlow</span>
        </button>
        <nav className="app-nav" aria-label="Workspace navigation">
          <button className={`app-nav-link ${view === 'dashboard' ? 'is-active' : ''}`} type="button" onClick={goToDashboard}>
            <LayoutDashboard size={15} /> Overview
          </button>
          {brandStepDone && (
            <button className={`app-nav-link ${view === 'campaign' ? 'is-active' : ''}`} type="button" onClick={() => { setSelectedCampaign(null); setView('campaign') }}>
              <Plus size={15} /> New campaign
            </button>
          )}
          {brandStepDone && (
            <button className={`app-nav-link ${view === 'brand-context' ? 'is-active' : ''}`} type="button" onClick={openBrandContext}>
              <UploadCloud size={15} /> Brand context
            </button>
          )}
        </nav>
        <div className="account-actions">
          <span className="user-avatar" aria-hidden="true">{user.email?.[0]?.toUpperCase() || 'U'}</span>
          <span className="user-email">{user.email}</span>
          <button className="icon-button" type="button" onClick={handleLogout} aria-label="Log out" title="Log out"><LogOut size={16} /></button>
        </div>
      </header>

      <div className="app-content">
        {!brandStepDone && (
          <BrandContextForm
            onDone={finishBrandContext}
            onSkip={finishBrandContext}
          />
        )}

        {brandStepDone && view === 'brand-context' && (
          <BrandContextForm
            key="revisit"
            isRevisit
            onDone={finishBrandContext}
            onSkip={finishBrandContext}
            onCancel={goToDashboard}
          />
        )}

        {brandStepDone && view === 'dashboard' && (
          <DashboardPage
            onCreateCampaign={() => { setSelectedCampaign(null); setView('campaign') }}
            onOpenCampaign={(campaign) => { setSelectedCampaign(campaign); setView('campaign') }}
          />
        )}
        {brandStepDone && view === 'campaign' && (
          <CampaignPage
            initialCampaign={selectedCampaign}
            onBack={goToDashboard}
            onCampaignGenerated={setSelectedCampaign}
            onUpdateBrandContext={openBrandContext}
          />
        )}
      </div>

      <footer className="app-footer"><span>BrandFlow / Creative operations</span><span>Built for better next moves.</span></footer>
    </div>
  )
}

export default App
