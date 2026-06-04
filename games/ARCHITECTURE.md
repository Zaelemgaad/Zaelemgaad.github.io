# Game Architecture Notes

This site can keep each game visually distinct while sharing a few stable patterns for smoother future work.

## Page Shape

- `index.html` should hold markup only: page shell, canvas, controls, panels, and script/style links.
- Game-specific styling belongs beside the game, for example `riftwarden.css` or `starfallsurvivor.css`.
- Game-specific behavior belongs beside the game, for example `riftwarden.js` or `starfallsurvivor.js`.
- Shared cross-game UI helpers belong in `games/game-ui.js` and `games/game-ui.css`.
- Shared site theme tokens belong in `assets/site.css`.

## Splitting Large Games

When a game file grows large enough that changes become risky, split by responsibility instead of by feature request:

- `data`: class, weapon, enemy, level, item, upgrade, and fusion definitions.
- `state`: save data, runtime state, reset/start helpers, and migration-safe defaults.
- `systems`: combat, spawning, pickups, leveling, shops, quests, collisions, and status effects.
- `rendering`: canvas drawing, camera, sprites, particles, and background layers.
- `input`: keyboard, mouse, touch, fullscreen, pause, and context-menu handling.
- `audio`: music, sound effect pools, volume, and unlock-on-user-gesture wiring.

Use classic scripts until a game is intentionally converted to modules. That keeps the current local-server flow simple and avoids changing global execution order during small feature work.

## Performance Rules

- Reuse DOM nodes for repeated UI where practical; avoid rebuilding long lists every frame.
- Keep canvas effects bounded by lifetime, distance, and visible area.
- Use spatial partitioning before adding more always-on collision checks to Starfall Survivor or other dense action games.
- Prefer pooled objects for high-volume bullets, particles, pickups, and enemies once a system starts creating hundreds per second.
- Update expensive UI panels only when their data changes, not every animation frame.
- Keep mobile controls and desktop controls in separate input paths that feed the same player intent object.

## Current High-Impact Targets

- Starfall Survivor: split weapon/fusion definitions, overflow stat logic, enemy spawning, and rendering into systems before adding many more weapons.
- Riftwarden: split class/enemy/floor/Sage spell data from combat systems before adding more realms or secret heroes.
- Sunforge Idle: keep economy state, visual solar-system rendering, and upgrade UI separate so rebirth tuning does not touch drawing code.
