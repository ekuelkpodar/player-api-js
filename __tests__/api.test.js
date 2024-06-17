const request = require('supertest');
const express = require('express');
const app = express();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'your-username',
    password: 'your-password',
    database: 'nbaplayers'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

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

describe('GET /api/players', () => {
    it('should return all players', async () => {
        const res = await request(app).get('/api/players');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});

describe('GET /api/players/:id', () => {
    it('should return a single player', async () => {
        const res = await request(app).get('/api/players/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
    });

    it('should return 404 if player not found', async () => {
        const res = await request(app).get('/api/players/999');
        expect(res.statusCode).toEqual(404);
    });
});
