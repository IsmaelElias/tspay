const database = require('../utils/database');

const verificaExistenciaEmailOuApelido = async (email, apelido) => {
    const queryVerifica = `SELECT * FROM usuarios WHERE email = $1 OR apelido = $2 `;
    const resultVerifica = await database.query({
        text: queryVerifica,
        values: [email, apelido]
    });

    return resultVerifica.rowCount;
};

const criarUsuario = async (email, senha, apelido) => {
    const query = `INSERT INTO usuarios (email, senha, apelido)
        VALUES ($1, $2, $3) RETURNING *`;

    const result = await database.query({
        text: query,
        values: [email, senha, apelido]
    });

    return result.rows[0];
}

const pegaUsuarioPorId = async (id) => {
    const query = `SELECT * FROM usuarios WHERE id = $1`;
    const result = await database.query({
        text: query,
        values: [id]
    });

    return result.rows[0];
}

const pegaUsuarioPorEmail = async (email) => {
    const query = `SELECT * FROM usuarios WHERE email = $1`;
    const result = await database.query({
        text: query,
        values: [email]
    });

    return result.rows[0];
}

const pegarSaldo = async (id) => {
    const query = `SELECT saldo FROM usuarios WHERE id = $1`;
    const result = await database.query({
        text: query,
        values: [id]
    });
    
    return result.rows[0];
}

const adicionarSaldo = async (value, id) => {
    const query = `UPDATE usuarios SET saldo = saldo + $1 WHERE id = $2 RETURNING saldo`;
    const result = await database.query({
        text: query,
        values: [value, id]
    });
    
    return result.rows[0];
}

const removerSaldo = async (value, id) => {
    const query = `UPDATE usuarios SET saldo = saldo - $1 WHERE id = $2 RETURNING saldo`;
    const result = await database.query({
        text: query,
        values: [value, id]
    });
    
    return result.rows[0];
}

module.exports = { verificaExistenciaEmailOuApelido, criarUsuario, pegaUsuarioPorEmail, pegarSaldo, adicionarSaldo, pegaUsuarioPorId, removerSaldo };