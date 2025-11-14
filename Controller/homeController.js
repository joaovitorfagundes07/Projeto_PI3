
class HomeController {

    constructor() {

    }

    homeView(req, res) {
        res.render('home/index', {});
    }

    sobreView(req, res) {
        res.render('about/about');
    }

    servicoView(req, res) {
        res.render('servicos/services');
    }
    
    depoimentoView(req, res) {
        res.render('depoimento/testimonials');   
    }
    contatoView(req, res) {
        res.render('contato/contact');
    }

    
}
module.exports = HomeController;