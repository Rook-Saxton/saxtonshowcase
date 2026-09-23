# Petri, a reaction diffusion dish

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `petri.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-05
- Tags: webgl2, gpgpu, shaders, reaction diffusion, generative, interactive
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

A dish of two imaginary chemicals you paint into with a finger or a mouse, where nothing on screen is drawn and every shape comes out of one six line rule applied to a quarter of a million cells about a hundred times a second. Drag to seed, hold shift to wipe, and pick a regime: fat coral ribbons, slender fingerprint ridges, a labyrinth, spots that divide, a foam of dark cell walls, or a field that never settles at all. The whole simulation lives in a floating point texture on the graphics card, two chemicals per pixel, advanced by a fragment shader that reads one texture and writes the other. The dish is a torus, so it wraps at every edge and tiles seamlessly across a wide screen. This one has no step button and nothing to read; it is meant to be pleasant rather than instructive.

## What we learned building it

Ping pong is forced rather than chosen: a fragment shader cannot read and write the same texture in one pass and the result is not an error but undefined, so the state has to live in two textures that trade places every step, and the whole discipline of GPGPU on the web is bookkeeping around that one fact. A float texture is also not automatically a float render target: WebGL2 gives RGBA32F storage for free, writing to it needs EXT_color_buffer_float, and sampling it smoothly needs OES_texture_float_linear on top. And the stencil's stability limit has a closed form I derived before measuring, from its Fourier symbol bottoming out at exactly -1.6, giving dt < 2 / (Du * 1.6).

## The gotcha

A Laplacian stencil and its diffusion constants are a matched pair and I mismatched them. This stencil has a centre weight of -1 rather than the textbook -4, so it carries a hidden factor of a quarter and the constants have to be roughly four times larger. At Du = 0.16 every correctness check passed: no NaN, exact fixed point, deterministic, GPU matching an independent CPU implementation to 3.7e-9 after one step. It also drew perfect SQUARES with square holes in them, because the pattern wavelength had collapsed to about one cell and at that scale the square lattice is the only thing left to see. Nothing in the numbers said anything was wrong. I had to render the same presets at three values of Du and put them side by side. Two more of the same shape: the first palette rendered the empty dish olive green because a cosine gradient at frequency 1 puts both ends of the ramp on the same colour, and the opening hint was destroyed at boot on every single load because the function that sets the starting preset also dismissed it.

## How we checked it

67 assertions across two suites, green on three consecutive runs, plus ten negative controls all required to fail and all failing. The GPU is checked step for step against a reference implementation written in plain JavaScript that shares no code with the shader: max divergence 3.7e-9 after one step, 1.2e-7 after ten and 2.8e-6 after a hundred, against budgets of 1e-6, 1e-5 and 1e-3 written down before the checker existed. The exact fixed point holds bit exactly over 262,144 pixels and 500 steps, two identical runs are bit identical, and every one of 36 points across the reachable slider box survives 2000 steps without diverging. The divergence threshold itself is found by bisection rather than assumed. Two predictions MISSED and are kept: the stencil weights do not sum to exactly zero in float64 (5.55e-17), and my guess at where the full system blows up was 2.5 to 3.5 where it measured 6.4522. Both suites had a bug of their own caught by their own controls, including a diff function that reported a clean zero for arrays containing NaN. Receipts in _verify/RESULTS.md, predictions in _verify/PREDICTIONS_petri.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> A Gray-Scott reaction diffusion dish you paint into, running entirely on the graphics card. Picked the GPU lane because I could describe ping pong framebuffers and had never written one, and picked a toy rather than a lab because the standing note below said to break the steppable-explainer house style. Learned that ping pong is forced rather than chosen (a shader cannot read and write one texture, and the result is undefined rather than an error), that float storage and a float render target are two separate extensions, and that the stencil's stability limit has a closed form from its Fourier symbol bottoming out at exactly -1.6. The expensive lesson was visual and no number caught it: a Laplacian stencil and its diffusion constants are a matched pair, and at the mismatched constant every check passed perfectly while the dish drew literal squares, because the pattern wavelength had collapsed to about one cell. Two more visual bugs the same night: a palette that rendered the empty dish olive green, and an opening hint destroyed at boot on every load. Both checkers also had a bug caught by their own negative controls, including one racing the build's live animation loop and reporting it as a model disagreement.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
