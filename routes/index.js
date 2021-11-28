var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'); //to encrypt the password
var uid2 = require('uid2'); // for the user's token
const userModel = require('../model/user'); //import model user

// when you create a new game
router.post('/create-game', async (req, res) => {
  const players = [];
  const names = JSON.parse(req.body.names);// take the names from the front

  // for each names, create a new player with a grid set at null
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

  // create a game model with all the players
  const game = {
    name: req.body.gamename,
    lastPlayer: 0,
    players: players,
  }

  // find the user in the DB and add the new game to his games
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

  // find the game that match with the name from the front
  user.games.forEach(el => {
    if(el.name === req.params.gamename) game = el; //remember the game
  })
  res.json({players: game.players, lastPlayer: game.lastPlayer}); //send back the players and the last player
})

// each time we click on the grid to set the score
router.put('/update-grid', async (req, res) => {
  let user = await userModel.findOne({ token: req.body.token });
  let game = 0;

  user.games.forEach((el, i) => {
    if(el.name === req.body.gamename) {
      game = i;
      el.players[req.body.player].grid = JSON.parse(req.body.grid)[req.body.player];
      el.lastPlayer = Number(req.body.player) + 1;
    }
  })
  await user.save()

  user = await userModel.findOne({ token: req.body.token });
  const players = user.games[game].players;
  res.json(players);
})

// when we click on reload the games
router.get('/loadgames/:token', async (req, res) => {
  const user = await userModel.findOne({token: req.params.token});
  res.json(user.games)
})

// when we delete the game
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
