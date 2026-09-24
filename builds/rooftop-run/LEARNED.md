# Rooftop Run, an endless runner across the city at dusk

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `rooftop-run.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-23
- Tags: game, arcade, runner, canvas, web-audio, procedural
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

A one-file side scrolling endless runner on canvas. The runner runs by themselves; tap, click, Space or Up jumps (hold for higher, press again in the air to double jump), and swipe down, Down or S slides. Roof gaps, chimneys, crates, crate stairs and washing lines come in five tiers that unlock with distance while the speed climbs from 29 to 60 m/s. Coins, a magnet, a shield that eats one crash or fall, and an umbrella that glides while you hold jump. The sky changes palette at every 500 m milestone over three parallax skyline layers. Sound is synthesized with Web Audio, with a small music loop whose tempo follows the speed. The title screen and the preview=1 card run an autopilot that plans with the same physics.

## What we learned building it

The fair way to prove a level is clearable was to search real inputs through the game's own step function rather than trust the arc formula: a breadth-first search over hold, release and slide every 25 ms, with states merged on height and velocity, since every state in a time layer shares the same x. That search turned out to be good enough to be the demo autopilot as well (8 of 8 seeds reached the 3000 m test cap). It also corrected my own physics: my negative control assumed the longest air came from a double jump at the apex, and the search cleared it by spending the double jump as low as possible on the way down, which really does buy more airtime, so the generator's apex-based reach is conservative rather than tight.

## The gotcha

The first generator run reported double-jump gaps as unclearable, and a hand-scripted input cleared the same gap. The search was losing the solution: when a time layer grew past its cap I thinned it by an even spread over height, and the state that saved its double jump for the apex is lower than the states that spent it early, so it was always thinned away. Thinning inside groups (air jump left or not, holding or not, sliding or not) while keeping the highest and lowest of each fixed it without raising the cap; every course then passed.

## How we checked it

node logic.test.js: 111 passed, 0 failed. That covers jump feel checks, 90 generated courses (2040 roofs) proven clearable from 0 to 4600 m and at fixed speeds 290 to 700 units/s, three negative controls rejected, two positive controls and a path replay, and the autopilot reaching the 3000 m cap on 8 of 8 seeds. node browser.test.js with headless Chrome: 30 passed, 0 failed. It ran at 1280x720 with real key presses (start, play, P pause freezes, blur pauses, Escape not prevented, game over, best saved, Space restart, M mute) and at 390x844 with touch (tap start, swipe-down slide, taps, no page scroll, game over, tap restart). The game still ran with localStorage throwing. preview=1 at 600x300: no chrome, 27 to 33% of pixels changed in 3 s over two runs, 1 game over and 1 self-restart within 30 s, no storage writes; 350x175 also ran. Zero page or console errors in every context. Screenshots reviewed by eye.

## About these notes

Copied word for word from the build's own record. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
