/**
 * @OnlyCurrentDoc
 * VERSION 6.0: Public Holiday Feature & Full Automation
 * - Reads a 'Cuti Umum' column from the Schedule sheet.
 * - Automatically generates month/year title and last-updated date.
 * - Creates a structured JSON object with metadata and the schedule list.
 * - Uses robust UI feedback (Browser.msgBox).
 */



// --- CONFIGURATION ---
const SCRIPT_PROP_KEYS = {
//stored in script properties
  username: 'GITHUB_USERNAME', //multimedia-mamtj6 
  repo: 'GITHUB_REPO', //dev
  token: 'GITHUB_TOKEN',
  baseUrl: 'IMAGE_BASE_URL', //https://multimedia.mamtj6.com/kuliah/assets/poster-kuliah/1920X1080/
  secretKey: 'SECRET_KEY' // update
};

// --- SHEET & FILE STRUCTURE ---
const GITHUB_FILE_PATH = 'kuliah/data/jadual_lengkap.json'; // Pastikan laluan ini betul 
const SCHEDULE_SHEET = 'Schedule'; 
const POSTERS_SHEET = 'Posters';
const NO_LECTURE_OPTION = '-- TIADA KULIAH --';

// --- WEB APP & MENU FUNCTIONS ---
function doGet(e) { 
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('GitHub Sync Control Panel'); 
}

function runSyncWithKey(key) { 
    try {
        const scriptProperties = PropertiesService.getScriptProperties();
        const storedKey = scriptProperties.getProperty(SCRIPT_PROP_KEYS.secretKey);
        if (!storedKey) { throw new Error("Configuration error: Secret key has not been set."); }
        if (key !== storedKey) { throw new Error("Invalid secret key."); }
        return updateJsonToGithub();
    } catch (error) {
        throw new Error(error.message);
    }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📤 Export Files')
    .addItem('Update Live Schedule (JSON)', 'updateJsonToGithub_fromMenu')
    .addToUi();
}

function updateJsonToGithub_fromMenu() {
  try {
    const result = updateJsonToGithub();
    Logger.log('SUCCESS: ' + result);
    Browser.msgBox('Success!', result, Browser.Buttons.OK);
  } catch (e) {
    Logger.log('ERROR: ' + e.toString());
    Browser.msgBox('Error', e.message, Browser.Buttons.OK);
  }
}

/**
 * Creates a mapping of short names to filenames for quick lookup.
 * @returns {Map<string, string>} A map where key is Short_Name and value is Filename.
 */
function createPosterMap() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(POSTERS_SHEET);
    if (!sheet) throw new Error(`Sheet named "${POSTERS_SHEET}" not found.`);
    const data = sheet.getDataRange().getValues();
    const headers = data.shift(); // Remove header row
    
    const shortNameIndex = headers.indexOf('Short_Name');
    const filenameIndex = headers.indexOf('Filename');
    const fullNameIndex = headers.indexOf('Nama Penuh');
    const topicIndex = headers.indexOf('Tajuk Kuliah');

    if ([shortNameIndex, filenameIndex, fullNameIndex, topicIndex].includes(-1)) {
        throw new Error('One of the required columns (Short_Name, Filename, Nama Penuh, Tajuk Kuliah) is missing in the Posters sheet.');
    }
    
    const posterMap = new Map();
    data.forEach(row => {
        const shortName = row[shortNameIndex];
        if (shortName) {
        posterMap.set(shortName, {
            filename: row[filenameIndex] || '',
            fullName: row[fullNameIndex] || 'Nama Tidak Ditetapkan',
            topic: row[topicIndex] || 'Topik Umum'
        });
        }
    });
    return posterMap;
}

/**
 * Reads the schedule, builds the JSON data, and pushes to GitHub.
 * @returns {string} The success message.
 */
