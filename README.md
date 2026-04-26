# ARC Raiders Tool

A local crafting planner for ARC Raiders. Pick the weapons, mods, ammo, shields, or utility items you want to craft, enter what materials you already own, and the tool calculates what you still need to collect with route and source hints.

## Run It

Use the hosted version:

https://hugotristan.github.io/arc_raiders_tool/

Or open it locally:

Open `index.html` in your browser.

No install step is required. The app is a static HTML/CSS/JavaScript tool and stores your selected plan locally in your browser.

## What It Does

- Search and filter craftable ARC Raiders items.
- Add one or more desired crafts to a plan.
- Aggregate all required materials across the plan.
- Track owned materials.
- Show a prioritized collection list.
- Open Hurricane First Wave Cache map links and route notes.
- Link back to community source pages for current recipe and item details.

## Refresh Data

Recipe data is stored in `arc-data.generated.js`. To rebuild it from the community wiki pages:

```powershell
powershell -ExecutionPolicy Bypass -File tools\build-arc-data.ps1 -OutFile arc-data.generated.js
```

The live game and community data can change after patches, so rebuild when recipes or loot guidance look stale.
