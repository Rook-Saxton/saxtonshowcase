# Loom, the master build

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `loom.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-22
- Tags: physics, cloth, reaction diffusion, audio, colour, ambient toy, interactive
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

One dark room under a night sky, and one piece made of four earlier ideas that now depend on each other. A pleated curtain hangs from a rail with seven threads below it. A divergence free curl noise wind moves through the room. A Gray-Scott dye grows maze stripes at the rail and spots at the hem in the cloth's own material coordinates, and where it is dense the cloth is stiffer, so the pattern is a material rather than a texture. When the wind bends a thread past a relative threshold it plucks a Karplus-Strong voice tuned to that thread's length. Every colour is one OKLCH hue, the Showcase's night sky ground, chroma bisected into sRGB and spaced on contrast. Drag the cloth and it follows you and takes dye where you hold it; stir the air past the threads and they sing. No tabs, no modes.

## What we learned building it

Putting lessons under load together finds things none of them found alone. The first version gathered the rail and let the cloth find its own folds, and its skip-one bend links, fine on every flat cloth in this folder, were compressed 28 percent by the gathering and pushed the sheet back toward its flat width. Rail links sat at 15 to 19 percent strain whatever their compliance, because at one iteration per substep a stiff link's correction is set by inverse mass rather than compliance, and the sheet kept snapping through and plucking threads with no wind at all: 36 voices in 20 silent seconds. Sewing the pleats into the rest shape took that to 0.7 percent and zero. Also measured: XPBD's single constraint lands on m*g*alpha to 5e-13 at every substep count, the (v + g*h)*damp bug shows up as a residual sitting at exactly one constant across compliances, midpoint advection drifts volume 37.5x less than Euler, and a hysteresis band that is too wide silences a harp as surely as a threshold that is too high.

## The gotcha

Seven of twenty-seven pre-registered predictions missed, graded in RESULTS.md. The biggest: removing the compliance floor did NOT turn the fully dyed sheet into a plate, because at one iteration per substep a zero compliance link is just a PBD projection with k = 1 and a sewn rest shape leaves it nothing to fight. The ledger's own P12 figure was wrong, caught before measurement. With the suites green, two screenshots showed real defects. The no-WebGL fallback drew the dye as literal squares, and a colour count (2667) and a run length statistic both passed it; only a test aimed at the claim, two points of different dye density inside one quad, saw 0 of 113 differ. And one vigorous drag left the curtain creased down the middle for good, because without self-collision the drag passed half the sheet through the other into a crossed state no local constraint can tell from rest; cloth self-collision fixed it.

## How we checked it

Two suites, predictions first in PREDICTIONS_loom.md, run on Windows in installed Chrome through Playwright. check_loom.js, 47 checks: XPBD against m*g*alpha and PBD against g*h^2 with the closed forms in the checker, the damping bug and deleted h^2 controls, curl divergence 5.8e-14 against a gradient control at 5.06, the Gray-Scott impulse exact and the blow-up bisected to 1.2603 against 2/1.6, pitch by autocorrelation and by phase advance (worst 0.106 cents, naive 4.23), T60 within 1.3 percent, 12 voices in 20 seconds at the default wind and 0 at none, bit identical over 2000 steps, NaN and a finite 1.9e8 both rejected on coordinates, colours checked with the checker's own exact Oklab inverse and against Chrome's rasteriser. check_loom_ui.js, 37 checks through the real pointer, touch, key and audio gesture: no AudioContext before a gesture, a drag grabs, lays dye and the sheet recovers its pleats, a stir plucks and the voice census reconciles, all four corners reach the solver, the preview contract at 2:1, a phone, and the no-WebGL fallback. Eight screenshots looked at, two defects found that way.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> The one piece that makes the folder's strongest lessons hold at the same time: a pleated curtain, seven threads, a curl noise wind, a Gray-Scott dye in the cloth's own coordinates that stiffens it where dense, allpass-tuned Karplus-Strong voices, one OKLCH hue seeded from the Showcase's night sky. Picked because half the thirty builds were three shapes (cloth, reaction diffusion, colour) standing alone, and the only move left in that lane was making them depend on each other. Learned that lessons under load together find things none found alone: skip-one bend links, fine on every flat cloth here, fought a gathered rail (15 to 19% strain, 36 plucks in silence) until the pleats were sewn into the rest shape; with no self-collision one drag crossed the sheet through itself into a crease nothing local could undo; and a too-wide hysteresis band silenced the harp. Nineteen of twenty-seven predictions hit, the ledger's own P12 figure was wrong, and both defects that mattered most were found by looking at a screenshot. Next build should leave physics alone.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
