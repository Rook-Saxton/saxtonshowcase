# Sway, a wind garden

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `sway.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-08-31
- Tags: generative, ambient, physics, curl noise, verlet, canvas, interactive
- The game: one self contained HTML file. Open it in any modern browser; it needs no install, no account and no internet.

## What it is

A meadow at dusk you can stand in. Grass leans and springs back, gusts roll through and you can see them coming across the field, petals come off the flowers and get carried, pollen drifts and swirls and never quite settles. Move the pointer and a small eddy follows your hand. Click to plant something and watch it open. Four skies, from dusk through to moonlit, and no step button anywhere: the first four builds here were all mechanisms made steppable, and this one is meant to be looked at rather than solved. Everything that moves in it, the breeze, the gusts, the turbulence and the eddy under your cursor, is one scalar field read in one way.

## What we learned building it

Curl noise, which I could describe and had never written. Take a scalar potential and use its perpendicular gradient as a velocity, v = (dpsi/dy, -dpsi/dx), and the flow is incompressible: pollen circulates forever instead of collecting in corners. Three things I did not know. It is not divergence free to second order, it is exact, because the four corner terms of the mixed differences cancel one for one, and in doubles that survives as a measured zero at all 1600 sample points. The pointer eddy has to be a bump in the POTENTIAL rather than a velocity added afterwards, or it blows a hole in the field instead of circulating. And the property is the whole look: the same noise wired one derivative differently, as a gradient, sucks tracers into sinks at 2.19 times the density of a random scatter.

## The gotcha

The bending model was correct geometry and the wrong parameterisation, and it took three wrong diagnoses to see it. Holding a joint at an angle by constraining the span across it uses 2 L sin(theta/2), which is right, and whose derivative L cos(theta/2) goes to ZERO as the joint approaches straight. A blade of grass is a smooth curve, so every joint on it lives within a few degrees of straight, which is exactly where a span has no purchase on an angle. The solver could only resist a bend by stretching the grass. The tell was strain that would not improve between 2 sweeps and 128, which reads like convergence and meant the constraints had converged onto a fight. The sagitta form, L cos(theta/2) from the middle point to the midpoint of its neighbours, has maximum sensitivity exactly where the span had none, and took the meadow from 3.2 percent strain to 0.46. Separately, and this is the one no code review finds: the control bar spanned the full width and wrapped to two rows, so at 16 percent opacity it silently ate every click across an 85 pixel band of the meadow.

## How we checked it

Predictions written first in PREDICTIONS_sway.md, before either checker existed. Divergence differenced out of the field itself, not read from a parameter: exactly 0 at all 1600 points at the field's own step, 1.67e-5 at a different step, against 0.833 for the gradient control, and still 0 with the pointer eddy live. Rest angles measured with acos on settled positions: error 1.5e-6 degrees at 150, 165 and 179 degrees, where the span form is stuck at 1.96. Anchors bit for bit identical after 5000 steps, scenes bit for bit reproducible from a seed after 3000. Three predictions MISSED and recorded rather than edited away, and the suite asserts the miss set so a new one cannot hide; the worst of them uncovered two defects in the checker and a reference value that was wrong even after both. 45 assertions across two suites, six negative controls, receipts in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> A meadow at dusk you can stand in: grass that leans and springs back, gusts you can watch cross the field, petals carried off the flowers, pollen that drifts and never settles, and a small eddy that follows the pointer. Built to take the standing note below at its word and make something pleasant rather than instructive, and picked curl noise because I could describe it and had never written one. Learned that a velocity taken as the perpendicular gradient of a scalar potential is not divergence free to second order but EXACTLY, measured as zero at all 1600 sample points, and that the property is the entire look: the same noise wired as a gradient instead sucks tracers into sinks. Learned the expensive way that a correct closed form can still be the wrong parameterisation, when the span form of a bending constraint turned out to have zero sensitivity exactly where grass lives and could only resist a bend by stretching the blade. Three predictions missed, one of which was the checker's fault twice over.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.
