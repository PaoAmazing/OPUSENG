const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'opus.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  }
  console.log('✓ Conectado ao banco de dados SQLite');
});

// Criar tabelas
db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('cliente', 'colaborador')),
      telefone TEXT,
      empresa TEXT,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      ativo INTEGER DEFAULT 1
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela usuarios:', err);
    else console.log('✓ Tabela usuarios criada ou já existe');
  });

  // Tabela de serviços
  db.run(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT,
      tipo TEXT NOT NULL,
      status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'em_andamento', 'concluido', 'cancelado')),
      prioridade TEXT DEFAULT 'normal' CHECK(prioridade IN ('baixa', 'normal', 'alta')),
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_conclusao DATETIME,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela servicos:', err);
    else console.log('✓ Tabela servicos criada ou já existe');
  });

  // Tabela de laudos técnicos
  db.run(`
    CREATE TABLE IF NOT EXISTS laudos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      servico_id INTEGER NOT NULL,
      cliente_id INTEGER NOT NULL,
      colaborador_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      conteudo TEXT NOT NULL,
      arquivo TEXT,
      status TEXT DEFAULT 'rascunho' CHECK(status IN ('rascunho', 'enviado', 'assinado')),
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_envio DATETIME,
      data_assinatura DATETIME,
      FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE,
      FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (colaborador_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela laudos:', err);
    else console.log('✓ Tabela laudos criada ou já existe');
  });

  // Tabela de atualizações de status
  db.run(`
    CREATE TABLE IF NOT EXISTS atualizacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      servico_id INTEGER NOT NULL,
      colaborador_id INTEGER NOT NULL,
      mensagem TEXT NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE,
      FOREIGN KEY (colaborador_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela atualizacoes:', err);
    else console.log('✓ Tabela atualizacoes criada ou já existe');
  });
});

db.close((err) => {
  if (err) {
    console.error('Erro ao fechar banco de dados:', err.message);
  } else {
    console.log('✓ Banco de dados inicializado com sucesso!');
  }
});
