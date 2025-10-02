// =================================================================
// SCRIPT.JS UNTUK DIGITAL SIGNAGE
// Versi 4.2 - Dengan Pembetulan Zon Masa (UTC)
// =================================================================

// ... (JSON_URL dan MESSAGES tidak berubah) ...
const JSON_URL = 'https://multimedia.mamtj6.com/kuliah/data/jadual_lengkap.json';
const MESSAGES = { /* ... */ };

/**
 * Gets a date string in YYYY-MM-DD format using UTC to avoid timezone issues.
 * @param {string} target 'today' or 'tomorrow'.
 * @returns {string} The formatted date string.
 */
function getTargetDate(target) {
    const date = new Date();
    
    // --- PEMBETULAN UTAMA DI SINI ---
    // Tukar tarikh semasa kepada zon masa UTC
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();

    // Cipta tarikh baharu yang "bersih" dalam UTC
    const utcDate = new Date(Date.UTC(year, month, day));

    if (target === 'tomorrow') {
        // Tambah satu hari dalam konteks UTC
        utcDate.setUTCDate(utcDate.getUTCDate() + 1);
    }
    
    const targetYear = utcDate.getUTCFullYear();
    const targetMonth = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
    const targetDay = String(utcDate.getUTCDate()).padStart(2, '0');
    
    return `${targetYear}-${targetMonth}-${targetDay}`;
}

/**
 * Updates the page content (image or message).
 * @param {string|null} imageUrl The URL of the image, or null.
 * @param {string} message The text to display if there is no image.
 */
function setDisplay(imageUrl, message) {
    // ... (Fungsi ini tidak berubah) ...
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
 * @param {string} day 'today' or 'tomorrow'.
 * @param {string} lectureType 'subuh' or 'maghrib'.
 */
async function initializeDisplay(day, lectureType) {
    // ... (Fungsi ini tidak berubah) ...
    const messageKey = `${day}_${lectureType}`;
    const targetDate = getTargetDate(day);
    
    // --- Tambah console.log untuk debugging ---
    console.log(`Mencari data untuk: ${targetDate}`);
    
    try {
        const response = await fetch(`${JSON_URL}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
        
        const jsonData = await response.json();
        const scheduleList = jsonData.senaraiHari;
        const entry = scheduleList.find(item => item.date === targetDate);

        // --- Tambah console.log untuk debugging ---
        if (entry) {
            console.log("Entri ditemui:", entry);
        } else {
            console.log("Tiada entri ditemui untuk tarikh sasaran.");
        }
        
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
