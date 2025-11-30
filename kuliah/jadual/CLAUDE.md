# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a responsive web application for displaying the monthly lecture (kuliah) schedule for Masjid Al-Mukhlisin. The application features a dual-view architecture with a traditional calendar table for desktop and a modern card-based layout for mobile devices. All data is managed through a single JSON file that is automatically updated from a Google Sheet via Google Apps Script.

## Running the Application

**Important:** Because the application fetches a JSON file via JavaScript, it must be run through a local web server (not directly via file://).

```bash
# Navigate to the project root
cd "H:\My Drive\Kuliah Ilmu Mamtj6\new page v3 (mobile view and force refresh)\new page"

# Start local server (Python 3)
python -m http.server

# Or Python 2
python -m SimpleHTTPServer
```

Then open `http://localhost:8000/jadual/jadual.html` in your browser.

## Project Structure

```
new page/
├── jadual/
│   ├── index.html          # Hub/landing page
│   ├── jadual.html         # Main schedule page (renders both desktop & mobile views)
│   ├── script.js           # Core rendering logic for both views
│   └── style.css           # Responsive styles with @media queries
└── data/
    └── jadual_lengkap.json # Single source of truth for all schedule data
```

## Architecture & Key Concepts

### Dual View System

The application renders **two complete, separate layouts simultaneously** in `jadual.html`:
1. **Desktop View:** A `<table id="calendar-body">` with absolute-positioned content inside cells
2. **Mobile View:** A `<div id="mobile-view-container">` with card-based layout

CSS `@media` queries control which view is displayed:
- Desktop (> 768px): Shows `.schedule-table`, hides `#mobile-view-container`
- Mobile (≤ 768px): Hides `.schedule-table`, shows `#mobile-view-container`

### Data Structure

`data/jadual_lengkap.json` uses a nested object structure:
```json
{
  "infoJadual": {
    "tajukBulan": "BULAN NOVEMBER 2025",
    "tarikhKemasKini": "*Dikemaskini oleh..."
  },
  "senaraiHari": [
    {
      "date": "2025-11-01",
      "subuh": { "nama_penceramah": "...", "tajuk_kuliah": "...", "poster_url": "..." },
      "maghrib": { ... },
      "cuti_umum": null
    }
  ]
}
```

**Critical:** When accessing data, always use `jsonData.senaraiHari`, not `jsonData` directly.

### Month Navigation

The application supports viewing current and next month via URL parameter:
- Current month: `jadual.html`
- Next month: `jadual.html?bulan=depan`

The script checks `URLSearchParams` and adjusts the target date accordingly (script.js:9-15).

### Desktop View Implementation

Key characteristics:
- Uses `position: absolute` for `.date-number` and `.lecture-content` within `.day-cell`
- Cells have `position: relative` to create positioning context
- Desktop units use `vmin` for responsive sizing
- "Hari Ini" (today) highlighting is achieved by adding class `is-today` to `.day-cell` (script.js:90-92)
- Public holidays use a special `.date-header` structure to prevent date number misalignment (script.js:79-86)

### Mobile View Implementation

Key characteristics:
- Special "Kuliah Hari Ini" card only displays when viewing current month (script.js:142-146)
- Integrates Hijri date from JAKIM e-Solat API (zone: WLY01) (script.js:235)
- Embeds live Digital Signage posters via iframe from `multimedia.mamtj6.com` (script.js:210-214)
- Uses responsive `em`/`rem` units for font sizes
- Cards use `aspect-ratio: 16 / 9` for poster wrapper responsive sizing

### Print Stylesheet

Print functionality is included via `@media print` (see style.css for full implementation):
- Enforces A4 landscape orientation
- Uses Flexbox layout to prevent footer overflow
- Converts all font sizes and positioning to `pt` units for consistency
- Hides interactive elements (links, "today" legend)
- Maintains `position: absolute` layout for content fidelity

## Data Management Workflow

**Note:** Schedule updates are managed externally via Google Sheets and Google Apps Script.

1. Content is maintained in a Google Sheet with two tabs: `Schedule` and `Posters`
2. A Google Apps Script reads the sheets and generates `jadual_lengkap.json`
3. The script automatically pushes the updated JSON to this repository
4. The web application fetches the JSON with cache-busting: `?v=${new Date().getTime()}` (script.js:6)

## Important Implementation Details

### Date String Format
Always use ISO format `YYYY-MM-DD` when working with dates (e.g., `2025-11-01`). When parsing for mobile view, append timezone offset: `new Date(dayData.date + 'T00:00:00')` to avoid timezone issues (script.js:157).

### Yasiin & Tahlil Detection
Special handling for Yasiin & Tahlil sessions: script checks if lecturer name includes "Yasiin" (script.js:102-103) and renders Arabic text with special formatting.

### Empty Slots
The system distinguishes between:
- **Empty days:** Both `subuh` and `maghrib` are `null` (script.js:97-101)
- **Weekend empty slots:** Individual time slot is empty on weekend (script.js:108-110)

### External API Integration
- JAKIM e-Solat API: `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=WLY01`
- Digital Signage: `https://multimedia.mamtj6.com/kuliah/paparan/today_subuh.html` and `today_maghrib.html`

### Responsive Breakpoint
The critical breakpoint is **768px**. All media queries use `@media (max-width: 768px)` to switch from desktop to mobile view.

## Customization Points

- **e-Solat Zone:** Change zone code at script.js:235 (currently `WLY01`)
- **Digital Signage URLs:** Hardcoded at script.js:210, 214
- **Month Navigation:** Link structure in index.html:30-32
- **Calendar Grid:** Desktop view uses fixed 5-week grid with overflow handling (script.js:51-58)
- **Force Refresh:** JSON fetching includes cache-busting timestamp to ensure fresh data (script.js:6)

## Version Information

- Script Version: 14.0 (with next month functionality)
- Last verified: November 2025
