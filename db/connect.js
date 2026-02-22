const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'opus.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  }
});

db.serialize(() => {
  db.get(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='usuarios'",
    [],
    (err, row) => {
      if (err || !row || !row.sql) {
        return;
      }

      const hasAdminRole = row.sql.includes("'admin'");
      if (hasAdminRole) {
        return;
      }

      console.log('↺ Atualizando tabela usuarios para incluir perfil admin');

      db.serialize(() => {
        db.run('PRAGMA foreign_keys=OFF');
        db.run('BEGIN TRANSACTION');
        db.run(
          `CREATE TABLE IF NOT EXISTS usuarios_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            tipo TEXT NOT NULL CHECK(tipo IN ('cliente', 'colaborador', 'admin')),
            telefone TEXT,
            empresa TEXT,
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            ativo INTEGER DEFAULT 1
          )`
        );
        db.run(
          `INSERT INTO usuarios_new (id, nome, email, senha, tipo, telefone, empresa, data_criacao, ativo)
           SELECT id, nome, email, senha, tipo, telefone, empresa, data_criacao, ativo FROM usuarios`
        );
        db.run('DROP TABLE usuarios');
        db.run('ALTER TABLE usuarios_new RENAME TO usuarios');
        db.run('COMMIT');
        db.run('PRAGMA foreign_keys=ON');
      });
    }
  );
});

module.exports = db;
