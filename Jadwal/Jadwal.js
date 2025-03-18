const fs = require("fs");
const path = require("path");
const moment = require("moment");

// Path ke file JSON di dalam folder "Jadwal"
const schedulePath = path.join(__dirname, "Jadwal.json");

// Fungsi untuk membaca jadwal dari JSON
function getSchedule() {
    try {
        const data = fs.readFileSync(schedulePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("❌ Gagal membaca file Jadwal.json:", error);
        return {};
    }
}

// Fungsi mengecek jadwal berdasarkan hari
async function checkSchedule(sock, groupId) {
    const schedule = getSchedule();
    const today = moment().format("dddd"); // Nama hari (Senin, Selasa, dst.)
    
    if (schedule[today] && schedule[today].length > 0) {
        let message = `📅 *Jadwal ${today}*\n\n📚 *Mata Pelajaran:*\n`;
        
        schedule[today].forEach((lesson) => {
            message += `- ${lesson.pelajaran} dari jam ${lesson.waktu}\n`;
        });

        await sock.sendMessage(groupId, { text: message });
        console.log("Pesan jadwal terkirim:\n", message);
    } else {
        console.log(`⚠️ Tidak ada jadwal untuk hari ini: ${today}`);
    }
}

module.exports = checkSchedule;
