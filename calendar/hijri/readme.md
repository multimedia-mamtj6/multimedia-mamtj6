# Kalendar Tarikh Penting Islam Malaysia

Projek ini bertujuan untuk memaparkan tarikh-tarikh penting dalam kalendar Islam bagi Malaysia dalam format jadual yang kemas, moden, dan responsif. Ia direka untuk dimuatkan dengan pantas dan sangat mudah untuk dikemas kini setiap tahun.

---

### 🔗 Pautan Berkaitan

*   **Laman Kalendar Utama:** [multimedia.mamtj6.com/calendar/hijri/info.html](https://multimedia.mamtj6.com/calendar/hijri/info.html)
*   **Integrasi Penuh (bersama Widget):** [www.mamtj6.com/takwim/takwim-islam](https://www.mamtj6.com/takwim/takwim-islam)
*   **Contoh Widget Kira Detik:** [multimedia.mamtj6.com/calendar/hijri/widgets.html](https://multimedia.mamtj6.com/calendar/hijri/widgets.html)
*   **Info Waktu dan Tarikh Hijri Terkini** [**multimedia.mamtj6.com/calendar/hijri/hari-ini.html**](https://multimedia.mamtj6.com/calendar/hijri/hari-ini.html)

---

### ✨ Ciri-ciri Utama

*   **Paparan Tarikh Tepat:** Memaparkan tarikh Masihi dan Hijrah berdasarkan takwim rasmi.
*   **Kira Detik (Countdown):** Mengira baki hari ke setiap acara akan datang.
*   **Reka Bentuk Responsif:** Paparan jadual yang kemas di desktop dan bertukar kepada paparan kad yang mesra pengguna di peranti mudah alih.
*   **Pusat Data Tunggal:** Semua data acara dan tarikh kemas kini diuruskan melalui satu fail sahaja, iaitu `events.json`.
*   **'Embeded' Widget:** Disertakan dengan fail `widget.html` berasingan untuk menjana kad kira detik yang boleh dibenamkan di mana-mana laman web lain.
*   **`hari-ini.html`: Widget ringkas dan moden yang memaparkan dua maklumat penting: jam rasmi Waktu Standard Malaysia (MST) dari SIRIM dan tarikh Hijrah semasa yang disegerakkan dengan data e-Solat JAKIM.

---


### 🛠️ Teknologi yang Digunakan

*   **HTML5**
*   **CSS3** (dengan Reka Bentuk Responsif menggunakan Media Queries)
*   **JavaScript** (Vanilla JS - tanpa sebarang *framework*)
*   **JSON** (untuk penyimpanan data acara)
*   **GitHub Pages** (untuk pengehosan percuma dan pantas)

---

### 🔄 Cara Mengemas Kini Tarikh (Untuk Rujukan Tahunan)

Mengemas kini data untuk tahun baharu adalah sangat mudah dan hanya melibatkan satu fail.

1.  **Buka Fail `events.json`:** Navigasi ke fail `events.json` di dalam repositori ini.
2.  **Kemas Kini Senarai Acara:** Di bawah kunci `"events"`, ubah suai senarai acara dengan maklumat `eventName`, `eventDate` (dalam format `YYYY-MM-DD`), dan `hijriDate` yang baharu.
3.  **Kemas Kini Tarikh:** Di bahagian atas fail, kemas kini nilai `lastUpdated` kepada tarikh dan masa anda membuat perubahan.
4.  **Simpan Fail:** Simpan (commit) perubahan tersebut. Laman web akan dikemas kini secara automatik dalam beberapa minit.

---

### 🧩'Embeded' Widget Countdown

Projek ini juga menyertakan fail `widget.html` yang boleh digunakan untuk memaparkan kira detik bagi satu acara secara khusus. Widget ini boleh dibenamkan di mana-mana laman web menggunakan `<iframe>`.

#### Cara Penggunaan

Gunakan kod `<iframe>` di bawah dan ubah suai `src` untuk menunjuk ke lokasi `widget.html` anda. Pemilihan acara dikawal menggunakan parameter URL `?event=`.

```html
<iframe src="https://multimedia.mamtj6.com/calendar/hijri/widgets.html?event=NAMA_ACARA" style="width:250px; height:350px; border:none;"></iframe>
```

Gantikan `NAMA_ACARA` dengan kata kunci unik dari `eventName` dalam fail `events.json`.

#### Senarai Pautan Widget Sedia Guna

Berikut adalah senarai pautan penuh untuk setiap acara yang boleh anda gunakan terus.

| Peristiwa | Pautan Widget Penuh |
| :--- | :--- |
| Israk dan Mikraj | `https://multimedia.mamtj6.com/calendar/hijri/widgets.html?event=Israk` |
| Nisfu Sya'ban | `https://multimedia.mamtj6.com/calendar/hijri/widgets.html?event=Nisfu` |
| Awal Ramadan | `https://multimedia.mamtj6.com/calendar/hijri/widgets.html?event=Ramadan` |
| Hari Nuzul Al-Quran | `https://multimedia.mamtj6.com/calendar/hijri/widgets.html?event=Nuzul` |
| Hari Raya Aidilfitri | `https://multimedia.mamtj6.com/calendar/hijri/widgets.html?event=Aidilfitri` |
| Hari Arafah | `https://multimedia.mamtj6.com/calendar/hijri/widgets.html?event=Arafah` |
| Hari Raya Aidiladha | `https://multimedia.mamtj6.com/calendar/hijri/widgets.html?event=Aidiladha` |
| Awal Muharram | `https://multimedia.mamtj6.com/calendar/hijri/widgets.html?event=Muharram` |
| Hari Asyura | `https://multimedia.mamtj6.com/calendar/hijri/widgets.html?event=Asyura` |
| Maulidur Rasul | `https://multimedia.mamtj6.com/calendar/hijri/widgets.html?event=Maulidur` |

---

### ℹ️ Sumber Rujukan & Penghargaan

*   Semua data tarikh Masihi dan Hijrah dirujuk dari portal **e-Solat oleh JAKIM**: [www.e-solat.gov.my](https://www.e-solat.gov.my/index.php?siteId=24&pageId=52)
*   Projek ini dibangunkan dan diselenggara oleh **Admin MAMTJ6**.
*   Untuk sebarang pertanyaan, sila hubungi melalui WhatsApp: [wa.me/601156828198](https://wa.me/601156828198)
