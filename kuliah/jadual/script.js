// =================================================================
// SCRIPT.JS - VERSI 10.1 (DIPERBAIKI UNTUK MASALAH PAPARAN & STABIL)
// =================================================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Laluan fail yang betul jika script.js berada di dalam folder 'jadual/'
        const jsonData = await fetch('https://multimedia.mamtj6.com/kuliah/data/jadual_lengkap.json').then(res => res.json());
        
        const titleElement = document.getElementById('schedule-title');
        if (titleElement && jsonData.infoJual.tajukBulan) {
            titleElement.textContent = jsonData.infoJual.tajukBulan;
        }
        const updateInfoElement = document.getElementById('update-info');
        if (updateInfoElement && jsonData.infoJual.tarikhKemasKini) {
            updateInfoElement.textContent = jsonData.infoJual.tarikhKemasKini;
        }

        // renderCalendar kini adalah 'async'
        await renderCalendar(jsonData.senaraiHari);

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'download-pdf') {
            generateAndDownloadPDF();
        }

    } catch (error) {
        console.error("Gagal memuatkan data atau menjana PDF:", error);
        const calendarBody = document.getElementById('calendar-body');
        calendarBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem; color: red;">RALAT: Gagal memuatkan data jadual. Sila pastikan fail 'data/jadual_lengkap.json' wujud dan betul.</td></tr>`;
    }
});

async function renderCalendar(senaraiHari) {
    return new Promise(resolve => {
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
                    wrapper.appendChild(dateHeader);

                    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                    if (dateString === todayString) {
                        dateHeader.classList.add('is-today-header');
                    }

                    if (dayData) {
                        const lectureWrapper = document.createElement('div');
                        lectureWrapper.className = 'lecture-content';

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
                        wrapper.appendChild(lectureWrapper);
                    }
                    
                    cell.appendChild(wrapper);
                    
                    if (!dayData) {
                        cell.classList.add('empty-cell');
                    }
                }
                row.appendChild(cell);
            }
        }
        calendarBody.appendChild(row);

        // Beritahu skrip bahawa rendering telah selesai
        resolve();
    });
}

function createLectureBlock(time, lecture) {
    const timeClass = time.toLowerCase();
    return `<div class="lecture-block"><div class="lecture-time ${timeClass}">${time}</div><div class="ustaz-name">${lecture.nama_penceramah}</div><div class="lecture-title">${lecture.tajuk_kuliah}</div></div>`;
}

function createEmptyLectureBlock() {
    return `<div class="lecture-block is-weekend-empty"><div class="empty-slot-text">Slot Kosong</div></div>`;
}

function generateAndDownloadPDF() {
    console.log("Arahan muat turun PDF diterima. Memulakan proses...");
    const jadualContainer = document.querySelector('.page-container');
    const options = { scale: 2, useCORS: true };

    html2canvas(jadualContainer, options).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);
        pdf.save('jadual-kuliah.pdf');
        console.log("PDF berjaya dicipta.");
    });
}
