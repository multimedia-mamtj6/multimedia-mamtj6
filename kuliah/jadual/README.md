## Masjid Al-Mukhlisin Jadual Kuliah – Project Overview

This is a small static web project to display the monthly schedule of Subuh and Maghrib lectures. The schedule is generated on the client from JSON data.

### Structure

```
new page/
  index.html          # Landing page (hub) with navigation
  jadual.html         # Main schedule page (renders calendar)
  style.css           # Styling for layout and schedule table
  script.js           # Client-side rendering logic (fetch + render)
  data/
    jadual.json       # Daily schedule data (dates → ustaz names)
    ustaz.json        # Ustaz metadata (name → topic)
```

### How it works

- `jadual.html` loads `style.css` and `script.js`, and contains a table skeleton. The body of the table (`#calendar-body`) is filled by JavaScript at runtime.
- `script.js`:
  - Fetches `data/jadual.json` and `data/ustaz.json` in parallel.
  - Builds a map of ustaz name → topic from `ustaz.json`.
  - Renders a 5-week (35-cell) grid for the current month based on the user’s system date.
  - For each date, it looks up a matching record in `jadual.json` (by `tarikh` in YYYY-MM-DD) and inserts lecture blocks for Subuh/Maghrib.
  - Special-case: if either `subuh` or `maghrib` equals the exact string `"YASIN"`, the cell shows a Yasiin/Tahlil layout instead of normal lecture blocks.

### Data formats

- `data/jadual.json`

```json
{
  "tahun": 2025,
  "bulan": 8,
  "senarai_hari": [
    {
      "tarikh": "2025-08-01",   
      "subuh": null,             
      "maghrib": "Ustaz Nazir bin Yamin", 
      "cuti_umum": null          
    }
    // ... one entry per date in the month
  ]
}
```

- `data/ustaz.json`

```json
[
  { "nama": "Ustaz Nawawi", "tajuk": "Riyadhus Solihin" }
  // ... one entry per ustaz referenced in jadual.json
]
```

Notes:
- `tahun` and `bulan` are currently not used by the renderer; the month shown is driven by the user’s current date.
- Each `tarikh` must be unique. If duplicates exist, only the first match will be used.
- To show Yasiin/Tahlil in a day cell, set `subuh` or `maghrib` to the exact string `"YASIN"` (uppercase). Any other phrasing will be treated as a standard lecture.

### Running locally

Because the page fetches JSON files, open it via a local web server (not `file://`). From the project folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/jadual.html` in your browser.

### Customization

- Month/year title: The title in `jadual.html` is set by `script.js` to the current month/year. To render a specific month instead, modify the call in `script.js` to pass a fixed date to `renderCalendar` (e.g., `new Date(2025, 7, 1)` for August 2025).
- Logo: `jadual.html` references `logo.png` in the project root. Add this file to show the logo.
- Downloads: `index.html` links to `jadual-kuliah.jpeg` and `jadual-kuliah.pdf`. Add these files if you want the download buttons to work.

### Known behaviors

- The calendar uses a fixed 5-row (35-day) grid. If the month has more than 35 visible slots (due to start day alignment), overflow days are placed into initial empty slots.
- `var(--primary-color)` used in `index.html` should be defined if you want consistent button theming; you can add it in the `:root` of `style.css`.


