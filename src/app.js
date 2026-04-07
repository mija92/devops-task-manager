const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

// Konfiguracija baze (koristimo environment varijable iz Docker-a)
const pool = new Pool({
  user: process.env.DB_USER || 'stefan',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'taskdb',
  password: process.env.DB_PASSWORD || 'devops_pass',
  port: 5432,
});

const JWT_SECRET = 'tvoj_tajni_kljuc_za_devops';

// --- RUTAMA ---

// 1. Health check (da proverimo da li radi)
app.get('/', (req, res) => {
  res.json({ message: "DevOps Task Manager API is running! 🚀" });
});

// 2. Registracija korisnika
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].password)) {
    const token = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Neispravni podaci' });
  }
});

// 4. Middleware za zaštitu ruta (JWT Provera)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 5. Rad sa zadacima (Samo za ulogovane)
app.get('/tasks', authenticateToken, async (req, res) => {
  const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [req.user.userId]);
  res.json(tasks.rows);
});

app.post('/tasks', authenticateToken, async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    'INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *',
    [title, req.user.userId]
  );
  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server se vrti na portu ${PORT}`);
});
