#BirthDay Server & Client
## Install:
To install, simply run npm install in both the server and client sub-directories.

server relies on `express` and `body-parser`

client relies on `request`

## Usage:
to run the server, simply type `node server.js`

to run the client, you can type `node client.js` or supply a name and birthday `node client.js Joris Bolsens 05 19`

## Server:
The server listens on port `8765` it accepts a `GET` request in the form of `GET /:firstName/:lastName/:birthMonth/:birthYear`

or it accepts a `PUT` request with a body of
```json
{
  "BirthMonth": 5,
  "BirthDay": 19,
  "FirstName": "Joris",
  "LastName": "Bolsens"
}
```