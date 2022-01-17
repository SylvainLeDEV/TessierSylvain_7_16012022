const path = require('path');
require('dotenv').config({path: './config/.env', encoding: "latin1"});
module.exports = {
    'config': path.resolve('config', 'config.js')
}

module.exports = {
    "development": {
        "username": process.env.DB_USER,
        "password": process.env.DE_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": "mysql"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
}
