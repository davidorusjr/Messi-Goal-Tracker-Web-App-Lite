# Messi | Road to 1,000 - Mark_1

By David Orus Jr

A small, single-page Messi career-goal tracker. The page is manually maintained: it makes no API calls and needs no server, package install, or account.

## Project files

- `index.html` — page structure and content.
- `styles.css` — responsive layout, colors, and light/dark themes.
- `app.js` — starting figures, manual Inter Miami updates, milestone calculation, and estimate scenarios.

Keep the files in the same folder and open `index.html` in a browser.

## Update the count

The starting career total is **936 goals as of 18 October 2026**:

| Team | Goals | How it is maintained |
|---|---:|---|
| Barcelona | 672 | Fixed starting figure in `app.js` |
| Argentina | 126 | Fixed starting figure in `app.js` |
| Inter Miami | 106 | Editable in the page |
| Paris Saint-Germain | 32 | Fixed starting figure in `app.js` |

To record a new Inter Miami goal, enter the updated Inter Miami total under **Update Inter Miami total** and select **Save manual totals**. The app recalculates the career total, progress, team breakdown, and milestone. Updates are stored in the current browser's local storage; they do not change the source file or sync to another browser or device. **Restore starting figures** resets the Inter Miami total to 106.

The app also upgrades a previously saved default of 104 to the corrected default of 106. Other saved Inter Miami values are kept.

## Milestones and estimates

The first milestone is 1,000 goals. When the displayed total reaches a target, the next target advances by 50. The estimate panel uses two hypothetical future club-scoring rates: 40 and 30 goals per year. These are illustrative scenarios, not predictions or measured rates.

## Data limitations

The 936 starting total and team breakdown use the user-supplied correction and existing project figures. They are manually maintained and are not verified against a live data source. The app does not contain match-level goals, assists, trophies, awards, or highlights.
