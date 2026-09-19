# Amy visual design field notes

Updated: 2026-09-18

This is the house judgment for sites and small tools Amy ships. It is a working standard, not a trend scrapbook.

## The read on 2026

The clean SaaS starter-kit look has become a tell: centered hero, blue-purple glow, Inter or Geist everywhere, three equal rounded cards, soft shadows, vague claims, and every corner at the same radius. It no longer reads as polished. It reads as generated.

The better work now has a point of view you can name in one sentence. It uses fewer visual ideas, repeats them harder, and sweats the quiet interaction details. Human-made marks are useful only when they belong to the story. Random squiggles pasted onto a generic layout are still generic.

## Rules for Amy's work

1. **Start with a real-world metaphor.** A shelf, counter, noticeboard, field guide, receipt, or local paper can govern the layout, labels, motion, and materials. Do not mix metaphors.
2. **Use one display face with character and one boring reading face.** Type is the identity. Do not let a gradient do that job. Avoid the default AI stack unless the product's story calls for it.
3. **Break symmetry on purpose.** One oversized item, a narrow side rail, uneven columns, or an off-center title is enough. Keep the reading order obvious.
4. **Let useful things look used.** Fold lines, ink spread, faded stamps, pencil edits, tape, crop marks, and local photography can build trust. Use a small, consistent set rather than random noise.
5. **Write labels a person would use.** "On the shelf," "Needs fixing," and "Made this week" beat "Explore solutions" and "Unlock value." Delete meta copy that explains how clever the interface is.
6. **Make controls feel physical without turning them into toys.** Buttons should move a couple of pixels, selected states should look selected, and hover should reveal one helpful detail. No floating blobs, glass panels, or motion for motion's sake.
7. **Vary radius by meaning.** Paper can be square. A tag can be pill-shaped. A button can have a small radius. One 16px radius on everything erases hierarchy.
8. **Design the empty and rough states.** A workbench should look active before it is full. Show real notes, dates, version marks, and what is being worked on next.
9. **Use local proof, not decorative content.** Real street names, business types, dates, weather, photos, and scraps from the town make a local tool believable. Fake charts and generic testimonials do the opposite.
10. **Check at phone width first.** The personality must survive at 390px without collapsing into a stack of identical cards.

## Anti-slop check before shipping

Fail the build if three or more are true:

- centered headline over a gradient glow
- every section is a rounded card
- Inter/Geist plus a purple-to-blue palette
- three equal feature cards
- generic words such as "powerful," "seamless," "transform," or "unlock"
- stock icons with no house drawing style
- fade-up animation on every section
- decoration that cannot be explained by the chosen metaphor
- fake data, fake reviews, or fake local detail
- a screenshot could belong to fifty other AI tools

## Interaction finish

- Keep hover motion under roughly 160ms and small enough that nothing jumps.
- Give pressed states a physical response.
- Preserve focus rings and contrast. Handmade is not permission to be hard to use.
- Show loading near the thing that is loading.
- Prefer instant local feedback, then reconcile with the server.
- Respect reduced-motion settings.
- Test long names, narrow phones, empty lists, errors, and slow responses.

## Four viable directions for Saxton Showcase

### 1. The Counter
A small-town shop counter after a busy day. Warm butcher paper, grease-pencil labels, stamped versions, uneven product cards, dark green and tomato red. Friendly and useful, not precious.

### 2. The Local Paper
A weekly newspaper insert. Big condensed headlines, cream newsprint, black rules, one spot red, dense snippets, issue/date language. Strongest editorial identity and easiest to expand.

### 3. The Parts Drawer
A garage or workshop inventory system. Kraft labels, steel blue, safety orange, monospace part numbers, square modules and sliding drawer cues. Best if the shelf should feel like working tools rather than a portfolio.

### 4. The Field Guide
A naturalist's pocket guide to useful software. Quiet green ink, annotated diagrams, specimen numbers, deckled paper edges, marginal notes. The calmest option and the least likely to age badly.

## Sources and what they changed

- Nielsen Norman Group, "Handmade Designs: The New Trust Signal" (2026-04-10): human-made signals work when they feel tied to authorship and trust, not when they are decoration. https://www.nngroup.com/articles/handmade-designs/
- Linear Method: narrow the work, write it down, and treat quality as a repeated practice rather than a final polish pass. https://linear.app/method
- Rauno Freiberg, "Invisible Details of Interaction Design": interaction quality comes from many small timing, state, and feedback decisions. https://rauno.me/craft/interaction-design
- Dani Asyrofi, "Interface Tuning": a field guide to concrete interface details from shipped products. https://daniasyrofi.com/writing/details-that-make-interfaces-feel-better/
- Awwwards brutalism collection: current evidence that raw type, hard rules, and visible structure can still carry premium work when the content stays legible. https://www.awwwards.com/awwwards/collections/brutalism/
- Setproduct, "Retro and brutalist UI design: a 2026 field guide": hard borders, pixel cues, and stripped-back interaction are returning in indie work, but they need restraint. https://www.setproduct.com/blog/retro-brutalist-ui-design-2026
- Sailop, "The Complete Guide to Anti-AI Design in 2026": useful as a practitioner critique of the repeated AI frontend defaults. Treat it as commentary, not research authority. https://sailop.com/blog/complete-guide-anti-ai-design-2026

## One call

Do not make all four. Pick one metaphor and go deep. For Saxton Showcase, **The Local Paper** is the strongest next version: it gives Amy a recognizable voice, handles a growing catalog cleanly, and can use real Perrysburg detail without looking like a craft-store theme. The Counter is the warmer fallback.
