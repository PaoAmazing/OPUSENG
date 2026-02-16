# 🚀 Guia Rápido de Início

## Instalação e Setup (Primeira Vez)

```bash
# 1. Instalar dependências
npm install

# 2. Inicializar banco de dados
node db/init.js

# 3. (OPCIONAL) Criar dados de teste
node scripts/criar-dados-teste.js

# 4. Iniciar servidor
npm start
```

## Acessar o Sistema

### Login
- **URL**: http://localhost:3000/login
- Types: **Cliente** ou **Colaborador**

### Registro
- **URL**: http://localhost:3000/registro

## Fluxos Principais

### 🧑 Cliente (Após Login)
1. **Dashboard** `/cliente/dashboard`
   - Ver todos os seus serviços
   - Contador de status (pendente, em andamento, concluído)

2. **Detalhes do Serviço** Clique em "Ver Detalhes"
   - Descrição completa
   - Histórico de atualizações
   - Laudos técnicos associados
   - Barra de progresso

3. **Meus Laudos** `/cliente/laudos`
   - Ver todos os laudos recebidos
   - Visualizar conteúdo em modal
   - Data de envio e status

4. **Meu Perfil** `/cliente/perfil`
   - Editar nome, telefone, empresa
   - Ver data de criação

### 👔 Colaborador (Após Login)
1. **Dashboard** `/colaborador/dashboard`
   - Ver todos os serviços do sistema
   - Filtrar por status
   - Acessar rápido para cada serviço

2. **Gerenciar Serviço**
   - Informações do cliente
   - MUDAR STATUS (Pendente → Em Andamento → Concluído)
   - Adicionar atualizações/mensagens
   - Ver histórico de atualizações

3. **Criar Laudo Técnico**
   - Escrever laudo completo
   - Editor com contador de caracteres
   - Salvar como rascunho e enviar depois
   - Ou enviar direto para cliente

4. **Gerenciar Clientes** `/colaborador/clientes`
   - Ver lista de todos os clientes
   - Informações de contato
   - Quantidade de serviços

5. **Painel Admin** `/colaborador/admin`
   - Estatísticas gerais
   - Gráficos de distribuição de serviços
   - Informações do sistema

6. **Meu Perfil** `/colaborador/perfil`
   - Editar informações pessoais

## Dados de Teste

Se você rodou `node scripts/criar-dados-teste.js`:

### Cliente (Tipo: cliente)
```
Email: joao@example.com
Senha: 123456
Empresa: Empresa Silva Ltda
Telefone: (11) 99999-9999
```

### Colaborador (Tipo: colaborador)
```
Email: carlos@opus.com
Senha: 123456
Telefone: (11) 97777-7777
```

## Estrutura de Pastas

```
OPUSENG/
├── app.js                      # Arquivo principal
├── package.json               
├── db/
│   ├── init.js               # Inicializar DB
│   └── connect.js            # Conexão DB
├── middlewares/
│   └── auth.js               # Autenticação
├── routes/
│   ├── auth.js               # Login/Registro
│   ├── cliente.js            # Rotas cliente
│   ├── colaborador.js        # Rotas colaborador
│   ├── index.js              # Home
│   └── contato.js            # Contato
├── views/
│   ├── auth/
│   │   ├── login.ejs
│   │   └── registro.ejs
│   ├── cliente/
│   │   ├── dashboard.ejs
│   │   ├── servico.ejs
│   │   ├── laudos.ejs
│   │   └── perfil.ejs
│   ├── colaborador/
│   │   ├── dashboard.ejs
│   │   ├── servico.ejs
│   │   ├── laudo.ejs
│   │   ├── clientes.ejs
│   │   ├── admin.ejs
│   │   └── perfil.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
├── public/
│   ├── css/
│   └── js/
├── scripts/
│   └── criar-dados-teste.js
├── opus.db                    # Banco de dados (criado)
└── SISTEMA_AUTENTICACAO.md   # Documentação completa
```

## Troubleshooting

### Erro: Porta 3000 em uso
```bash
# Use outra porta
PORT=3001 npm start
```

### Erro: Banco de dados não existe
```bash
# Recrie o banco
node db/init.js
```

### Erro: Módulo não encontrado
```bash
# Reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

### Limpar sessões
```bash
# Remover arquivo de sessões
rm opus_sessions.db
```

## Variáveis de Ambiente (.env)

Crie arquivo `.env` na raiz:

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=sua-chave-secreta-super-segura-aqui
```

## Comandos Úteis

```bash
# Iniciar servidor (produção)
npm start

# Iniciar com nodemon (desenvolvimento)
npm run dev

# Criar dados de teste
node scripts/criar-dados-teste.js

# Inicializar banco de dados
node db/init.js

# Abrir banco de dados SQLite
sqlite3 opus.db

# Ver estructura das tabelas
# sqlite> .schema
# sqlite> SELECT * FROM usuarios;
```

## URLs Principais

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/login` | Login |
| `/registro` | Registrar |
| `/logout` | Sair |
| `/cliente/dashboard` | Dashboard cliente |
| `/cliente/servico/:id` | Detalhes serviço |
| `/cliente/laudos` | Meus laudos |
| `/cliente/perfil` | Meu perfil |
| `/colaborador/dashboard` | Dashboard colaborador |
| `/colaborador/servico/:id` | Gerenciar serviço |
| `/colaborador/clientes` | Gerenciar clientes |
| `/colaborador/admin` | Painel admin |
| `/colaborador/perfil` | Meu perfil |

## Recursos Importantes

- 📚 Documentação completa: [SISTEMA_AUTENTICACAO.md](./SISTEMA_AUTENTICACAO.md)
- 📋 Alterações implementadas: [ALTERACOES_IMPLEMENTADAS.md](./ALTERACOES_IMPLEMENTADAS.md)
- 🔄 Histórico: [CORREÇÕES_REALIZADAS.md](./CORREÇÕES_REALIZADAS.md)

---

**Pronto para usar!** 🎉

Qualquer dúvida, consulte a documentação em `SISTEMA_AUTENTICACAO.md`
