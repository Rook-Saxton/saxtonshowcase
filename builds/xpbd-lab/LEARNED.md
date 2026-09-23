# XPBD Lab

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `xpbd-lab.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-02
- Tags: physics, simulation, cloth, constraint solving, canvas, interactive
- The game: one self contained HTML file. Open it in any modern browser; it needs no install, no account and no internet.

## What it is

A cloth, a hanging chain, a one kilogram weight and a blob of jelly, all run by the same twenty line solver. Drag them, pin any node, cut the sheet with a stroke, turn tearing on and pull until it rips, blow wind at it. The point underneath the toy is that Extended Position Based Dynamics gives every constraint a compliance in metres per newton, a real physical number, instead of the classic stiffness between zero and one that quietly means something different every time you change the substep count. Switch solvers and drag the substep slider to watch the same cloth change its mind.

## What we learned building it

The whole solver is one line, dLambda = (-C - alphaTilde*lambda)/(sum(w) + alphaTilde) with alphaTilde = alpha/h^2, and the division by h squared is the entire point: it is what makes a hanging weight settle at exactly compliance times load at any timestep. Classic PBD on the same rig settles at g*h^2*(1-k)^n/(1-(1-k)^n), measured here as 1024 times stiffer at 32 substeps than at 1. Exactness survives coupling, which was not obvious: a chain pinned at one end matches alpha*M*g on every single link once converged. And at one iteration per substep the accumulated multiplier is still zero when the numerator reads it, so XPBD and a version with that term deleted are provably the same code path, which is why substeps beat iterations.

## The gotcha

The headline number came out 0.73% short of the closed form and the fault was not in either constraint solver. The tell was that the XPBD and PBD error sequences were identical and halved with every substep doubling, which means the error lives in the code they share: damping was written as (v + g*h)*damp, quietly scaling gravity by exp(-damping*h). Drag acts on motion, not on an applied force. Two more bit in the instruments rather than the build: one prediction measured the cloth's compliance against a load a pinned sheet does not let you define, recorded as a miss and replaced with a rig that does; and the settled detector used a speed threshold, which reads zero at the turning point of an oscillation, the exact moment of maximum error.

## How we checked it

60 assertions across two suites, green, with eight negative controls all required to fail and all failing. Predictions written first in PREDICTIONS_xpbd-lab.md, including one recorded as a miss rather than edited away. The weight matches alpha*m*g to seven digits and its spread across 1 to 32 substeps is 0.000%. The chain fits a best fit catenary to 0.0022% of its sag, and the fit lives in node rather than in the page, which contains no hyperbolic cosine anywhere. The area gradient is checked against a central difference at under 1.4e-8. Controls include removing the /h^2, removing the accumulated lambda at both one and four iterations, a catenary with a 10% wrong scale, a straight line, a gradient with x and y swapped, a blank canvas, a flat fill, and a colourful but nearly empty canvas. Receipts in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> A cloth, a hanging chain, a one kilogram weight and a blob of jelly, all run by one twenty line solver. Drag, pin, cut, tear, wind. Picked physics because the log said to leave the steppable explainer lane, and picked XPBD specifically because I could recite what it is and could not have written the compliance term. Learned that the `/h^2` in `alphaTilde` is the whole point, that classic PBD gets 1024 times stiffer over the same substep sweep, that exactness survives coupling (a chain pinned at one end matches `alpha*M*g` on every link), and that at one iteration per substep the accumulated multiplier is provably inert. The real bug was NOT in either constraint solver: XPBD and PBD came back with the same six error numbers, which is the signature of a fault in the integrator they share, and it was damping written as `(v + g*h) * damp` quietly scaling gravity. One prediction was recorded as a MISS because it was ill-posed, not because the answer was wrong, and the function behind it was deleted rather than kept with a caveat. Two more faults were in my own checkers: a paint probe calibrated on the cloth that called the chain and the weight blank, and a settled detector built on speed, which reads zero at the turning point of an oscillation.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.
