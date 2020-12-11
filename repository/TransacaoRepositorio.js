const database = require('../utils/database');

const cadastrarTransacao = async (usuarioOrigem, valor, tipo, usuarioDestino = null) => {
    const query = `INSERT INTO transacoes ("usuarioOrigem", valor, tipo, "usuarioDestino", "dataCriacao")
        VALUES ($1, $2, $3, $4,$5) RETURNING *`;

    const result = await database.query({
        text: query,
        values: [usuarioOrigem, valor, tipo, usuarioDestino, new Date()]
    });

    return result.rows[0];
};

const pegarUltimasTransacoes = async () => {
    const query = `SELECT * FROM transacoes order by "dataCriacao" limit 4`;

    const result = await database.query({
        text: query,
    });

    return result.rows;
};

const transacoesPorOrigem = async (id) => {
    const query = `SELECT * FROM transacoes WHERE "usuarioOrigem" = $1`;

    const result = await database.query({
        text: query,
        values: [id]
    });

    return result.rows;
};

const transacoesPorDestino = async (id) => {
    const query = `SELECT * FROM transacoes WHERE "usuarioDestino" = $1`;

    const result = await database.query({
        text: query,
        values: [id]
    });

    return result.rows;
}

module.exports = { cadastrarTransacao, transacoesPorOrigem, transacoesPorDestino, pegarUltimasTransacoes };