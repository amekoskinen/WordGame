const words = require('./sanat')

const getWordsArray = function(num=6){
    const newArr = []
    const arr = words.split("\n")
    for (let word of arr){
        word = word.trim()
        if(word.length===num){
        newArr.push(word)
        }
    }
    return newArr;
}

// const wordsCheck = getWordsArray()
// console.log(wordsCheck)

module.exports = getWordsArray