const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require("mysql2");
const config = require("../Scripts/config");
const connection = mysql.createConnection(config.db);
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const emailValidator = require("email-validator");
const slowDown = require("express-slow-down");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Çok fazla istek, lütfen bekleyin!"
});

const registerLimiter = slowDown({
  windowMs: 5 * 60 * 1000,
  delayAfter: 3,
  delayMs: (delay, request) => {
    const delayAfter = request.slowDown.delayAfter;
    return (delay - delayAfter) * 2000;
  },
});


router.post('/login',apiLimiter, async (req, res) => {
    const { email, password } = req.body;
  
    try {
      connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
          console.error('Giriş sırasında hata:', error);
          res.status(500).json({ error: 'İç Sunucu Hatası' });
        } else if (results.length === 0) {
          res.status(401).json({ error: 'Geçersiz email veya şifre' });
        } else {
          const user = results[0];
          const passwordMatch = await bcrypt.compare(password, user.password);
  
          if (!passwordMatch) {
            res.status(401).json({ error: 'Geçersiz email veya şifre' });
          } else {
            const token = jwt.sign({ email: user.email }, 'h159753123', { expiresIn: '1h' });
            res.json({ token });
          }
        }
      });
    } catch (error) {
      console.error('Giriş sırasında hata:', error);
      res.status(500).json({ error: 'İç Sunucu Hatası' });
    }
  });

module.exports = router