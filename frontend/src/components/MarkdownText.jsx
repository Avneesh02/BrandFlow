// Small, dependency-free markdown renderer for the AI-generated content blocks.
// Supports: #/##/### headers, **bold**, *italic*/_italic_, `code`,
// - / * bullet lists, 1. numbered lists, and GFM-style pipe tables.
// Anything it doesn't recognise is rendered as a plain paragraph, so it
// never throws on unexpected content.

function renderInline(text, keyPrefix) {
  if (text == null) return null
  const nodes = []
  // Split on bold, italic, and inline-code markers while keeping the markers
  // so we can tell what matched.
  const pattern = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g
  const parts = String(text).split(pattern)
  parts.forEach((part, i) => {
    if (!part) return
    const id = `${keyPrefix}-${i}`
    if (/^\*\*[^*]+\*\*$/.test(part) || /^__[^_]+__$/.test(part)) {
      nodes.push(<strong key={id}>{part.slice(2, -2)}</strong>)
    } else if (/^`[^`]+`$/.test(part)) {
      nodes.push(<code key={id}>{part.slice(1, -1)}</code>)
    } else if (/^\*[^*]+\*$/.test(part) || /^_[^_]+_$/.test(part)) {
      nodes.push(<em key={id}>{part.slice(1, -1)}</em>)
    } else {
      nodes.push(part)
    }
  })
  return nodes
}

function isTableSeparator(line) {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line)
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

export default function MarkdownText({ text, className }) {
  if (text == null || text === '') return null
  const lines = String(text).replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let i = 0
  let listBuffer = null // { type: 'ul' | 'ol', items: [] }

  function flushList() {
    if (listBuffer) {
      blocks.push(listBuffer)
      listBuffer = null
    }
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '') {
      flushList()
      i += 1
      continue
    }

    // Headers
    const headerMatch = /^(#{1,4})\s+(.*)$/.exec(trimmed)
    if (headerMatch) {
      flushList()
      blocks.push({ type: 'heading', level: headerMatch[1].length, text: headerMatch[2] })
      i += 1
      continue
    }

    // Tables: a row followed by a separator row
    if (trimmed.includes('|') && lines[i + 1] && isTableSeparator(lines[i + 1])) {
      flushList()
      const header = splitTableRow(trimmed)
      const rows = []
      i += 2
      while (i < lines.length && lines[i].trim().includes('|')) {
        rows.push(splitTableRow(lines[i]))
        i += 1
      }
      blocks.push({ type: 'table', header, rows })
      continue
    }

    // Bullet list
    const bulletMatch = /^[-*]\s+(.*)$/.exec(trimmed)
    if (bulletMatch) {
      if (!listBuffer || listBuffer.type !== 'ul') {
        flushList()
        listBuffer = { type: 'ul', items: [] }
      }
      listBuffer.items.push(bulletMatch[1])
      i += 1
      continue
    }

    // Numbered list
    const numberedMatch = /^\d+[.)]\s+(.*)$/.exec(trimmed)
    if (numberedMatch) {
      if (!listBuffer || listBuffer.type !== 'ol') {
        flushList()
        listBuffer = { type: 'ol', items: [] }
      }
      listBuffer.items.push(numberedMatch[1])
      i += 1
      continue
    }

    // Paragraph — gather consecutive plain lines together
    flushList()
    const paraLines = [trimmed]
    i += 1
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,4})\s+/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+[.)]\s+/.test(lines[i].trim()) &&
      !(lines[i].includes('|') && lines[i + 1] && isTableSeparator(lines[i + 1]))
    ) {
      paraLines.push(lines[i].trim())
      i += 1
    }
    blocks.push({ type: 'paragraph', text: paraLines.join(' ') })
  }
  flushList()

  const HeadingTag = { 1: 'h4', 2: 'h4', 3: 'h5', 4: 'h5' }

  return (
    <div className={`markdown-body ${className || ''}`}>
      {blocks.map((block, idx) => {
        const key = `md-${idx}`
        if (block.type === 'heading') {
          const Tag = HeadingTag[block.level] || 'h5'
          return <Tag key={key}>{renderInline(block.text, key)}</Tag>
        }
        if (block.type === 'paragraph') {
          return <p key={key}>{renderInline(block.text, key)}</p>
        }
        if (block.type === 'ul') {
          return (
            <ul key={key}>
              {block.items.map((item, li) => <li key={`${key}-${li}`}>{renderInline(item, `${key}-${li}`)}</li>)}
            </ul>
          )
        }
        if (block.type === 'ol') {
          return (
            <ol key={key}>
              {block.items.map((item, li) => <li key={`${key}-${li}`}>{renderInline(item, `${key}-${li}`)}</li>)}
            </ol>
          )
        }
        if (block.type === 'table') {
          return (
            <div className="markdown-table-wrap" key={key}>
              <table>
                <thead>
                  <tr>{block.header.map((cell, ci) => <th key={`${key}-h-${ci}`}>{renderInline(cell, `${key}-h-${ci}`)}</th>)}</tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ri) => (
                    <tr key={`${key}-r-${ri}`}>
                      {row.map((cell, ci) => <td key={`${key}-r-${ri}-${ci}`}>{renderInline(cell, `${key}-r-${ri}-${ci}`)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
