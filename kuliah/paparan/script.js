const JSON_URL = 'schedule.json';
const NO_LECTURE_MESSAGE = 'Slot kosong, tiada kuliah hari ini';

/**
 * Gets a date string in YYYY-MM-DD format.
 * @param {string} target 'today' or 'tomorrow'.
 * @returns {string} The formatted date string.
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
 * Sets the display content based on the found image URL.
 * @param {string|null} imageUrl The URL of the image to display.
 */
function setDisplay(imageUrl) {
    const container = document.getElementById('display-container');
    const messageBox = document.getElementById('message');

    if (imageUrl) {
        // We have an image, hide the message box and set the background
        messageBox.style.display = 'none';
        container.style.backgroundImage = `url('${imageUrl}')`;
    } else {
        // No image, show the "no lecture" message
        container.style.backgroundImage = 'none'; // Ensure no old image is showing
        messageBox.style.display = 'block';
        messageBox.querySelector('h1').textContent = NO_LECTURE_MESSAGE;
    }
}

/**
 * Initializes the digital sign.
 * @param {string} day 'today' or 'tomorrow'.
 * @param {string} lectureType 'subuh_url' or 'maghrib_url'.
 */
async function initializeDisplay(day, lectureType) {
    const targetDate = getTargetDate(day);

    try {
        // Add a cache-busting parameter to ensure we get the latest file
        const response = await fetch(`${JSON_URL}?t=${new Date().getTime()}`);
        if (!response.ok) {
            throw new Error(`Could not load schedule.json. Status: ${response.status}`);
        }
        const schedule = await response.json();
        
        // Find the entry for the target date
        const entry = schedule.find(item => item.date === targetDate);
        
        let imageUrl = null;
        if (entry && entry[lectureType]) {
            imageUrl = entry[lectureType];
        }

        setDisplay(imageUrl);

    } catch (error) {
        console.error('Failed to initialize display:', error);
        const messageBox = document.getElementById('message');
        messageBox.querySelector('h1').textContent = `Error: Could not load schedule.`;
    }
}
