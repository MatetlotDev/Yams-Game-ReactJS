var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uid2 = require('uid2');
// const playerModel = require('../model/grid');
const userModel = require('../model/user');


router.post('/create-game', async (req, res) => {
  const players = [];
  const names = JSON.parse(req.body.names);

  for (let i = 0; i < names.length; i++) {
    const player = {
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
    }
    players.push(player);
  }

  const game = {
    name: req.body.gamename,
    players: players,
  }

  const user = await userModel.findOne({ token: req.body.token })

  if (user) {
    user.games.push(game)
    await user.save();
    res.json({ message: true })
  }
  else res.json({ message: false })
})


router.get('/get-grid/:token/:gamename', async (req, res) => {
  const user = await userModel.findOne({token: req.params.token})
  let game = user.games[0]
  user.games.forEach(el => {
    if(el.name === req.params.gamename) game = el;
  })
  res.json(game.players);
})

router.put('/update-grid', async (req, res) => {
  let user = await userModel.findOne({ token: req.body.token });
  let game = 0;
  user.games.forEach((el, i) => {
    if(el.name === req.body.gamename) {
      game = i;
      el.players[req.body.player].grid = JSON.parse(req.body.grid)[req.body.player];
    }
  })
  await user.save()
  user = await userModel.findOne({ token: req.body.token });
  const players = user.games[game].players;
  res.json(players);
})

router.get('/loadgames/:token', async (req, res) => {
  const user = await userModel.findOne({token: req.params.token});
  res.json(user.games)
})

router.delete('/deletegame/:token/:gamename', async (req, res) => {
  const user = await userModel.findOne({token: req.params.token});
  
  let game = 0;
  user.games.forEach((el, i) => {
    if(el.name === req.body.gamename) {
      game = i
    }   
  })
  user.games.splice(game, 1); 
  await user.save();
  res.json({message: true})
})


//--- SIGN IN and LOGIN ---
router.post('/signin', async (req, res) => {
  const user = await userModel.find({ email: req.body.email });

  if (user.length == 0) {
    const newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      token: uid2(32),
    })
    const userSaved = await newUser.save();
    res.json({ message: true, user: userSaved });
  } else res.json({ message: false })
})

router.post('/login', async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email })

  user ? res.json({ message: true, user: user }) : res.json({ message: false })
})


module.exports = router;
