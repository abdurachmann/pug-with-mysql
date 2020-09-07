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

// memanggil method connect
db.connect( error => {
    if (error) {
        console.log('Koneksi server MariaDB gagal');
        throw error;
    } else {
        console.log('Koneksi MariaDB Berhasil');
        // db.end();
    }
})

// membuat session
const session = new NodeSession({
    secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'
});

const server = http.createServer( (req, res) => {
    routes(session, db, req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log(`Server aktif di port ${PORT}`);

// const runServer = server.listen(PORT, "127.0.0.1", () => {
//     const host = runServer.address().address;
//     const port = runServer.address().port;

//     console.log("App listening at http://%s:%s", host, port);
// });

