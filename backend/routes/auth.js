const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ username, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'secretKey', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in saving');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect Password!' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'secretKey', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
        });
    } catch (e) {
        console.error(e);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
