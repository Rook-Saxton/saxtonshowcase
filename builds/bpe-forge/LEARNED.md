# BPE Forge

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `bpe-forge.html`, the game itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-08-21
- Tags: tokenization, text, language, teaching explainer, interactive
- The game: one self contained HTML file. Open it in a current browser; it needs no install, no account and no internet, though some builds need WebGL2 or sound.

## What it is

Train a byte pair encoding tokenizer from scratch, in the browser, on text you paste, and then use the thing you just made. Step it one merge at a time and watch which candidate pairs lost and by how much, tokenize anything with the vocabulary you built, click a token to trace it from raw bytes up through every merge that fired, and hunt the corpus for words where rank ordered merging and plain longest match cut the same word in different places. Trains its own vocabulary only: it is nobody's real tokenizer and its token IDs mean nothing outside the page.

## What we learned building it

The capital G with a dot that shows up in front of words in token dumps is an offset, not a decision. Byte level BPE cannot run on raw bytes, so all 256 values are rehoused on printable code points; 188 are already printable and keep their own, and the other 68 stack from U+0100 upward in byte order. Space is byte 32 and the 33rd homeless byte, so it lands on U+0120. Also: counting pairs and merging pairs only disagree when both halves are the same symbol, because two occurrences of (a,b) with a != b cannot overlap. And encoding is not longest match, it is lowest rank first, which is why a vocabulary alone is not a tokenizer.

## The gotcha

The compression curve was sampled once per batch of merges instead of once per merge, so it drew a straight line between two points and showed the exact opposite of the diminishing returns it exists to demonstrate. All 79 correctness assertions passed while that chart was lying, because none of them was about the chart. Same lesson the last build paid for in a different costume: auditing the numbers does not audit the picture. Measuring every merge instead cost 177ms for the whole run.

## How we checked it

152 assertions across two suites, green. Hand derived constants the build has to reproduce: 188 kept bytes, 68 displaced, byte 32 to U+0120, and a four merge training ladder worked out on paper (counts 23, 9, 6, 4) whose vocabulary provably cuts 'xabc' two different ways. An exact arithmetic identity, corpus shrinkage equals the sum of every recorded merge count, checked to the unit on five corpora. Encoder output cross-checked against the trainer's own word states through a separate code path. Four negative controls all required to fail and all failing, including the naive overlapping pair counter, which reports 48 for a merge it applies 24 times. Receipts in _verify/RESULTS.md.

## Why Amy picked it

Amy is the AI helper that built it. Her build log entry, word for word:

> Train a byte pair encoding tokenizer live on text you paste, then use it: watch the merges get chosen, tokenize anything, trace one chunk from raw bytes to its tokens, and find the words where rank ordered merging and longest match disagree. Picked it because tokens are the unit everything here is measured in and they are invisible, and because I could describe BPE but had never written the byte remapping, the non-overlapping pair count, or rank ordered encoding by hand. Learned that the capital G in token dumps is an offset rather than a decision, that counting and merging only disagree when both halves of a pair are the same symbol, and that a vocabulary without its merge order is not a tokenizer.

## About these notes

Copied word for word from the build's own record and build log. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
