const fs = require("fs");
const path = require("path");

// Path ke file JSON tugas
const tugasPath = path.join(__dirname, "Tugas.json");

// Fungsi untuk membaca dan menulis daftar tugas dari JSON
function getTugas() {
    try {
        const data = fs.readFileSync(tugasPath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Gagal membaca file Tugas.json:", error);
        return {};
    }
}

function saveTugas(tugas) {
    try {
        fs.writeFileSync(tugasPath, JSON.stringify(tugas, null, 2), "utf-8");
    } catch (error) {
        console.error("Gagal menyimpan file Tugas.json:", error);
    }
}

async function sendTugas(sock, sender, groupId, tugasText) {
    if (!tugasText) {
        await sock.sendMessage(sender, { text: "⚠️ Format salah! Gunakan: .sendtugas [deskripsi tugas]" });
        return;
    }

    // Simpan tugas ke JSON
    const tugas = getTugas();
    const hariIni = new Date().toLocaleDateString("id-ID", { weekday: "long" });
    if (!tugas[hariIni]) tugas[hariIni] = [];
    tugas[hariIni].push({ description: tugasText });
    saveTugas(tugas);

    // Kirim tugas ke grup
    const message = `📌 *Tugas Baru untuk ${hariIni}* \n\n✏️ ${tugasText}`;
    await sock.sendMessage(groupId, { text: message });

    // Konfirmasi ke pengirim
    await sock.sendMessage(sender, { text: "✅ Tugas berhasil dikirim ke grup!" });
}

module.exports = sendTugas;
