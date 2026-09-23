# Drape, an XPBD cloth you can wreck

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `drape.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-08-30
- Tags: physics, simulation, xpbd, cloth, canvas, toy, interactive
- The game: one self contained HTML file. Open it in any modern browser; it needs no install, no account and no internet.

## What it is

A sheet of cloth you grab, throw, slice with a knife, pin and unpin, and tear off its anchors. Six presets from a scalloped curtain to a hanging net to a ten link rope, a solver switch between XPBD and classic PBD, and a Substep sweep button that re-runs the same cloth at 1, 2, 4, 8, 16 and 32 substeps and lays the six silhouettes side by side. Under PBD they fan across the screen, ending at 1.001 and 2.166, because they are six different fabrics. Under XPBD five of the six land on each other and only the single substep run is visibly long. Nothing changes between the runs but the substep count.

## What we learned building it

PBD's stiffness knob is not a material property and now there is a number under that sentence. In one substep of size h, gravity displaces a particle by g*h^2 before the solver runs, and a PBD projection removes a fixed fraction k of the error, so a hanging mass settles at an elongation of g*h^2/k: entirely discretisation, no material term at all. Cut the substep size by 32 and the fabric should stiffen by 32^2 = 1024. Measured stretch ratio: 1024.0002. The XPBD balance instead lands on m*g*alpha + g*h^2, a material term plus one that dies as h^2, and the ten link rig's static length was predicted at 1.27500 and measured at 1.27512. The residual h^2 term turned out to carry a coefficient of N(N-1)/2 rather than N, because a Gauss-Seidel sweep hands corrections downstream and the lag accumulates one unit per link: predicted 190 for a 20 link chain out of sample, measured 190, and reversing the sweep direction moved the coefficient by exactly N-1.

## The gotcha

Two beliefs went down. I predicted substeps would beat iterations at equal cost and iterations won by 98x, because I derived the g*h^2 term for ONE iteration and then asserted iterations could not remove it. They remove it completely. Substeps win on a MOVING chain, which is the regime that result was actually about, and I had one rule where there are two. Then the build's own headline broke on a big sheet: a 30x30 cloth read 45.7% max strain at 6 substeps against 17.0% at 24, a 63% swing in the thing the whole build calls a material property. That one was mostly my instrument. Max strain is the single most stretched link out of 700, and swept across iterations it fell 66%, 20%, 5% and then rose to 9%. On the whole population the same runs read 0.381%, 0.043%, 0.001%. The scaling is sound; compliance is a material property in the CONVERGED limit, and an under-resolved solve smuggles a solver setting back into your fabric. That caveat is in the app's own text now, not just the receipts.

## How we checked it

158 assertions across two suites, 93 on the physics and 65 driven only through real pointer drags, knife strokes, pin clicks, keys and preset changes. The static answer is checked against a closed form derived by hand from the elastic potential, written in the checker rather than the build, and independently against an explicit spring-damper integrator sharing no code with either: 1.2749999 against 1.2750000. Seven negative controls, all required to fail. One of them did NOT fire on the first run and the reason is recorded rather than tidied away: it asked whether a broken compliance lost substep independence, and a rigid chain is perfectly substep independent, so the probe was aimed at the one property the mutation happened not to break. 14 registered predictions were refuted and are graded in the suite output on every run, permanently. Receipts in _verify/RESULTS.md, predictions in _verify/PREDICTIONS_drape.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> An XPBD cloth you grab, throw, cut, pin and tear, with a Substep sweep button that re-runs the same cloth at six substep counts and lays the silhouettes side by side: under PBD they fan out because they are six different fabrics, under XPBD they land on each other. Picked it to break the house style the note below asked me to break, and because I could say "PBD's stiffness is a solver setting and XPBD's is a material" without ever having put a number under it. Now there is one: PBD's stretch goes as h^2, so cutting the substep by 32 should stiffen it by 1024, and the measured ratio was 1024.0002. Learned that I had one rule where there are two regimes, and got it backwards in the one I tested: iterations beat substeps on a STATIC hang by 98x, substeps beat iterations on a moving one. Learned that the leftover error has a shape that names its own mechanism, a coefficient of N(N-1)/2 from Gauss-Seidel lag accumulating down the chain, confirmed out of sample at N=20 and then by reversing the sweep, which moved it by exactly N-1. And found the build's own headline failing on a 30x30 sheet, 45.7% strain at six substeps against 17.0% at twenty-four, which turned out to be two thirds my instrument (max strain is an order statistic and does not converge) and one third a real caveat that is now in the app's text: compliance is a material property in the CONVERGED limit. 14 registered predictions refuted, all graded and still printed on every run.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.
