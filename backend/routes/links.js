const express = require('express');
const router = express.Router();
const Link = require('../models/Link');

// generate code
const gen = (len = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let s = '';
    for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}

const isValidCode = (code) => /^[A-Za-z0-9]{6}$/.test(code);

// POST /api/links
router.post('/', async (req, res) => {
    const { url } = req.body || {};
    if (!url) return res.status(400).json({ error: 'missing url' });

    for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = gen(6);
        try {
            const doc = new Link({ code: candidate, url });
            await doc.save();
            return res.status(201).json(doc);
        } catch (err) {
            if (err && err.code === 11000) continue; // collision
            console.error(err);
            return res.status(500).json({ error: 'internal error' });
        }
    }
    return res.status(500).json({ error: 'could not generate unique code' });
});


// GET /api/links
router.get('/', async (req, res) => {
    try {
        const docs = await Link.find({}).sort({ createdAt: -1 }).select('code url clicks lastClicked createdAt -_id');
        return res.json(docs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'internal error' });
    }
});


// GET /api/links/:code
router.get('/:code', async (req, res) => {
    const { code } = req.params;
    if (!isValidCode(code)) return res.status(404).json({ error: 'not found' });
    try {
        const doc = await Link.findOne({ code }).select('code url clicks lastClicked createdAt -_id');
        if (!doc) return res.status(404).json({ error: 'not found' });
        return res.json(doc);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'internal error' });
    }
});


// DELETE /api/links/:code
router.delete('/:code', async (req, res) => {
    const { code } = req.params;
    if (!isValidCode(code)) return res.status(404).json({ error: 'not found' });
    try {
        const deleted = await Link.findOneAndDelete({ code });
        if (!deleted) return res.status(404).json({ error: 'not found' });
        return res.json({ ok: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'internal error' });
    }
});


module.exports = router;