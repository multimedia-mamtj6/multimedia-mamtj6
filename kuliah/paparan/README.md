# Digital Signage Management System

## 📄 Project Overview

This system is designed to manage and display daily lecture schedules on digital screens. It uses Google Sheets as a simple and user-friendly control panel, which then automatically updates a set of web pages hosted on GitHub Pages.

The system is fully responsive and optimized for viewing on large digital signs, full-screen on mobile devices, or embedded within other websites and mobile apps.

---

## 🚀 Core Features

*   **Centralized Management:** All schedules are controlled from a single Google Sheet.
*   **User-Friendly Interface:** Uses simple dropdown menus to select speakers, eliminating the need to handle long and complex image URLs.
*   **Automated Publishing:** A custom menu in Google Sheets pushes the updated schedule to the live displays with a single click.
*   **Four Dedicated Displays:** Provides separate, unique web pages for:
    *   Today's Subuh Lecture
    *   Today's Maghrib Lecture
    *   Tomorrow's Subuh Lecture
    *   Tomorrow's Maghrib Lecture
*   **Intelligent Messaging:** Displays specific, context-aware messages when a lecture slot is empty (e.g., "Tiada Kuliah Subuh Hari Ini").
*   **Fully Responsive:** The display pages are optimized to look great on any screen size, from a 1920x1080 digital sign to a small, embedded mobile view, without cropping images or requiring scrolling.

---

## 🏗️ System Architecture (How It Works)

The system works in a simple, four-step flow:

1.  **Administrator (You):** You manage the schedule and poster list using a Google Sheet.
2.  **Google Apps Script (The Engine):** When you click the "Update" menu, a script reads your Google Sheet, looks up the correct image filenames, constructs the full URLs, and formats everything into a data file called `schedule.json`.
3.  **GitHub (The Host):** The script securely pushes this `schedule.json` file to your GitHub repository, where all the display page files (`.html`, `.css`, `.js`) are also stored.
4.  **Digital Signs (The Displays):** The web browsers on your digital signs load the appropriate HTML page. JavaScript on that page automatically fetches the `schedule.json` file and displays the correct image or "no lecture" message.

---

## 📘 User Guide: How to Manage the Schedule

This is your day-to-day workflow.

### Step 1: To Add a New Poster/Speaker

You only need to do this when a new poster is created.

1.  Open the Google Sheet.
2.  Go to the **`Posters`** sheet (tab).
3.  Add a new row.
    *   In the `Short_Name` column, enter the name you want to see in the dropdown (e.g., `Ustaz Salleh bin Din`).
    *   In the `Filename` column, enter the exact filename of the image (e.g., `07_7.-Ustaz-Salleh.jpg`).
4.  The dropdowns in the `Schedule` sheet will update automatically.

### Step 2: To Schedule Lectures

1.  Open the Google Sheet and go to the **`Schedule`** sheet.
2.  For the desired date, click the cell under `Subuh_Image_URL` or `Maghrib_Image_URL`.
3.  A dropdown menu will appear. Select the desired speaker.
4.  To mark a slot as empty, select the **`-- TIADA KULIAH --`** option from the dropdown.

### Step 3: To Publish Your Changes Live

After you have finished scheduling, you must push the updates to the signs.

1.  In the Google Sheet menu, click **`📤 Export Files`**.
2.  From the submenu, click **`Update Live Schedule (JSON)`**.
3.  A confirmation box will appear when the update is complete. The changes will be live on your digital signs within a minute.

---

## 🛠️ Technical Details & File Descriptions

All display files are located in your GitHub repository under the `kuliah/paparan/` directory.

*   **`schedule.json`** (Auto-Generated)
    *   This is the most important data file. It is the single source of truth for all display pages and is automatically updated by the Google Apps Script.

*   **`today_subuh.html`**, **`today_maghrib.html`**, etc. (4 files)
    *   These are the actual web pages for your signs. Each one calls the JavaScript function with a unique set of parameters, like `initializeDisplay('today', 'subuh')`.

*   **`style.css`** (Styling)
    *   This file controls the entire visual appearance. It handles the responsive image display (`background-size: contain`), the flexible font and box sizes for text messages, and background colors.

*   **`script.js`** (Logic)
    *   This is the "brain" that runs in the browser. It fetches the `schedule.json` data, determines the correct date, and displays either the poster image or the specific "no lecture" message.

*   **Google Apps Script** (Engine)
    *   This script, attached to your Google Sheet, acts as the bridge to GitHub. It contains all the logic for reading the sheets, creating the JSON data, and using the GitHub API to update the live `schedule.json` file.

---

## 🔍 Troubleshooting Common Issues

### Problem: The sign is not updating after I clicked the "Update" menu.
*   **Solution 1:** Wait 1-2 minutes. GitHub Pages can take a moment to deploy the latest changes. Your browser might also be caching the old data.
*   **Solution 2:** In your GitHub repository, click the **"Actions"** tab. You should see a recent "pages build and deployment" workflow with a green checkmark ✅. If you see a red X ❌, the deployment failed, and you can click on it to see the error.

### Problem: The sign shows a "No Lecture" message, but I scheduled one.
*   **Solution 1:** Check the **`Posters`** sheet. Is the `Filename` for that speaker spelled exactly right?
*   **Solution 2:** Check the Google Apps Script settings (**Project Settings > Script Properties**). Is the `IMAGE_BASE_URL` correct and does it have the trailing `/` at the end?

### Problem: A new speaker I added is not appearing in the dropdown menu.
*   **Solution:** Make sure you added the speaker to the **`Posters`** sheet. The dropdown list in the `DropdownLists` sheet should update automatically. If not, check the formula in cell `A2` of that sheet.````
