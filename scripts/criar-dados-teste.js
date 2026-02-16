#!/usr/bin/env node

/**
 * Script para criar dados de teste
 * Uso: node scripts/criar-dados-teste.js
 */

const bcrypt = require('bcryptjs');
const db = require('../db/connect');

const dados = {
  clientes: [
    {
      nome: 'João Silva',
      email: 'joao@example.com',
      senha: '123456',
      telefone: '(11) 99999-9999',
      empresa: 'Empresa Silva Ltda'
    },
    {
      nome: 'Maria Santos',
      email: 'maria@example.com',
      senha: '123456',
      telefone: '(11) 98888-8888',
      empresa: 'Indústria Santos'
    }
  ],
  colaboradores: [
    {
      nome: 'Carlos Oliveira',
      email: 'carlos@opus.com',
      senha: '123456',
      telefone: '(11) 97777-7777'
    },
    {
      nome: 'Ana Costa',
      email: 'ana@opus.com',
      senha: '123456',
      telefone: '(11) 96666-6666'
    }
  ],
  servicos: [
    {
      usuario_id: 1,
      titulo: 'Inspeção de Máquina CNC',
      descricao: 'Inspeção de segurança da máquina CNC modelo XYZ-2024',
      tipo: 'inspeccao',
      status: 'em_andamento',
      prioridade: 'alta'
    },
    {
      usuario_id: 1,
      titulo: 'Laudo Técnico - NR12',
      descricao: 'Avaliação de conformidade com NR12',
      tipo: 'laudo',
      status: 'pendente',
      prioridade: 'alta'
    },
    {
      usuario_id: 2,
      titulo: 'Consultoria em Eficiência Energética',
      descricao: 'Análise e otimização do consumo de energia',
      tipo: 'consultoria',
      status: 'concluido',
      prioridade: 'normal'
    }
  ]
};

async function criarDados() {
  console.log('🔄 Iniciando criação de dados de teste...\n');

  try {
    // Criar clientes
    console.log('👥 Criando clientes de teste...');
    for (const cliente of dados.clientes) {
      const senhaHash = await new Promise((resolve, reject) => {
        bcrypt.hash(cliente.senha, 10, (err, hash) => {
          if (err) reject(err);
          else resolve(hash);
        });
      });

      db.run(
        `INSERT INTO usuarios (nome, email, senha, tipo, telefone, empresa, ativo)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [cliente.nome, cliente.email, senhaHash, 'cliente', cliente.telefone, cliente.empresa],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              console.log(`  ⚠️  Cliente "${cliente.nome}" já existe`);
            } else {
              console.error(`  ❌ Erro ao criar cliente: ${err.message}`);
            }
          } else {
            console.log(`  ✅ Cliente criado: ${cliente.nome} (ID: ${this.lastID})`);
          }
        }
      );
    }

    // Criar colaboradores
    console.log('\n👨‍💼 Criando colaboradores de teste...');
    for (const colab of dados.colaboradores) {
      const senhaHash = await new Promise((resolve, reject) => {
        bcrypt.hash(colab.senha, 10, (err, hash) => {
          if (err) reject(err);
          else resolve(hash);
        });
      });

      db.run(
        `INSERT INTO usuarios (nome, email, senha, tipo, telefone, ativo)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [colab.nome, colab.email, senhaHash, 'colaborador', colab.telefone],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              console.log(`  ⚠️  Colaborador "${colab.nome}" já existe`);
            } else {
              console.error(`  ❌ Erro ao criar colaborador: ${err.message}`);
            }
          } else {
            console.log(`  ✅ Colaborador criado: ${colab.nome} (ID: ${this.lastID})`);
          }
        }
      );
    }

    // Criar serviços
    console.log('\n📦 Criando serviços de teste...');
    setTimeout(() => {
      for (const servico of dados.servicos) {
        db.run(
          `INSERT INTO servicos (usuario_id, titulo, descricao, tipo, status, prioridade)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [servico.usuario_id, servico.titulo, servico.descricao, servico.tipo, servico.status, servico.prioridade],
          function(err) {
            if (err) {
              console.error(`  ❌ Erro ao criar serviço: ${err.message}`);
            } else {
              console.log(`  ✅ Serviço criado: ${servico.titulo} (ID: ${this.lastID})`);
            }
          }
        );
      }

      setTimeout(() => {
        console.log('\n✨ Dados de teste criados com sucesso!\n');
        console.log('📋 Credenciais de teste:\n');
        console.log('Cliente:');
        console.log('  Email: joao@example.com');
        console.log('  Senha: 123456\n');
        console.log('Colaborador:');
        console.log('  Email: carlos@opus.com');
        console.log('  Senha: 123456\n');
        
        process.exit(0);
      }, 1000);
    }, 1000);

  } catch (err) {
    console.error('Erro:', err);
    process.exit(1);
  }
}

criarDados();
