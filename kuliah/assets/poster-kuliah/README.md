# Google Drive to GitHub Sync Script Documentation

## 1. Summary

This Google Apps Script provides a powerful and automated way to synchronize image files from a specified Google Drive folder to a GitHub repository.

It is designed to solve the common problem of hosting images for websites (especially static sites on GitHub Pages) by allowing you to manage files in the user-friendly environment of Google Drive while leveraging the speed and version control of GitHub for hosting.

The script automatically handles file naming, sorting, and ordering to ensure a clean, web-friendly result.

## 2. Key Features

-   **Automatic Syncing:** Copies files from Google Drive to GitHub.
-   **Intelligent Sorting:** Uses a "natural sort" algorithm to correctly order files that start with numbers (e.g., `2.png` comes before `10.png`).
-   **Automatic Renaming & Ordering:**
    -   Adds a zero-padded numerical prefix (e.g., `01_`, `02_`) to enforce a permanent sort order in GitHub.
    -   Replaces all spaces in filenames with hyphens (`-`) to create web-safe URLs.
-   **File Type Filtering:** Only syncs files with extensions specified in an "allow list" (e.g., `jpg`, `png`).
-   **Secure:** Stores sensitive information like your GitHub token securely using Google's Script Properties, not in the code itself.
-   **Multiple Trigger Options:**
    -   Can be run directly from the script editor.
    -   Can be run from a custom menu in a Google Sheet.
    -   Can be triggered remotely from any browser (including mobile) via a secure Web App URL.

## 3. Setup Instructions

Follow these steps to configure the script for your own use.

### Phase A: GitHub Setup

1.  **Create a Personal Access Token (PAT):** This script needs permission to write to your repository.
    -   Go to GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic).
    -   Click **Generate new token (classic)**.
    -   Give it a **Note** (e.g., "Google Drive Sync Script").
    -   Set an **Expiration**.
    -   Under **Select scopes**, check the box next to **`repo`**.
    -   Click **Generate token** and **copy the token immediately**. You will not see it again.

### Phase B: Google Drive Setup

1.  **Create a Folder:** Create a folder in your Google Drive and place all the image files you want to sync into it.
2.  **Get the Folder ID:** Open the folder and look at the URL. The ID is the long string of characters at the end.
    -   `https://drive.google.com/drive/folders/THIS_IS_THE_FOLDER_ID`

### Phase C: Google Apps Script Setup

1.  **Create a Google Sheet:** This will serve as a control panel. Create a new, blank Google Sheet.
2.  **Open the Script Editor:** In the Sheet, go to **Extensions > Apps Script**.
3.  **Paste the Code:** Copy the entire `script.js` code and paste it into the editor, replacing any placeholder code.
4.  **Configure the `CONFIG` Block:** Fill in your details in the `CONFIG` section at the top of the script.
    -   **`DRIVE_FOLDER_ID`**: The ID from Phase B.
    -   **`GITHUB_USERNAME`**: Your GitHub username.
    -   **`GITHUB_REPO`**: The name of the repository to sync to.
    -   **`REPO_PATH`**: The folder path within the repository (e.g., `assets/images/`). **Must end with a `/`**.
5.  **Store Your Secrets Securely:**
    -   In the script editor, go to **Project Settings** (⚙️ icon).
    -   Scroll down to **Script Properties**.
    -   Add a property named `GITHUB_TOKEN` and paste your Personal Access Token as the value.
    -   Add another property named `SECRET_KEY` and enter a simple password (e.g., `MySecret123`) for the Web App trigger.
    -   Click **Save script properties**.

## 4. How to Use

### Method 1: Run from Google Sheets (Recommended for Desktop)

1.  Open or refresh the Google Sheet containing the script.
2.  A new menu named **GitHub Sync** will appear.
3.  Click **GitHub Sync > Sync Files Now**.
4.  (First time only) You will need to complete the authorization prompts.

### Method 2: Run from Mobile (Web App Trigger)

This requires a one-time deployment.

1.  **Deploy the Web App:**
    -   In the script editor, click **Deploy > New deployment**.
    -   Set the type to **Web app**.
    -   **Execute as:** `Me`.
    -   **Who has access:** `Anyone`. (The `SECRET_KEY` provides the security).
    -   Click **Deploy** and authorize.
    -   **Copy the Web app URL**.
2.  **Create Your Trigger Link:**
    -   Combine the URL with your secret key in this format:
        `[Your Web app URL]?key=[Your SECRET_KEY value]`
    -   Example: `https://script.google.com/macros/s/.../exec?key=MySecret123`
3.  **Run from Your Phone:**
    -   Visit this link from your phone's browser.
    -   Use the "Add to Home Screen" feature to create a one-tap icon for future use.

## 5. Code Breakdown

The script operates in a logical sequence:

1.  **`doGet(e)` / `onOpen()`**: These are the entry points. `onOpen` creates the menu in the Sheet. `doGet` handles the Web App trigger, checking the `SECRET_KEY` before proceeding. Both call the main function.
2.  **`syncFilesToGithub()`**:
    -   **Authentication:** Securely retrieves the `GITHUB_TOKEN` from Script Properties.
    -   **Fetch Files:** Gets all files from the specified Google Drive folder and filters them based on the `ALLOWED_EXTENSIONS` list.
    -   **Natural Sort:** Sorts the filtered files numerically based on the number at the start of their filename, ensuring `10.png` comes after `2.png`. If no number is found, it falls back to an alphabetical sort.
    -   **Process and Upload Loop:** Iterates through each file in the now-sorted list.
        -   **Clean Filename:** Replaces spaces with hyphens (`-`).
        -   **Add Prefix:** Adds a two-digit prefix (e.g., `01_`) to the cleaned filename.
        -   **Check GitHub:** Checks if a file with the same prefixed name already exists in the GitHub repository.
        -   **API Call:** Uses the GitHub API to either **create** a new file or **update** an existing one.
        -   **Log Output:** Provides detailed logs of its actions.
