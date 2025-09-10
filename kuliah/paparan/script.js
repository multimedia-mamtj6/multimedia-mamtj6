/**
 * Digital Signage Script v4.0 - Integrated Version
 * Features:
 * - Fetches schedule data from the new structured 'jadual_lengkap.json'.
 * - Displays specific "no lecture" messages for 4 scenarios.
 * - Fully responsive for mobile and embed views.
 */

// URL kini merujuk kepada fail JSON yang dijana oleh Google Sheet
const JSON_URL = 'https://multimedia.mamtj6.com/kuliah/paparan/jadual_lengkap.json';

// Define all possible messages in one place for easy management.
const MESSAGES = {
    today_subuh: 'Tiada Kuliah Subuh Hari Ini',
    today_maghrib: 'Tiada Kuliah Maghrib Hari Ini',
    tomorrow_subuh: 'Tiada Kuliah Subuh pada Hari Esok',
    tomorrow_maghrib: 'Tiada Kuliah Maghrib pada Hari Esok',
    error: 'Error: Could not load schedule data'
};

/**
 * Gets a date string in YYYY-MM-DD format.
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
 * Updates the page content (image or message).
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
 * Main function to initialize the display.
 */
async function initializeDisplay(day, lectureType) {
    const messageKey = `${day}_${lectureType}`;
    const targetDate = getTargetDate(day);
    
    try {
        const response = await fetch(`${JSON_URL}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
        
        // --- PERUBAHAN UTAMA DI SINI ---
        const jsonData = await response.json();
        
        // Ekstrak array jadual dari 'senaraiHari'
        const schedule = jsonData.senaraiHari; 
        
        const entry = schedule.find(item => item.date === targetDate);
        
        let imageUrl = null;
        if (entry && entry[lectureType]?.poster_url) {
            imageUrl = entry[lectureType].poster_url;
        }

        setDisplay(imageUrl, MESSAGES[messageKey]);

    } catch (error) {
        console.error('Failed to initialize display:', error);
        setDisplay(null, MESSAGES['error']);
    }
}
