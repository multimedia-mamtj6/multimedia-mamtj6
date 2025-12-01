# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [14.1] - 2025-12-01

### Fixed
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
