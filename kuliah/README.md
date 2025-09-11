# Masjid Al-Mukhlisin - Lecture Schedule & Digital Signage Project

This is a comprehensive web project designed to display the monthly lecture schedule for Masjid Al-Mukhlisin. It consists of two main components: a detailed monthly calendar view and a fullscreen digital signage display for individual lecture posters.

The entire system is dynamically powered by a single Google Sheet, making it incredibly easy for non-technical users to manage the schedule.

---

## Live Links

*   **Main Website (Info Kuliah):** [https://www.mamtj6.com/pengimarahan/info-kuliah](https://www.mamtj6.com/pengimarahan/info-kuliah)
*   **Live Calendar View:** [https://multimedia.mamtj6.com/kuliah/jadual/jadual.html](https://multimedia.mamtj6.com/kuliah/jadual/jadual.html)
*   **Management Google Sheet:** [View the Google Sheet](https://docs.google.com/spreadsheets/d/1WRbrMkfF_zwFi49j2p3sjebxcUoTbsDgWQxAxcuaUCw/edit?usp=sharing)

#### Digital Signage Links
*   **Today's Maghrib:** [today_maghrib.html](https://multimedia.mamtj6.com/kuliah/paparan/today_maghrib.html)
*   **Today's Subuh:** [today_subuh.html](https://multimedia.mamtj6.com/kuliah/paparan/today_subuh.html)
*   **Tomorrow's Maghrib:** [tomorrow_maghrib.html](https://multimedia.mamtj6.com/kuliah/paparan/tomorrow_maghrib.html)
*   **Tomorrow's Subuh:** [tomorrow_subuh.html](https://multimedia.mamtj6.com/kuliah/paparan/tomorrow_subuh.html)

---

## Features

*   **Centralized Management:** The entire schedule is managed from a single, user-friendly Google Sheet. No manual JSON editing is required.
*   **Dynamic Content:** The month/year title, "last updated" date, and public holiday labels are all generated automatically based on the Google Sheet data.
*   **Monthly Calendar View:** A responsive, fullscreen calendar that displays all Subuh and Maghrib lectures for the current month.
*   **Digital Signage View:** Four dedicated pages that display a fullscreen poster for a specific lecture (e.g., today's Maghrib, tomorrow's Subuh). If no lecture is scheduled, a clear message is shown.
*   **Today Highlighting:** The current day is automatically highlighted in the calendar view for easy reference.
*   **Public Holiday Labels:** A custom label is displayed next to the date for any designated public holidays.

---

## Project Structure

The project is organized into modular components for easy maintenance.

```
projek-jadual-masjid/
│
├── 📄 index.html             # Main hub page with navigation links
├── 📄 README.md              # This file
│
├── 📁 data/
│    └── 📄 jadual_lengkap.json  # THE SINGLE SOURCE OF TRUTH (auto-generated)
│
├── 📁 paparan/
│  	 ├── 📄 today_maghrib.html
│  	 ├── 📄 today_subuh.html
│   	 ├── 📄 tomorrow_maghrib.html
│   	 ├── 📄 tomorrow_subuh.html
│  	 ├── 📄 script.js          # Logic for the Digital Signage
│  	 └── 📄 style.css          # Styles for the Digital Signage
│
└── 📁 jadual/
    ├── 📄 jadual.html            # The Calendar View page
    ├── 📄 script.js              # Logic for the Calendar View
    ├── 📄 style.css              # Styles for the Calendar View
    ├── 📄 logo.png
    └── ... (optional download files)
```

---

## How It Works

1.  **Data Management (Google Sheet):**
    *   The administrator updates the schedule in two tabs of the [Google Sheet](https://docs.google.com/spreadsheets/d/1WRbrMkfF_zwFi49j2p3sjebxcUoTbsDgWQxAxcuaUCw/edit?usp=sharing):
        *   `Posters`: Maps a lecturer's short name to their full name, lecture topic, and poster filename.
        *   `Schedule`: Lists the dates for the month, assigning a lecturer's short name to the Subuh and Maghrib slots. A "Cuti Umum" column is used for holiday labels.
2.  **Automation (Google Apps Script):**
    *   A custom Google Apps Script is attached to the spreadsheet.
    *   When triggered (via the `📤 Export Files` menu), the script reads the data from both tabs.
    *   It automatically generates metadata (like the month title and last updated date) and constructs a single, comprehensive `jadual_lengkap.json` file.
    *   Using the GitHub API, the script pushes this updated JSON file directly to the `data/` directory in the repository.
3.  **Frontend Rendering (Client-Side):**
    *   Both the **Calendar View** (`jadual/script.js`) and the **Digital Signage** (`paparan/script.js`) fetch their data from the same `../data/jadual_lengkap.json` file.
    *   The JavaScript then dynamically builds the HTML content based on this data, ensuring both views are always perfectly in sync.

---

## How to Run Locally

Because the project fetches a JSON file, you cannot simply open the `.html` files in your browser via the `file://` protocol. You must serve them through a local web server.

1.  **Open the project** in a code editor like VS Code.
2.  **Use a live server extension.** The most popular one is **Live Server** by Ritwick Dey.
3.  **Right-click on `index.html`** in the root directory and select "Open with Live Server".
4.  This will open the main hub page (e.g., at `http://127.0.0.1:5500`), and all links will work correctly from there.
