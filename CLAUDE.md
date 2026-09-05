# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A browser-based Snake game built with vanilla HTML5 Canvas, CSS, and JavaScript — no build tools, bundlers, frameworks, or dependencies.

## Running the game

Open `index.html` directly in a browser (double-click it, or use a simple static server if the browser blocks local file access):

```
python -m http.server 8000
```

Then visit `http://localhost:8000`. There is no build step, package manager, linter, or test suite in this project.

## Architecture

- `index.html` — page shell: canvas element, HUD (score/high score), status/hint text.
- `style.css` — all styling, dark theme.
- `game.js` — entire game logic, in one file:
  - A `requestAnimationFrame` loop (`loop()`) throttled by `MOVE_INTERVAL_MS` to control snake speed independent of frame rate.
  - Game state (`snake`, `direction`, `nextDirection`, `food`, `score`, `paused`, `gameOver`) lives in module-level variables, reset via `init()`.
  - Input is buffered into `nextDirection` and only applied on the next tick, and reversal into the snake's own body is blocked in `handleKey()`.
  - High score persists via `localStorage` (`snakeHighScore`).

When making changes, keep the no-dependency, single-file-per-concern structure — do not introduce a bundler or framework unless explicitly asked.

## Visual identity (CI) checks

Always check the CI (color and font) before considering visual work done. Match the existing palette and typography rather than introducing new ones ad hoc:

- Background: `#1e1f26` (page), `#14151a` (canvas/status area)
- Snake: `#7bd88f` (head), `#4fae67` (body)
- Food: `#ff6b6b`
- Text: `#f5f5f5` (primary), `#a9adc1` (HUD), `#6b6f85` (hint)
- Font: `system-ui, -apple-system, Segoe UI, sans-serif`
