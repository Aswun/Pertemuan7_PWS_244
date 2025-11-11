const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware agar folder public bisa diakses
app.use(express.static(path.join(__dirname, 'public')));

// Route utama kirim file HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
