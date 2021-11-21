var express = require('express');
var router = express.Router();
// var bcrypt = require('bcrypt');
// var uid2 = require('uid2');
const playerModel = require('../model/grid');
// const userModel = require('../model/user');


router.post('/create-game', async (req, res) => {
  await playerModel.deleteMany();
  const names = JSON.parse(req.body.names);

  for(let i = 0; i < names.length; i++){
    
    const player = new playerModel({
      player: i,
      name: names[i],
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
  player.grid = JSON.parse(req.body.grid)[req.body.player];  
  await player.save()
  const players = await playerModel.find();
  res.json(players);
})


// --- SIGN IN and LOGIN ---
// router.post('/signin', async (req, res) => {
//   const user = await userModel.findOne({email: req.body.email});
//   console.log(user)

//   if(user.length === 0){
//     const newUser = new userModel({
//       name: req.body.name,
//       email: req.body.email,
//       password: bcrypt.hashSync(req.body.password, 10),
//       token: uid2(32),
//     })
//     const userSaved = await newUser.save();
//     res.json({message: true, user: userSaved});
//   }else  res.json({message: false})
// })

// router.post('/login', async (req, res) => {
  
// })


module.exports = router;
