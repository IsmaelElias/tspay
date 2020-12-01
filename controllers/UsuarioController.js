const bcrypt = require("bcrypt");
const repositorio = require("../repository/UsuarioRepositorio");

async function criarUsuario(req, res) {
    const { email, senha, apelido } = req.body;

    if (!email || !senha || !apelido) {
        return res.status(400).send("E-mail, senha ou apelido não foram informados");
    }

    if (await repositorio.verificaExistenciaEmailOuApelido(email, senha)) {
        return res.status(400).send({ message: "Apelido ou e-mail já cadastrados"});
    }

    const hash = await bcrypt.hash(senha, 10);

    const usuario = await repositorio.criarUsuario(email, hash, apelido);

    return res.send({
        id: usuario.id,
        apelido: usuario.apelido,
        email: usuario.email
    });
};

module.exports = { criarUsuario };