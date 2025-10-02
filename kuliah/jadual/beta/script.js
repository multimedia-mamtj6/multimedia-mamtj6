// =================================================================
// SCRIPT.JS - VERSI 13.5 (PEMBETULAN MUKTAMAD UNTUK JAJARAN CUTI UMUM DESKTOP)
// =================================================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const jsonData = await fetch('../data/jadual_lengkap.json').then(res => res.json());
        
        const titleElement = document.getElementById('schedule-title');
        if (titleElement && jsonData.infoJadual.tajukBulan) {
            titleElement.textContent = jsonData.infoJadual.tajukBulan;
        }
        const updateInfoElement = document.getElementById('update-info');
        if (updateInfoElement && jsonData.infoJadual.tarikhKemasKini) {
            updateInfoElement.textContent = jsonData.infoJadual.tarikhKemasKini;
        }

        renderCalendarDesktop(jsonData.senaraiHari);
        initializeMobileView(jsonData.senaraiHari);

    } catch (error) {
        console.error("Gagal memuatkan data:", error);
        const calendarBody = document.getElementById('calendar-body');
        if (calendarBody) {
            calendarBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem; color: red;">RALAT: Gagal memuatkan data jadual. Sila pastikan fail 'data/jadual_lengkap.json' wujud dan betul.</td></tr>`;
        }
    }
});

