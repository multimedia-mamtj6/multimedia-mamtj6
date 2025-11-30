# Masjid Al-Mukhlisin - Project Jadual Kuliah

This project is a responsive web application designed to display the monthly lecture (kuliah) schedule for Masjid Al-Mukhlisin. It features a traditional calendar view for desktops and a modern, card-based list view for mobile devices.

The entire system is powered by a single JSON data source, which is automatically generated and updated from a user-friendly Google Sheet, making schedule management easy and efficient.

## Key Features

-   **Fully Responsive:** Automatically switches between a full calendar view on desktop and a mobile-friendly card view.
-   **Automated Data Management:** All schedule data is managed via a single Google Sheet. A Google Apps Script processes this sheet and pushes the updated data to the repository.
-   **Dynamic Content:** The displayed month, "last updated" date, and public holiday labels are all generated dynamically from the data source.
-   **"Kuliah Hari Ini" Card:** A special card on the mobile view highlights the current day's schedule, complete with Hijri date integration from JAKIM's e-Solat API.
-   **Next Month Preview:** Users can easily navigate to view the schedule for the upcoming month.
-   **Digital Signage Integration:** The "Kuliah Hari Ini" card embeds live posters from the separate Digital Signage system.
-   **Print-Friendly:** Includes a dedicated print stylesheet for generating clean, A4 landscape PDFs of the desktop calendar view.

## Project Structure

The project is organized into a modular structure for easy maintenance.

📁 projek-jadual-masjid/
│
├── 📄 index.html # Main landing page (hub)
├── 📄 README.md # This file
│
├── 📁 data/
│ └── 📄 jadual_lengkap.json # The single source of truth for all data
│
└── 📁 jadual/
├── 📄 jadual.html # The main schedule page (renders both views)
├── 📄 script.js # Core logic for rendering desktop & mobile views
├── 📄 style.css # Styles for both desktop & mobile views
└── 📄 logo.png

## How It Works

1.  **Data Management (Google Sheets):**
    -   A Google Sheet with two tabs (`Schedule` and `Posters`) is used to manage all lecture data.
    -   A Google Apps Script reads these sheets, constructs a structured JSON object containing all necessary information (lecturer names, topics, poster URLs, public holidays), and automatically pushes it to the `data/jadual_lengkap.json` file in this repository.

2.  **Client-Side Rendering (`jadual/script.js`):**
    -   When a user visits `jadual.html`, the script fetches the master `data/jadual_lengkap.json` file.
    -   It checks the URL for a `?bulan=depan` parameter to determine which month to display (current or next).
    -   It then dynamically renders **two versions** of the schedule in the HTML:
        -   A traditional `<table>` for the desktop view.
        -   A series of `<div>` cards for the mobile view.
    -   For the mobile view, it also fetches the current Hijri date from JAKIM's e-Solat API to display in the "Kuliah Hari Ini" card.

3.  **Responsive Display (`jadual/style.css`):**
    -   The stylesheet contains a `@media query` for screens 768px wide or less.
    -   On desktop screens, the `<table>` is displayed, and the mobile card container is hidden (`display: none`).
    -   On mobile screens, the `<table>` is hidden, and the mobile card container is displayed.

## Data Management Workflow

To update the schedule, you **only need to edit the Google Sheet**.

1.  **`Posters` Sheet:** Ensure all lecturers and their details (full name, topic, poster filename) are listed here.
2.  **`Schedule` Sheet:** Fill in the monthly schedule using the `Short_Name` from the `Posters` sheet. You can add data for future months at the bottom of the current month's data.
3.  **Run the Script:** From the Google Sheet menu, run **`Export Files` > `Update Live Schedule (JSON)`**.

This will automatically update the `jadual_lengkap.json` file, and the changes will be live on the website.

## Running Locally

Because the page fetches a JSON file, you must run it through a local web server.

1.  Navigate to the project's root directory (`projek-jadual-masjid/`) in your terminal.
2.  Start a local server. A simple way is using Python:
    ```bash
    python -m http.server
    ```
3.  Open your browser and navigate to `http://localhost:8000/jadual/jadual.html`.

## Customization

-   **Next Month View:** The link for the next month's schedule is located in `index.html` and points to `jadual/jadual.html?bulan=depan`.
-   **Digital Signage URLs:** The URLs for the embedded posters are hardcoded in `jadual/script.js` within the `renderTodayCard` function.
-   **e-Solat Zone:** The JAKIM API zone is set to `WLY01` in `jadual/script.js` within the `loadHijriDate` function. This can be changed to match your location.


Tentu. Berdasarkan set kod terakhir yang lengkap dan berfungsi, berikut adalah ringkasan perubahan utama dan perkara-perkara penting yang memastikan kedua-dua paparan (desktop dan mudah alih) berfungsi dengan betul.

Ini adalah "manual rujukan" yang baik untuk projek anda.

---

