import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { computeCandidates } from './solver/candidates'
import { boxOf, cellIndex, columnOf, emptyGrid, parseGridString, rowOf, setCellValue } from './solver/grid'
import { boxCells, columnCells, findConflictCells, rowCells, validateGrid } from './solver/houses'
import { findHints } from './solver/hints'
import type { CellIndex, Digit, Grid, HintStep, SavedPuzzle } from './solver/types'
import { DIGITS } from './solver/types'
import { gridFromSavedPuzzle, loadSavedPuzzles, makeSavedPuzzle, persistSavedPuzzles } from './storage/puzzles'
import { techniques } from './learn/techniques'
import { DIFFICULTIES, getRandomSample } from './samples'
import type { SampleDifficulty } from './samples'

type Theme = 'light' | 'dark'
type SpoilerLevel = 'nudge' | 'reasoning' | 'reveal'
type HintLevel = 'all' | 'basic' | 'intermediate' | 'advanced' | 'killer'

const hintLevelLabels: Record<HintLevel, string> = {
  all: 'All',
  basic: 'Basic',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  killer: 'Killer',
}

const hintLevelRank: Record<Exclude<HintLevel, 'all'>, number> = {
  basic: 1,
  intermediate: 2,
  advanced: 3,
  killer: 4,
}

