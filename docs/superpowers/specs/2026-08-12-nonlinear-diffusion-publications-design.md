# Nonlinear Diffusion Publications Design

## Goal

Update only the Publications list in the `Nonlinear Diffusion & Image Processing` section of `research.html` with the publications supplied by the user.

## Scope

- Add 11 publications to the existing `<ol class="publication-list">` under `#nonlinear-diffusion-image-processing`.
- Do not modify any other research direction, page section, CSS rule, or JavaScript behavior.
- Keep the existing publication entry markup, responsive layout, client-side ordering, and More/Less behavior.
- Do not display corresponding-author asterisks because the existing website author format does not use them.

## Deduplication

The 15 supplied records contain 13 unique titles. Two duplicate pairs are merged:

- The two records for “Global boundedness and asymptotic stability of the Keller-Segel system with growth source in the whole space” become one entry using the verified article number 133.
- The two records for “Global boundedness and asymptotic stability of the attraction-repulsion chemotaxis system with nonlinear productions and logistic-type source on ℝN” become one entry.

Two of the remaining unique titles already exist in the target list and will not be added or edited:

- “Monotone traveling waves for the viscous Nicholson’s blowflies equation.”
- “A diffusive intraguild predation model with variable carrying capacity proportional to the same biotic resource.”

The resulting net addition is 11 publications.

## Entries to Add

1. **2026** — Qingchun Li & Haomeng Chen. “Global boundedness and asymptotic stability of the attraction-repulsion chemotaxis system with nonlinear productions and logistic-type source on ℝN.” *Discrete and Continuous Dynamical Systems - B* 33, 398–422. DOI: `10.3934/dcdsb.2025157`.
2. **2026** — Haomeng Chen. “Stability of traveling wavefronts for viscous Nicholson’s blowflies equation.” *Communications in Nonlinear Science and Numerical Simulation* 159, 109917. DOI: `10.1016/j.cnsns.2026.109917`.
3. **2025** — Yong Luo, Jingxue Yin & Liting You. “Sharp life span of semilinear heat equations with large and small scaled inner and initial sources.” *Journal of Differential Equations* 419, 481–504. DOI: `10.1016/j.jde.2024.12.001`.
4. **2025** — Jinhuan Wang, Haomeng Chen & Mengdi Zhuang. “Global existence of solutions to a Keller-Segel model with logistic source in ℝ2.” *Discrete and Continuous Dynamical Systems - B* 30(8), 2806–2821. DOI: `10.3934/dcdsb.2024191`.
5. **2025** — Qingchun Li & Haomeng Chen. “Global boundedness and asymptotic stability of the Keller-Segel system with growth source in the whole space.” *Nonlinear Differential Equations and Applications NoDEA* 32, 133. DOI: `10.1007/s00030-025-01134-7`.
6. **2024** — Liting You, Jingxue Yin & Yong Luo. “Optimal estimate on life span for semilinear heat equations with non-rarefied sources at infinity.” *Journal of Differential Equations* 394, 278–295. DOI: `10.1016/j.jde.2024.02.038`.
7. **2024** — Bo Liang, Qingchun Li, Yongbo Zhu & Yongzheng Zhu. “Existence and Asymptotic Behaviors to a Nonlinear Fourth-order Parabolic Equation with a General Source.” *Taiwanese Journal of Mathematics* 28(5), 969–990. DOI: `10.11650/tjm/240404`.
8. **2023** — Zhiyong Wang, Jingxue Yin & Liting You. “Life span of solutions for a semilinear heat equation with inhomogeneous source.” *Journal of Differential Equations* 350, 189–201. DOI: `10.1016/j.jde.2022.12.028`.
9. **2023** — Jinhuan Wang, Haomeng Chen & Mengdi Zhuang. “Global boundedness of weak solutions to a chemotaxis–haptotaxis model with p-Laplacian diffusion.” *Zeitschrift für angewandte Mathematik und Physik* 74, 223. DOI: `10.1007/s00033-023-02113-7`.
10. **2022** — Liting You, Huijuan Song & Jingxue Yin. “Multiplicity of solutions of the weighted p-Laplacian with isolated singularity and diffusion suppressed by convection.” *Chinese Annals of Mathematics, Series B* 43(5), 643–658. DOI: `10.1007/s11401-022-0351-4`.
11. **2022** — Bo Liang, Qingchun Li, Jihong Zhang & Ying Wang. “Existence of solutions to a doubly degenerate fourth-order parabolic equation.” *Applied Mathematics and Computation* 413, 126650, 10 pp. DOI: `10.1016/j.amc.2021.126650`.

In HTML, ℝ2 and ℝN will be rendered as ℝ with superscript 2 and N.

## Presentation

- Each added item will use the existing `year / authors / linked title / venue` structure.
- Each title will link directly to its DOI URL and open in a new tab with the same link attributes as existing entries.
- The two new 2026 year spans will use `publication-year-2026`, producing the same yellow year text as current 2026 publications.
- Other years will use ordinary year spans.
- Existing JavaScript will order entries by descending year and first-author surname. Publications before 2025 will remain behind the existing More control.

## Verification

- Parse `research.html` and confirm every target publication item has one year, author block, title link, and venue line.
- Normalize titles and confirm all publication titles in the target list are unique.
- Confirm exactly 11 net items are added and exactly two new items use the 2026 yellow-year class.
- Confirm all 11 DOI links use HTTPS and the existing external-link safety attributes.
- Run `git diff --check` and confirm no file outside the intended design record and `research.html` is changed during the workflow.
- Preview `research.html#nonlinear-diffusion-image-processing` at desktop and mobile widths, verify ordering, wrapping, the yellow 2026 years, and the More/Less behavior.
