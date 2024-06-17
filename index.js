const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'playerdb'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/players', (req, res) => {
    db.query('SELECT * FROM players', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/api/players/:id', (req, res) => {
    const playerId = req.params.id;
    db.query('SELECT * FROM players WHERE id = ?', [playerId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Player not found' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
