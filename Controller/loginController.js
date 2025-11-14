const UsuarioModel = require("../models/usuarioModel");
const ejs = require('ejs');
const path = require('path');


    class LoginController {

        loginView(req,res) {
            res.render('login/login');      //renderizar a pagina de login
        }

        camposView(req, res) {
            ejs.renderFile(
                path.join(__dirname, '../Views/login/campos.ejs'),
                {},
                (err, body) => {
                    if (err) {
                        return res.status(500).send('Erro ao renderizar');
                    }
                    res.render('login/layout', { body, active: 'inicio' });
                }
            );
        }

        async login(req, res) {
            let msg = "";

            const { email, senha } = req.body;

            if (email && senha) {
                const usuarioModel = new UsuarioModel();
                const usuario = await usuarioModel.validar(email, senha); // verifica email/senha e ativo

                if (usuario) {
                    // Login bem-sucedido, salva cookie do usuário
                    res.cookie('usuarioLogado', JSON.stringify(usuario.usuarioId), { httpOnly: true, maxAge: 3600000 });
                    return res.redirect('/login/campos');
                } else {
                    msg = "Usuário/Senha incorretos ou usuário inativo!";
                }
            } else {
                msg = "Usuário/Senha incorretos!";
            }

            // Renderiza a tela de login novamente com mensagem de erro
            res.render('login/login', { msg });
        }

    }

module.exports = new LoginController();