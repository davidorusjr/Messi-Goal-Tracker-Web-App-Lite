# Messi | Road to 1,000 - Mark_1

By David Orus Jr

A small, single-page Messi career-goal tracker. The page is intentionally manual: it makes no API calls and needs no server, package install, or account.

## Project files

- `Messi_Road_to_1,000.html` — page structure and content.
- `styles.css` — visual design, responsive layout, and light/dark themes.
- `app.js` — starting figures, manual Inter Miami updates, milestone calculation, and estimate scenarios.

Keep all three files in the same folder.

## Open and update

1. Open `Messi_Road_to_1,000.html` in a browser.
2. Enter Messi's updated Inter Miami goal total in **Update Inter Miami total**.
3. Select **Save manual totals**.

The career total, team breakdown, progress bar, and next milestone recalculate from the Inter Miami figure plus the fixed Barcelona, Argentina, and PSG starting figures. Updates are stored in the current browser's local storage; they do not alter `app.js` or sync to another browser or device. Use the same browser and file location to keep seeing the saved value.

**Restore starting figures** resets Inter Miami to its default of 104. To change the source defaults, edit `STARTING_DATA` near the top of `app.js`. Barcelona (672), Argentina (126), and PSG (32) are fixed there.

## Milestones and estimates

The initial target is 1,000 goals. When the displayed total reaches a target, the next target advances by 50. The estimate panel offers two hypothetical future club-scoring rates: 40 goals per year and 30 goals per year. They are illustrative scenarios, not predictions or measured rates.

## Data limitations

The starting figures (934 total as of 18 October 2026) came from the original HTML and have not been verified against a live data source. Only the Inter Miami value can be updated in the interface. This app does not contain match-level goals, assists, trophies, awards, or highlights.
