const express = require('express');
const Code = require('../models/Code');
const router = express.Router();

router.post('/save', async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;

    try {
        let code = new Code({ user: userId, content });
        await code.save();
        res.status(200).json({ message: 'Code saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error in saving');
    }
});

router.get('/get', async (req, res) => {
    const userId = req.user.id;

    try {
        let code = await Code.findOne({ user: userId }).sort({ date: -1 });
        res.status(200).json(code);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error in fetching');
    }
});

module.exports = router;
