const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const app = express();
let sql;

const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./contactbook.db', sqlite.OPEN_READWRITE, (e) => {
    if (e) {
        return console.error(e);
    }
});

app.use(bodyParser.json());

// post requests

app.post('/contact', (req,res) => {
    try {
        const { id, firstName, lastName, phone, email, address } = req.body;
        sql = "INSERT INTO contact(id, firstName, lastName, phone, email, address) VALUES (?,?,?,?,?,?)";
        db.run(sql, [id, firstName, lastName, phone, email, address], (e) => {
            if (e) {
                return res.status(300).json({
                    message: e.message
                });
            }

            console.log("successful input", id, firstName, lastName, phone, email, address);
        })
        res.status(200).json({
            message: 'success!'
        });
    } catch (e) {
        return res.status(400).json({
            error: e.message
        });
    }
});

// get requests

app.get('/contacts', (req, res) => {
    sql = 'SELECT * FROM contact';
    try {
        db.all(sql, [], (e, rows) => {
            if (e) {
                return res.status(300).json({
                    message: e.message
                });
            }

            if (rows.length < 1) {
                return res.status(300).json({
                    message: 'No match'
                })
            }

            return res.status(200).json({
                data: rows
            })
        })
    } catch (e) {
        return res.status(400).json({
            error: e.message
        });
    }
});

app.get('/contact', (req, res) => {
    sql = 'SELECT * FROM contact';
    try {
        const queryParams = url.parse(req.url, true).query;
        sql += ` WHERE id = '${queryParams.id}'`

        db.all(sql, [], (e, rows) => {
            if (e) {
                return res.status(300).json({
                    message: e.message
                });
            }

            if (rows.length < 1) {
                return res.status(300).json({
                    message: 'No match'
                })
            }

            return res.status(200).json({
                data: rows
            })
        })
    } catch (e) {
        return res.status(400).json({
            error: e.message
        });
    }
});

app.listen(3000);