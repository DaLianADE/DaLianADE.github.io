# People and Publication Labels Design

## Goal

Make three text-only corrections while preserving the existing page structure and styling.

## Changes

1. In the unique Qingchun Li / 李清纯 card in `people.html`, replace the complete `person-research` text with `Chemotaxis systems.`
2. In `research.html`, append ` (in Chinese)` to the title “An overview of recent studies on the pseudo-parabolic equation” and remove ` · In Chinese` from its venue line.
3. In `research.html`, remove `, 10 pp.` from the venue line for “Existence of solutions to a doubly degenerate fourth-order parabolic equation,” leaving `Applied Mathematics and Computation 413, 126650`.

## Constraints

- Do not change Qingchun Li’s name, role, period, area, or publication authorship.
- Do not change either publication’s year, authors, title wording other than the language label, link, journal, volume, issue, pages, or article number.
- Do not modify CSS, JavaScript, or any other page content.

## Verification

- Confirm exactly one `Chemotaxis systems.` field exists in Qingchun Li’s card and the old research-interest text is absent from that card.
- Confirm `(in Chinese)` appears in the intended title and no longer appears in the venue line.
- Confirm `10 pp.` is absent and article number `126650` remains.
- Parse the modified HTML, run `git diff --check`, and confirm the final net diff contains only the three approved text edits in `people.html` and `research.html`.
