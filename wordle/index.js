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

function generateWordleResultString(resultsArray, number, mode) {
    //loop through results array
    var resultString = `Wordle ${number} ${resultsArray.length}/6${mode}\n\n`;

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

async function playWordle(mode) {
    var solver = await fetchSolver();
    var wordleData = await fetchWordleData();
    
    solver = `simWord = "${wordleData.solution}";simMode = true;` + solver;
    console.log(solver);
    resultsArray = await eval(solver);
    return generateWordleResultString(resultsArray, wordleData.days_since_launch, mode);
}

module.exports = {
    fetchWordleData,
    generateWordleResultString,
    playWordle
}