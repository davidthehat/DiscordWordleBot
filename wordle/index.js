//include axios
var axios = require('axios');

function dateToWordledate(date) {
    if (date === undefined) {
        date = new Date();
    }
    return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate();
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
    var finalRow = resultsArray[5];
    return finalRow.every((value) => value === "correct");
}

function generateWordleResultString(resultsArray, number, mode) {
    //loop through results array
    var resultString = `Wordle ${number} ${wonGame(resultsArray) ? resultsArray.length : "X"}/6${mode}\n\n`;

    for (var i = 0; i < resultsArray.length; i++) {
        for (var j = 0; j < resultsArray[i].length; j++) {
            curr = resultsArray[i][j];
            if (curr === "absent") {
                //black square
                resultString += "⬛";
            } else if (curr === "present") {
                //yellow square
                resultString += "🟨";
            } else if (curr === "correct") {
                //green square
                resultString += "🟩";
            }
        }
        resultString += "\n";
    }
    return resultString;
}

async function playWordle(mode, word) {
    var solver = await fetchSolver();
    var wordleData = await fetchWordleData();
    if (word === undefined) {
        word = wordleData.solution;
    }
    const alpha5 = new RegExp(`^[a-z]{5}$`);
    if (!alpha5.test(word) || word.length != 5) {
        throw new Error("Word must be 5 letters long and only contain letters a-z");
    }

    solver = `simWord = "${word}";simMode = true;` + solver;
    console.log(solver);
    resultsArray = await eval(solver);
    return generateWordleResultString(resultsArray, wordleData.days_since_launch, mode);
}

module.exports = {
    fetchWordleData,
    generateWordleResultString,
    playWordle
}