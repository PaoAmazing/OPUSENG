require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar store de sessão
const store = new SQLiteStore({
  db: 'opus_sessions.db',
  dir: __dirname
});

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware de sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'sua-chave-secreta-aqui-mude-em-producao',
  store: store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Passar dados de usuário para as views
app.use((req, res, next) => {
  res.locals.usuario = req.session.userId ? {
    id: req.session.userId,
    nome: req.session.nome,
    email: req.session.email,
    tipo: req.session.tipo
  } : null;
  next();
});

// Rotas
const indexRouter = require('./routes/index');
const contatoRouter = require('./routes/contato');
const authRouter = require('./routes/auth');
const clienteRouter = require('./routes/cliente');
const colaboradorRouter = require('./routes/colaborador');

app.use('/', indexRouter);
app.use('/contato', contatoRouter);
app.use('/', authRouter);
app.use('/cliente', clienteRouter);
app.use('/colaborador', colaboradorRouter);

// Página 404 - deve ser a última rota
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).render('404', { 
    title: 'Erro interno do servidor',
    message: 'Ocorreu um erro ao processar sua solicitação.'
  });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
});
