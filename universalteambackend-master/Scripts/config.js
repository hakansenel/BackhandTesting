require('dotenv').config("../.env")
const config = {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
}
module.exports = config;