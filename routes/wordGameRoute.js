const express = require('express')
const playGame = require('../wordgame')
const router = express.Router()
let answerObj = {};

function emptyAnswer(){
for (let row = 1; row <= 6; row++) {
  for (let col = 1; col <= 6; col++) {
    answerObj[`letter${row}${col}`] = "";
    answerObj[`color${row}${col}`] = "";   // new
  }
}
}
emptyAnswer() 


router.get('/', (req, res) => {
  if(req.session.round) req.session.round= 0
  if(req.session.word) req.session.word = ""
  res.render('index')
});

router.get('/game', (req,res) => {
    res.render('game', answerObj, winner=0, catURL="", correctWord="")
})

router.post('/game', playGame)


module.exports = router;