/**
 * This script is the "brain" for the digital signage pages.
 * It fetches the schedule data, determines which image to display,
 * and handles cases where there is no scheduled lecture.
 */

// The relative path to the JSON file. Since this script is in the same
// folder as the HTML files and the JSON file, we can just use the filename.
const JSON_URL = 'schedule.json';
const NO_LECTURE_MESSAGE = 'Slot kosong, tiada kuliah hari ini';

/**
 * Gets a date string in the required YYYY-MM-DD format.
 * @param {string} target 'today' or 'tomorrow'.
 * @returns {string} The formatted date string (e.g., "2025-08-27").
 */
function getTargetDate(target) {
    const date = new Date();
    // If the target is 'tomorrow', advance the date by one day.
    if (target === 'tomorrow') {
        date.setDate(date.getDate() + 1);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-11, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Updates the page content. It either sets a background image or shows a message.
 * @param {string|null} imageUrl The URL of the image to display, or null if none.
 */
function setDisplay(imageUrl) {
    const container = document.getElementById('display-container');
    const messageBox = document.getElementById('message');

    if (imageUrl) {
        // If an image URL is provided:
        // 1. Hide the text message box.
        messageBox.style.display = 'none';
        // 2. Set the background image of the main container.
        container.style.backgroundImage = `url('${imageUrl}')`;
        // 3. Ensure the fallback background color is removed.
        container.style.backgroundColor = 'transparent';
    } else {
        // If no image URL is provided:
        // 1. Ensure any previous background image is removed.
        container.style.backgroundImage = 'none';
        // 2. Set a plain white background color.
        container.style.backgroundColor = '#ffffff';
        // 3. Show the message box.
        messageBox.style.display = 'flex'; // Use flex for centering
        // 4. Set the text content of the message.
        messageBox.querySelector('h1').textContent = NO_LECTURE_MESSAGE;
    }
}

/**
 * The main function that initializes the digital sign.
 * This is called from the inline script in each HTML file.
 * @param {string} day 'today' or 'tomorrow'.
 * @param {string} lectureType 'subuh_url' or 'maghrib_url'.
 */
async function initializeDisplay(day, lectureType) {
    const targetDate = getTargetDate(day);
    const messageBox = document.getElementById('message');

    try {
        // Fetch the schedule.json file. We add a cache-busting parameter (`?t=...`)
        // to the URL. This ensures the browser always downloads the latest version
        // of the file and doesn't use an old, cached one.
        const response = await fetch(`${JSON_URL}?t=${new Date().getTime()}`);
        
        // If the file can't be found (e.g., 404 error), throw an error.
        if (!response.ok) {
            throw new Error(`Could not load schedule.json. Status: ${response.status}`);
        }
        
        const schedule = await response.json();
        
        // Find the specific entry in the schedule array that matches our target date.
        const entry = schedule.find(item => item.date === targetDate);
        
        let imageUrl = null;
        // Check if an entry was found and if that entry has a non-empty URL
        // for the specific lecture type we're looking for.
        if (entry && entry[lectureType]) {
            imageUrl = entry[lectureType];
        }

        // Call the function to update what's shown on the screen.
        setDisplay(imageUrl);

    } catch (error) {
        // If anything goes wrong (network error, JSON is malformed, etc.),
        // display an error message on the screen for easy debugging.
        console.error('Failed to initialize display:', error);
        messageBox.querySelector('h1').textContent = `Error: Could not load schedule data.`;
        setDisplay(null); // Ensure the error message is visible
    }
}
