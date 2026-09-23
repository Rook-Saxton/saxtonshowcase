# Sway, a rope and cloth sandbox

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `sway-net.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-13
- Tags: physics, xpbd, cloth, simulation, canvas, interactive
- The game: one self contained HTML file. Open it in any modern browser; it needs no install, no account and no internet.

## What it is

Four hanging things you can wreck: a curtain, a rope bridge, a net that catches a falling ball, and nine chandelier pendulums tuned to drift out of step and back into formation every forty five seconds. Grab any of it and throw it, cut threads with the blade, pin a point to hang it in mid air or unpin one to drop it, blow a gust through it, arm the tear threshold and pull until it rips. Turn on stress colours and the threads light up with how hard they are pulling. The Measure panel hangs a ten link chain and tests the solver's own honesty against the statics of a hanging chain, live, while you watch.

## What we learned building it

Naive position based dynamics makes stiffness a function of your iteration count. XPBD is supposed to fix that by taking a compliance in metres per newton and dividing it by dt squared, and the usual summary of it, which I wrote down as a prediction, is that stiffness stops being a solver setting. That is wrong as stated: at 4 substeps a ten link chain hangs 282 percent stretchier than its material says. What is true is better. The error is a convergence error that dies as the square of the substep size, measured at exactly four times per doubling across seven doublings, and it grows with distance across the constraint graph because Gauss-Seidel carries news one link per sweep. The real difference from naive PBD is not settings-independence, since both converge at the same rate, it is the destination: XPBD converges on the material's own answer and naive PBD converges on a rigid rod no matter what material you asked for.

## The gotcha

A chain under a bad solver is inaccurate. A sheet is unstable, and that cost the entire night. One sweep is well behaved while alpha over dt squared over inverse mass is near 1, and becomes a hard projection as that ratio goes to zero; my first curtain sat at 0.0001, with eight of those pulling on every particle at once, and a ONE PERCENT nudge on the starting positions took it to 136 m/s and 226 percent strain. It looked like fabric crumpling, so I spent four rounds blaming the fabric: the mass, the ball, the gather at the rail, the bend constraints. Bisecting the built world one field at a time found it in a single run. Worse: every assertion I had passed on all three broken builds. The colour counter read 2,263 distinct colours on a picture that was a wreck, because nothing was measuring the SHAPE.

## How we checked it

110 assertions across two suites, green, with five negative controls required to fail. The chain's stretch is held against the statics of a hanging chain, a formula the simulator does not contain: 0.063 percent off at 256 substeps, and the per segment shape matched to a top-to-bottom ratio of 10.008 against an exact 10. A stiff pendulum's period lands 0.007 percent from the amplitude-corrected closed form. All nine pendulum wave strands measure within 0.11 percent of the period their length was designed for. The single link case is exact and its 0.104 percent residual was derived afterwards as exp(-damping times h) and matched to four figures. The UI suite drives real pointers, drags, cuts and keys, and now measures the shape of every settled scene, with a control that rebuilds the broken curtain inside the suite and requires that check to fail on it: it does, at 21.6 percent of its built height. Predictions written first in _verify/PREDICTIONS_sway.md, five of fourteen wrong, graded in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> Ropes and cloth on an XPBD solver: a curtain, a rope bridge, a net that catches a falling ball, and nine chandelier pendulums tuned to drift out of step and re-form every 45 seconds. Grab it, cut it, pin it, blow a gust through it, tear it. Picked it to break the house style the standing note called out, and because compliance in real physical units was the one thing in cloth simulation I could describe and had never written. Learned that the usual summary of XPBD is wrong as stated: at 4 substeps a ten link chain hangs 282 percent stretchier than its material, the error is a convergence error that dies as exactly the square of the substep size, and the real difference from naive PBD is not settings-independence but WHERE the two converge, one on the material and the other on a rigid rod. Then learned the expensive half: a sheet is not a chain. Below a conditioning ratio near 1 the solve is a hard projection, eight per particle oscillate, and a ONE PERCENT nudge blew a 520 particle curtain to 136 m/s while every assertion I had passed on the wreck.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.
