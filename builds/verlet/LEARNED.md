# Verlet, a cloth and rope sandbox

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `verlet.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-15
- Tags: physics, simulation, cloth, constraints, canvas, interactive
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

Hang a curtain, fly nine streamers in a gusting crosswind, string a rope bridge, sling a net, then grab it, tear it, cut it, pin it and drop it on the floor. Everything on screen is about a hundred lines of physics: points that remember where they were last frame, and links that repeatedly drag their two ends back to the right distance apart. There is no spring force and no velocity anywhere in the code. Solver iterations, gravity, wind, drag and a tear threshold are all live, and the iteration slider is the one to play with, because on this kind of solver stiffness is not a number, it is how many times you ask.

## What we learned building it

Seeding the history with previous equals current does not mean at rest: it injects half a timestep of velocity that never decays, because the error obeys the integrator's own recurrence, and a point dropped that way falls 116.667 px too far in ten seconds. Stiffness is an iteration count and the sweep ORDER matters more than the count: a Gauss Seidel pass starting at the pinned end carries a disturbance down a whole rope in one sweep, while the same solver sweeping the other way moves exactly one more node per iteration. Strain times iteration count is a constant, so solver work buys 1/k and never better. And projecting a position back onto its constraint costs energy all by itself: a pendulum with damping switched off loses 11.8% of its swing per period at 60 steps a second, first order in the timestep and completely untouched by iteration count.

## The gotcha

Four of five pre-registered predictions missed, and one of the checks passed while the claim under it was false: it compared relative errors, which fall as 1/t for any fixed offset, so it could not have failed against any build at all. A separate prediction looked refuted at 36 of 39 nodes and was not, because a 1e-9 tolerance sitting in the checker out of habit could not see a displacement of 3.638e-10. Then, with every assertion green, a screenshot showed a curtain hanging like a board, bend links making the drape worse rather than better, and a flag that cannot be done honestly in two dimensions at all. Third build in this folder where the picture disagreed with a clean scoreboard.

## How we checked it

80 assertions across two suites, 34 on the physics and 46 end to end through real pointer and keyboard events, plus the shared index suite. Closed form ties the build has to hit: free fall exact to 6.2e-8 px over 600 steps, a pendulum period inside 0.066% of 2 pi root L over g with the finite amplitude correction, and the exact node by node propagation counts along a 40 link chain for three solver modes. The cut tool is checked against an independent orientation test written in Node, deliberately not the parametric form the build uses. Four negative controls, all required to fail and all failing, one of which had to be rewritten because its first version failed on the healthy build too and would have passed against anything. Predictions written first in PREDICTIONS_verlet.md, graded honestly in _verify/RESULTS.md, misses and all.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> A cloth and rope sandbox: a curtain, nine streamers in a crosswind, a rope bridge, a net, and tools to grab, cut, pin and tear them onto a floor. Picked to break the house style the note below called out, so this one is a thing to play with rather than a thing to step through. Learned that seeding a Verlet history with previous equals current injects half a step of velocity that never decays, that sweep ORDER matters more than iteration count (a forward pass carries a disturbance down a whole rope at once, backward moves one node per sweep), that strain times iterations is a constant so solver work buys 1/k and never better, and that projecting a position back onto a constraint costs 11.8% of a pendulum's swing per period with damping switched off. Four of five pre-registered predictions missed. One check passed while the claim under it was false because it compared relative errors, which fall as 1/t for any offset at all. And with every assertion green, a screenshot still showed a curtain hanging like a board, bend links making the drape worse against every tutorial, and a flag that cannot be done honestly in two dimensions.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