// =================================================================
// BAHAGIAN 1: FUNGSI UNTUK PAPARAN DESKTOP (DENGAN PEMBETULAN)
// =================================================================
function renderCalendarDesktop(senaraiHari) {
    const calendarBody = document.getElementById('calendar-body');
    if (!calendarBody) return;
    
    calendarBody.innerHTML = '';
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let calendarDays = Array(35).fill(null);
    let dayCounter = 1;
    for (let i = firstDayOfMonth; i < 35 && dayCounter <= daysInMonth; i++) { calendarDays[i] = dayCounter++; }
    let overflowingDays = [];
    while (dayCounter <= daysInMonth) { overflowingDays.push(dayCounter++); }
    for (let i = 0; i < 35 && overflowingDays.length > 0; i++) { if (calendarDays[i] === null) { calendarDays[i] = overflowingDays.shift(); } }

    for (let i = 0; i < 5; i++) {
        const row = document.createElement('tr');
        const weekCell = document.createElement('td');
        weekCell.className = 'week-number-cell';
        weekCell.textContent = `MINGGU ${i + 1}`;
        row.appendChild(weekCell);

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            cell.className = 'day-cell';
            const dayNumber = calendarDays[i * 7 + j];

            if (dayNumber !== null) {
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                const dayData = senaraiHari.find(d => d.date === dateString);

                // Sentiasa letak nombor tarikh dahulu, di luar header
                cell.innerHTML = `<div class="date-number">${dayNumber}</div>`;

                // Jika ada cuti umum, tambah header HANYA dengan label
                if (dayData && dayData.cuti_umum) {
                    const dateHeader = document.createElement('div');
                    dateHeader.className = 'date-header';
                    dateHeader.appendChild(document.createElement('span')); 
                    const holidayLabel = document.createElement('span');
                    holidayLabel.className = 'holiday-label';
                    holidayLabel.textContent = dayData.cuti_umum;
                    dateHeader.appendChild(holidayLabel);
                    cell.appendChild(dateHeader);
                }

                const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                if (dateString === todayString) {
                    cell.classList.add('is-today');
                }
                
                const lectureWrapper = document.createElement('div');
                lectureWrapper.className = 'lecture-content';

                if (dayData) {
                    const tiadaSubuh = !dayData.subuh;
                    const tiadaMaghrib = !dayData.maghrib;

                    if (tiadaSubuh && tiadaMaghrib) {
                        lectureWrapper.classList.add('is-empty-slot');
                        lectureWrapper.innerHTML = `<div class="empty-slot-text">Slot Kosong</div>`;
                    } else if (dayData.subuh?.nama_penceramah.includes('Yasiin') || dayData.maghrib?.nama_penceramah.includes('Yasiin')) {
                        lectureWrapper.innerHTML = `<div><div class="arabic-text" lang="ar" dir="rtl"> باچان يسٓ دان تهليل </div><div class="yasin-title">BACAAN YASIIN & TAHLIL</div></div>`;
                    } else {
                        const currentDate = new Date(year, month, dayNumber);
                        const dayOfWeek = currentDate.getDay();
                        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
                        if (isWeekend) {
                            if (dayData.subuh) { lectureWrapper.innerHTML += createLectureBlock('Subuh', dayData.subuh); } else { lectureWrapper.innerHTML += createEmptyLectureBlock(); }
                            if (dayData.maghrib) { lectureWrapper.innerHTML += createLectureBlock('Maghrib', dayData.maghrib); } else { lectureWrapper.innerHTML += createEmptyLectureBlock(); }
                        } else {
                            if (dayData.subuh) { lectureWrapper.innerHTML += createLectureBlock('Subuh', dayData.subuh); }
                            if (dayData.maghrib) { lectureWrapper.innerHTML += createLectureBlock('Maghrib', dayData.maghrib); }
                        }
                    }
                }
                cell.appendChild(lectureWrapper);

                if (!dayData && dayNumber) { 
                    cell.innerHTML = `<div class="date-number">${dayNumber}</div><div class="lecture-content"></div>`;
                }

            } else {
                cell.classList.add('empty-cell');
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}

// =================================================================
// BAHAGIAN 2: FUNGSI-FUNGSI UNTUK PAPARAN MUDAH ALIH
// =================================================================
async function initializeMobileView(senaraiHari) {
    const mobileContainer = document.getElementById('mobile-view-container');
    if (!mobileContainer) return;

    const mobileListContainer = document.getElementById('mobile-card-list');
    if (!mobileListContainer) return;
    
    await renderTodayCard(senaraiHari);
    
    const today = new Date();
    const daysInMalay = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
    const monthNames = ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"];

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    senaraiHari
      .filter(dayData => {
          const date = new Date(dayData.date + 'T00:00:00');
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .forEach(dayData => {
        const currentDate = new Date(dayData.date + 'T00:00:00');
        if (currentDate.toDateString() === today.toDateString()) return;

        const card = document.createElement('div');
        card.className = 'mobile-card';
        
        const cardHeaderHTML = `
            <div class="card-header">
                <span class="date-string">${daysInMalay[currentDate.getDay()]}, ${currentDate.getDate()} ${monthNames[currentDate.getMonth()]}</span>
                ${dayData.cuti_umum ? `<span class="holiday-label">${dayData.cuti_umum}</span>` : ''}
            </div>`;
        
        let cardBodyContent = '';
        const tiadaKuliah = !dayData.subuh && !dayData.maghrib;
        if (tiadaKuliah) {
            cardBodyContent = `<div class="card-body is-empty-slot"><div class="empty-slot-text">Slot Kosong</div></div>`;
        } else {
            if (dayData.subuh) cardBodyContent += createLectureBlock('Subuh', dayData.subuh);
            if (dayData.maghrib) cardBodyContent += createLectureBlock('Maghrib', dayData.maghrib);
            cardBodyContent = `<div class="card-body">${cardBodyContent}</div>`;
        }
        
        card.innerHTML = cardHeaderHTML + cardBodyContent;
        mobileListContainer.appendChild(card);
    });
}

async function renderTodayCard(senaraiHari) {
    const todayContainer = document.getElementById('today-kuliah-card');
    if (!todayContainer) return;

    todayContainer.classList.add('is-today-card');
    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayData = senaraiHari.find(d => d.date === todayDateString);

    let cardHeader = `
        <div class="today-card-header">
            <div class="label">Kuliah Hari Ini</div>
            <div class="date-string" id="today-miladi-date">Memuatkan tarikh...</div>
            <div class="hijri-date-string" id="today-hijri-date"></div>
            ${todayData && todayData.cuti_umum ? `<span class="holiday-label">${todayData.cuti_umum}</span>` : ''}
        </div>`;

    let cardBody = `<div class="today-card-body">`;
    if (todayData && (todayData.subuh || todayData.maghrib)) {
        if (todayData.subuh) {
            cardBody += createLectureBlock('Subuh', todayData.subuh);
            cardBody += `<div class="poster-wrapper"><iframe class="poster-iframe" src="https://multimedia.mamtj6.com/kuliah/paparan/today_subuh.html" loading="lazy" scrolling="no"></iframe></div>`;
        }
        if (todayData.maghrib) {
            cardBody += createLectureBlock('Maghrib', todayData.maghrib);
            cardBody += `<div class="poster-wrapper"><iframe class="poster-iframe" src="https://multimedia.mamtj6.com/kuliah/paparan/today_maghrib.html" loading="lazy" scrolling="no"></iframe></div>`;
        }
    } else {
        cardBody += `<div class="no-kuliah-today">Tiada kuliah dijadualkan hari ini.</div>`;
    }
    cardBody += `</div>`;
    
    todayContainer.innerHTML = cardHeader + cardBody;
    
    await loadHijriDate();
}

async function loadHijriDate() {
    const miladiContainer = document.getElementById('today-miladi-date');
    const hijriContainer = document.getElementById('today-hijri-date');
    if (!miladiContainer) return; 
    
    const today = new Date();
    const daysInMalay = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
    miladiContainer.textContent = `${daysInMalay[today.getDay()]}, ${today.getDate()} ${today.toLocaleString('ms-MY', { month: 'long' })} ${today.getFullYear()}`;
    
    const solatApiUrl = 'https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=WLY01';
    try {
        const response = await fetch(solatApiUrl);
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        const prayerInfo = data.prayerTime[0];
        const hijriMonthNames = { "01": "Muharam", "02": "Safar", "03": "Rabi'ul Awwal", "04": "Rabi'ul Akhir", "05": "Jamadil Awal", "06": "Jamadil Akhir", "07": "Rejab", "08": "Syaaban", "09": "Ramadan", "10": "Syawal", "11": "Zulkaedah", "12": "Zulhijah" };
        const hijriParts = prayerInfo.hijri.split('-');
        const hijriStr = `${parseInt(hijriParts[2], 10)} ${hijriMonthNames[hijriParts[1]]} ${hijriParts[0]}`;
        if (hijriContainer) hijriContainer.textContent = hijriStr;
    } catch (error) {
        console.error('Gagal memuatkan tarikh Hijri:', error);
        if (hijriContainer) hijriContainer.textContent = 'Tidak dapat memuatkan tarikh Hijri.';
    }
}

// =================================================================
// BAHAGIAN 3: FUNGSI-FUNGSI SOKONGAN
// =================================================================
function createLectureBlock(time, lecture) {
    const timeClass = time.toLowerCase();
    return `<div class="lecture-block"><div class="lecture-time ${timeClass}">${time}</div><div class="ustaz-name">${lecture.nama_penceramah}</div><div class="lecture-title">${lecture.tajuk_kuliah}</div></div>`;
}

function createEmptyLectureBlock() {
    return `<div class="lecture-block is-weekend-empty"><div class="empty-slot-text">Slot Kosong</div></div>`;
}
