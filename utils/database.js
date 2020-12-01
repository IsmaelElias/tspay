const { Client } = require("pg");

require("dotenv").config();

const client = new Client({
    database: "wallet",
    host: "localhost",
    password: "postgres",
    user: "postgres",
    port: "5432",
});

client.connect().then(() => console.log("conectado")).catch((err) => console.log("erro ao criar conexão", err.stack));

module.exports = client;