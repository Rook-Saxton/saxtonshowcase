# Drape, an XPBD cloth sandbox

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `drape-scenes.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-17
- Tags: physics, simulation, xpbd, cloth, constraints, interactive
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

A sandbox of hanging, heaping, tearable cloth. Five scenes: a curtain longer than its drop so the surplus piles on the floor, a flag in the wind, a sheet falling over a sphere, a net with balls resting in it, and a rope bridge. Drag the fabric, slash it with the cut tool, hang a new hook or release an old one with pin, drop more balls in. No step buttons and no explainer panels: you open it and you poke at it. The one knob worth finding is the solver switch, because flipping to plain PBD and then dragging the substeps slider makes the cloth stiffen as you add substeps, which is the whole reason XPBD exists.

## What we learned building it

I could recite that XPBD makes stiffness independent of iteration count and timestep, and had never derived why nor measured whether my own code delivers it. For one unit mass on one constraint the steady stretch works out to exactly g*alpha, with the timestep cancelling; plain PBD settles at g*dt^2*(1-k)/k instead, so halving the substep quarters the sag and the stiffness knob means nothing on its own. Both came out matching to within 7e-10 percent. The harder lesson was that a 2D face-on cloth cannot fold at all, because folding is out of plane and there is no out of plane, so the curtain went through three versions before it got excess LENGTH rather than excess width and heaped on the floor, which is a deformation the plane can actually do.

## The gotcha

Shear and bend links get a larger compliance SCALE so they are softer than the weave, and the effective compliance was alpha times that scale. The stiffness slider ships at rigid, which is alpha of zero, and zero times a scale factor is still zero: at the DEFAULT slider position every diagonal and bend link was perfectly rigid, the cloth was an over-constrained plate that could not fold, and a 40 wide sheet settled 261 percent out of shape. Invisible in the code, only visible in a measurement, at the one setting everybody starts on. The same test then found a runaway that reached 1.9e8 px with every value still finite, so a finiteness check called it healthy the whole way. And my own prediction of where the catenary error came from was wrong twice, discretisation then convergence, before measuring found the real cause: the solver sweeps left to right over a perfectly symmetric problem and the chain settles crooked by a fifth of a pixel.

## How we checked it

126 assertions across two suites against closed forms held in the checkers rather than the build: the catenary from solving 2a*sinh(span/2a)=length by bisection, the XPBD and PBD steady stretches from hand derivation, the pendulum period 2*pi*sqrt(L/g), an independent segment intersection routine for the cut test, and penetration recomputed from raw positions. Mid-span sag 221.277 px against a closed form of 221.278; pendulum period off by 0.045 percent; a cut removed 166 links of 166 expected with zero extra and zero missed; penetration 2.8e-14 px; 20,000 hostile substeps with everything finite. Predictions pre-registered before the build existed: ten hits, three misses, all three left on the record. Five negative controls, including one for each fix the first run forced, and the assertions that catch the runaway are on coordinates rather than on finiteness, because NaN passes every comparison.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> An XPBD cloth and rope sandbox: a curtain longer than its drop that heaps on the floor, a flag in wind, a sheet falling over a sphere, a net with balls in it, a rope bridge. Drag it, slash it, pin it, drop balls in. Picked the physics lane to break the steppable-explainer house style the four builds before it had settled into, and picked XPBD because I could recite "it makes stiffness independent of iteration count and timestep" and had never derived why or measured whether my own code does it. Both closed forms came out matching to within 7e-10 percent. Learned the hard way that a 2D face-on cloth CANNOT fold, since folding is out of plane and there is no out of plane, so the curtain needed excess length rather than excess width. Three things bit: the compliance scale on shear and bend links was dead at the slider's default position because it multiplied an alpha of zero, which left the cloth an over-constrained plate settling 261% out of shape and was invisible in the code; a runaway that reached 1.9e8 px with every value still finite, so finiteness called it healthy; and my own diagnosis of the catenary error being wrong twice before measuring found the real cause, a left-to-right sweep over a symmetric problem settling crooked by a fifth of a pixel.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
