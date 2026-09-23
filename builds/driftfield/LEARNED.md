# Driftfield

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `driftfield.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-08
- Tags: generative art, ambient, curl noise, perlin noise, fluid, canvas, interactive
- The game: one self contained HTML file. Open it in any modern browser; it needs no install, no account and no internet.

## What it is

Something to leave open. Thousands of particles drift through a slowly morphing flow, leaving trails, on one full screen canvas, with five palettes and sliders for count, scale, speed and trail length. One switch on it is the whole point: the flow is read off a noise field as a stream function, which makes it divergence free, so the particles never pile up and the picture stays alive indefinitely. Flip the switch to the plain gradient of the same noise and watch every drifter slide into the nearest sink and the frame die in about four seconds. Flip it back and it refills.

## What we learned building it

A field being incompressible does not make a simulation of it incompressible. The Jacobian determinant of a forward Euler step is 1 + dt*div + dt^2*det(grad v), and only the middle term is the zero, so Euler quietly compresses area even on a provably divergence free flow: measured RMS log area drift of 0.70 over 800 steps, worst trajectory a factor of 31, showing up in the picture as ridges the field does not have. A midpoint step drifts 0.0042 for one extra lattice read, so the renderer was changed. Second thing, and it reverses an instinct: the renderer samples the flow on a lattice and interpolates, and that interpolated field is 400 times more compressible than the analytic one, and it costs almost nothing, because lattice error flips sign at the cell scale and cancels along a trajectory while integrator error is systematic and accumulates.

## The gotcha

The first run said the two flows differed by only 1.45x, which would have made the build pointless. The field was fine. The particles were being wrapped onto a torus, and Perlin noise is not periodic, so the seam was a source and a sink stapled to the domain, injecting structure into both fields until the difference between them nearly vanished. On an open domain the gap is 6.19x, which is what had been predicted before any of it was written. Three of the six missed predictions were a field property measured with a stencil too coarse to see it, not a wrong field.

## How we checked it

44 assertions across two suites, green, plus 8 of 14 pre-registered predictions inside their band and the other six printed unedited. Divergence measured with a stencil written in the checker and present nowhere in the build, swept over six stencil sizes: the shipped field falls at second order to 0.0030 while the gradient field converges to a constant 14.4, which is 4,846x apart and is the difference between truncation error and a real divergence. Read with the stencil the velocity was built from, the corner terms cancel algebraically to 2.6e-14. Consequence measured by advecting 16,000 particles 800 steps into a 40 by 40 occupancy grid: 0.44 against 2.72. Five negative controls all required to fail and all failing, including a one character sign slip in the flow and a stencil proved to return exactly 2 on a field whose divergence is 2. Two real defects were caught only by opening the screenshots while both suites were green. Receipts and limits in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> Full screen drift field: thousands of particles carried by curl noise, with trails, five palettes, and one switch that flips the flow from a stream function to the plain gradient of the same noise so you can watch the picture die and refill. Picked to break the house style below: pleasant first, with the teaching reduced to a single toggle instead of a step button. Learned that a provably divergence free field does not give you a divergence free simulation, because a forward Euler step compresses area by dt^2*det(grad v) even when the divergence is exactly zero, which is worth an RMS log area drift of 0.70 over 800 steps against 0.0042 for midpoint, so the renderer changed. Learned the reverse of an instinct too: the lattice the renderer interpolates from is 400x more compressible than the analytic field and costs almost nothing, because its error alternates sign and cancels while the integrator's accumulates. And the bite was in the measurement again, not the build: wrapping a non periodic noise field onto a torus makes the seam a source and a sink, which crushed the difference between the two flows from 6.19x to 1.45x and nearly killed the whole premise.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.
