const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./config/ConnectDatabase');
const cors = require('cors');
const morgan = require('morgan');
const linkRoutes = require('./routes/links');
const { isValidCode } = require('./utils/validator');
const Link = require('./models/Link');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDatabase();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Healthcheck
app.get('/healthz', (req, res) => {
    res.json({ ok: true, version: '1.0' });
});

// Link routes
app.use('/api/links', linkRoutes);


// Redirect route: GET /:code
app.get('/:code', async (req, res) => {
    const { code } = req.params;
    if (!isValidCode(code)) return res.status(404).send('Not found');
    try {
        // Find and atomically increment clicks
        const doc = await Link.findOneAndUpdate(
            { code },
            { $inc: { clicks: 1 }, $set: { lastClicked: new Date() } },
            { new: true }
        );
        if (!doc) return res.status(404).send('Not found');
        return res.redirect(302, doc.url);
    } catch (err) {
        console.error(err);
        return res.status(500).send('internal error');
    }
});





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});