const repositorio = require("../repository/UsuarioRepositorio");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

async function login(req, res) {
    const { email, senha } = req.body;

    const usuario = await repositorio.pegaUsuarioPorEmail(email);

    if (!usuario) {
        return res.status(404).send({ message: "Usuario não encontrado "});
    }

    if (await bcrypt.compare(senha, usuario.senha)) {
        const token = jwt.sign({
            id: usuario.id, apelido: usuario.apelido, email: usuario.email, saldo: usuario.saldo
        },
            process.env.JWT_SECRET
        );

        return res.send({ token });
    }

    return res.status(400).send({ message: "Senha incorreta" });
}

module.exports = { login };