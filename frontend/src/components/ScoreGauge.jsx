const RADIUS = 40
const HALF_CIRCUMFERENCE = Math.PI * RADIUS

export default function ScoreGauge({ score, max = 10 }) {
  const pending = score == null
  const clamped = pending ? 0 : Math.max(0, Math.min(max, score))
  const fraction = clamped / max
  const dash = fraction * HALF_CIRCUMFERENCE
  const tone = pending ? 'is-pending' : fraction >= 0.7 ? 'is-pass' : 'is-fail'

  return (
    <div className={`score-gauge ${tone}`}>
      <svg viewBox="0 0 100 56" className="score-gauge-svg">
        <path className="score-gauge-track" d="M 8 50 A 42 42 0 0 1 92 50" />
        <path
          className="score-gauge-value"
          d="M 8 50 A 42 42 0 0 1 92 50"
          strokeDasharray={`${dash} ${HALF_CIRCUMFERENCE}`}
        />
      </svg>
      <div className="score-gauge-label">
        <strong>{pending ? '—' : clamped}</strong>
        <span>/ {max}</span>
      </div>
    </div>
  )
}
