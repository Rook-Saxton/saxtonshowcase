# Slingshot

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `slingshot.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-14
- Tags: game, physics, orbital mechanics, canvas, puzzle, interactive
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

Nine levels of one problem: a probe, some gravity, and a station you have to reach. One shot per attempt and no engine, so once you let go the only thing steering is whatever the planets do. Drag to aim or nudge it with the arrow keys, swing around a heavy world to let it do the turning for you, thread two offset wells, or time a crossing against a moon that will not hold still. The dotted arc while you aim is not a sketch of where you will go, it is where you will go: it comes from running the same integrator over the same state.

## What we learned building it

Bodies here carry mu, the standard gravitational parameter, rather than a mass and a separate G, which is how orbital mechanics actually does it and deletes a constant that only exists to be cancelled again. Velocity Verlet does not conserve energy and is not trying to: it conserves a nearby shadow quantity, so energy wobbles inside a band of 9.5e-11 forever, while forward Euler on the identical initial condition climbs out of the well by 52% and never comes back. Angular momentum, though, is conserved outright, to 3.5e-14 over 71,086 steps. And the collision test is the regularization: gravity has a singularity at r = 0 and the usual fix is a softening term that quietly changes the orbit you are simulating, but a probe inside a planet is a crash, so r can never get small and no softening is needed.

## The gotcha

The win rate was the wrong number. A census of 10,800 launches per level said every level was winnable at about 1.2% of the launch space, which sounds like a measurement and says nothing: 128 scattered single-cell solutions and 128 in one band are the same percentage and a completely different game. Measuring the widest run of consecutive winning angles instead is what showed the levels were actually playable. Separately, two of the three real defects were found by looking at a screenshot while both suites were green, and the second of those is the uncomfortable one: the off-screen marker was drawn correctly and was still nearly invisible, faintest exactly where it mattered most.

## How we checked it

52 assertions across two suites, green, with predictions written first in _verify/PREDICTIONS_slingshot.md and both misses recorded rather than edited away. Period, energy, radius and angular momentum are all checked against Kepler and vis-viva worked out on paper before the simulation existed: period 5.9238825s against a hand-derived 5.9238439s. Six negative controls, all required to fail and all failing, including a frozen-field aiming arc that drifts 10.67 world units in two seconds and a solvability sweep proven able to report zero. Every level's full launch space is swept and the census reconciles in all nine rows. The game itself is driven through real pointer drags, real keypresses and real clicks, and a flight accumulated frame by frame lands on the identical endpoint as a straight-through simulation. Receipts in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> A ballistic orbital puzzle. Nine levels, a probe, no engine, and a station to reach; the dotted aiming arc is literally the flight path because it comes from the same integrator on a copy of the same state. Picked it to break the house style the note below called out: this one has no step button, no inspector and explains nothing about itself. Learned that velocity Verlet does not conserve energy and is not trying to, it conserves a shadow quantity so energy wobbles in a band of 9.5e-11 forever while forward Euler climbs out of the well by 52%, and that angular momentum by contrast is conserved outright to 3.5e-14. Learned that the collision test is the regularization, so no softening term is needed. The expensive lesson was about measurement rather than physics: the win rate over the launch space is the wrong number and the widest contiguous band of winning angles is the right one. Two of the three real defects were found by looking at a screenshot with both suites green, and both graded prediction misses were in the checker, not the build.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
