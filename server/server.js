const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8765;

const months31 = [1,3,5,7,8,10,12]; //these months have 31 days

//This will compare two dates and return the difference between them in the year.
const compareDates = function (today, birthDay) {
    let days = Math.ceil((birthDay - today) / (1000 * 86400));

    return days > 0 ? days : 365 + days;
};

//Process a GET request and set the body field
const getHandler = function (req, res, next) {
    req.body = {
        'BirthMonth': Number(req.params.month),
        'BirthDay': Number(req.params.day),
        'FirstName':req.params.first,
        'LastName':req.params.last
    };

    next();
};

//Some Basic error handling
const errorHandler = function(req, res, next) {
    //Make sure that each field is defined and the proper type
    if(req.body === undefined || req.body.BirthDay === undefined || req.body.BirthMonth === undefined ||
        req.body.FirstName === undefined || req.body.LastName === undefined || isNaN(req.body.BirthDay) ||
        isNaN(req.body.BirthMonth))
        res.status(400).send("Must include FirstName, LastName, BirthDay, and BirthMonth\n" +
            "use a GET request in the form of /firstname/lastname/month(numeric)/day(numeric)\n" +
            "or send a put request to / with an object: {\n" +
                "  \"BirthMonth\": 5,\n" +
                "  \"BirthDay\": 19,\n" +
                "  \"FirstName\": \"Joris\",\n" +
                "  \"LastName\": \"Bolsens\"\n" +
            "}"
        );
    //Make sure that the month is within range
    else if(req.body.BirthMonth < 1 || req.body.BirthMonth > 12)
        res.status(400).send("Birth month must be between 1 (January) and 12 (December)");
    //Make sure that the day is within range
    else if(req.body.BirthDay < 1 || (req.body.BirthMonth === 2 && req.body.BirthDay > 29) ||
        (months31.includes(req.body.BirthMonth) && req.body.BirthDay > 31) ||
        (req.body.BirthMonth !== 2 && !months31.includes(req.body.BirthMonth) && req.body.BirthDay > 30))
        res.status(400).send("Birth day cannot be less than 1 or greater than days per month");
    else
        next(); //move to next handler
};

//Final handler
const responseHandler = function(req, res) {
    //get todays date
    const today = new Date();
    //get the birthdate
    const birthday = new Date(today.getFullYear(), req.body.BirthMonth - 1, req.body.BirthDay);

    //base message
    let message = "Hello " + req.body.FirstName + ". ";
    //check if today is their birthday
    if(today.getDay() === birthday.getDay() && today.getMonth() === birthday.getMonth())
        message += "Happy Birthday!";
    //if it is not their birthday
    else
        message += "You have " + compareDates(today, birthday) + " days until your birthday!";

    res.send(message);
};

app.use(bodyParser.json());
//use regex to validate GET params
app.get('/:first(\\w+)/:last(\\w+)/:month(\\d{1,2})/:day(\\d{1,2})', [getHandler, errorHandler, responseHandler]);
app.post('/', [errorHandler, responseHandler]);

app.listen(port, ()=> console.log("Listening!"));