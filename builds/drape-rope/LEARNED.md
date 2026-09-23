# Drape, a cloth and rope sandbox

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `drape-rope.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-11
- Tags: physics, simulation, position based dynamics, verlet, cloth, canvas, interactive
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

Fabric hanging in a dark room that you can grab, fling, cut with scissors, tear, pin and blow around with wind. Five scenes share one solver: a gathered curtain, a flag on a pole, a rope slung between two points, a hammock pinned at its corners, and a loose sheet that falls into a heap on the floor. There is no velocity anywhere in the file. Every particle remembers where it is and where it was a moment ago, and motion is the gap between those two, which is the whole trick of Verlet integration. The cloth itself is nothing but a list of distances that want to be true, projected over and over until the fabric stops arguing with itself.

## What we learned building it

A stiffness slider is not a material property: one constraint projected n times at stiffness k leaves (1-k)^n of the error, so the iteration count is half the setting and moving it changes what the fabric is made of. A pinned chain does not converge in one solver sweep even at full stiffness, because satisfying each link breaks the one behind it, worked out on paper first and then matched exactly. Sweep order changes the answer: same chain, same stiffness, one sweep, pin first leaves 0.5r of error and tip first leaves 0.75r. Naive Verlet reads a changed timestep as a change in velocity, so halving dt doubles the implied velocity exactly. And a hanging rope really is a catenary, worth checking against cosh rather than the parabola everyone reaches for.

## The gotcha

The build shipped a claim in its own panel that the naive integrator would blow up under variable timesteps. It does not. Position based dynamics clamps positions by construction, so a wrong integrator produces wrong motion behind a picture that looks completely healthy: 20.2% off the closed form for free fall versus 0.20%, with nothing on screen to show for it. Worse, the rendering was wrong while every number was green. The suite reported 131 canvas colours and every assertion passing while the curtain hung as a flat slab with no folds and the flag had sheared into a ribbon off the bottom of the frame. Three causes, all found by opening the screenshots: no shear constraints, so the grid was a linkage rather than a fabric; no third dimension, so gathered cloth could not fold and the shading had nothing to shade; and a preview card that was a 1.39x horizontal stretch because the canvas was measured before the panel was hidden.

## How we checked it

87 assertions across two suites, green, against predictions written before the build existed. Fourteen of fourteen pre-registered numbers hit, several exactly: the stiffness ladder to 2e-9, the hand-derived chain residuals 5.0, 2.5, 1.25 and 7.5 exactly, the timestep velocities to 5e-8. The rope is checked against a catenary fitted to its own measured arc length, so stretch and shape error cannot hide inside each other: 0.04 px RMS across all 61 nodes, with a parabola through the same endpoints run as the wrong-curve control at 4.88 px, a 3.25x discrimination margin that was itself predicted in advance. Nine negative controls plus one positive control, and the positive one earned its place by catching a paint probe that had never been shown real pixels. Receipts in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> Cloth and rope sandbox: grab it, fling it, cut it with scissors, tear it, pin it, blow wind through it. Five scenes on one position based dynamics solver. Picked the lane this file said was unused and took the standing note seriously: this one is a toy first and the instruments are in a side panel you can ignore. Learned that a stiffness slider is not a material property, that a pinned chain does not converge in one sweep even at full stiffness, that sweep order changes the answer, and that naive Verlet under a variable timestep does not explode, it quietly computes motion 20% wrong behind a healthy looking picture. Two bites: I shipped that explosion claim in the UI before measuring it, and every number in the suite was green while the curtain on screen was a flat slab and the flag had sheared into a ribbon.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