function App() {
  const [grid, setGrid] = useState<Grid>(() => emptyGrid())
  const [selectedCell, setSelectedCell] = useState<CellIndex | null>(null)
  const [selectedHintId, setSelectedHintId] = useState<string | null>(null)
  const [spoilerLevel, setSpoilerLevel] = useState<SpoilerLevel>('nudge')
  const [savedPuzzles, setSavedPuzzles] = useState<SavedPuzzle[]>(() => loadSavedPuzzles())
  const [puzzleName, setPuzzleName] = useState('Untitled puzzle')
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('sudoku-tutor:theme') as Theme) || 'dark')
  const [showPeers, setShowPeers] = useState(true)
  const [showCandidates, setShowCandidates] = useState(true)
  const [importText, setImportText] = useState('')
  const [message, setMessage] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<SampleDifficulty>('Easy')
  const [hintLevel, setHintLevel] = useState<HintLevel>('all')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('sudoku-tutor:theme', theme)
  }, [theme])

  const candidates = useMemo(() => computeCandidates(grid), [grid])
  const hints = useMemo(() => findHints(grid), [grid])
  const visibleHints = useMemo(() => filterHintsByLevel(hints, hintLevel), [hints, hintLevel])
  const selectedHint = visibleHints.find((hint) => hint.id === selectedHintId) ?? null
  const errors = useMemo(() => validateGrid(grid), [grid])
  const conflictCells = useMemo(() => findConflictCells(grid), [grid])
  const isComplete = useMemo(() =>
    errors.length === 0 && grid.every((cell) => cell.value !== null),
  [grid, errors])

  const highlighted = useMemo(() => buildHighlights(selectedCell, selectedHint, showPeers), [selectedCell, selectedHint, showPeers])

  const updateCell = (index: CellIndex, value: Digit | null) => {
    setGrid((current) => setCellValue(current, index, value, value !== null))
    setSelectedHintId(null)
    setSpoilerLevel('nudge')
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedCell === null || isEditableTarget(event.target)) return

      if (/^[1-9]$/.test(event.key)) {
        event.preventDefault()
        updateCell(selectedCell, Number(event.key) as Digit)
        return
      }

      if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0' || event.key === '.') {
        event.preventDefault()
        updateCell(selectedCell, null)
        return
      }

      const isUp = event.key === 'ArrowUp' || event.key === 'k'
      const isDown = event.key === 'ArrowDown' || event.key === 'j'
      const isLeft = event.key === 'ArrowLeft' || event.key === 'h'
      const isRight = event.key === 'ArrowRight' || event.key === 'l'

      if (isUp || isDown || isLeft || isRight) {
        event.preventDefault()
        const row = rowOf(selectedCell)
        const column = columnOf(selectedCell)
        const nextRow = isUp ? Math.max(0, row - 1) : isDown ? Math.min(8, row + 1) : row
        const nextColumn = isLeft ? Math.max(0, column - 1) : isRight ? Math.min(8, column + 1) : column
        setSelectedCell(cellIndex(nextRow, nextColumn))
        return
      }

      if (event.key === 'Escape') {
        setSelectedHintId(null)
        setSpoilerLevel('nudge')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCell])

  const savePuzzle = () => {
    const saved = makeSavedPuzzle(puzzleName.trim() || 'Untitled puzzle', grid)
    const next = [saved, ...savedPuzzles]
    setSavedPuzzles(next)
    persistSavedPuzzles(next)
    setMessage(`Saved “${saved.name}”.`)
  }

  const loadPuzzle = (puzzle: SavedPuzzle) => {
    setGrid(gridFromSavedPuzzle(puzzle))
    setPuzzleName(puzzle.name)
    setSelectedCell(null)
    setSelectedHintId(null)
    setMessage(`Loaded “${puzzle.name}”.`)
  }

  const deletePuzzle = (id: string) => {
    const next = savedPuzzles.filter((puzzle) => puzzle.id !== id)
    setSavedPuzzles(next)
    persistSavedPuzzles(next)
  }

  const importPuzzle = () => {
    try {
      setGrid(parseGridString(importText))
      setSelectedHintId(null)
      setSelectedCell(null)
      setMessage('Imported puzzle string.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not import puzzle.')
    }
  }

  const loadSample = () => {
    const sample = getRandomSample(selectedDifficulty)
    setGrid(parseGridString(sample.grid))
    setPuzzleName(sample.name)
    setSelectedHintId(null)
    setSelectedCell(null)
    setMessage(`Loaded ${sample.difficulty.toLowerCase()} sample: ${sample.name}.`)
  }

  const selectedCandidates = selectedCell === null ? null : candidates.get(selectedCell)

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Sudoku Tutor</p>
          <h1>Learn the next move.</h1>
          <p className="lede">Enter a puzzle, compare hint options, and see the reasoning behind each step.</p>
        </div>
        <div className="header-actions">
          <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Light' : 'Dark'} mode
          </button>
          <div className="sample-loader">
            <label htmlFor="sample-select">Difficulty</label>
            <select id="sample-select" value={selectedDifficulty} onChange={(event) => setSelectedDifficulty(event.target.value as SampleDifficulty)}>
              {DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
            <button type="button" onClick={loadSample}>Load</button>
          </div>
          <button type="button" onClick={() => setGrid(emptyGrid())}>Clear</button>
        </div>
      </header>

      <section className="workspace">
        <section className="board-card" aria-label="Sudoku board">
          <div className="board-toolbar">
            <div>
              <label htmlFor="puzzle-name">Puzzle name</label>
              <input id="puzzle-name" value={puzzleName} onChange={(event) => setPuzzleName(event.target.value)} />
            </div>
            <button type="button" onClick={savePuzzle}>Save puzzle</button>
          </div>

          <div className="sudoku-grid">
            {grid.map((cell, index) => (
              <button
                type="button"
                key={index}
                className={cellClassName(index, highlighted, selectedCell, conflictCells)}
                onClick={() => setSelectedCell(index)}
                aria-label={`row ${rowOf(index) + 1} column ${columnOf(index) + 1}`}
              >
                {cell.value ? (
                  <span className={cell.given ? 'given-value' : 'value'}>{cell.value}</span>
                ) : showCandidates ? (
                  <span className="candidate-grid" aria-hidden="true">
                    {DIGITS.map((digit) => (
                      <span key={digit}>{candidates.get(index)?.has(digit) ? digit : ''}</span>
                    ))}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="number-pad" aria-label="Number pad">
            {DIGITS.map((digit) => (
              <button type="button" key={digit} onClick={() => selectedCell !== null && updateCell(selectedCell, digit)}>
                {digit}
              </button>
            ))}
            <button type="button" onClick={() => selectedCell !== null && updateCell(selectedCell, null)}>Clear cell</button>
          </div>

          <div className="board-meta">
            <div className="toggle-group">
              <label className="toggle-row">
                <input type="checkbox" checked={showCandidates} onChange={(event) => setShowCandidates(event.target.checked)} />
                Show candidates
              </label>
              <label className="toggle-row">
                <input type="checkbox" checked={showPeers} onChange={(event) => setShowPeers(event.target.checked)} />
                Highlight peers
              </label>
            </div>
            <p className="keyboard-help">1–9 enter · Backspace/0/. clear · arrows/hjkl move</p>
          </div>

          <div className="board-status">
            {isComplete && <span className="complete-line">Puzzle solved!</span>}
            {!isComplete && errors.length > 0 && <span className="error-line">{errors[0]}</span>}
            {!isComplete && message && !errors.length && <span className="status-line">{message}</span>}
            {!isComplete && selectedCell !== null && !errors.length && !message && (
              <span className="status-line">
                r{rowOf(selectedCell) + 1}c{columnOf(selectedCell) + 1}
                {showCandidates && selectedCandidates && selectedCandidates.size > 0 ? ` · candidates: ${[...selectedCandidates].join(', ')}` : ''}
              </span>
            )}
          </div>
        </section>

        <aside className="side-panel">
          <section className="panel-section">
            <h2>Hint options</h2>
            <p className="muted">Ranked from simpler techniques upward. Choose one to study.</p>
            <label className="hint-level-filter" htmlFor="hint-level">
              Show hints at or above
              <select id="hint-level" value={hintLevel} onChange={(event) => setHintLevel(event.target.value as HintLevel)}>
                {Object.entries(hintLevelLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <div className="hint-list">
              {visibleHints.length === 0 ? (
                <p className="empty-state">No hints found for this level. Try widening the filter.</p>
              ) : visibleHints.slice(0, 10).map((hint) => (
                <button
                  type="button"
                  key={hint.id}
                  className={`hint-card ${selectedHintId === hint.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedHintId(hint.id)
                    setSelectedCell(hint.targetCells[0])
                    setSpoilerLevel('nudge')
                  }}
                >
                  <span>{hint.technique}</span>
                  <strong>{hint.nudge}</strong>
                  <small>{hint.difficulty} · {hint.type}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="panel-section explanation-panel">
            <h2>Explanation</h2>
            {selectedHint ? (
              <>
                <div className="spoiler-tabs">
                  {(['nudge', 'reasoning', 'reveal'] as SpoilerLevel[]).map((level) => (
                    <button
                      type="button"
                      key={level}
                      className={spoilerLevel === level ? 'active' : ''}
                      onClick={() => setSpoilerLevel(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="hint-technique">{selectedHint.technique}</p>
                <HintLegend hint={selectedHint} />
                {spoilerLevel === 'nudge' && <p>{selectedHint.nudge}</p>}
                {spoilerLevel === 'reasoning' && (
                  <ol>
                    {selectedHint.reasoning.map((line) => <li key={line}>{line}</li>)}
                  </ol>
                )}
                {spoilerLevel === 'reveal' && <p className="reveal">{selectedHint.reveal}</p>}
                {spoilerLevel === 'reveal' && selectedHint.eliminateCandidates.length > 0 && (
                  <ul className="elimination-list">
                    {selectedHint.eliminateCandidates.map((item) => (
                      <li key={`${item.cell}-${item.digit}`}>Remove {item.digit} from r{rowOf(item.cell) + 1}c{columnOf(item.cell) + 1}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="empty-state">Select a hint to see how it works.</p>
            )}
          </section>

          <section className="panel-section">
            <h2>Save / load</h2>
            <div className="saved-list">
              {savedPuzzles.length === 0 ? <p className="empty-state">No saved puzzles yet.</p> : savedPuzzles.map((puzzle) => (
                <div className="saved-puzzle" key={puzzle.id}>
                  <button type="button" onClick={() => loadPuzzle(puzzle)}>{puzzle.name}</button>
                  <button type="button" className="ghost" onClick={() => deletePuzzle(puzzle.id)}>Delete</button>
                </div>
              ))}
            </div>
            <label htmlFor="import-string">Import 81-character string</label>
            <textarea id="import-string" value={importText} onChange={(event) => setImportText(event.target.value)} rows={3} />
            <button type="button" onClick={importPuzzle}>Import</button>
          </section>
        </aside>
      </section>

      <section className="learn-section">
        <div>
          <p className="eyebrow">Study guide</p>
          <h2>Technique notes</h2>
        </div>
        <div className="technique-grid">
          {techniques.map((technique) => (
            <article className="technique-card" key={technique.slug}>
              <span className={`difficulty-badge difficulty-${technique.difficulty.toLowerCase()}`}>{technique.difficulty}</span>
              <h3>{technique.title}</h3>
              <p className="technique-summary">{technique.summary}</p>
              <details>
                <summary>Worked example</summary>
                <p className="technique-example">{technique.example}</p>
              </details>
              <details>
                <summary>When to look</summary>
                <ul>
                  {technique.whenToLook.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </details>
              <details>
                <summary>Step by step</summary>
                <ol>
                  {technique.steps.map((item) => <li key={item}>{item}</li>)}
                </ol>
              </details>
              <details>
                <summary>Common mistakes</summary>
                <ul>
                  {technique.mistakes.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </details>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

const buildHighlights = (selectedCell: CellIndex | null, selectedHint: HintStep | null, showPeers: boolean): Map<CellIndex, string> => {
  const highlights = new Map<CellIndex, string>()

  if (selectedCell !== null && showPeers) {
    for (const cell of [...rowCells(rowOf(selectedCell)), ...columnCells(columnOf(selectedCell)), ...boxCells(boxOf(selectedCell))]) {
      highlights.set(cell, 'peer-highlight')
    }
  }

  if (selectedHint) {
    if (selectedHint.type === 'elimination') {
      for (const cell of selectedHint.supportCells) highlights.set(cell, 'pattern-highlight')
      for (const cell of selectedHint.targetCells) highlights.set(cell, 'remove-highlight')
    } else {
      for (const cell of selectedHint.supportCells) highlights.set(cell, 'context-highlight')
      for (const cell of selectedHint.targetCells) highlights.set(cell, 'answer-highlight')
    }
  }

  if (selectedCell !== null && !highlights.has(selectedCell)) highlights.set(selectedCell, 'selected-highlight')
  return highlights
}

const cellClassName = (index: CellIndex, highlighted: Map<CellIndex, string>, selectedCell: CellIndex | null, conflictCells: Set<CellIndex>): string => {
  const classes = ['sudoku-cell']
  if (conflictCells.has(index)) classes.push('conflict-cell')
  else if (highlighted.has(index)) classes.push(highlighted.get(index)!)
  if (selectedCell === index) classes.push('is-selected')
  if (columnOf(index) === 2 || columnOf(index) === 5) classes.push('box-border-right')
  if (rowOf(index) === 2 || rowOf(index) === 5) classes.push('box-border-bottom')
  if (boxOf(index) % 2 === 0) classes.push('subtle-box')
  return classes.join(' ')
}

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target.isContentEditable
}

const filterHintsByLevel = (hints: HintStep[], level: HintLevel): HintStep[] => {
  if (level === 'all') return hints
  const minRank = hintLevelRank[level]
  return hints.filter((hint) => hintLevelRank[hint.difficulty] >= minRank)
}

const HintLegend = ({ hint }: { hint: HintStep }) => {
  if (hint.type === 'elimination') {
    return (
      <div className="hint-legend" aria-label="Hint highlight legend">
        <span><i className="legend-swatch pattern"></i> Pattern cells</span>
        <span><i className="legend-swatch remove"></i> Remove candidates</span>
      </div>
    )
  }

  return (
    <div className="hint-legend" aria-label="Hint highlight legend">
      <span><i className="legend-swatch answer"></i> Answer cell</span>
      <span><i className="legend-swatch context"></i> Context cells</span>
    </div>
  )
}

export default App
