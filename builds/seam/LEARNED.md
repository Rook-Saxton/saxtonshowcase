# Seam, a diff with the work showing

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `seam.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-22
- Tags: algorithms, diff, myers, text, tool, interactive
- The game: one self contained HTML file. Open it in any modern browser; it needs no install, no account and no internet.

## What it is

A line diff tool with three engines running on every input: a textbook dynamic program that fills the whole grid, Myers' 1986 greedy search that walks it by edit distance, and Myers' linear-space version that throws the path away and recovers it from both ends. All three must return the same number, and the stats strip says on screen whether they did and whether the edit script actually replays A into B. Side by side with word level highlighting inside changed lines, unified, and a third view that draws the grid the search is crossing, with a slider that pushes the frontier out one edit at a time. Eight worked examples, and both texts are editable.

## What we learned building it

The comparison everybody writes as a tie-break is not one: it picks the furthest reach, and the real tie is when stepping down and stepping right land on the same column. That is common rather than rare, 54,120 tie points across 4,000 random pairs, and taking the other side changes the script on 1,927 of them and the distance on none; it is also why a diff shows the minus before the plus. Writing the comparison as <= instead of < silently returns valid non-minimal scripts on 526 of those pairs. The linear-space engine is not a time-for-memory trade: it costs 1.054x the greedy search, because searching from both ends stops the top level at half the distance (19,403 slots against 38,365) and each level below halves again, summing to 2.085x the top. Memory does collapse, 77,283 retained slots to 1,606, flat at about 4 per input line from n=50 to n=400 while the greedy figure climbs from 51.8 to 389.2.

## The gotcha

The linear-space engine was wrong on 276 of the first 300 random pairs from one sign in the reverse overlap bracket, and it still produced scripts that replayed A into B perfectly; only a comparison against a separate engine caught it. A negative control then showed the same shape from the other side: mis-placing the single edit in the recursion's base case does not change the edit distance at all, so a suite that compared distances and stopped there would have been green on a broken engine. Three fixtures in a row claimed to contain a tie and did not, each for a different reason, and the real one was found by searching 4,000 random pairs instead of by reasoning. The fold-long-runs feature had no example long enough to trigger it, so the interface suite was asserting against a question nothing could answer.

## How we checked it

76 assertions across two suites, 42 on the algorithms and 34 driven only through real clicks, typing, a pointer drag of the slider and the fixture dropdown. Predictions written in PREDICTIONS_seam.md before the build existed; three missed and each miss is asserted as measured with the miss recorded rather than edited away. GNU diff is the outside oracle and shares nothing with the build: it agrees with seam on all 8 fixtures and at 200 and 2,000 random lines, and its own heuristics first cost it minimality between 6,000 and 7,000 lines (9,450 against 9,438). Nine negative controls, every one required to fail, including two that were found to be testing nothing and rewritten. Receipts in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> A line diff tool. Three engines on every input, a textbook dynamic program, Myers' 1986 greedy O(ND) search and Myers' linear-space middle-snake version, all required to return the same number, with the stats strip reporting on screen whether they agreed and whether the edit script actually replays A into B. Side by side with word level highlighting, unified, and a third view that draws the grid the search is crossing. Picked a TOOL because eleven of the twelve rows above this one carry physics or simulation in their genre, which is the shared SHAPE this file's own note says to watch for, and picked diff because GNU diff is on the same machine as an outside oracle that shares nothing with my code. Learned that the comparison everyone calls the tie-break is not one (it picks the furthest reach; the real tie is when down and right land on the same column, it happens 54,120 times in 4,000 random pairs, and it is why a diff shows the minus before the plus), that writing it `<=` instead of `<` silently returns valid non-minimal scripts on 526 of those pairs, that the linear-space engine costs 1.054x the greedy one rather than the 1.5x to 3x I predicted because searching from both ends halves the top level and every level below halves again, that two random texts over 26 symbols share 0.31 of their length and not the 0.39 that 2/sqrt(k) predicts, and that GNU diff's own heuristics first cost it minimality between 6,000 and 7,000 lines. Bit by a sign error that made the linear engine non-minimal on 276 of 300 pairs while still producing scripts that replayed perfectly, by three fixtures in a row that claimed to contain a tie and did not, and by a feature with no example long enough to trigger it.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.
