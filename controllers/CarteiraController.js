const usuarioRepositorio = require("../repository/UsuarioRepositorio");
const transacaoRepositorio = require("../repository/TransacaoRepositorio");

async function pegarFeed(_, res) {
    const { id } = res.locals.jwtPayload;
    const transacoes = await transacaoRepositorio.pegarUltimasTransacoes();

    const feed = await Promise.all(transacoes.map(async t => {
        let origem = "";
        let destino = "";
        let usuario;

        if (t.usuarioDestino != null) {
            if (t.usuarioDestino == id) {
                destino = "você";
            }else{
                usuario = await usuarioRepositorio.pegaUsuarioPorId(t.usuarioDestino);
                destino = usuario.apelido;
            }
        }

        if (t.usuarioOrigem == id) {
            origem = "você";
        }else {
            usuario = await usuarioRepositorio.pegaUsuarioPorId(t.usuarioOrigem);
            origem = usuario.apelido;
        }

        return {
            origem,
            destino,
            acao: t.tipo === "transferencia" ? "pagou" : "depositou",
            valor: t.valor,
            data: new Date(t.dataCriacao).toLocaleString("pt-Br", { timeZone: "America/Sao_Paulo"})
        };
    }));

    return res.send(feed);
};

async function pegarInformacoes(_, res) {
    const { id } = res.locals.jwtPayload;

    const saldo = await usuarioRepositorio.pegarSaldo(id);
    const entradas = await transacaoRepositorio.transacoesPorOrigem(id);
    const saidas = await transacaoRepositorio.transacoesPorDestino(id);

    const valorEntradas = entradas.reduce((acc, e) => acc += e.valor, 0);
    const valorSaidas = saidas.reduce((acc, e) => acc += e.valor, 0);

    return res.send({
        ...saldo,
        entradas: valorEntradas,
        saidas: valorSaidas
    });
}

async function fazerDeposito(req, res) {
    const { valor } = req.body;
    const { id } = res.locals.jwtPayload;

    await transacaoRepositorio.cadastrarTransacao(id, valor, "deposito");
    const saldo = await usuarioRepositorio.adicionarSaldo(valor, id);

    if (saldo) {
        res.locals.jwtPayload.saldo = saldo;
        return res.send({ message: "Saldo inserido com sucesso", ...saldo });
    }
}

async function fazerTransferencia(req, res) {
    const { valor,  idUsuarioDestino } = req.body;
    const { id } = res.locals.jwtPayload;

    const saldo = await usuarioRepositorio.pegarSaldo(id);

    if (saldo < valor) {
        return res.status(400).send({ message: "Saldo abaixo do valor informado" });
    }

    const usuarioDestino = await usuarioRepositorio.pegaUsuarioPorId(idUsuarioDestino);

    if (!usuarioDestino) {
        return res.status(404).send({ message: "Usuário informado não encontrado" });
    }

    await transacaoRepositorio.cadastrarTransacao(id, valor, "transferencia", idUsuarioDestino);

    const novoSaldo = await usuarioRepositorio.removerSaldo(valor, id);
    await usuarioRepositorio.adicionarSaldo(valor, idUsuarioDestino);

    if (novoSaldo) {
        return res.send({ message: "Transferência realizada com sucesso", ...novoSaldo });
    }
}

module.exports = { fazerDeposito, fazerTransferencia, pegarInformacoes, pegarFeed };