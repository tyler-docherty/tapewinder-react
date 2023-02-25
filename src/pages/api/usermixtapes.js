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
    pool.query(`
    SELECT mixtapes.tracks
    FROM accounts
    INNER JOIN mixtapes 
    on accounts.uid=mixtapes.owner 
    AND accounts.username=$1`, 
    [username])
        .then((query) => {
            if (!query.rows.length) {
                res.status(200).json({ duplicate: false });
            } else {
                res.status(403).json({ duplicate: true });
            }
        })
        .catch((err) => {
            console.error(err);
        });
}