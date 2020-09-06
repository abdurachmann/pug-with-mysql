const http = require('http');
const Client = require('mysql2');
const NodeSession = require('node-session');

const routes = require('./routes.js');

const db = Client.createConnection({
    host : 'sql12.freemysqlhosting.net',
    user : 'sql12363793',
    password : 'ghAu9btzwY',
    database: 'sql12363793'
});

// membuat session
const session = new NodeSession({
    secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'
});

const server = http.createServer( (req, res) => {
    routes(session, db, req, res);
});

const runServer = server.listen(3000, "127.0.0.1", () => {
    const host = runServer.address().address;
    const port = runServer.address().port;

    console.log("App listening at http://%s:%s", host, port);
});
