require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Rotas
const indexRouter = require('./routes/index');
const contatoRouter = require('./routes/contato');

app.use('/', indexRouter);
app.use('/contato', contatoRouter);

// Error 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
