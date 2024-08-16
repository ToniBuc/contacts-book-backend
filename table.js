const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./contactbook.db', sqlite.OPEN_READWRITE, (e) => {
    if (e) {
        return console.error(e);
    }
});

const sql = `CREATE TABLE contact(id TEXT PRIMARY KEY, firstName, lastName, phone, email, address)`;
db.run(sql);