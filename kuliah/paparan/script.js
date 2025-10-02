// =================================================================
// SCRIPT.JS UNTUK DIGITAL SIGNAGE
// Versi 4.0 - Dengan Tambahan Console Log untuk Debugging
// =================================================================

const JSON_URL = 'https://multimedia.mamtj6.com/kuliah/data/jadual_lengkap.json';

const MESSAGES = {
    today_subuh: 'Tiada Kuliah Subuh Hari Ini',
    today_maghrib: 'Tiada Kuliah Maghrib Hari Ini',
    tomorrow_subuh: 'Tiada Kuliah Subuh pada Hari Esok',
    tomorrow_maghrib: 'Tiada Kuliah Maghrib pada Hari Esok',
    error: 'Error: Could not load schedule data'
};

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

async function initializeDisplay(day, lectureType) {
    const messageKey = `${day}_${lectureType}`;
    const targetDate = getTargetDate(day);
    
    // Log tarikh yang sedang dicari
    console.log(`Mencari jadual untuk: ${day} (${targetDate}), Slot: ${lectureType}`);

    try {
        const response = await fetch(`${JSON_URL}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
        
        const jsonData = await response.json();
        const scheduleList = jsonData.senaraiHari;
        const entry = scheduleList.find(item => item.date === targetDate);
        
        // Log entri yang ditemui (jika ada)
        console.log("Entri data yang ditemui:", entry);
        
        let imageUrl = null;
        if (entry && entry[lectureType]?.poster_url) {
            imageUrl = entry[lectureType].poster_url;
        }

        // --- TAMBAHAN CONSOLE LOG DI SINI ---
        if (imageUrl) {
            console.log("URL Imej untuk dipaparkan:", imageUrl);
            setDisplay(imageUrl, '');
        } else {
            console.log("Tiada URL imej ditemui. Memaparkan mesej.");
            setDisplay(null, MESSAGES[messageKey]);
        }
        // --- AKHIR TAMBAHAN ---

    } catch (error) {
        console.error('Failed to initialize display:', error);
        setDisplay(null, MESSAGES['error']);
    }
}
