const mongoose = require('mongoose');

const gridSchema = mongoose.Schema({
    as: Number,
    two: Number,
    three: Number,
    four: Number,
    five: Number,
    six: Number,
    total: Number,
    bonus: Number,
    total1: Number,
    max: Number, 
    min: Number,
    total2: Number,
    brelan: Number,
    smSuite: Number,
    bgSuite: Number,
    full: Number,
    square: Number,
    yams: Number,
    chance: Number,
    total3: Number,
    total4: Number,
})

const playerSchema = mongoose.Schema({
    player: Number,
    name: String,
    grid: gridSchema,
})

const playerModel = mongoose.model('grids', playerSchema);

module.exports = playerModel;