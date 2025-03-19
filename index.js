const { makeWASocket, useMultiFileAuthState, delay } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const checkSchedule = require("./Jadwal/Jadwal");
const moment = require("moment");

moment.locale("id"); // Gunakan format Indonesia

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            qrcode.generate(qr, { small: true });
        }
        if (connection === "close") {
            console.log("Bot terputus, mencoba menyambungkan kembali...");
            startBot();
        } else if (connection === "open") {
            console.log("✅ Bot berhasil tersambung!");
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || !msg.key.remoteJid) return;
    
        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    
        if (text === ".sendtugas") {
            await sendTugas(sock, sender);
        }
    });
    

    const groupId = "120363398189305663@g.us";

    // // 🔹 Jalankan setiap 1 menit
    // setInterval(async () => {
    //     await checkSchedule(sock, groupId);
    // }, 30000);

    // 🔹 Kirim otomatis setiap pukul 07:00 pagi
    setInterval(async () => {
        const currentTime = moment().format("HH:mm");
        if (currentTime === "12:00") {
            await checkSchedule(sock, groupId);
        }
    }, 60000);

    return sock;
}

startBot();
