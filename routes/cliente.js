const express = require('express');
const router = express.Router();
const db = require('../db/connect');
const { verificarCliente } = require('../middlewares/auth');

// GET - Dashboard do cliente
router.get('/dashboard', verificarCliente, (req, res) => {
  const userId = req.session.userId;

  // Buscar serviços do cliente
  db.all(
    `SELECT * FROM servicos WHERE usuario_id = ? ORDER BY data_criacao DESC`,
    [userId],
    (err, servicos) => {
      if (err) {
        console.error('Erro ao buscar serviços:', err);
        servicos = [];
      }

      // Contar serviços por status
      const contadores = {
        total: servicos.length,
        pendente: servicos.filter(s => s.status === 'pendente').length,
        em_andamento: servicos.filter(s => s.status === 'em_andamento').length,
        concluido: servicos.filter(s => s.status === 'concluido').length
      };

      res.render('cliente/dashboard', {
        title: 'Dashboard do Cliente',
        usuario: {
          nome: req.session.nome,
          email: req.session.email
        },
        servicos,
        contadores
      });
    }
  );
});

// GET - Página de detalhes do serviço
router.get('/servico/:id', verificarCliente, (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  // Buscar serviço
  db.get(
    `SELECT * FROM servicos WHERE id = ? AND usuario_id = ?`,
    [id, userId],
    (err, servico) => {
      if (err || !servico) {
        return res.status(404).render('404', {
          title: 'Serviço não encontrado'
        });
      }

      // Buscar laudos do serviço
      db.all(
        `SELECT l.*, u.nome as colaborador_nome 
         FROM laudos l 
         LEFT JOIN usuarios u ON l.colaborador_id = u.id
         WHERE l.servico_id = ?
         ORDER BY l.data_criacao DESC`,
        [id],
        (err, laudos) => {
          if (err) laudos = [];

          // Buscar atualizações
          db.all(
            `SELECT a.*, u.nome as colaborador_nome 
             FROM atualizacoes a 
             LEFT JOIN usuarios u ON a.colaborador_id = u.id
             WHERE a.servico_id = ?
             ORDER BY a.data_criacao DESC`,
            [id],
            (err, atualizacoes) => {
              if (err) atualizacoes = [];

              res.render('cliente/servico', {
                title: 'Detalhes do Serviço',
                usuario: {
                  nome: req.session.nome,
                  email: req.session.email
                },
                servico,
                laudos,
                atualizacoes
              });
            }
          );
        }
      );
    }
  );
});

// GET - Página de laudos
router.get('/laudos', verificarCliente, (req, res) => {
  const userId = req.session.userId;

  db.all(
    `SELECT l.*, s.titulo as servico_titulo, u.nome as colaborador_nome 
     FROM laudos l 
     LEFT JOIN servicos s ON l.servico_id = s.id
     LEFT JOIN usuarios u ON l.colaborador_id = u.id
     WHERE l.cliente_id = ?
     ORDER BY l.data_criacao DESC`,
    [userId],
    (err, laudos) => {
      if (err) {
        console.error('Erro ao buscar laudos:', err);
        laudos = [];
      }

      res.render('cliente/laudos', {
        title: 'Meus Laudos Técnicos',
        usuario: {
          nome: req.session.nome,
          email: req.session.email
        },
        laudos
      });
    }
  );
});

// GET - Página do perfil
router.get('/perfil', verificarCliente, (req, res) => {
  const userId = req.session.userId;

  db.get(
    'SELECT * FROM usuarios WHERE id = ?',
    [userId],
    (err, usuario) => {
      if (err || !usuario) {
        return res.status(404).render('404', {
          title: 'Usuário não encontrado'
        });
      }

      res.render('cliente/perfil', {
        title: 'Meu Perfil',
        usuario
      });
    }
  );
});

// POST - Atualizar perfil
router.post('/perfil/atualizar', verificarCliente, (req, res) => {
  const { nome, telefone, empresa } = req.body;
  const userId = req.session.userId;

  db.run(
    `UPDATE usuarios SET nome = ?, telefone = ?, empresa = ? WHERE id = ?`,
    [nome, telefone || null, empresa || null, userId],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar perfil:', err);
        return res.json({ sucesso: false, mensagem: 'Erro ao atualizar perfil' });
      }

      // Atualizar sessão
      req.session.nome = nome;

      res.json({ 
        sucesso: true, 
        mensagem: 'Perfil atualizado com sucesso!'
      });
    }
  );
});

module.exports = router;
