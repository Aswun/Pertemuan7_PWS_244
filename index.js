const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // agar bisa baca JSON body dari fetch()

// Koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Bil1o8775', // sesuaikan dengan konfigurasi MySQL kamu
  database: 'api_p7',
  port: 3307
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Terhubung ke database!');
});

// Route utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint untuk generate API key
app.post('/generate-key', (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username dan email wajib diisi.' });
  }

  // Generate API key unik
  const randomBytes = crypto.randomBytes(16).toString('hex').toUpperCase();
  const hash = crypto
    .createHash('sha256')
    .update(username + email + Date.now())
    .digest('hex')
    .substring(0, 12)
    .toUpperCase();
  const apiKey = `${username.substring(0, 3).toUpperCase()}-${randomBytes}-${hash}`;

  // Simpan ke database
  const sql = 'INSERT INTO api_keys (username, email, api_key) VALUES (?, ?, ?)';
  db.query(sql, [username, email, apiKey], (err, result) => {
    if (err) {
      console.error('❌ Gagal menyimpan API key:', err);
      return res.status(500).json({ error: 'Gagal menyimpan API key ke database.' });
    }

    console.log('✅ API key tersimpan untuk:', username);
    res.json({ apiKey });
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
