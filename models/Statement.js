const mongoose = require('mongoose')

const StatementSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true },
    effect: { type: String, required: true },
    statementActions: [{ type: String }],
    statementResources: [{ type: String, required: true }],
    conditions: { type: mongoose.Mixed }
}, {
    timestamps: true,
    strict: true
})

module.exports = mongoose.model('Statement', StatementSchema)