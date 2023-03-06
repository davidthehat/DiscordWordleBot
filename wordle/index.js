//include axios
const axios = require('axios');
const c = require('ansi-colors');

function dateToWordledate(date) {
    if (date === undefined) {
        date = new Date();
    }
    return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + (date.getDate()).toString().padStart(2, "0");
}

async function fetchWordleData(date) {
    date = dateToWordledate(date);
    var url = "https://www.nytimes.com/svc/wordle/v2/" + date + ".json";
    
    var {data} = await axios.get(url);
    if (data.solution === undefined) {
        throw new Error("No wordle word found for date " + date);
    }
    return data;
}

async function fetchSolver() {
    var url = "https://davidthehat.github.io/wordlebot/docs/file.js";
    var {data} = await axios.get(url);
    return data;
}

function wonGame(resultsArray) {
    if (resultsArray === undefined) {
        return false;
    }
    if (resultsArray.length != 6) {
        return true;
    }
    var finalRow = resultsArray[5][0];
    return finalRow.every((value) => value === "correct");
}

function generateWordleResultString(resultsArray, number, mode, revealed) {
    //loop through results array
    var resultString = "";
    if (revealed) {
        resultString += "**WARNING: Spoiler contains the solution**\n";
    }
    resultString += `Wordle ${number} ${wonGame(resultsArray) ? resultsArray.length : "X"}/6${mode}\n\n`;
    if (revealed) {
        resultString += "||```ansi\n";
    }
    for (var i = 0; i < resultsArray.length; i++) {
        for (var j = 0; j < resultsArray[i][0].length; j++) {
            var currColor = resultsArray[i][0][j];
            var currLetter = resultsArray[i][1][j];
            if (revealed) {
                if (currColor === "absent") {
                    //default letter
                    resultString += (currLetter.toUpperCase());
                } else if (currColor === "present") {
                    //yellow letter
                    resultString += c.yellow(currLetter.toUpperCase());
                } else if (currColor === "correct") {
                    //green letter
                    resultString += c.green(currLetter.toUpperCase());
                }
            } else {
                if (currColor === "absent") {
                    //black square
                    resultString += "⬛";
                } else if (currColor === "present") {
                    //yellow square
                    resultString += "🟨";
                } else if (currColor === "correct") {
                    //green square
                    resultString += "🟩";
                }
            }
        }
        resultString += "\n";
    }
    if (revealed) {
        resultString += "\n```||";
    }
    return resultString;
}

async function playWordle(mode, wordleData, word, revealed) {
    var solver = await fetchSolver();
    
    if (wordleData !== undefined) {
        word = wordleData.solution;
        number = wordleData.days_since_launch;
    } else {
        number = `[${word.toUpperCase()}]`
    }
    const alpha5 = new RegExp(`^[a-z]{5}$`);
    if (!alpha5.test(word) || word.length != 5) {
        throw new Error("Word must be 5 letters long and only contain letters a-z");
    }

    solver = `verbose = false; simWord = "${word}";simMode = true;` + solver;
    resultsArray = await eval(solver);
    console.log("resultsArray: ")
    console.log(resultsArray);
    return generateWordleResultString(resultsArray, number, mode, revealed);
}

module.exports = {
    fetchWordleData,
    generateWordleResultString,
    playWordle
}