# Practical Information Section Design

## Goal

Add a `Practical Information` entry immediately after `Useful PDFs Available` on the Open Positions page. The entry links to a new section on the same page containing only the information shown in the user's cropped reference image.

## Scope

- Add one `Practical Information` link to the existing `On this page` navigation in `positions.html`.
- Add one matching section immediately after the existing `Useful PDFs Available` section.
- Include exactly two list items:
  1. `Dalian - Wikitravel`, followed by the supplied description of Dalian.
  2. `Dalian University of Technology`, followed by a `Campus Map` link and the supplied Lingshui campus sentence.
- Use native HTML text and links rather than embedding the reference image.
- Open all three external links in a new tab with safe external-link attributes.
- Reuse the site's existing typography, colors, spacing, reveal behavior, and responsive layout. Add only narrowly scoped CSS if needed for the new list.

## Link Targets

- Dalian - Wikitravel: `https://wikitravel.org/en/Dalian`
- Dalian University of Technology: `https://en.dlut.edu.cn/index.htm`
- Campus Map: `https://en.dlut.edu.cn/Campus_Life/Maps___Transportation.htm`

## Content

The section body will reproduce the reference text exactly:

- `Dalian (大连; Dàlián) is the second-largest city in Liaoning Province in Northeast China (Dongbei) and the largest port in Northeast China. It is also a major tourist destination for Chinese visitors.`
- `Our workshop takes place at the main (Lingshui, 凌水) campus.`

## Accessibility and Behavior

- The navigation link and section use the same `#practical-information` anchor.
- The section heading is associated through `aria-labelledby`.
- Links remain keyboard accessible and visually identifiable.
- The new section must not introduce horizontal scrolling at mobile widths.

## Verification

- Confirm the new navigation entry appears immediately below `Useful PDFs Available`.
- Confirm the entry scrolls to the new section.
- Confirm only the requested two items appear in the section.
- Confirm all three external links have the intended targets and open in a new tab.
- Preview the page at desktop and approximately 560-pixel mobile widths.
- Confirm no files or page content outside this narrowly defined change are altered.

## Non-goals

- Do not embed either screenshot.
- Do not copy any other content from the reference website.
- Do not change other pages, existing text, navigation entries, PDFs, JavaScript, or unrelated styles.
