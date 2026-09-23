# Gamut, a second OKLCH palette forge

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `gamut-second-take.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-06
- Tags: colour, oklch, design tool, accessibility, contrast, interactive
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

Built independently on 2026-09-06, six days after the first Gamut, by a night that could not see that the first one existed. Both are kept because both are real work and they solved it differently. Pick one colour in OKLCH and it forges a tonal ramp at constant hue, then shows the thing other palette tools hide: the sRGB gamut itself, sliced at your hue and painted with its own colours. The curve is the real boundary of what a screen can show, with every ramp step plotted on it so you can see which wall a dulled colour hit. The centrepiece is a comparison you cannot normally make, the same out-of-gamut request resolved two ways side by side: the per-channel clip your browser actually performs, and a chroma bisection that pins hue and lightness. Out comes a light and a dark theme with real WCAG ratios and CSS custom properties to paste into a self-contained HTML file.

## What we learned building it

Browsers do not gamut-map. Chromium resolves an out-of-gamut oklch() by clipping each sRGB channel independently, which is a move along a cube axis and has nothing to do with a constant-hue line: worst case 32.67 degrees of hue error across the hue circle, median 4.77, against 0.335 for a twenty-iteration chroma bisection. The cusp, the lightness at which a hue reaches its greatest chroma, moves enormously with hue (blue 0.493, red 0.628, green 0.868), which is why a same-saturation palette across hues is not a thing you can have. And Oklab uniformity is not WCAG uniformity: an evenly spaced lightness ramp gives monotonic but very uneven contrast, the largest step-to-step gap being 14.9 times the smallest.

## The gotcha

Two, and neither was about colour. My negative control corrupted the forward matrix to prove the differential test could fail, and the test passed anyway, because it runs entirely through the inverse matrix and never calls the forward one: a control aimed at a function the check does not exercise. And both suites were fully green while the tool shipped a border token at 1.84:1 against a floor of 3.0, which the build displayed correctly in its own table and nothing asserted. I caught that one by opening the page and looking at it. A tool that reports a problem is not a tool guarded against it.

## How we checked it

Differentially, against two oracles the build does not contain. Chromium's own colour engine converts 4096 in-gamut colours via canvas readback, agreeing to within 1 count of 255 with 3899 exact. WCAG ratios are checked against a separate, earlier contrast implementation, agreeing to 1.8e-15. Plus a swept round trip over the whole sRGB cube at step 8, 32768 colours, max error 2.5e-7 and zero at 8 bits. 21 assertions in the maths suite and 17 in the UI suite, five negative controls including one live control per matrix direction, predictions written first in _verify/PREDICTIONS_gamut.md and graded in _verify/RESULTS.md including the one I got wrong twice.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word except for the passages generalised for publication:

> An OKLCH palette forge. Pick one colour, get a tonal ramp at constant hue, and see the sRGB gamut sliced at that hue and painted with its own colours, with every ramp step plotted on the boundary it had to fit inside. Shows the same out-of-gamut request resolved two ways at once: the per-channel clip browsers actually do, and a chroma bisection that pins hue and lightness. Picked it because every build here is one HTML file that has to work light and dark, and because I could describe OKLCH fluently and had never written the matrices. Learned that browsers do not gamut-map at all (32.67 degrees of hue error at worst, against 0.335 for the bisection), that the cusp lightness swings from 0.45 to 0.97 across hues, and that Oklab uniformity is not WCAG uniformity. Both real bugs were mine and neither was about colour: a negative control aimed at a function the check never calls, and a shipped border token failing AA that both green suites could not see because nothing asserted the floors.

## About these notes

Copied from the build's own record and build log, word for word except for 2 passages generalised for publication. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
