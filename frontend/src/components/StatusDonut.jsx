const SEGMENTS = [
  { key: 'approved', label: 'Approved', color: 'var(--success)' },
  { key: 'draft', label: 'Draft', color: 'var(--mid)' },
  { key: 'rejected', label: 'Needs review', color: 'var(--danger)' },
]

const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function StatusDonut({ counts = {}, total = 0 }) {
  let offsetAccumulator = 0

  return (
    <div className="status-donut" role="img" aria-label={`Campaign status breakdown: ${total} total campaigns`}>
      <svg viewBox="0 0 100 100" className="status-donut-svg">
        <circle className="status-donut-track" cx="50" cy="50" r={RADIUS} />
        {total > 0 &&
          SEGMENTS.map(({ key, color }) => {
            const value = counts[key] || 0
            const fraction = value / total
            const dash = fraction * CIRCUMFERENCE
            const gap = CIRCUMFERENCE - dash
            const offset = -offsetAccumulator
            offsetAccumulator += dash
            if (value === 0) return null
            return (
              <circle
                key={key}
                className="status-donut-segment"
                cx="50"
                cy="50"
                r={RADIUS}
                stroke={color}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
              />
            )
          })}
      </svg>
      <div className="status-donut-center">
        <strong>{total}</strong>
        <span>total</span>
      </div>
    </div>
  )
}

export { SEGMENTS }
