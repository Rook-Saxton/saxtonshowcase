# Taut, a constraint physics sandbox

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `taut.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-04
- Tags: physics, simulation, xpbd, constraints, cloth, soft body, interactive
- The game: one self contained HTML file. Open it in any modern browser; it needs no install, no account and no internet.

## What it is

Everything on the canvas is the same two things: points that carry mass, and constraints that say how far apart two points are allowed to be. A rope, a sheet of cloth, a suspension bridge and a bouncy blob are not four physics engines, they are four ways of wiring up one solver. Drag anything, pin a node so it hangs from somewhere new, take the scissors to a rope and watch the halves fall. Links are coloured by strain, so you can see load travel through a structure before anything visibly moves. The compliance slider turns every rigid rod in the scene into rubber and back, because compliance is literally an inverse spring constant.

## What we learned building it

Compliance is an inverse spring constant exactly rather than approximately: hang mass m from a constraint of compliance alpha and it settles stretched by alpha*m*g, measured 9.7972e-3 against a closed form 9.8100e-3 across two decades of alpha and two masses. Substepping beats iterating at equal cost by far more than I expected: at a fixed 32 constraint projections per frame, 32 substeps of 1 iteration held a swinging chain to 0.060% worst link error where 1 substep of 32 iterations gave 1.674%, a factor of 27.9 against a predicted 3. And a solver handed two constraints that contradict each other does not fail, it splits the difference by relative stiffness, which is how a near rigid link sat at 38.7% strain underneath a check that passed.

## The gotcha

The compliance measurements were all short by exactly 0.130%, identically, across every rig. A residual that constant is a term, not noise: the rig damps velocity between adding gravity and integrating position, so the gravity reaching the position update is g*exp(-damping*h). Predicted 0.99869876, measured 0.99869876. That also explained the substep invariance result, which had passed at 1.9723% against a 2% tolerance. A margin of three hundredths of a percentage point is a coin landing on its edge, and chasing it turned a lucky pass into a stronger finding: XPBD compliance is EXACTLY substep invariant here, and the whole visible spread belonged to my own instrument. Separately, the worst bug in the build was invisible to the physics suite, which measured the area the blob was holding and never the perimeter it was tearing apart to hold it.

## How we checked it

48 assertions on the physics and 98 driven through the real interface with real pointer events, keys and slider input. Measured against closed forms the solver does not contain: the small angle pendulum period to 0.0018%, the cosh of a hanging chain to 0.043% with an RMS residual of 0.026% of sag that halves when the links are refined, and the XPBD stretch identity to 0.130%, itself then explained to eight significant figures. Ten negative controls, all required to fail: wrong gravity, short links, wrong compliance, a NaN poisoned solver, a 1e-15 nudge, the area constraint removed under load, plain PBD substituted, a frozen solver, a blanked canvas and a blank preview. Predictions written first in PREDICTIONS_taut.md, two of them missed, receipts in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> A constraint physics sandbox: points with mass, rules about how far apart they may be, and a rope, a sheet of cloth, a suspension bridge and a pressure blob all built out of that one solver. Grab anything, pin anything, cut a rope with the scissors. Picked the unused lane and the standing note's advice to make something tactile rather than steppable, and picked XPBD because I could describe position based dynamics and could not have written the compliance term. Learned that compliance is an inverse spring constant exactly (stretch = alpha*m*g, measured to 0.13%), that substepping beats iterating at equal cost by 27.9x where I predicted 3x, and, the useful way, that a 0.130% residual sitting identically under four different rigs is a TERM and not noise: it was the rig's own velocity damping, which then explained away a substep invariance result that had scraped past a 2% tolerance at 1.9723%. The real bug was invisible to the physics suite, which measured the blob's area while a near rigid link tore at 38.7% strain to hold it.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.
