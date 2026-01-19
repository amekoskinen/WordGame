const getWordsArray = require('./utils/getFinnishWords')
const getCatImage = require('./utils/getCatImage')

let answerObj = {};

for (let row = 1; row <= 6; row++) {
  for (let col = 1; col <= 6; col++) {
    answerObj[`letter${row}${col}`] = "";
    answerObj[`color${row}${col}`] = "";   // new
  }
}

const playGame = async(req,res) => {
  if(!req.session.round) req.session.round= 0
  if(!req.session.word) req.session.word = ""
  req.session.points = 0

  const {letter1, letter2, letter3, letter4, letter5, letter6} = req.body;
  const guess = [letter1, letter2, letter3, letter4, letter5, letter6]
  if(req.session.round==0){
    const allWords = getWordsArray(6)
    req.session.word = allWords[(Math.floor(Math.random() * allWords.length))].toUpperCase().split("")
    for (let row = 1; row <= 6; row++) {
        for (let col = 1; col <= 6; col++) {
            answerObj[`letter${row}${col}`] = "";
            answerObj[`color${row}${col}`] = "";   // new
        }
    }
    console.log(answerObj)
  }
  const row = req.session.round+1
  for (let i=1; i<7; i++){
    answerObj[`letter${row}${i}`] = guess[i-1].toUpperCase()
  }
  req.session.round ++
  console.log(req.session.word)

  let used = Array(6).fill(false);

  for (let i = 0; i < 6; i++) {
   if (guess[i].toUpperCase() === req.session.word[i]) {
    answerObj[`color${row}${i+1}`] = "correct";   // green
    used[i] = true;
    req.session.points++;
    }
   }
   for (let i = 0; i < 6; i++) {
   if (answerObj[`color${row}${i+1}`] === "correct") continue;
   let found = false;
   for (let j = 0; j < 6; j++) {
    if (!used[j] && req.session.word[j] === guess[i].toUpperCase()) {
      used[j] = true;
      found = true;
      break;
    }
  }

    if (found) {
    answerObj[`color${row}${i+1}`] = "incorrect";  // yellow
    } else {
    answerObj[`color${row}${i+1}`] = "wrong";      // gray
  }
}
  if (req.session.points == 6){
    const catURL = await getCatImage()
    if(!catURL){
        catUrl = "/images/Cat.png"
    }
    correctWord = req.session.word
    correctWord = correctWord.join("")
    console.log(correctWord)
    return res.render('game', {correctWord: correctWord, catURL: catURL, winner:1,...answerObj})
  }
  if (req.session.round ==6){
    const catURL = await getCatImage()
    if(!catURL){
        catUrl = "/images/Cat.png"
    }
    correctWord = req.session.word
    correctWord = correctWord.join("")
    return res.render('game', {correctWord: correctWord, catURL: catURL,...answerObj})
  }
  res.render('game', answerObj)
}

module.exports = playGame