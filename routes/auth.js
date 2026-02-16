const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/connect');
const { verificarNaoAutenticado } = require('../middlewares/auth');

// GET - Página de login
router.get('/login', verificarNaoAutenticado, (req, res) => {
  res.render('auth/login', { 
    title: 'Login',
    erro: req.query.erro ? decodeURIComponent(req.query.erro) : null
  });
});

// POST - Fazer login
router.post('/login', verificarNaoAutenticado, (req, res) => {
  const { email, senha, tipo } = req.body;

  if (!email || !senha || !tipo) {
    return res.redirect('/login?erro=Preencha todos os campos');
  }

  db.get(
    'SELECT * FROM usuarios WHERE email = ? AND tipo = ? AND ativo = 1',
    [email, tipo],
    (err, usuario) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.redirect('/login?erro=Erro ao processar login');
      }

      if (!usuario) {
        return res.redirect('/login?erro=Email ou tipo de usuário incorreto');
      }

      // Verificar senha
      bcrypt.compare(senha, usuario.senha, (err, senhaValida) => {
        if (err) {
          console.error('Erro ao verificar senha:', err);
          return res.redirect('/login?erro=Erro ao processar login');
        }

        if (!senhaValida) {
          return res.redirect('/login?erro=Senha incorreta');
        }

        // Criar sessão
        req.session.userId = usuario.id;
        req.session.nome = usuario.nome;
        req.session.email = usuario.email;
        req.session.tipo = usuario.tipo;

        // Redirecionar para dashboard apropriado
        if (usuario.tipo === 'cliente') {
          res.redirect('/cliente/dashboard');
        } else {
          res.redirect('/colaborador/dashboard');
        }
      });
    }
  );
});

// GET - Página de registro
router.get('/registro', verificarNaoAutenticado, (req, res) => {
  res.render('auth/registro', { 
    title: 'Cadastro',
    erro: req.query.erro ? decodeURIComponent(req.query.erro) : null
  });
});

// POST - Fazer registro
router.post('/registro', verificarNaoAutenticado, (req, res) => {
  const { nome, email, senha, confirmarSenha, tipo, telefone, empresa } = req.body;

  // Validações
  if (!nome || !email || !senha || !confirmarSenha || !tipo) {
    return res.redirect('/registro?erro=Preencha todos os campos obrigatórios');
  }

  if (senha !== confirmarSenha) {
    return res.redirect('/registro?erro=As senhas não coincidem');
  }

  if (senha.length < 6) {
    return res.redirect('/registro?erro=A senha deve ter no mínimo 6 caracteres');
  }

  if (!['cliente', 'colaborador'].includes(tipo)) {
    return res.redirect('/registro?erro=Tipo de usuário inválido');
  }

  // Criptografar senha
  bcrypt.hash(senha, 10, (err, senhaHash) => {
    if (err) {
      console.error('Erro ao criptografar senha:', err);
      return res.redirect('/registro?erro=Erro ao processar registro');
    }

    // Inserir no banco
    db.run(
      `INSERT INTO usuarios (nome, email, senha, tipo, telefone, empresa)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, email, senhaHash, tipo, telefone || null, empresa || null],
      function(err) {
        if (err) {
          console.error('Erro ao registrar usuário:', err);
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.redirect('/registro?erro=Este email já está registrado');
          }
          return res.redirect('/registro?erro=Erro ao criar conta');
        }

        // Criar sessão automaticamente após registro
        req.session.userId = this.lastID;
        req.session.nome = nome;
        req.session.email = email;
        req.session.tipo = tipo;

        // Redirecionar para dashboard
        if (tipo === 'cliente') {
          res.redirect('/cliente/dashboard');
        } else {
          res.redirect('/colaborador/dashboard');
        }
      }
    );
  });
});

// GET - Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
