const UsuarioModel = require("../models/usuarioModel");


class AuthMiddleware {

    async validar(req, res, next) {
        let usuarioId = req.cookies.usuarioLogado;
        if(usuarioId) {
            let usuario = new UsuarioModel();
            usuario = await usuario.buscarPorId(usuarioId);
            if(usuario != null && usuario.usuarioAtivo) {
                next();
            }
            else {
                res.redirect("/login");
            }
            
        }
        else {
            res.redirect("/login");
        }
    }
}

module.exports = AuthMiddleware;