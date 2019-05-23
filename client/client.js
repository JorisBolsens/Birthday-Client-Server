const request = require('request');
const readline = require('readline');
const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
});

//These months have 31 days
const months31 = [1,3,5,7,8,10,12];

//Basic error checking
const checkRequest = function(firstName, lastName, month, day) {
    //make sure everything is defined and correct type
    if (firstName === undefined || lastName === undefined || isNaN(day) || isNaN(month))
        console.error("Must include FirstName, LastName, BirthDay, and BirthMonth\n" +
            "BirthMonth and BirthDay must be numeric");
    //make sure month is in range
    else if (month < 1 || month > 12)
        console.error("Birth month must be between 1 (January) and 12 (December)");
    //make sure day is in range
    else if (day < 1 || (month === 2 && day > 29) ||
        (months31.includes(Number(month)) && day > 31) ||
        (month !== 2 && !months31.includes(Number(month)) && day > 30))
        console.error("Birth day cannot be less than 1 or greater than days per month");
    else
        sendRequest(firstName, lastName, month, day)
};

//Send request to the server
const sendRequest = function(firstName, lastName, month, day){
    request.post('http://localhost:8765/', {
        json : {
            BirthMonth: month,
            BirthDay: day,
            FirstName: firstName,
            LastName: lastName
        }
    }, (err, res, body) => {
        if(err){
            console.log(err)
        } else {
            console.log(body);
        }
    });
};

//Prompt user for input
const promptUser = function () {
    console.log("Please enter a firstName lastName birthMonth birthDay (or 0 or Ctrl-C to exit)");
};

//check number of args
//incorrect number of args
if (process.argv.length !== 2 && process.argv.length !== 6){
    console.error("must use either no arguments, or provide firstName lastName birthMonth birthDay");
    return -1;
} else if(process.argv.length === 6){ //name and date provided as arguments
    checkRequest(process.argv[2], process.argv[3], Number(process.argv[4]), Number(process.argv[5]));
    setTimeout(promptUser, 100)
} else
    promptUser();

//handle new input
rl.on('line', (line) => {
    if(line.trim()==="0") {
        console.log("Goodbye!");
        process.exit(0);
    } else if(line.trim().split(" ").length === 4){
        checkRequest.apply(this, line.trim().split(" "));
        setTimeout(promptUser,100);
    } else {
        promptUser()
    }
}).on('close', () => {
    console.log("Goodbye!");
    process.exit(0);
});