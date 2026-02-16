// Middleware para verificar se o usuário está autenticado
const verificarAutenticacao = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Middleware para verificar se é cliente
const verificarCliente = (req, res, next) => {
  if (req.session && req.session.userId && req.session.tipo === 'cliente') {
    next();
  } else {
    res.status(403).render('404', { 
      title: 'Acesso Negado',
      message: 'Você não tem permissão para acessar esta página' 
    });
  }
};

// Middleware para verificar se é colaborador
const verificarColaborador = (req, res, next) => {
  if (req.session && req.session.userId && req.session.tipo === 'colaborador') {
    next();
  } else {
    res.status(403).render('404', { 
      title: 'Acesso Negado',
      message: 'Você não tem permissão para acessar esta página' 
    });
  }
};

// Middleware para verificar se não está logado
const verificarNaoAutenticado = (req, res, next) => {
  if (req.session && req.session.userId) {
    res.redirect(req.session.tipo === 'cliente' ? '/cliente/dashboard' : '/colaborador/dashboard');
  } else {
    next();
  }
};

module.exports = {
  verificarAutenticacao,
  verificarCliente,
  verificarColaborador,
  verificarNaoAutenticado
};
