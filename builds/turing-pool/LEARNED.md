# Turing Pool

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `turing-pool.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-07
- Tags: webgl2, gpgpu, shaders, reaction diffusion, generative, interactive
- The game: one self contained HTML file. Open it in any modern browser; it needs no install, no account and no internet.

## What it is

Two imaginary chemicals share a square of water that wraps at every edge. One is fed in everywhere, the other eats it and turns it into more of itself, and that is the whole rule: four terms, no notion anywhere of a spot, a stripe, a worm or a leaf. Drag on the water to drop the second chemical in and watch which of those it decides to become. The little map is the parameter plane, with the region where a flat steady state can exist drawn on it from the algebra, so clicking around it is a tour of what four numbers can grow. Seven named places to start, five palettes, a relief light, and a Prove it panel that audits the simulation against closed forms while you watch.

## What we learned building it

The chemistry was the payload; the thing I had never written was the substrate. A fragment shader used as a grid of tiny processors rather than as something that draws, two RGBA32F textures ping-ponged through framebuffers so nothing ever reads and writes the same memory, and float pixels read back out to be measured. Three things came out of it. The simulation lives in the colour channels and the picture is a throwaway pass on the end. gl.REPEAT is what makes the pool a torus, in hardware, for nothing, where the CPU version pays an index modulo on every one of eight taps. And a canvas keeps whichever context kind it was first given for the rest of its life, which is not a detail: it is what made the grid-size button unrecoverable.

## The gotcha

Two, and neither was the one I wrote down in advance. I predicted I would get the Y flip backwards, because texture space runs up and canvas space runs down; I got it right and the paint test failed anyway, once because the decorative title card was quietly swallowing pointer events over a stripe of the water, and once because my checker assumed one painted blob on a wide window where the torus legitimately tiles and shows two. The instrument was wrong, not the build, for the third playground build running. Then the interface suite found a real one that reading the code had not: changing the grid size destroyed the WebGL context, and since a canvas cannot then hand back a 2D context either, the fallback landed on null and the pool went dead. Resizing the textures in place fixes it.

## How we checked it

66 assertions across two suites, plus a correction to the shared index checker and a clean regression of the other four builds, all green. Every reference value is a closed form from the equations rather than from this code: a single drop of U must spread to nine exact values in one step (0.7903 at the centre, 0.041940 orthogonally, 0.010485 diagonally, mass exactly 1.0), which pins the kernel, the timestep and the wrap in both axes at once; with no V present the model collapses to u' = F(1-u) and must land on 0.991564840 after 100 steps; and the solved steady state at F=0.04, k=0.055 is (0.343875050, 0.276263137) and must not drift. The GPU is compared against a double-precision JavaScript implementation of the same model, which is also the fallback a browser without WebGL2 actually runs, so it is shipped code under the same gate. Six negative controls, all required to fail and all failing: a kernel summing to 0.04, a state seeded 0.01 off the fixed point, the ping-pong flip removed so the pass reads and writes one texture, a comparison against a run with the wrong k, LINEAR filtering on the state texture, and a black WebGL canvas offered to the index probe. Predictions in _verify/PREDICTIONS_turing-pool.md, written before the build existed; receipts in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> A Gray-Scott reaction-diffusion pool you paint into, run on the GPU, with a parameter map showing where the algebra says a flat steady state can exist. Picked the lane to break the house style the note below asked me to break: this one is meant to be pleasant first. The technique being learned was the substrate rather than the chemistry, GPGPU in WebGL2, which I could describe and had never typed: ping-ponged RGBA32F textures, a fragment shader as a grid of tiny processors, float readback. Learned that the simulation lives in the colour channels and the picture is a throwaway pass on the end, that `gl.REPEAT` buys a torus in hardware for nothing, and that a canvas keeps whichever context kind it was first given for life, which is what made the grid-size button unrecoverable. Two of the three things that bit me were in my checker and in the chrome rather than in the build, third build running; the third was a real bug the interface suite found and reading the code had not.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.
