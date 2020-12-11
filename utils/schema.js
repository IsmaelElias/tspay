const database = require("./database");

const esquemas = {
    1: `CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL,
        email TEXT NOT NULL,
        senha TEXT NOT NULL,
        apelido TEXT NOT NULL
    );`,
    2: `ALTER TABLE usuarios ADD COLUMN saldo INT DEFAULT 0`,
    3: `CREATE TABLE IF NOT EXISTS transacoes (
        id SERIAL,
        "usuarioOrigem" TEXT,
        "usuarioDestino" TEXT,
        valor INT,
        tipo TEXT NOT NULL,
        "dataCriacao" DATE
    );`,
    4: `ALTER TABLE transacoes ALTER COLUMN "dataCriacao" TYPE timestamp`,
};

const up = async (numero = null) => {
    if (!numero) {
        for (const valor in esquemas) {
            await database.query({ text: esquemas[valor] });
        }
    } else {
        await database.query({ text: esquemas[numero] });
    }

    console.log("Migrações rodaram com sucesso");
};

const down = async (nomeTabela) => {
    if (nomeTabela) {
        await database.query(`DROP TABLE ${nomeTabela}`);
        console.log("Tabela excluida");
    }
};

up().then(() => console.log("ok")).catch((error) => console.log("Migração rejeitada: " + error))