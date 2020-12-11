const jwt = require("jsonwebtoken");

require("dotenv").config();

async function verificaToken (req, res, next) {
    const token = req.headers['authorization'];

    const tokenSeparado = token.split(" ");

    if (tokenSeparado[0] != "Bearer") {
        return res.status(401).send({ message: "Token em formato inválido"});
    }

    try {
        res.locals.jwtPayload = await jwt.verify(tokenSeparado[1], "c25a7e79-2b34-4680-b6e3-39d013cc027d");
    } catch (error) {
        return res.status(401).send({ message: "Token inválido" });
    }

    return next();
}

module.exports = { verificaToken };