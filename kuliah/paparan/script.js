// =================================================================
// SCRIPT.JS UNTUK DIGITAL SIGNAGE
// Versi 4.3 - Dengan Paksaan Zon Masa Malaysia (GMT+8)
// =================================================================

const JSON_URL = 'https://multimedia.mamtj6.com/kuliah/data/jadual_lengkap.json';

const MESSAGES = {
    today_subuh: 'Tiada Kuliah Subuh Hari Ini',
    today_maghrib: 'Tiada Kuliah Maghrib Hari Ini',
    tomorrow_subuh: 'Tiada Kuliah Subuh pada Hari Esok',
    tomorrow_maghrib: 'Tiada Kuliah Maghrib pada Hari Esok',
    error: 'Error: Could not load schedule data'
};

/**
 * Gets a date string in YYYY-MM-DD format, FORCED to Malaysia Time (GMT+8).
 * @param {string} target 'today' or 'tomorrow'.
 * @returns {string} The formatted date string.
 */
function getTargetDate(target) {
    // 1. Dapatkan waktu semasa
    const now = new Date();
    
    // 2. Kira offset untuk GMT+8 (Malaysia) dari UTC
    // Waktu tempatan + offset zon masa tempatan + offset GMT+8
    const malaysiaTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (8 * 3600000));
    
    // 3. Tambah satu hari jika sasarannya adalah "esok"
    if (target === 'tomorrow') {
        malaysiaTime.setDate(malaysiaTime.getDate() + 1);
    }
    
    // 4. Formatkan tarikh kepada YYYY-MM-DD
    const year = malaysiaTime.getFullYear();
    const month = String(malaysiaTime.getMonth() + 1).padStart(2, '0');
    const day = String(malaysiaTime.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

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
        // Pastikan mesej yang betul dipaparkan
        messageBox.querySelector('h1').textContent = message;
    }
}

async function initializeDisplay(day, lectureType) {
    const messageKey = `${day}_${lectureType}`;
    const targetDate = getTargetDate(day);
    
    console.log(`Mencari data untuk tarikh (Waktu Malaysia): ${targetDate}`);

    try {
        const response = await fetch(`${JSON_URL}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        
        const jsonData = await response.json();
        const scheduleList = jsonData.senaraiHari;
        const entry = scheduleList.find(item => item.date === targetDate);
        
        console.log("Entri ditemui:", entry);
        
        let imageUrl = null;
        if (entry && entry[lectureType]?.poster_url) {
            imageUrl = entry[lectureType].poster_url;
        }

        // --- PEMBETULAN UNTUK MEMAPARKAN MESEJ ---
        // Jika tiada imej, pastikan ia menggunakan mesej yang betul dari MESSAGES
        if (imageUrl) {
            setDisplay(imageUrl, '');
        } else {
            setDisplay(null, MESSAGES[messageKey]);
        }

    } catch (error) {
        console.error('Failed to initialize display:', error);
        setDisplay(null, MESSAGES['error']);
    }
}
