# Courses, Xiaoan Shen, and Publications Design

## Goal

Update course ordering, add Xiaoan Shen to People, and add four verified publications to the two requested Research directions without changing the established visual design.

## Courses

- Keep the existing single teaching table in `activities.html`.
- Extend its client-side ordering in `script.js` to sort by:
  1. year descending;
  2. term order with Fall above Spring;
  3. the first listed instructor's English surname, ascending;
  4. the English course title, ascending.
- Ignore `Prof.` and `Dr.` when deriving the instructor name.
- Treat `Lamas Rodriguez` as a compound surname beginning with L.
- For a course with multiple instructors, use the first listed instructor as the sort key.
- Do not change any course content, table markup, or styling.

## People

Add one compact card to the Junior Researchers list in `people.html`:

- English name: `Xiaoan Shen`
- Chinese name: `沈笑安`
- Role: `Postdoctoral Researcher`
- Period: `Sep. 2026 –`
- Community: `Junior Researcher`
- Research direction: `Analysis & PDE`
- Research interest: `Analysis and partial differential equations.`
- Portrait initials: `XS`

Use `data-group="junior"`, `data-area="analysis-pde"`, and `data-role="postdoc"` so the existing filters and table view work without CSS changes.

## Research Publications

Use the existing publication markup, DOI links, author formatting, sorting, More/Less behavior, and yellow 2026 year class. Do not display corresponding-author asterisks or page-count labels.

### Analysis / Nonlinear PDEs / Fluid Mechanics

1. 2026 — Tianxiang Gou & Xiaoan Shen — `Nonlinear bound states with prescribed angular momentum in the mass supercritical regime` — *Journal of Differential Equations* 453, 113796 — DOI `10.1016/j.jde.2025.113796`.
2. 2024 — Xiaoan Shen & Christof Sparber — `Semiclassical wave packets for weakly nonlinear Schrödinger equations with rotation` — *Zeitschrift für angewandte Mathematik und Physik* 75, 171 — DOI `10.1007/s00033-024-02311-x`.
3. 2024 — Irina Nenciu, Xiaoan Shen & Christof Sparber — `Nonlinear bound states with prescribed angular momentum` — *Calculus of Variations and Partial Differential Equations* 63, 1 — DOI `10.1007/s00526-023-02599-z`.

The publisher's title `wave packets` has no hyphen and must be used as written.

### Pseudo-parabolic / Reaction-Diffusion / PDE-based Image Processing

4. 2026 — Yang Cao, Haomeng Chen & Huizhen Mo — `A Quasilinear Chemotaxis Model with Nonlocal Term and Nonlinear Indirect Signal Production` — *Applied Mathematics & Optimization* 94, 53 — DOI `10.1007/s00245-026-10492-2`.

The fourth title and metadata follow the publisher/Crossref capitalization and the normalized DOI containing hyphens.

## Verification

- Confirm the rendered course order is year descending, Fall before Spring, instructor surname ascending, then course title ascending.
- Confirm the 12 existing courses retain all original content.
- Confirm exactly one Xiaoan Shen / 沈笑安 card exists and appears in both card and table views with the requested role, period, direction, and research interest.
- Confirm each new DOI and normalized title appears exactly once in the requested Research list.
- Confirm only the two new 2026 publications receive `publication-year-2026`; the two 2024 publications remain normal and are covered by the existing More/Less behavior.
- Parse the modified HTML, run JavaScript syntax checking and `git diff --check`, and confirm no CSS or unrelated content changed.
