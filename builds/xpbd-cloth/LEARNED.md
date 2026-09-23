# Compliance, an XPBD cloth lab

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `xpbd-cloth.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-09
- Tags: physics, simulation, cloth, xpbd, constraint solving, canvas, interactive
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

A cloth you can grab, pin and slash, with the argument for Extended Position Based Dynamics sitting underneath it. In plain Position Based Dynamics the stiffness slider is not a material property at all, it is an artefact of how many times the solver happened to run, so the same cloth becomes a different fabric when you change the substep count. XPBD gives every link a compliance in metres per newton and divides it by the square of the substep length, and the substep length then cancels out of the answer. Switch solvers, drag the substeps slider, and watch one of them hold its material while the other quietly stiffens. There is a rope, a single hanging mass with a ruler on it, and a panel that runs the whole comparison against closed form predictions while you watch.

## What we learned building it

A single distance constraint converges in exactly ONE XPBD iteration rather than asymptotically: the update drives C + alpha_tilde*lambda to zero in one pass and it stays there, which is why the iterations axis of the sweep is dead flat. The h squared in alpha_tilde = alpha/h squared is the whole trick, and it is what makes a hanging mass rest at m*g*alpha, which is Hooke's law with k = 1/alpha. Cloth drapes because it BENDS, not because it stretches: the first version had bend links at 60x the structural compliance and hung like sheet steel, and it needed 2000x plus very soft shear before it looked like fabric. And damping has to be taken per substep, at damping^(1/substeps), or changing the substep count silently changes how draggy the cloth feels and contaminates the only comparison the build exists to make.

## The gotcha

Two predictions missed and both are graded in RESULTS.md. I predicted the lambda-reset control would come out stiffer; it came out 471x softer, and working out why produced a fresh prediction (more substeps must make it softer still) that was then written down and measured before being believed. The second miss is worse: I asserted a cloth at the softest setting would stay under 1 metre of stretch, it read 19.7 metres, and the build was fine. A 400 particle sheet on a 20 N/m spring rests at about twenty metres. Exploding is not a magnitude, it is unbounded growth, so the check now runs the same setting twice as long and requires the state to have stopped. Separately, a real bug was found by looking at a screenshot rather than by any assertion: the strain readout was computed before the alive check, so a torn cloth reported 2268% stretch that was just the width of the tear.

## How we checked it

76 assertions across two suites, plus the index suite re-run. Both closed forms measured over 20 combinations of substeps and iterations: XPBD ties its own to 5.9e-10 relative and spreads 6.5e-10 across every solver setting, PBD ties its own just as tightly and spreads 5080x on the same knobs against a predicted 5079x. An RK4 spring-damper written only in the checker, sharing no code with the build and containing nothing position based, agrees to better than 0.01% on two mass and stiffness pairs. The rope's tension profile matches link by link. Four negative controls, all required to fail, three of them mutating the shipped solver through a documented flag rather than a copy of it. Predictions written first in PREDICTIONS_xpbd-cloth.md, receipts in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> Compliance, a cloth you can grab, pin and slash, built to make one argument visible: PBD's stiffness slider is not a material property, it is an artefact of how many times the solver ran, and XPBD's compliance is. Picked XPBD because I could name it and had never written one, and the tell was that I could not have said whether the Lagrange multiplier resets per frame or per substep. Learned that a single distance constraint converges in exactly one iteration rather than asymptotically, that the h squared in alpha/h squared is the entire trick and cancels the substep length out of the resting stretch, and that cloth drapes because it BENDS: bend links needed 2000x the structural compliance before the sheet stopped hanging like sheet steel. Two predictions missed, both graded: I had the lambda-reset control's direction backwards by 471x, and I asserted a magnitude threshold that fired on a build that was fine. The one real bug was found by opening a screenshot, not by an assertion.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
