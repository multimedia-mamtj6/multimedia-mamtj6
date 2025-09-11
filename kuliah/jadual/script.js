// =================================================================
// SCRIPT.JS - VERSI 9.2 (MUKTAMAD DENGAN PEMBETULAN KESILAPAN EJAAN)
// =================================================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Laluan fail yang betul jika script.js berada di dalam folder 'jadual/'
        const jsonData = await fetch('../kuliah/data/jadual_lengkap.json').then(res => res.json());
        
        // Membetulkan kesilapan ejaan dari 'infoJual' kepada 'infoJadual'
        const titleElement = document.getElementById('schedule-title');
        if (titleElement && jsonData.infoJadual.tajukBulan) {
            titleElement.textContent = jsonData.infoJadual.tajukBulan;
        }
        const updateInfoElement = document.getElementById('update-info');
        if (updateInfoElement && jsonData.infoJadual.tarikhKemasKini) {
            updateInfoElement.textContent = jsonData.infoJadual.tarikhKemasKini;
        }

        renderCalendar(jsonData.senaraiHari);

    } catch (error) {
        console.error("Gagal memuatkan data:", error);
        const calendarBody = document.getElementById('calendar-body');
        calendarBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem; color: red;">RALAT: Gagal memuatkan data jadual. Sila pastikan fail 'data/jadual_lengkap.json' wujud dan betul.</td></tr>`;
    }
});

function renderCalendar(senaraiHari) {
    const calendarBody = document.getElementById('calendar-body');
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
                const wrapper = document.createElement('div');
                wrapper.className = 'cell-wrapper';

                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                const dayData = senaraiHari.find(d => d.date === dateString);

                const dateHeader = document.createElement('div');
                dateHeader.className = 'date-header';
                const dateNumSpan = document.createElement('span');
                dateNumSpan.className = 'date-number';
                dateNumSpan.textContent = dayNumber;
                dateHeader.appendChild(dateNumSpan);

                if (dayData && dayData.cuti_umum) {
                    const holidayLabel = document.createElement('span');
                    holidayLabel.className = 'holiday-label';
                    holidayLabel.textContent = dayData.cuti_umum;
                    dateHeader.appendChild(holidayLabel);
                }
                
                const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                if (dateString === todayString) {
                    dateHeader.classList.add('is-today-header');
                     cell.classList.add('is-today');
                }
                wrapper.appendChild(dateHeader);

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
                wrapper.appendChild(lectureWrapper);
                cell.appendChild(wrapper);

                if (!dayData) {
                    cell.classList.add('empty-cell');
                }
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}

function createLectureBlock(time, lecture) {
    const timeClass = time.toLowerCase();
    return `<div class="lecture-block"><div class="lecture-time ${timeClass}">${time}</div><div class="ustaz-name">${lecture.nama_penceramah}</div><div class="lecture-title">${lecture.tajuk_kuliah}</div></div>`;
}

function createEmptyLectureBlock() {
    return `<div class="lecture-block is-weekend-empty"><div class="empty-slot-text">Slot Kosong</div></div>`;
}
