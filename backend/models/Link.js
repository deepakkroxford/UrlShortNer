const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    lastClicked: { type: Date }
});


module.exports = mongoose.model('Link', LinkSchema);