### **Ringkasan Perubahan Utama & Perkara Penting**

#### **1. Sistem Dua Paparan dalam Satu Halaman**

*   **Perubahan Utama:** Daripada mempunyai reka letak yang cuba menyesuaikan diri, kita kini mempunyai **dua reka letak yang berasingan sepenuhnya** di dalam `jadual.html`:
    1.  Sebuah `<table>` dengan id `calendar-body` (untuk desktop).
    2.  Sebuah `<div>` dengan id `mobile-view-container` (untuk mudah alih).
*   **Bagaimana Ia Berfungsi:** `script.js` kini menjalankan **dua fungsi render** yang berbeza (`renderCalendarDesktop` dan `initializeMobileView`), yang mengisi kedua-dua bekas ini serentak.
*   **Perkara Penting:** Fail `style.css` menggunakan `@media query` untuk mengawal mana satu yang dipaparkan.
    *   **Desktop:** `.schedule-table` dipaparkan, `#mobile-view-container` disembunyikan.
    *   **Mudah Alih:** `.schedule-table` disembunyikan, `#mobile-view-container` dipaparkan.
    *   Ini adalah kunci utama yang menyelesaikan masalah paparan yang "hancur" sebelum ini.

#### **2. Pengurusan Data Melalui Google Sheet & JSON Berstruktur**

*   **Perubahan Utama:** Kita telah beralih daripada menguruskan `jadual.json` dan `ustaz.json` secara manual kepada satu aliran kerja automatik.
*   **Bagaimana Ia Berfungsi:**
    1.  **Google Sheet:** Menjadi satu-satunya tempat untuk mengurus data.
    2.  **Skrip Google Apps:** Bertindak sebagai "enjin" yang membaca Google Sheet dan menghasilkan fail `jadual_lengkap.json`.
    3.  **`jadual_lengkap.json`:** Fail ini kini mempunyai struktur objek yang lebih kaya, mengandungi `infoJadual` (metadata) dan `senaraiHari` (jadual).
*   **Perkara Penting:** Mana-mana `script.js` (sama ada untuk Jadual Kalendar atau Digital Signage) yang ingin membaca data ini **mesti** tahu untuk mengakses `jsonData.senaraiHari` terlebih dahulu, bukan `jsonData` secara terus.

#### **3. Ciri-ciri Paparan Desktop (Kekal dengan `position: absolute`)**

*   **Perubahan Utama:** Kita telah membuat keputusan untuk mengekalkan kaedah `position: absolute` untuk paparan desktop bagi memastikan ia kelihatan 100% sama seperti reka bentuk asal anda.
*   **Bagaimana Ia Berfungsi:**
    *   `.day-cell` mempunyai `position: relative`.
    *   `.date-number` dan `.lecture-content` mempunyai `position: absolute` dan diletakkan pada koordinat `top`, `left`, `bottom`, `right` yang spesifik.
*   **Perkara Penting:**
    *   **`Highlight` Hari Ini:** Untuk `highlight` berfungsi dalam kaedah ini, `script.js` **mesti** menambah kelas `is-today` pada `.day-cell` (`<td>`), dan `style.css` **mesti** mempunyai peraturan `.day-cell.is-today` untuk mewarnakan latar belakangnya.
    *   **Jajaran Cuti Umum:** Untuk memastikan nombor tarikh tidak "lari" pada hari cuti, `script.js` kini menggunakan helah: ia memaparkan nombor tarikh seperti biasa, dan jika ada cuti, ia menambah `<div class="date-header">` yang hanya mengandungi label cuti dan satu `<span>` kosong untuk menolaknya ke kanan.

#### **4. Ciri-ciri Paparan Mudah Alih (Kad Responsif)**

*   **Perubahan Utama:** Paparan jadual digantikan dengan dua komponen: kad "Kuliah Hari Ini" dan senarai kad harian.
*   **Bagaimana Ia Berfungsi:**
    *   **Kad "Hari Ini":** Dicipta secara dinamik oleh `renderTodayCard`. Ia membuat panggilan `fetch` tambahan ke API e-solat JAKIM untuk mendapatkan tarikh Hijri. Ia juga membenamkan (embed) paparan Digital Signage menggunakan `<iframe>`.
    *   **Senarai Kad:** Dicipta oleh `initializeMobileView`. Ia akan `filter` data untuk bulan semasa dan melangkau hari yang tiada kuliah.
*   **Perkara Penting:**
    *   **Struktur:** Semua kandungan mudah alih berada di dalam `<div id="mobile-view-container">`.
    *   **Saiz Fon:** Saiz fon untuk paparan mudah alih dikawal secara berasingan di dalam blok `@media query` menggunakan unit `em` dan `rem`, yang lebih sesuai untuk skrin kecil.
    *   **Poster Responsif:** Gaya untuk `.poster-wrapper` menggunakan `aspect-ratio: 16 / 9;` untuk memastikan `iframe` poster sentiasa mengekalkan nisbah aspek yang betul.

