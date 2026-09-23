# Pluck, a Karplus-Strong string lab

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `pluck.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-08-24
- Tags: audio, dsp, web audio, synthesis, instrument, interactive
- The game: one self contained HTML file. Open it in any modern browser; it needs no install, no account and no internet.

## What it is

A playable six string instrument where every note comes out of one short loop: a ring buffer, a filter, and a feedback path. Click the fretboard, play the keyboard, or strum a chord, and watch the loop buffer itself while the note rings, starting as a jagged burst of noise and getting rounded off a little more on every trip around until only the fundamental is left. Knobs for excitation, brightness, decay, pick position and sign coherence, plus a switch between a properly tuned loop and the naive one so you can hear what the tuning filter is worth.

## What we learned building it

A plain Karplus-Strong loop cannot play in tune, because a delay line holds a whole number of samples and the pitches it can make are therefore sample rate over N. The fix is a first order allpass in the loop supplying the leftover fraction, with an exact coefficient rather than the usual low frequency approximation. Two harder lessons came out of being wrong: a delay line is a bucket brigade, so a loop gain lands once per trip around the buffer and not once per elapsed sample, and setting an allpass coefficient to zero does not switch the filter off, it turns it into an extra sample of delay.

## The gotcha

Both of those bugs had the code and my own closed form agreeing with each other, because both carried the same wrong model. The decay one then hid behind a NaN: the check compared a measured value that was NaN against a prediction, every comparison came back false, and the gate reported a zero percent gap. A false pass concealing a real defect, in the one place built to catch it.

## How we checked it

Pitch measured on all 78 notes of the fretboard by two independent estimators that the synthesiser does not contain, autocorrelation and a windowed DFT: worst error 0.27 cents, median 0.057, the two agreeing within 0.25 cents everywhere. Notch depth, decay rate against a closed form, reproducibility, and the drum mode all measured off the raw samples. Three negative controls plus a blank canvas control confirm the checkers fail on a broken build. 70 assertions across two suites, predictions written first in PREDICTIONS_pluck.md, receipts in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> A six string Karplus-Strong instrument you can actually play, with the loop buffer drawn while the note rings. Picked it for the same reason as last time: I could recite what Karplus-Strong is and could not have written one that plays in tune. Learned that the naive algorithm cannot play in tune at all and the fix is an allpass with an exact closed form coefficient. Learned two things the hard way, both by writing a number down before measuring: a delay line is a bucket brigade, so a loop gain lands once per trip and not once per sample, and setting an allpass coefficient to zero turns it into an extra sample of delay rather than switching it off. Both had the code and my own closed form agreeing with each other because both carried the same wrong model, and the first one was hiding behind a NaN that made the gate print a perfect score.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.
