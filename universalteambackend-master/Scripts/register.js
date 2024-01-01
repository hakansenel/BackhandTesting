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
  max: 20,
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


router.post('/register',apiLimiter, async (req, res) => {
    const { email, password } = req.body;
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (error, results) => {
        if (error) {
          console.error('Kayıt sırasında hata:', error);
          res.status(500).json({ error: 'İç Sunucu Hatası' });
        } else {
          res.status(201).json({ message: "Kayıt başarılı" });
        }
      });
    } catch (error) {
      console.error('Kayıt sırasında hata:', error);
      res.status(500).json({ error: 'İç Sunucu Hatası' });
    }
  });

  module.exports = router