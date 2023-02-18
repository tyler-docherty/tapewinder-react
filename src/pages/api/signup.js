import bcrypt from "bcrypt";
import emailValidator from "email-validator";
import { Pool } from "pg";
import { v4 } from "uuid";

// 1 num, 1 lowercase char, 1 uppercase char, 1 ascii symbol, 8 to 200 chars
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.*[a-zA-Z0-9@#$%^&+=!]).{8,50}$/;
// not underscore and any alphanumeric characters
const usernamePattern = /^[^_\W]{3,20}$/;
const saltRounds = 10;

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
    const body = JSON.parse(req.body);
    console.log(body, "body");
    const email = body.email;
    const password = body.password;
    const username = body.username;

    const statusIfEmpty = !email || !password || !username;
    if (statusIfEmpty) {
        res.status(400).json({ success: false, errors: { email: !email, password: !password, username: !username } });
        return;
    } else {
        res.status(100);
    }
    
    const emailIsValid = emailValidator.validate(email);
    const passwordIsValid = Boolean(password.match(passwordPattern));
    const usernameIsValid = Boolean(username.match(usernamePattern));
    console.log(emailIsValid, passwordIsValid, usernameIsValid);

    if (emailIsValid && passwordIsValid && usernameIsValid) {
        console.log("valid");
        const uid = v4();
        const hash = await bcrypt.hash(password, saltRounds);
        pool.query(`INSERT INTO accounts VALUES ($1, $2, $3, $4, ${false})`, [uid, username, email, hash])
            .then(() => {
                res.status(201).json({ success: true });
            })
            .catch((err) => {
                console.error(err);
                const possibleErrors = {
                    "accounts_username_key": { 
                        username: true, 
                        email: false, 
                        password: false 
                    },
                    "accounts_email_key": { 
                        username: false, 
                        email: true, 
                        password: false 
                    } 
                };
                const violation = possibleErrors[err.constraint];
                res.status(403).json({ success: false, errors: violation });
            });
    } else {
        const errors = { email: !emailIsValid, password: !passwordIsValid, username: !usernameIsValid };
        res.status(403).json({success: false, errors: errors});
    }
}