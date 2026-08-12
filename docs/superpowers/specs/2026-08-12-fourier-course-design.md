# Fourier Analysis Course Entry Design

## Goal

Add one course entry to the existing Teaching Activities table on `activities.html`.

## Course Entry

- Semester: `Fall 2026`
- English title: `Fourier Analysis and Differential Equations`
- Chinese title: `傅里叶分析与微分方程`
- Instructor: `Prof. Xian Liao`
- Instructor Chinese name: `廖娴`
- Links & notes: `Graduate course`

## Implementation

- Add one standard `.teaching-list-row` matching the existing course markup.
- Do not add a course link or use the featured-row style.
- Rely on the existing teaching chronology script to group the new entry with the other `Fall 2026` courses.
- Do not change existing courses, styles, scripts, navigation, or other pages.

## Verification

- Confirm the new entry contains all six approved values exactly.
- Confirm the Teaching Activities table has one additional course row.
- Confirm the existing script places the entry in the `Fall 2026` group.
- Confirm the row renders correctly at desktop and mobile widths.
- Confirm the final website diff is limited to the requested Activities course addition.
