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
