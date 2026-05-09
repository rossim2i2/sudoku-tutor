# sudoku-tutor

A local-first Sudoku and Killer Sudoku tutor that teaches the logic behind hints instead of just revealing answers.

## Goals

- Enter a puzzle manually.
- Save and reload games locally.
- Ask for multiple hint options.
- Highlight the cells, houses, and candidates that matter.
- Explain how a move was computed so the solver learns the technique.

## Current scope

The first version focuses on standard Sudoku:

- 9×9 grid entry
- candidate computation
- naked singles
- hidden singles
- hint explanations
- row/column/box highlighting
- light/dark mode
- local save/load
- 81-character puzzle string import

Killer Sudoku support is planned after the standard tutor is reliable.
