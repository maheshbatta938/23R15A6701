const express = require('express');
const router = express.Router();
const Url = require('../models/url');
const shortid = require('shortid');

// Create short URL
router.post('/shorten', async (req, res) => {
    const { originalUrl, expiry, shortId } = req.body;
    if (!originalUrl) 
        return res.json({ error: 'URL is required' });

    try {
        let customId = shortId || shortid.generate();
        if (shortId && await Url.findOne({ shortId })) {
            return res.json({ error: 'Shortcode already exists' });
        }
        const newUrl = new Url({ originalUrl, shortId: customId, expiry });
        await newUrl.save();
        res.json({ shortUrl: `http://localhost:3000/${customId}` });
    } catch {
        res.json({ error: 'Server error' });
    }
});

// Redirect to original URL
router.get('/:shortId', async (req, res) => {
    try {
        const url = await Url.findOne({ shortId: req.params.shortId });
        if (!url)
             return res.json({ error: 'URL not found' });
        if (url.expiry && new Date() > url.expiry) {
            return res.json({ error: 'Short URL expired' });
        }
        url.clicks += 1;
        const referer = req.get('Referer') || 'direct';
        if (!url.sources.includes(referer)) url.sources.push(referer);
            await url.save();
        res.redirect(url.originalUrl);
    } catch {
        res.json({ error: 'Server error' });
    }
});
const { authenticateToken } = require('../auth');

// Statistics endpoint (protected)

router.get('/statistics/all', authenticateToken, async (req, res) => {
    try {
        const urls = await Url.find();
        res.json({ urls });
    } catch {
        res.json({ error: 'Server error' });
    }
});
module.exports = router;