function updateJsonToGithub() {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const config = {
      username: scriptProperties.getProperty(SCRIPT_PROP_KEYS.username),
      repo: scriptProperties.getProperty(SCRIPT_PROP_KEYS.repo),
      token: scriptProperties.getProperty(SCRIPT_PROP_KEYS.token),
      baseUrl: scriptProperties.getProperty(SCRIPT_PROP_KEYS.baseUrl)
    };

    if (!config.username || !config.repo || !config.token || !config.baseUrl) {
      throw new Error("Configuration is missing. Please set all properties in Project Settings > Script Properties.");
    }
    
    const posterMap = createPosterMap();
    const scheduleSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SCHEDULE_SHEET);
    if (!scheduleSheet) throw new Error(`Sheet named "${SCHEDULE_SHEET}" not found.`);
    
    const scheduleData = scheduleSheet.getDataRange().getValues();
    const scheduleHeaders = scheduleData.shift();

    // Find column indices by header name for flexibility
    const dateIndex = scheduleHeaders.indexOf('Date');
    const subuhIndex = scheduleHeaders.indexOf('Subuh');
    const maghribIndex = scheduleHeaders.indexOf('Maghrib');
    const holidayIndex = scheduleHeaders.indexOf('Cuti Umum'); // New Holiday Column

    if ([dateIndex, subuhIndex, maghribIndex].includes(-1)) {
        throw new Error("Required columns ('Date', 'Subuh', 'Maghrib') not found in Schedule sheet.");
    }

    const spreadsheetTimezone = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();

    // Generate dynamic metadata
    if (scheduleData.length === 0 || !scheduleData[0][dateIndex]) {
        throw new Error("Jadual kosong atau tarikh pertama tidak sah.");
    }
    const firstDate = new Date(scheduleData[0][dateIndex]);
    const monthNames = ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"];
    const dynamicTitle = `BULAN ${monthNames[firstDate.getMonth()].toUpperCase()} ${firstDate.getFullYear()}`;
    const todayString = Utilities.formatDate(new Date(), spreadsheetTimezone, "d/M/yyyy");
    const dynamicUpdateText = `*Dikemaskini oleh Biro Dakwah pada ${todayString}`;
    
    const createLectureObject = (shortName) => {
      if (!shortName || shortName === NO_LECTURE_OPTION) return null;
      const details = posterMap.get(shortName);
      if (!details || !details.filename) return null;
      return {
        nama_penceramah: details.fullName,
        tajuk_kuliah: details.topic,
        poster_url: config.baseUrl + details.filename
      };
    };

    const senaraiHari = scheduleData.map(row => {
      const dateValue = row[dateIndex];
      const subuhShortName = row[subuhIndex];
      const maghribShortName = row[maghribIndex];
      const holidayName = (holidayIndex !== -1 && row[holidayIndex]) ? row[holidayIndex] : null;

      const formattedDate = (dateValue instanceof Date)
        ? Utilities.formatDate(dateValue, spreadsheetTimezone, "yyyy-MM-dd")
        : dateValue.toString();
      
      return {
        date: formattedDate,
        subuh: createLectureObject(subuhShortName),
        maghrib: createLectureObject(maghribShortName),
        cuti_umum: holidayName
      };
    });

    // Create the final structured JSON object
    const finalJsonOutput = {
      infoJadual: {
        tajukBulan: dynamicTitle,
        tarikhKemasKini: dynamicUpdateText
      },
      senaraiHari: senaraiHari
    };

    // --- GitHub Push Logic ---
    const jsonString = JSON.stringify(finalJsonOutput, null, 2);
    const apiUrl = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${GITHUB_FILE_PATH}`;
    const getResponse = UrlFetchApp.fetch(apiUrl, { method: 'get', headers: { 'Authorization': `token ${config.token}` }, muteHttpExceptions: true });
    
    let sha = null;
    if (getResponse.getResponseCode() === 200) {
      sha = JSON.parse(getResponse.getContentText()).sha;
    }

    const payload = {
      message: `[Auto] Update comprehensive schedule from Google Sheets on ${new Date().toISOString()}`,
      content: Utilities.base64Encode(jsonString),
      sha: sha
    };

    const putResponse = UrlFetchApp.fetch(apiUrl, { method: 'put', headers: { 'Authorization': `token ${config.token}` }, contentType: 'application/json', payload: JSON.stringify(payload) });

    if (putResponse.getResponseCode() === 200 || putResponse.getResponseCode() === 201) {
      return `✅ Success! The ${GITHUB_FILE_PATH} file has been updated on GitHub.`;
    } else {
      throw new Error(`Failed to update file. GitHub API responded with: ${putResponse.getResponseCode()}\n${putResponse.getContentText()}`);
    }

  } catch (error) {
    // Re-throw the error so it can be caught by the calling function
    throw new Error(`An error occurred: ${error.message}`);
  }
}