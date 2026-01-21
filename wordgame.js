const getWordsArray = require('./utils/getFinnishWords')
const getCatImage = require('./utils/getCatImage')

const playGame = async(req,res) => {
  req.session.points = 0;
  let letters = req.session.letters
  let answerObj = req.session.answerObj;
  const guess = []
  
  for (let i=0; i<letters; i++){
    guess.push(req.body[`letter${i+1}`].toUpperCase());
  }
  console.log("GUESS", guess)
  const row = req.session.round+1
  for (let i=1; i<letters+1; i++){
    answerObj[`letter${row}${i}`] = guess[i-1]
  }
  req.session.round ++

  let used = Array(letters).fill(false);

  for (let i = 0; i < letters; i++) {
   if (guess[i].toUpperCase() === req.session.word[i]) {
    answerObj[`color${row}${i+1}`] = "correct";
    used[i] = true;
    req.session.points++;
    }
  }
  for (let i = 0; i < letters; i++) {
   if (answerObj[`color${row}${i+1}`] === "correct") continue;
   let found = false;
   for (let j = 0; j < letters; j++) {
    if (!used[j] && req.session.word[j] === guess[i]) {
      used[j] = true;
      found = true;
      break;
    }
  }
    if (found) {
    answerObj[`color${row}${i+1}`] = "incorrect";  
    } else {
    answerObj[`color${row}${i+1}`] = "wrong";      
  }
}
  if (req.session.points == req.session.letters){
    const catURL = await getCatImage()
    if(!catURL){
        catURL = "/images/catpic.png"
    }
    correctWord = req.session.word
    correctWord = correctWord.join("")
    return res.render('game', {player:req.session.player, answerObj, letters, correctWord: correctWord, catURL: catURL, winner:1,...answerObj})
  }
  if (req.session.round == 6){
    const catURL = await getCatImage()
    if(!catURL){
        catURL = "/images/catpic.png"
    }
    correctWord = req.session.word
    correctWord = correctWord.join("")
    return res.render('game', {player:req.session.player, answerObj, letters, correctWord: correctWord, catURL: catURL, winner:2,...answerObj})
  }
  req.session.answerObj = answerObj;
  res.redirect('game')
}

const addOptions = (req,res) => {
    req.session.round= 0
    req.session.word = ""
    req.session.answerObj = {}
    const player = req.body.playerName
    req.session.player = player;
    req.session.letters = Number(req.body.letterOptions)
    if(req.session.round==0){
      const allWords = getWordsArray(req.session.letters)
      req.session.word = allWords[(Math.floor(Math.random() * allWords.length))].toUpperCase().split("")
    let answerObj = {};
    for (let row = 1; row <= 6; row++) {
        for (let col = 1; col <= req.session.letters; col++) {
            answerObj[`letter${row}${col}`] = "";
            answerObj[`color${row}${col}`] = "";
        }
    }
    req.session.answerObj = answerObj
  }
    res.redirect('game')
}

module.exports = {
  playGame,
  addOptions
};
