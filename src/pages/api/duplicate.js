import { Pool } from "pg";

const user = "ACCOUNTMAN";
const hostname = "db.bit.io";
const port = 5432;
const db = "shr4pnel/users";
const dbpassword = process.env.REACT_APP_BIT_IO_KEY;
const ssl = true;

const pool = new Pool({
    user: user,
    host: hostname,
    database: db,
    password: dbpassword,
    port: port,
    ssl: ssl
});

export default async function handler(req, res) {
    const { username, title } = req.query;
    // cross table join, get tracks for given uid
    pool
        .query(`
    SELECT mixtapes.title
    FROM accounts
    INNER JOIN mixtapes 
    on accounts.uid=mixtapes.owner 
    AND accounts.username=$1`, [username])
        // this callback checks if any rows contain a duplicate title. this ensures dynamic
        // links work correctly.
        .then((query) => {
            let duplicate = { duplicate: false };
            if (query.rowCount > 0) {
                query.rows.forEach((row) => {
                    if (row.title === title) {
                        duplicate = { duplicate: true };
                    }
                });
                return res.status(200).json(duplicate); 
            } else {
                return res.status(200).json({ duplicate: false });
            }
        })
        .catch((err) => {
            console.error(err);
        });
}