Secara ringkasnya, kunci utama sistem anda sekarang ialah **pengasingan**: pengasingan antara logik data (Google Sheet) dan paparan (laman web), serta pengasingan antara gaya paparan desktop dan gaya paparan mudah alih.

Tentu. Berdasarkan versi terakhir yang berfungsi dengan baik, berikut adalah ringkasan perkara-perkara penting (key points) di dalam blok `@media print` anda dan mengapa setiap satu daripadanya kritikal.

### **Kunci Utama dalam `@media print`**

#### **1. Penetapan Halaman & Susun Atur Utama (`@page` & `Flexbox`)**

*   **Kod:**
    ```css
    @page {
        size: A4 landscape;
        margin: 0;
    }
    .page-container {
        display: flex;
        flex-direction: column;
        height: 100vh !important;
        padding: 1cm !important;
    }
    main {
        flex-grow: 1;
    }
    ```
*   **Mengapa Penting:** Ini adalah asas kepada penyelesaian masalah "footer terkeluar".
    *   **`size: A4 landscape;`**: Menetapkan orientasi kertas, memastikan jadual yang lebar mempunyai ruang yang cukup.
    *   **`display: flex;` pada `.page-container`**: Mengubah bekas utama menjadi bekas Flexbox.
    *   **`flex-grow: 1;` pada `main`**: Ini adalah arahan yang paling kritikal. Ia "memaksa" bahagian `main` (yang mengandungi jadual) untuk **memanjang dan mengisi semua ruang kosong** di antara `header` dan `footer`, memastikan `footer` sentiasa kekal di bahagian bawah halaman yang sama.

#### **2. Mengekalkan Kaedah `position: absolute`**

*   **Kod:**
    ```css
    .day-cell { position: relative !important; }
    .date-number { position: absolute; ... }
    .date-header { position: absolute; ... }
    .lecture-content { position: absolute; ... }
    ```
*   **Mengapa Penting:** Paparan desktop anda dibina di atas kaedah ini. Untuk memastikan hasil cetakan kelihatan **sama seperti paparan desktop**, kita perlu mengekalkan kaedah penggayaan ini. `!important` pada `.day-cell` memastikan ia tidak diatasi oleh mana-mana gaya lain.

#### **3. Penggunaan Unit Mesra Cetakan (`pt`)**

*   **Kod:**
    ```css
    .lecture-content { font-size: 6.5pt; top: 16pt; }
    .date-number { font-size: 9pt; top: 2pt; }
    ```
*   **Mengapa Penting:** Unit `vmin` (yang digunakan pada desktop) adalah tidak menentu dalam mod cetak. Menukar semua saiz fon dan kedudukan (`top`, `bottom`, dll.) kepada unit **Points (`pt`)** adalah kunci untuk mendapatkan **konsistensi visual**. `pt` adalah unit standard untuk saiz fon pada kertas, jadi ia akan sentiasa kelihatan sama. Ini menyelesaikan masalah teks yang "melimpah".

#### **4. Pengurusan Garisan Sempadan (`border`)**

*   **Kod:**
    ```css
    .schedule-table td { padding: 1px !important; }
    .day-cell { background-color: transparent !important; }
    .day-cell::before {
        content: '';
        position: absolute;
        top: 1px; left: 1px; right: 1px;
        height: 15pt;
        background-color: var(--date-header-bg);
    }
    ```
*   **Mengapa Penting:** Ini adalah "helah" untuk memaparkan semula garisan sempadan jadual yang hilang.
    *   `.day-cell` dijadikan lutsinar (`transparent`) supaya garisan di bawahnya boleh kelihatan.
    *   Elemen palsu `::before` dicipta untuk "melukis semula" jalur kuning di dalam ruang yang kini lutsinar itu.
    *   `padding: 1px` pada `<td>` mencipta ruang kecil untuk garisan itu "bernafas".

#### **5. Menyembunyikan Elemen Tidak Perlu**

*   **Kod:**
    ```css
    .footer-link,
    .legend-box.today-legend {
        display: none !important;
    }
    .day-cell.is-today {
        background-color: var(--date-header-bg) !important;
    }
    ```
*   **Mengapa Penting:** Ini mengemaskan hasil cetakan.
    *   Menyembunyikan pautan yang tidak boleh diklik dan petunjuk "Hari Ini" yang tidak relevan pada kertas.
    *   Memastikan petak "Hari Ini" kembali kepada warna kuning biasa, menjadikan keseluruhan jadual seragam dari segi visual.

Secara ringkasnya, kunci utama `@media print` anda ialah **menggabungkan susun atur Flexbox peringkat tinggi** (untuk `page-container`) dengan **pengekalan gaya `position: absolute` peringkat rendah** (untuk kandungan petak), sambil **menukar semua unit kepada `pt`** untuk konsistensi cetakan.