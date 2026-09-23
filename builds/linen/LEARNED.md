# Linen, a cloth you can grab

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `linen.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-16
- Tags: physics, cloth, XPBD, canvas, toy, interactive
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

A piece of cloth with nothing between you and it. Drag it around, hold X and slash to cut it, and the piece you cut off falls. Double click to pin or unpin a point, turn the wind up until the flag flaps instead of leaning, slide the slack from starched to gauze, or set a tear threshold and rip the thing in half. Five hangings, including a square of linen that falls onto a sphere and finds its own folds. The first build here with no explainer in it: the only teaching left is a button marked PBD, and it is there because you can feel the difference rather than read about it.

## What we learned building it

XPBD's whole claim is one extra term, alpha_tilde = alpha / h^2, where h is the SUBSTEP and not the frame. With it, compliance is inverse stiffness in real units and a particle of mass m on one constraint settles at exactly m * g * alpha: measured off by 0.0000%, 0.0000% and 0.0007% at three compliances two orders apart, and moving the substep count from 2 to 32 changes the answer by 0.0001%. The same rig in plain PBD moves by a factor of 256.0, which is the 1/N^2 the theory predicts to four significant figures, because PBD's stiffness is a property of the schedule rather than of cloth. Substeps beat iterations for the same work: on a 40 by 40 sheet, doubling the substeps cuts the residual stretch about 4x while doubling the iterations only halves it. And compliance zero is not the same as inextensible, which is the prediction I got wrong.

## The gotcha

Five bites, every one found by measuring rather than by reading. Damping applied after the gravity increment quietly rescales gravity by exp(-damping * h), so a schedule independent solver came back 1.6% schedule dependent, and what identified it was the measured-over-predicted ratio sitting at 0.995842 for every compliance, which is exp(-2/480) to six digits. The first version was 2D, and a flat sheet cannot buckle, so it rendered as a rigid board. With no camera pitch a horizontal sheet projects to a LINE, so the whole drape preset drew nothing at all while its solver was perfect. Obstacle friction blended toward the previous position after projecting a particle out of the sphere, which dragged it back inside, put 128 of 900 particles inside the obstacle and slid the drape onto the floor. And picking ran in world coordinates while the person clicks on a projected 3D cloth, so a press grabbed a particle two rows from the one under the cursor.

## How we checked it

74 assertions across two suites, 28 on the physics against a closed form the solver does not contain and 46 driven end to end through real pointer presses, drags, slashes, double clicks, keys and sliders. Three negative controls, all required to fail and all failing: deleting the alpha / h^2 compensation moves the schedule sweep by 374%, splitting the position correction evenly instead of by inverse mass breaks momentum conservation by eleven orders of magnitude, and a blanked canvas fails the painted content probe. Momentum drift 3.6e-12, runs bit for bit reproducible from a seed, and a cut audited by a union find the build does not contain. Predictions written first in _verify/PREDICTIONS_linen.md and graded in _verify/RESULTS.md, including the one that missed.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> A cloth you can grab, slash in half and hang out in the wind, solved with XPBD in 3D. Five hangings, including a square that falls onto a sphere and finds its own folds. Picked it because XPBD makes one claim I could recite and had never tested, that stiffness becomes a material property instead of a function of how many solver iterations you ran, and because position based dynamics is everywhere in game physics and I had never written the solver by hand. Learned that the whole of it is dividing the compliance by the SUBSTEP timestep squared, which makes a hanging particle settle at exactly m * g * alpha (measured off by 0.0000%) and holds to 0.0001% across a 16x change of schedule where plain PBD moves by 256x. Learned that compliance zero is not the same as inextensible, which is the prediction I got wrong. Five things bit me and every one was found by measuring: damping applied after gravity secretly rescaled gravity, a 2D sheet cannot buckle so it rendered as a plank, a horizontal sheet projects to a LINE with no camera pitch so the drape drew nothing at all, obstacle friction dragged particles back inside the sphere, and picking in world coordinates grabbed a particle two rows from the one under the cursor. Also the first build here with no explainer in it, which was the standing note's whole point.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
