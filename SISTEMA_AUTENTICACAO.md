# Sistema de Autenticação e Gerenciamento - Documentação

## Overview

O sistema foi completamente renovado com um painel de autenticação, login para clientes e colaboradores, banco de dados SQLite e gerenciamento completo de serviços e laudos técnicos.

## Acesso ao Sistema

### 1. Página de Login
- URL: `http://localhost:3000/login`
- Selecione o tipo: **Cliente** ou **Colaborador/Prestador**
- Digite email e senha

### 2. Página de Registro
- URL: `http://localhost:3000/registro`
- Escolha se é Cliente ou Colaborador
- Preencha os dados necessários
- A conta será ativada imediatamente após o registro

### 3. Sair da Conta
- Clique em "Sair" no menu de navegação

## Fluxo do Cliente

### Dashboard do Cliente
- **URL**: `/cliente/dashboard`
- **Acesso**: Apenas clientes logados
- **Funcionalidades**:
  - Visualizar todos os seus serviços
  - Ver status dos serviços (Pendente, Em Andamento, Concluído, Cancelado)
  - Acompanhar prioridades (Baixa, Normal, Alta)
  - Contadores com resumo dos serviços

### Detalhes do Serviço
- **URL**: `/cliente/servico/:id`
- **Funcionalidades**:
  - Descrição completa do serviço
  - Barra de progresso visual
  - Histórico de atualizações
  - Laudos técnicos associados
  - Datas de criação e conclusão

### Meus Laudos Técnicos
- **URL**: `/cliente/laudos`
- **Funcionalidades**:
  - Lista de todos os laudos emitidos
  - Status dos laudos (Rascunho, Enviado, Assinado)
  - Data de envio e assinatura
  - Visualização do conteúdo completo em modal

### Perfil do Cliente
- **URL**: `/cliente/perfil`
- **Funcionalidades**:
  - Editar nome completo
  - Adicionar/editar telefone
  - Adicionar/editar empresa
  - Visualizar data de criação da conta
  - Ver status da conta

## Fluxo do Colaborador

### Dashboard do Colaborador
- **URL**: `/colaborador/dashboard`
- **Acesso**: Apenas colaboradores logados
- **Funcionalidades**:
  - Visualizar todos os serviços do sistema
  - Filtrar por status
  - Contadores com resumo de todos os serviços
  - Tabela de serviços com informações do cliente
  - Acesso rápido para gerenciar cada serviço

### Gerenciar Serviço
- **URL**: `/colaborador/servico/:id`
- **Funcionalidades**:
  - Informações completo do cliente
  - Atualizar status do serviço
  - Adicionar atualizações (mensagens de progresso)
  - Histórico de atualizações
  - Criar, editar e enviar laudos técnicos
  - Visualizar status de cada laudo

### Criar/Editar Laudo Técnico
- **URL**: `/colaborador/laudo/novo/:servico_id`
- **Funcionalidades**:
  - Editor de texto para o laudo
  - Contador de caracteres em tempo real
  - Informações do serviço e cliente
  - Salvar como rascunho
  - Enviar para cliente

### Gerenciar Clientes
- **URL**: `/colaborador/clientes`
- **Funcionalidades**:
  - Lista de todos os clientes cadastrados
  - Informações de contato
  - Quantidade de serviços por cliente
  - Data de registro do cliente

### Painel Administrativo
- **URL**: `/colaborador/admin`
- **Funcionalidades**:
  - Estatísticas gerais do sistema
  - Total de serviços e clientes
  - Distribuição de serviços por status (gráficos)
  - Informações do sistema
  - Ações administrativas (placeholders para futuras implementações)

### Perfil do Colaborador
- **URL**: `/colaborador/perfil`
- **Funcionalidades**:
  - Editar informações pessoais
  - Telefone
  - Data de criação da conta
  - Placeholder para estatísticas de trabalho

## Banco de Dados

### Tabelas Criadas

#### 1. usuários
```sql
- id: INTEGER PRIMARY KEY
- nome: TEXT NOT NULL
- email: TEXT UNIQUE NOT NULL
- senha: TEXT NOT NULL (criptografada com bcrypt)
- tipo: TEXT ('cliente' ou 'colaborador')
- telefone: TEXT
- empresa: TEXT
- data_criacao: DATETIME
- ativo: INTEGER (0 ou 1)
```

