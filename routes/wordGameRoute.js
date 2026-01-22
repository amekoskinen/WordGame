const express = require('express')
const {playGame, addOptions} = require('../wordgame')
const router = express.Router()
const mongoose = require('mongoose')
const Highscore = require('../models/highscore')


router.get('/', (req, res) => {
  if(req.session.round) req.session.round= 0
  if(req.session.word) req.session.word = ""
  if(req.session.player){
    req.session.score=0
    req.session.player=""
  }
  req.session.answerObj = {}
  res.render('index')
});

router.get('/options', async(req,res) => {
    const letters = req.session.letters || 0;
    const answerObj = req.session.answerObj || {};
    const player = req.session.player || ""
    const highscore = await Highscore.find({})
    highscore.sort((a, b) => b.points - a.points);
    res.render('options', {...answerObj, answerObj, letters, winner:0, catURL:"", correctWord:"", highscore, player})
})

router.post('/options', addOptions)

router.get('/game', (req, res) => {
  const letters = req.session.letters;
  const answerObj = req.session.answerObj || {};
  const player = req.session.player || ""

  res.render('game', {
    ...answerObj,
    answerObj,
    letters,
    winner: 0,
    catURL: "",
    correctWord: "",
    player
  });
});


router.post('/game', playGame)

router.get('/quit', async (req, res) => {
  const newHighscore = await new Highscore({name: req.session.player, points: req.session.score})
  console.log(newHighscore)
  await newHighscore.save()
  // await mongoose.connection.close();
  console.log('Server is shutting down...');
  res.render('quit')
});


module.exports = router;