const express = require('express');
const path = require('path');
const crypto = require('crypto'); // ← tambahkan ini
const app = express();
const port = 3000;

// Middleware untuk parsing JSON body
app.use(express.json());

// Middleware agar folder public bisa diakses
app.use(express.static(path.join(__dirname, 'public')));

// Route utama kirim file HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔑 API route untuk generate API key
app.post('/generate-key', (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username dan email wajib diisi.' });
  }

  // Generate API key secara aman dengan crypto
  const randomBytes = crypto.randomBytes(16).toString('hex').toUpperCase();
  const hash = crypto.createHash('sha256').update(username + email + Date.now()).digest('hex').substring(0, 12).toUpperCase();

  const apiKey = `${username.substring(0,3).toUpperCase()}-${randomBytes}-${hash}`;

  res.json({ apiKey });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