#### 2. serviços
```sql
- id: INTEGER PRIMARY KEY
- usuario_id: INTEGER (FK para usuários)
- titulo: TEXT NOT NULL
- descricao: TEXT
- tipo: TEXT NOT NULL
- status: TEXT ('pendente', 'em_andamento', 'concluido', 'cancelado')
- prioridade: TEXT ('baixa', 'normal', 'alta')
- data_criacao: DATETIME
- data_atualizacao: DATETIME
- data_conclusao: DATETIME (NULL se não concluído)
```

#### 3. laudos
```sql
- id: INTEGER PRIMARY KEY
- servico_id: INTEGER (FK para serviços)
- cliente_id: INTEGER (FK para usuários)
- colaborador_id: INTEGER (FK para usuários)
- titulo: TEXT NOT NULL
- conteudo: TEXT NOT NULL
- arquivo: TEXT
- status: TEXT ('rascunho', 'enviado', 'assinado')
- data_criacao: DATETIME
- data_envio: DATETIME
- data_assinatura: DATETIME
```

#### 4. atualizacoes
```sql
- id: INTEGER PRIMARY KEY
- servico_id: INTEGER (FK para serviços)
- colaborador_id: INTEGER (FK para usuários)
- mensagem: TEXT NOT NULL
- data_criacao: DATETIME
```

## Criando Dados de Teste

### Via Terminal SQLite

```bash
# Abrir o terminal SQLite
sqlite3 opus.db

# Inserir um cliente de teste
INSERT INTO usuarios (nome, email, senha, tipo, telefone, empresa, ativo)
VALUES ('João Silva', 'joao@example.com', '$2a$10/...hash...', 'cliente', '11999999999', 'Empresa XYZ', 1);

# Inserir um colaborador de teste
INSERT INTO usuarios (nome, email, senha, tipo, telefone, ativo)
VALUES ('Maria Santos', 'maria@example.com', '$2a$10/...hash...', 'colaborador', '11988888888', 1);

# Inserir um serviço de teste
INSERT INTO servicos (usuario_id, titulo, descricao, tipo, status, prioridade)
VALUES (1, 'Inspeção de Máquina', 'Inspeção de segurança da máquina XYZ', 'inspeccao', 'em_andamento', 'alta');
```

**Nota**: As senhas devem ser criptografadas com bcrypt. Use a funcionalidade de registro no sistema.

## Rotas Disponíveis

### Autenticação
- `GET /login` - Página de login
- `POST /login` - Submeter login
- `GET /registro` - Página de registro
- `POST /registro` - Submeter registro
- `GET /logout` - Fazer logout

### Cliente
- `GET /cliente/dashboard` - Dashboard principal
- `GET /cliente/servico/:id` - Detalhes do serviço
- `GET /cliente/laudos` - Meus laudos
- `GET /cliente/perfil` - Meu perfil
- `POST /cliente/perfil/atualizar` - Atualizar perfil

### Colaborador
- `GET /colaborador/dashboard` - Dashboard
- `GET /colaborador/servico/:id` - Gerenciar serviço
- `POST /colaborador/servico/:id/status` - Atualizar status
- `POST /colaborador/servico/:id/atualizar` - Adicionar atualização
- `GET /colaborador/laudo/novo/:servico_id` - Criar laudo
- `POST /colaborador/laudo/salvar` - Salvar laudo
- `POST /colaborador/laudo/:id/enviar` - Enviar laudo
- `GET /colaborador/clientes` - Lista de clientes
- `GET /colaborador/admin` - Painel administrativo
- `GET /colaborador/perfil` - Meu perfil
- `POST /colaborador/perfil/atualizar` - Atualizar perfil

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=sua-chave-secreta-aqui-mude-em-producao
LOG_LEVEL=info
```

## Segurança

- Senhas são criptografadas com bcrypt (10 rounds)
- Sessões são armazenadas em SQLite
- Cookies de sessão com httpOnly e secure flags
- Validação de entrada em todos os formulários
- Middlewares de autenticação protegem rotas privadas

## Próximas Implementações

- [ ] Suporte a upload de arquivos (laudos em PDF)
- [ ] Notificações por email
- [ ] Assinatura digital de laudos
- [ ] Integração com API de pagamento
- [ ] Relatórios e exportação de dados
- [ ] Integração com WhatsApp Business API
- [ ] Dashboard de analytics
- [ ] Sistema de permissões mais granulares
- [ ] Backup automático do banco de dados

## Troubleshooting

### Porta 3000 já está em uso
```bash
# Alternative port
PORT=3001 npm start
```

### Erro de banco de dados
```bash
# Reinicializar banco de dados
node db/init.js
```

### Limpar sessões
```bash
# Remover arquivo de sessões
rm opus_sessions.db
```

## Contato e Suporte

Para mais informações, visite `/contato`
