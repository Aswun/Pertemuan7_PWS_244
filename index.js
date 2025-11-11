const mysql = require('mysql2');

// koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Bil1o8775', // ubah sesuai konfigurasi kamu
  database: 'api_p7'
});

db.connect(err => {
  if (err) throw err;
  console.log('Terhubung ke database!');
});

app.post('/generate-key', (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username dan email wajib diisi.' });
  }

  const randomBytes = crypto.randomBytes(16).toString('hex').toUpperCase();
  const hash = crypto.createHash('sha256').update(username + email + Date.now()).digest('hex').substring(0, 12).toUpperCase();
  const apiKey = `${username.substring(0,3).toUpperCase()}-${randomBytes}-${hash}`;

  // Simpan ke database
  const sql = 'INSERT INTO api_keys (username, email, api_key) VALUES (?, ?, ?)';
  db.query(sql, [username, email, apiKey], (err, result) => {
    if (err) return res.status(500).json({ error: 'Gagal menyimpan API key ke database.' });

    res.json({ apiKey });
  });
});
