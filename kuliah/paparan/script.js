/**
 * This script is the "brain" for the digital signage pages.
 * It fetches the schedule data, determines which image to display,
 * and handles cases where there is no scheduled lecture.
 * VERSION 2.0: Displays a different message for today vs. tomorrow.
 */

const JSON_URL = 'schedule.json';

// --- NEW: Define the two possible messages ---
const MESSAGE_TODAY = 'Slot kosong, tiada kuliah hari ini';
const MESSAGE_TOMORROW = 'Tiada kuliah pada hari esok';
const MESSAGE_ERROR = 'Error: Could not load schedule data.';

/**
 * Gets a date string in the required YYYY-MM-DD format.
 * @param {string} target 'today' or 'tomorrow'.
 * @returns {string} The formatted date string (e.g., "2025-08-27").
 */
function getTargetDate(target) {
    const date = new Date();
    if (target === 'tomorrow') {
        date.setDate(date.getDate() + 1);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Updates the page content. It either sets a background image or shows a message.
 * @param {string|null} imageUrl The URL of the image to display, or null if none.
 * @param {string} message The text to display if there is no image.
 */
function setDisplay(imageUrl, message) {
    const container = document.getElementById('display-container');
    const messageBox = document.getElementById('message');

    if (imageUrl) {
        messageBox.style.display = 'none';
        container.style.backgroundImage = `url('${imageUrl}')`;
        container.style.backgroundColor = 'transparent';
    } else {
        container.style.backgroundImage = 'none';
        container.style.backgroundColor = '#ffffff';
        messageBox.style.display = 'flex';
        messageBox.querySelector('h1').textContent = message;
    }
}

/**
 * The main function that initializes the digital sign.
 * @param {string} day 'today' or 'tomorrow'.
 * @param {string} lectureType 'subuh_url' or 'maghrib_url'.
 */
async function initializeDisplay(day, lectureType) {
    const targetDate = getTargetDate(day);

    // --- LOGIC CHANGE IS HERE ---
    // Determine which "no lecture" message to use based on the 'day' parameter.
    const noLectureMessage = (day === 'today') ? MESSAGE_TODAY : MESSAGE_TOMORROW;

    try {
        const response = await fetch(`${JSON_URL}?t=${new Date().getTime()}`);
        if (!response.ok) {
            throw new Error(`Could not load schedule.json. Status: ${response.status}`);
        }
        const schedule = await response.json();
        
        const entry = schedule.find(item => item.date === targetDate);
        
        let imageUrl = null;
        if (entry && entry[lectureType]) {
            imageUrl = entry[lectureType];
        }

        // Pass the correct message to the setDisplay function.
        setDisplay(imageUrl, noLectureMessage);

    } catch (error) {
        console.error('Failed to initialize display:', error);
        // If an error occurs, pass the specific error message.
        setDisplay(null, MESSAGE_ERROR);
    }
}
