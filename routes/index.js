var express = require('express');
var router = express.Router();
const playerModel = require('../model/grid');


router.post('/create-game', async (req, res) => {
  await playerModel.deleteMany();
  const names = JSON.parse(req.body.names);

  for(let i = 1; i < 3; i++){
    
    const player = new playerModel({
      player: i,
      name: names[i - 1],
      grid: {
        as: null,
        two: null,
        three: null,
        four: null,
        five: null,
        six: null,
        total: null,
        bonus: null,
        total1: null,
        max: null,
        min: null,
        total2: null,
        brelan: null,
        smSuite: null,
        bgSuite: null,
        full: null,
        square: null,
        yams: null,
        chance: null,
        total3: null,
        total4: null,
      }
    })
    await player.save();
  }
  const players = await playerModel.find();
  players ? res.json({message: true}) : res.json({message: false})
})


router.get('/get-grid', async (req, res) => {
  const grids = await playerModel.find();
  res.json(grids);
})

router.put('/update-grid', async (req, res) => {
  let player = await playerModel.findOne({player: req.body.player});
  player.grid = JSON.parse(req.body.grid)[req.body.player - 1];  
  await player.save()

  const players = await playerModel.find();
  res.json(players);
})


module.exports = router;
