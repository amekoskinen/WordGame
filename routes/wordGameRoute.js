const express = require('express')
const {playGame, addOptions} = require('../wordgame')
const router = express.Router()


router.get('/', (req, res) => {
  if(req.session.round) req.session.round= 0
  if(req.session.word) req.session.word = ""
  if(!req.session.player){
    req.session.score=0
  }
  req.session.answerObj = {}
  res.render('index')
});

router.get('/options', (req,res) => {
    const letters = req.session.letters || 0;
    const answerObj = req.session.answerObj || {};
    const player = req.session.player || ""
    res.render('options', {...answerObj, answerObj, letters, winner:0, catURL:"", correctWord:"", player})
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


module.exports = router;