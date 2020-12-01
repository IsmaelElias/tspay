const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const usuarioController = require("./controllers/UsuarioController");
const authController = require("./controllers/AuthController");
const authMiddleware = require("./midlewares/Auth");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/usuarios", usuarioController.criarUsuario);
app.post("/login", authController.login);

app.use(authMiddleware.verificaToken);

app.put("/usuarios/:id", usuarioController.criarUsuario);

app.get("/", (req, res) => {
    return res.send("Hello");
});

app.listen(8080, () => console.log("Running"));