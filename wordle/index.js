//include axios
var axios = require('axios');

function dateToWordledate(date) {
    if (date === undefined) {
        date = new Date();
    }
    return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate();
}

async function fetchWordleWord(date) {
    date = dateToWordledate(date);
    var url = "https://www.nytimes.com/svc/wordle/v2/" + date + ".json";
    
    var {data} = await axios.get(url);
    if (data.solution === undefined) {
        throw new Error("No wordle word found for date " + date);
    }
    return data.solution;
}

module.exports = {
    fetchWordleWord
}