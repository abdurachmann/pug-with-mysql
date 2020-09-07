const url = require('url');
const pug = require('pug');
const qs = require('querystring');
const homePug = './templates/home.pug';
const listPug = './templates/list.pug';
const loginPug = './templates/login-form.pug';
const editPug = './templates/edit.pug';
const addPug = './templates/add.pug';
const addListPug = './templates/addList.pug';

const routes = (session, db, req, res) => {
    session.startSession(req, res, () => {

        if (req.url === '/') {
            res.writeHead(
                200,
                {
                    'Content-Type' : 'text/html'
                }
            );
            const template = pug.renderFile(loginPug);
            res.end(template);
        } else if (req.url === '/login' && req.method === 'POST') {
            let body = '';
            req.on('data', value => {
                body += value;
            });

            req.on('end', () => {
                let form = qs.parse(body);
                let data = [
                    form['username'],
                    form['password']
                ];

                let sql = `select count(*) as cnt, level_user from users 
                where username = ? and password = md5(?)`;

                db.query(sql, data, (error, result) => {
                    if (error) {
                        throw error;
                    } else {
                        let value = result[0]['cnt'];
                        // console.log(`Nilainya adalah ${value}`);
                        let role = result[0]['level_user'];
                        // console.log(role);
                        
                        if ( value > 0) {
                            // login success
                            req.session.put('username', data[0]);
                            
                            if (role === 1) {
                                // redirect to home page
                                res.writeHead(
                                    302,
                                    {
                                        'Location' : '/home'
                                    }
                                );

                                res.end();
                            } else if (role === 2) {
                                // redirect to list page
                                res.writeHead(
                                    302,
                                    {
                                        'Location' : '/list'
                                    }
                                );

                                res.end()
                            }
                            
                        } else if (data[0] === '' || data[1] === '') {
                            res.writeHead(
                                200,
                                {
                                    'Content-Type' : 'text/html'
                                }
                            );
                            const templateError = pug.renderFile(loginPug, {msg : 'Username atau Password tidak boleh kosong'});
                            res.end(templateError);
                        } else {
                            res.writeHead(
                                200,
                                {
                                    'Content-Type' : 'text/html'
                                }
                            );
                            const templateError = pug.renderFile(loginPug, {msg : 'Username atau Password Salah!'});
                            res.end(templateError);
                        }
                    }
                });
            });
        } else if (req.url === '/home') {
            if (!req.session.has('username')) {
                // redirect to form login
                res.writeHead(
                    302,
                    {
                        'Location': '/'
                    }
                );
                res.end();
            } else {
                db.query('select * from destination', (error, result) => {
                    if (error) {
                        console.log('error');
                        throw error;
                    }
                    let username = req.session.get('username');
                    res.writeHead(
                        200,
                        {
                            'Content-Type' : 'text/html'
                        }
                    );
                    // console.log({destination : result[0].image});
                    // const templateSession = pug.renderFile(homePug, {username : username});
                    const template = pug.renderFile(homePug, {destination : result, username});
                    res.end(template);
                });
            }
        } else if (req.url === '/list') {
            if (!req.session.has('username')) {
                // redirect to form login
                res.writeHead(
                    302,
                    {
                        'Location': '/'
                    }
                );
                res.end();
            } else {
                db.query('select * from destination', (error, result) => {
                    if (error) {
                        console.log('error');
                        throw error;
                    }
                    let username = req.session.get('username');
                    res.writeHead(
                        200,
                        {
                            'Content-Type' : 'text/html'
                        }
                    );
                    // console.log({destination : result[0].image});
                    // const templateSession = pug.renderFile(homePug, {username : username});
                    const template = pug.renderFile(listPug, {destination : result, username});
                    res.end(template);
                });
            }
        } else if (req.url === '/add') {
            switch (req.method) {
                case 'GET':
                    let template = pug.renderFile(addPug);
                    res.end(template);
                    break;

                case 'POST':
                    let body = ''; 
                    req.on('data', data => {
                        body += data;
                    });

                    req.on('end', () => {
                        let form = qs.parse(body);
                        let newDestination = [
                            form['id_destination'],
                            form['image'],
                            form['name'],
                            form['city'],
                            form['description'],
                            form['category'],
                        ];

                        let sql = 'insert into destination values(?,?,?,?,?,?)';
                        db.query(sql, newDestination, (error, result) => {
                            if (error) {
                                throw error;
                            }

                            res.writeHead(
                                302,
                                {
                                    'Location' : '/home'
                                }
                            );
                            res.end();
                        });
                    });
                    break;
                default:
                    break;
            }
        } else if (req.url === '/addList') {
            switch (req.method) {
                case 'GET':
                    let template = pug.renderFile(addListPug);
                    res.end(template);
                    break;

                case 'POST':
                    let body = ''; 
                    req.on('data', data => {
                        body += data;
                    });

                    req.on('end', () => {
                        let form = qs.parse(body);
                        let newDestination = [
                            form['id_destination'],
                            form['image'],
                            form['name'],
                            form['city'],
                            form['description'],
                            form['category'],
                        ];

                        let sql = 'insert into destination values(?,?,?,?,?,?)';
                        db.query(sql, newDestination, (error, result) => {
                            if (error) {
                                throw error;
                            }

                            res.writeHead(
                                302,
                                {
                                    'Location' : '/list'
                                }
                            );
                            res.end();
                        });
                    });
                    break;
                default:
                    break;
            }
        } else if (url.parse(req.url).pathname === '/update') {
            switch (req.method) {
                case 'GET':
                    let id = qs.parse(url.parse(req.url).query).id;
                    let sql = 'select * from destination where id_destination = ?';
                    db.query(sql, [id], (error, result) => {
                        if (error) {
                            throw error;
                        } else {
                            let template = pug.renderFile(
                                editPug, 
                                {
                                    destination : result[0]
                                }
                            )
                            res.end(template);
                        }
                    });
                    break;
                
                case 'POST':
                    let body = '';
                
                    req.on('data', (value) => {
                        body += value;
                    });

                    req.on('end', () => {
                        let form = qs.parse(body);
                        let updateDestination = [
                            form['image'],
                            form['name'],
                            form['city'],
                            form['description'],
                            form['category'],
                            form['id_destination']
                        ];
                        console.log(updateDestination);

                        let sql =  `
                            update destination
                                set
                                    image = ?,
                                    name = ?,
                                    city = ?,
                                    description = ?,
                                    category = ?
                                where
                                    id_destination = ?
                        `;

                        db.query(sql, updateDestination, (error, result) => {
                            if (error) {
                                throw error;
                            }

                            res.writeHead(
                                302,
                                {
                                    'Location' : '/home'
                                }
                            );
                            res.end();
                        });
                    });
                    break;

                default:
                    break;
            }
        } else if (url.parse(req.url).pathname === '/delete') {
            let id = qs.parse(url.parse(req.url).query).id;
            let sql = 'DELETE FROM destination WHERE id_destination = ?';
            db.query(sql, [id], (error, result) => {
                if (error) {
                    throw error;
                } else {
                    // kode untuk direct ke root
                    res.writeHead(
                        302,
                        {
                            'Location' : '/home',
                        }
                    );
                    res.end();
                }
            });
        } else if (req.url === '/logout') {
            if (req.session.has('username')) {
                req.session.forget('username');
            }

            // redirect to login
            res.writeHead(
                302,
                {
                    'Location' : '/'
                }
            );
            res.end();
        } else {
            res.writeHead(
                200,
                {
                    'Content-Type' : 'text/html'
                }
            );
            res.end('404 : Page Not Found!');
        }
    });
}

module.exports = routes;