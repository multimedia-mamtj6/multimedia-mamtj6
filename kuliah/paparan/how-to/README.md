# How to Implement This System for a New Project

This guide provides a step-by-step process for duplicating the entire digital signage system for a new, independent project.

The process involves three main stages:
1.  **Duplicating the Google Sheet "Control Panel"**
2.  **Setting up a new GitHub Repository "Host"**
3.  **Connecting the new Sheet to the new Repository**

---

### Part 1: Duplicate the Google Sheet Control Panel

This is the fastest way to get your backend ready. Instead of creating a new sheet from scratch, we will copy the existing one.

1.  Open your original, master Google Sheet.
2.  Go to the menu **File > Make a copy**.
3.  Give the new spreadsheet a name relevant to your new project (e.g., "Company Events Signage Control").
4.  Click **"Make a copy"**.

This creates a new Google Sheet that includes perfect copies of your `Schedule`, `Posters`, and `DropdownLists` tabs, and most importantly, it also **copies the entire Google Apps Script**.

#### What to Do in the New Sheet:

*   **Clear Old Data:**
    *   In the `Schedule` sheet, delete all the old date and lecture entries.
    *   In the `Posters` sheet, delete all the old speaker/poster entries.
*   **Populate with New Data:**
    *   In the `Posters` sheet, add the new "short names" and "filenames" for your new project's images.
    *   The `DropdownLists` sheet will update automatically.
*   **Leave the Script Alone for Now:** Don't edit the script yet. We first need to set up its new destination on GitHub.

---

### Part 2: Set Up the New GitHub Repository

Your new project needs its own separate, clean repository.

1.  **Create a New GitHub Repository:**
    *   Go to GitHub and create a new **public** repository. Name it something relevant (e.g., `company-event-display`).

2.  **Create a New Personal Access Token (PAT):**
    *   For security and clarity, it's best to create a new token for the new project.
    *   Go to your GitHub **Settings > Developer settings > Personal access tokens > Tokens (classic)**.
    *   Generate a new token with the `repo` scope.
    *   **IMPORTANT:** Copy and save this new token immediately. You will not see it again.

3.  **Create the Folder Structure and Upload Files:**
    *   In your new repository, you need to replicate the file structure. Click **"Add file" > "Create new file"**.
    *   Create a new folder by typing the name, followed by a `/`. For example, type `events/display/` to create a new structure.
    *   **Copy the code** from your original project's six front-end files (`today_subuh.html`, `today_magrib.html`, `tomorrow_subuh.html`, `tomorrow_magrib.html`, `style.css`, and `script.js`) and paste them into new files inside this new directory.
    *   *(Optional)* You can rename the HTML files if you wish (e.g., `session_1.html`), but you must also update the corresponding call in the script tag at the bottom of the HTML file (e.g., `initializeDisplay('today', 'session_1')`).

4.  **Enable GitHub Pages:**
    *   In the new repository's **Settings > Pages**, enable GitHub Pages for the `main` branch.

---

### Part 3: Connect the New Sheet to the New Repository

This is the final and most critical step. We need to tell the script in your **new** Google Sheet to talk to your **new** GitHub repository.

1.  Open the **new** Google Sheet (the copy you made in Part 1).
2.  Go to **Extensions > Apps Script**.
3.  On the left menu, click on **Project Settings** (the gear icon ⚙️).
4.  Scroll down to the **Script Properties** section. You will see that it is **empty** (script properties are not copied over).
5.  Click **"Add script property"** and add the following four properties, filling in the values for your **NEW** project:

    *   **Property 1:**
        *   **Property:** `GITHUB_USERNAME`
        *   **Value:** `your-github-username`

    *   **Property 2:**
        *   **Property:** `GITHUB_REPO`
        *   **Value:** `company-event-display` (The name of your **new** repository)

    *   **Property 3:**
        *   **Property:** `GITHUB_TOKEN`
        *   **Value:** Paste the **new** Personal Access Token you generated in Part 2.

    *   **Property 4:**
        *   **Property:** `IMAGE_BASE_URL`
        *   **Value:** Enter the base URL for the images for your **new** project (e.g., `https://company.com/assets/event-posters/`).

6.  Click **Save project**.

---

### Part 4: Final Test and Launch

1.  Go to your **new** Google Sheet. Add at least one or two rows of data in the `Schedule` sheet.
2.  Refresh the page. The `📤 Export Files` menu should appear.
3.  Click **`📤 Export Files` > `Update Live Schedule (JSON)`**.
4.  **Authorize the script.** Since this is a new sheet, you will need to go through the Google authorization steps again.
5.  After the script runs successfully, check your **new** GitHub repository. A `schedule.json` file should now exist in the folder you created.
6.  Navigate to your new GitHub Pages URLs to see your new signage system in action.

You have now successfully cloned the entire system for a new project.
