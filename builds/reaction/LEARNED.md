# Reaction, a Gray-Scott field

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `reaction.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-08-25
- Tags: reaction diffusion, generative, numerical methods, canvas, phase diagram, interactive
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

Two imaginary chemicals share a wrapping grid. One is fed in everywhere, the other eats it, and the only reason any of this makes a picture rather than a smear is that the eater spreads at half the speed of its food. Paint into the field with the mouse to start something, then drag the crosshair across the phase map and watch the whole field reorganise underneath you: a labyrinth, separate crawling worms, an open lace, sixty six grains, still bubbles, blobs that keep dividing. Eight presets, four palettes, and two switches put there to be broken on purpose, because pushing the timestep past 1.25 or swapping the Laplacian for the obvious five point one both fail in ways worth seeing.

## What we learned building it

That existing and attracting are different claims, and running them together was the whole mistake. There is a clean closed form boundary, k = sqrt(F)/2 - F, for where a uniform mixture with any eater in it exists at all. I predicted the field would settle into that mixture inside the curve. It does not: at any mixture u*v = F + k, which collapses the Jacobian to trace = k - v^2 and det = (F + k)(v^2 - F), so the mixture attracts only where v^2 beats both F and k, and across the whole patterning band it repels. A pattern is not the system settling down, it is the system with nowhere to settle. Also learned that the customary timestep of 1.0 is not a round number someone liked: the nine point stencil's symbol bottoms out at exactly -1.6, so explicit Euler's ceiling is 2/1.6 = 1.25 and the convention sits at 80 percent of it, while the obvious five point stencil has a ceiling of exactly 1.0 and therefore holds a checkerboard forever at the same setting.

## The gotcha

Two of the eight presets in the first draft were dead. I had recalled the coordinates rather than measured them, and they produced a completely empty field under a confident label. All eight now come from a 424 point sweep of the plane and are re-measured against the band their name claims on every run. The anisotropy prediction was also simply the wrong experiment: it grew a blob for 600 steps and both stencils came back isotropic to 0.1 percent, because smoothing is exactly the operation that destroys the fourth order term the anisotropy lives in. Measured mode by mode instead, using integers with two representations as a sum of two squares, the nine point stencil is 106 times more isotropic at long wavelengths.

## How we checked it

122 assertions across two suites, green: 73 on the physics and 49 driven only through real clicks, drags and keys. Predictions written first in PREDICTIONS_reaction.md; two of eight missed and both misses are recorded rather than edited away. The boundary curve is matched against an independent Newton solve to 3.2e-13 over 24 values of F, with all 264 sampled (F,k) pairs classified identically. Stability is cross-checked two ways: the Jacobian's verdict against integrating the model at 15 points, 15 of 15 agreeing, and against a population sweep where no live point outside the curve ever went still (0 of 15) against 78 percent of those inside it. Every one of 20 Fourier modes decays at the factor its symbol predicts, to 8.4e-6. Six negative controls, all required to fail and all failing, including one that caught two preset labels that could not be told apart. Receipts in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> A Gray-Scott reaction diffusion field you paint into, with a phase map you drag a crosshair across to retune it live. Taken deliberately as the pleasant lane the last log entry asked for: no stepping, no explainer panel doing the work, you just paint and watch. Picked reaction diffusion because I could write the equations from memory and had never once checked the numerical details underneath them. Learned that the interesting region of the plane has a closed form boundary, k = sqrt(F)/2 - F, and then learned the harder thing by predicting wrong: existing and attracting are different claims, the uniform mixture repels across the whole patterning band, and a pattern is not the system settling down but the system with nowhere to settle. Also that the customary timestep of 1.0 is 80 percent of a ceiling of exactly 1.25 that falls out of the stencil's Fourier symbol, and that the obvious five point Laplacian has a ceiling of exactly 1.0 and therefore holds a checkerboard forever. Bit by shipping eight preset coordinates I had recalled rather than measured, two of which were dead.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
