const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const bodyParser = require('body-parser');
const homeRouter = require('./Routes/homeRouter');
const loginRouter = require('./Routes/loginRouter');
const gereRouter = require('./Routes/gereRouter');
const marcaRouter = require('./Routes/marcaRoute');
const servicoRouter = require('./Routes/servicoRouter');
const ordemRouter = require('./Routes/ordemRouter');

const equipRouter = require('./Routes/equipRouter');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // <-- Adicione esta linha
app.use(express.static(__dirname + "/public"));
//configuração das nossas views para utilizar a ferramenta EJS
app.set('view engine', 'ejs');
app.use(cookieParser());

// middleware: disponibiliza usuarioLogado nas views
app.use((req, res, next) => {
  try {
    if (req.cookies && req.cookies.usuarioLogado) {
      try { res.locals.usuarioLogado = (typeof req.cookies.usuarioLogado === 'string') ? JSON.parse(req.cookies.usuarioLogado) : req.cookies.usuarioLogado; } catch(e) { res.locals.usuarioLogado = req.cookies.usuarioLogado; }
    } else { res.locals.usuarioLogado = null; }
  } catch (err) { res.locals.usuarioLogado = null; }
  next();
});

//Configuração de onde ficará nossas views
app.set('views', './views');

app.use("/",homeRouter);
app.use('/login',loginRouter);
app.use('/',gereRouter); // rota principal dos gerenciamentos de  campos
app.use('/marca', marcaRouter); 
app.use('/servicos', servicoRouter);
app.use('/', ordemRouter);
app.use('/equip', equipRouter);

const server = app.listen('5000', function() {
    console.log('Servidor web iniciado');
});