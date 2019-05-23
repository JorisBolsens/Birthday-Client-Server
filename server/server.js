const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8765;
const months31 = [1,3,5,7,8,10,12];

const compareDates = function (today, birthDay) {
    let days = Math.ceil((birthDay - today) / (1000 * 86400));

    return days > 0 ? days : 365 + days;
};

const getHandler = function (req, res, next) {
    req.body = {
        'BirthMonth': Number(req.params.month),
        'BirthDay': Number(req.params.day),
        'FirstName':req.params.first,
        'LastName':req.params.last
    };

    next();
};
const errorHandler = function(req, res, next) {
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
    else if(req.body.BirthMonth < 1 || req.body.BirthMonth > 12)
        res.status(400).send("Birth month must be between 1 (January) and 12 (December)");
    else if(req.body.BirthDay < 1 || (req.body.BirthMonth === 2 && req.body.BirthDay > 29) ||
        (months31.includes(req.body.BirthMonth) && req.body.BirthDay > 31) ||
        (req.body.BirthMonth !== 2 && !months31.includes(req.body.BirthMonth) && req.body.BirthDay > 30))
        res.status(400).send("Birth day cannot be less than 1 or greater than days per month");
    else
        next();
};
const responseHandler = function(req, res) {
    const today = new Date();
    const birthday = new Date(today.getFullYear(), req.body.BirthMonth - 1, req.body.BirthDay);

    let message = "Hello " + req.body.FirstName + ". ";
    if(today.getDay() === birthday.getDay() && today.getMonth() === birthday.getMonth())
        message += "Happy Birthday!";
    else
        message += "You have " + compareDates(today, birthday) + " days until your birthday!";

    res.send(message);
};

app.use(bodyParser.json());
app.get('/:first(\\w+)/:last(\\w+)/:month(\\d{2})/:day(\\d{2})', [getHandler, errorHandler, responseHandler]);
app.post('/', [errorHandler, responseHandler]);

app.listen(port, ()=> console.log("Listening!"));