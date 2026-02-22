const express = require('express');
const router = express.Router();
const db = require('../db/connect');
const { verificarColaborador, verificarAdmin } = require('../middlewares/auth');

// GET - Dashboard do colaborador
router.get('/dashboard', verificarColaborador, (req, res) => {
  const userId = req.session.userId;

  // Buscar todos os serviços
  db.all(
    `SELECT s.*, u.nome as cliente_nome, u.email as cliente_email 
     FROM servicos s 
     LEFT JOIN usuarios u ON s.usuario_id = u.id
     ORDER BY s.data_criacao DESC`,
    [],
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

      res.render('colaborador/dashboard', {
        title: 'Painel do Colaborador',
        usuario: {
          nome: req.session.nome,
          email: req.session.email,
          tipo: req.session.tipo
        },
        servicos,
        contadores
      });
    }
  );
});

// GET - Página de gerenciamento de serviço
router.get('/servico/:id', verificarColaborador, (req, res) => {
  const { id } = req.params;

  // Buscar serviço
  db.get(
    `SELECT s.*, u.nome as cliente_nome, u.email as cliente_email, u.telefone, u.empresa
     FROM servicos s 
     LEFT JOIN usuarios u ON s.usuario_id = u.id
     WHERE s.id = ?`,
    [id],
    (err, servico) => {
      if (err || !servico) {
        return res.status(404).render('404', {
          title: 'Serviço não encontrado'
        });
      }

      // Buscar laudos do serviço
      db.all(
        `SELECT l.*, u.nome as criador_nome 
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

              res.render('colaborador/servico', {
                title: 'Gerenciar Serviço',
                usuario: {
                  nome: req.session.nome,
                  email: req.session.email,
                  id: req.session.userId,
                  tipo: req.session.tipo
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

// POST - Atualizar status do serviço
router.post('/servico/:id/status', verificarColaborador, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusValidos = ['pendente', 'em_andamento', 'concluido', 'cancelado'];
  if (!statusValidos.includes(status)) {
    return res.json({ sucesso: false, mensagem: 'Status inválido' });
  }

  const dataConclusao = status === 'concluido' ? new Date().toISOString() : null;

  db.run(
    `UPDATE servicos 
     SET status = ?, data_atualizacao = ?, data_conclusao = ?
     WHERE id = ?`,
    [status, new Date().toISOString(), dataConclusao, id],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar status:', err);
        return res.json({ sucesso: false, mensagem: 'Erro ao atualizar status' });
      }

      res.json({ sucesso: true, mensagem: 'Status atualizado com sucesso!' });
    }
  );
});

// POST - Adicionar atualização ao serviço
router.post('/servico/:id/atualizar', verificarColaborador, (req, res) => {
  const { id } = req.params;
  const { mensagem } = req.body;
  const colaboradorId = req.session.userId;

  if (!mensagem) {
    return res.json({ sucesso: false, mensagem: 'Mensagem não pode estar vazia' });
  }

  db.run(
    `INSERT INTO atualizacoes (servico_id, colaborador_id, mensagem)
     VALUES (?, ?, ?)`,
    [id, colaboradorId, mensagem],
    function(err) {
      if (err) {
        console.error('Erro ao adicionar atualização:', err);
        return res.json({ sucesso: false, mensagem: 'Erro ao adicionar atualização' });
      }

      res.json({ sucesso: true, mensagem: 'Atualização adicionada com sucesso!' });
    }
  );
});

// GET - Página de criar/gerenciar laudo
router.get('/laudo/novo/:servico_id', verificarColaborador, (req, res) => {
  const { servico_id } = req.params;

  db.get(
    `SELECT * FROM servicos WHERE id = ?`,
    [servico_id],
    (err, servico) => {
      if (err || !servico) {
        return res.status(404).render('404', {
          title: 'Serviço não encontrado'
        });
      }

      res.render('colaborador/laudo', {
        title: 'Criar Laudo Técnico',
        usuario: {
          nome: req.session.nome,
          email: req.session.email,
          id: req.session.userId,
          tipo: req.session.tipo
        },
        servico,
        laudo: null
      });
    }
  );
});

// POST - Salvar laudo
router.post('/laudo/salvar', verificarColaborador, (req, res) => {
  const { servico_id, cliente_id, titulo, conteudo, laudo_id } = req.body;
  const colaboradorId = req.session.userId;

  if (!servico_id || !cliente_id || !titulo || !conteudo) {
    return res.json({ sucesso: false, mensagem: 'Preencha todos os campos' });
  }

  if (laudo_id) {
    // Atualizar laudo existente
    db.run(
      `UPDATE laudos SET titulo = ?, conteudo = ? WHERE id = ?`,
      [titulo, conteudo, laudo_id],
      function(err) {
        if (err) {
          console.error('Erro ao atualizar laudo:', err);
          return res.json({ sucesso: false, mensagem: 'Erro ao atualizar laudo' });
        }
        res.json({ sucesso: true, mensagem: 'Laudo atualizado com sucesso!' });
      }
    );
  } else {
    // Criar novo laudo
    db.run(
      `INSERT INTO laudos (servico_id, cliente_id, colaborador_id, titulo, conteudo, status)
       VALUES (?, ?, ?, ?, ?, 'rascunho')`,
      [servico_id, cliente_id, colaboradorId, titulo, conteudo],
      function(err) {
        if (err) {
          console.error('Erro ao criar laudo:', err);
          return res.json({ sucesso: false, mensagem: 'Erro ao criar laudo' });
        }
        res.json({ sucesso: true, mensagem: 'Laudo criado com sucesso!', laudoId: this.lastID });
      }
    );
  }
});

// POST - Enviar laudo para cliente
router.post('/laudo/:id/enviar', verificarColaborador, (req, res) => {
  const { id } = req.params;

  db.run(
    `UPDATE laudos SET status = 'enviado', data_envio = ? WHERE id = ?`,
    [new Date().toISOString(), id],
    function(err) {
      if (err) {
        console.error('Erro ao enviar laudo:', err);
        return res.json({ sucesso: false, mensagem: 'Erro ao enviar laudo' });
      }
      res.json({ sucesso: true, mensagem: 'Laudo enviado com sucesso!' });
    }
  );
});

// GET - Página de clientes
router.get('/clientes', verificarColaborador, (req, res) => {
  db.all(
    `SELECT u.*, COUNT(s.id) as total_servicos 
     FROM usuarios u 
     LEFT JOIN servicos s ON u.id = s.usuario_id
     WHERE u.tipo = 'cliente' AND u.ativo = 1
     GROUP BY u.id
     ORDER BY u.data_criacao DESC`,
    [],
    (err, clientes) => {
      if (err) {
        console.error('Erro ao buscar clientes:', err);
        clientes = [];
      }

      res.render('colaborador/clientes', {
        title: 'Gerenciar Clientes',
        usuario: {
          nome: req.session.nome,
          email: req.session.email,
          tipo: req.session.tipo
        },
        clientes
      });
    }
  );
});

// GET - Serviços do cliente
router.get('/clientes/:id/servicos', verificarColaborador, (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT id, nome, email, telefone, empresa FROM usuarios WHERE id = ? AND tipo = 'cliente' AND ativo = 1`,
    [id],
    (err, cliente) => {
      if (err || !cliente) {
        return res.status(404).render('404', {
          title: 'Cliente não encontrado'
        });
      }

      db.all(
        `SELECT s.* FROM servicos s WHERE s.usuario_id = ? ORDER BY s.data_criacao DESC`,
        [id],
        (err, servicos) => {
          if (err) {
            console.error('Erro ao buscar serviços do cliente:', err);
            servicos = [];
          }

          res.render('colaborador/cliente-servicos', {
            title: 'Serviços do Cliente',
            usuario: {
              nome: req.session.nome,
              email: req.session.email,
              tipo: req.session.tipo
            },
            cliente,
            servicos
          });
        }
      );
    }
  );
});

// GET - Página de administração
router.get('/admin', verificarColaborador, (req, res) => {
  // Buscar estatísticas
  db.all(
    `SELECT COUNT(*) as total FROM servicos`,
    [],
    (err, servicoData) => {
      const totalServicos = servicoData && servicoData[0] ? servicoData[0].total : 0;

      db.all(
        `SELECT status, COUNT(*) as total FROM servicos GROUP BY status`,
        [],
        (err, servicosPorStatus) => {
          const statusMap = {};
          if (servicosPorStatus) {
            servicosPorStatus.forEach(item => {
              statusMap[item.status] = item.total;
            });
          }

          db.all(
            `SELECT COUNT(*) as total FROM usuarios WHERE tipo = 'cliente'`,
            [],
            (err, clienteData) => {
              const totalClientes = clienteData && clienteData[0] ? clienteData[0].total : 0;

              db.all(
                `SELECT COUNT(*) as total FROM usuarios WHERE tipo = 'colaborador'`,
                [],
                (err, colaboradorData) => {
                  const totalColaboradores = colaboradorData && colaboradorData[0] ? colaboradorData[0].total : 0;

                  const isAdmin = req.session.tipo === 'admin';

                  const renderAdmin = (usuarios = []) => {
                    res.render('colaborador/admin', {
                      title: 'Administração',
                      usuario: {
                        nome: req.session.nome,
                        email: req.session.email,
                        tipo: req.session.tipo
                      },
                      estatisticas: {
                        totalServicos,
                        totalClientes,
                        totalColaboradores,
                        servicosPorStatus: statusMap
                      },
                      isAdmin,
                      usuarios
                    });
                  };

                  if (!isAdmin) {
                    return renderAdmin();
                  }

                  db.all(
                    `SELECT id, nome, email, tipo, ativo, data_criacao FROM usuarios ORDER BY data_criacao DESC`,
                    [],
                    (err, usuarios) => {
                      if (err) {
                        console.error('Erro ao buscar usuários:', err);
                        usuarios = [];
                      }

                      renderAdmin(usuarios);
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

// POST - Atualizar tipo de usuário (admin)
router.post('/admin/usuarios/:id/tipo', verificarAdmin, (req, res) => {
  const { id } = req.params;
  const { tipo } = req.body;

  const tiposValidos = ['cliente', 'colaborador', 'admin'];
  if (!tiposValidos.includes(tipo)) {
    return res.redirect('/colaborador/admin?erro=Tipo de usuário inválido');
  }

  db.run(
    `UPDATE usuarios SET tipo = ? WHERE id = ?`,
    [tipo, id],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar tipo de usuário:', err);
        return res.redirect('/colaborador/admin?erro=Erro ao atualizar usuário');
      }

      res.redirect('/colaborador/admin');
    }
  );
});

// GET - Página de perfil
router.get('/perfil', verificarColaborador, (req, res) => {
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

      res.render('colaborador/perfil', {
        title: 'Meu Perfil',
        usuario
      });
    }
  );
});

// POST - Atualizar perfil
router.post('/perfil/atualizar', verificarColaborador, (req, res) => {
  const { nome, telefone } = req.body;
  const userId = req.session.userId;

  db.run(
    `UPDATE usuarios SET nome = ?, telefone = ? WHERE id = ?`,
    [nome, telefone || null, userId],
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
