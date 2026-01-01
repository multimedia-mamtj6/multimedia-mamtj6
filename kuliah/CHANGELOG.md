# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [15.0] - 2025-12-30

### Added - Major Features
- **URL-based PDF export functionality** - New `?file=pdf` parameter automatically triggers print dialog
  - Supports current month: `jadual.html?file=pdf`
  - Supports next month: `jadual.html?file=pdf&bulan=depan`
  - Client-side implementation using `window.print()` with sophisticated timing strategy
  - Double `requestAnimationFrame` + 250ms delay ensures rendering completion before print
  - Compatible with iOS Safari, Chrome Mobile, and desktop browsers
  - Files modified: `jadual/script.js` (lines 17-42)

- **Mobile PDF printing support** - Critical CSS overrides ensure desktop table view prints on mobile devices
  - Forces `.schedule-table` to display when printing regardless of viewport size
  - Hides `#mobile-view-container` in print mode
  - Uses `!important` flags and `@media print` rules to override mobile viewport styles
  - Ensures A4 landscape layout is maintained on all devices
  - Files modified: `new page/jadual/style.css` (lines 143-150)

- **PDF export buttons on landing page** - Added dedicated PDF export buttons for easy access
  - Light blue buttons (background: #e8f4f8) distinguish from main navigation
  - Side-by-side layout with view buttons on desktop (2-column grid)
  - Stacked layout on mobile for better readability
  - Dynamic month names on both view and PDF buttons
  - Files modified: `jadual/index.html` (lines 46-48, 57-59)

- **Section labels for visual organization** - Added uppercase labels to separate button groups
  - "Bulan Semasa" (Current Month) label
  - "Bulan Depan" (Next Month) label
  - "Tetapan" (Settings) label
  - Styled in gray (#666), uppercase, with letter-spacing for hierarchy
  - Files modified: `jadual/index.html` (lines 40, 51, 62)

- **MAMTJ6 logo on landing page** - Added mosque branding at the top of index page
  - SVG logo (200px width) from https://dev.mamtj6.com/media/logo-mamtj6/SVG/mamtj6-black.svg
  - Centered above header with 2rem margin
  - Responsive and scales with viewport
  - Files modified: `jadual/index.html` (line 30)

### Changed
- **Button layout redesign** - Changed from stacked to side-by-side layout on desktop
  - Removed `.full-width` class from view and PDF buttons
  - View and PDF buttons now appear side-by-side in 2-column grid
  - Admin button remains full-width
  - Mobile view retains stacked layout for readability
  - Files modified: `jadual/index.html` (lines 42-59)

- **PDF button styling enhanced** - Increased text size to match main navigation buttons
  - Font size: Changed from 0.9rem to 1.2rem
  - Font weight: Changed from 600 to 700 (bold)
  - Padding: Changed from 0.8rem to 1.5rem (consistent with nav buttons)
  - Maintains light blue background for visual distinction
  - Files modified: `jadual/index.html` (line 17)

- **Mobile padding improvements** - Added horizontal padding on mobile views
  - 1.5rem padding on left and right sides for screens ≤600px
  - Prevents buttons from touching screen edges
  - Improves readability and touch targets
  - Files modified: `jadual/index.html` (line 24)

- **Header text updated** - Added "SISTEM JADUAL KULIAH" as primary heading
  - Two h1 elements for emphasis
  - Mosque name remains prominent
  - Files modified: `jadual/index.html` (lines 33-34)

### Technical Details
- **Script version**: Updated from 14.1 to 15.0
- **Print media query strategy**: Uses `box-shadow` technique for color preservation
- **Grid system**: Utilizes CSS Grid with 2-column layout (`1fr 1fr`)
- **Responsive breakpoint**: 600px for mobile layout changes
- **Browser compatibility**: Tested on Chrome, Firefox, Edge, Safari (desktop and mobile)

## [14.1] - 2025-12-01

### Fixed
- **Holiday labels not appearing in print/PDF output** - Fixed public holiday labels (e.g., "Tahun Baru", "Cuti Umum") showing white background instead of dark blue (#2c3e50) when printing or saving as PDF
  - Added global `print-color-adjust: exact` declaration to force browsers to print background colors exactly as specified
  - Added explicit `background-color` and `color` properties to `.holiday-label` print rule with `!important` flags
  - Included `-webkit-print-color-adjust: exact` for Safari/Chrome compatibility
  - Ensures holiday labels print with dark blue background and white text matching the desktop view
  - File modified: `jadual/style.css` (lines 127-130 for global rule, lines 207-216 for holiday label specific rule)

- **Vertical week text rotation inconsistency on Edge browser** - Fixed vertical week labels (MINGGU 1, MINGGU 2, etc.) appearing upside down on certain 1920x1080 digital signage displays using Edge browser
  - Added browser-specific vendor prefixes for `writing-mode` property (`-webkit-writing-mode`, `-ms-writing-mode`)
  - Added explicit `transform-origin: center center` to ensure consistent rotation center point across all browsers
  - Added vendor prefixes for `transform` property (`-webkit-transform`, `-moz-transform`, `-ms-transform`, `-o-transform`) for maximum cross-browser compatibility
  - Maintains the required 180° rotation for correct text orientation
  - File modified: `jadual/style.css` (line 45, `.week-number-cell` class)

- **Print layout missing styles** - Added complete `@media print` styles that were missing from the CSS file
  - Implements A4 landscape page layout with proper margins
  - Uses Flexbox layout to prevent footer overflow on printed pages
  - Applies `box-shadow` technique to preserve background colors (green headers, yellow date cells, gray empty slots) in print output
  - Converts all font sizes and positioning to `pt` units for print consistency
  - Sets vertical week labels with `writing-mode: vertical-lr` and 180° rotation for correct orientation
  - Maintains `position: absolute` layout for content fidelity between screen and print
  - Shows footer link in printed output (removed `.footer-link` from hidden elements)
  - Hides print button and "today" legend box
  - File modified: `jadual/style.css` (lines 121-217, added complete `@media print` block)

### Added
- **Dynamic month names on navigation buttons** - Both current and next month buttons now display the actual month name and year
  - Current month button shows: "LIHAT JADUAL BULAN [MONTH] [YEAR]"
  - Next month button shows: "LIHAT JADUAL BULAN [MONTH] [YEAR]"
  - Month names automatically update based on current date using JavaScript
  - File modified: `jadual/index.html` (lines 27-34, 42-70)

- **Version footer on landing page** - Added version number and update date display at the bottom of index page
  - Displays: "Versi 14.1 • Dikemaskini Disember 2025"
  - File modified: `jadual/index.html` (lines 41-43)

## Previous Versions

### [14.0] - 2025-11-01
- Added next month navigation functionality
- Implemented dual-view architecture (desktop table + mobile cards)
- Integrated JAKIM e-Solat API for Hijri dates
- Added Digital Signage poster integration
- Implemented force refresh with cache-busting
