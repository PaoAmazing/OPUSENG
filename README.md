# OPUS Engenharia - Site Institucional

Site profissional para OPUS Soluções em Engenharia. Desenvolvido com Node.js, Express e EJS.

## Sobre o Projeto

A OPUS Engenharia oferece soluções especializadas em:
- Projetos Mecânicos
- Laudos Técnicos
- NR12 com ART
- Consultoria em Engenharia
- PMOC - Plano de Manutenção de Ar Condicionado
- Reclassificação de Monta

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **EJS** - Template engine
- **SQLite3** - Banco de dados relacional
- **bcryptjs** - Criptografia de senhas
- **express-session** - Gerenciamento de sessões
- **connect-sqlite3** - Store de sessões em SQLite
- **Nodemailer** - Sistema de email
- **dotenv** - Gerenciamento de variáveis de ambiente

## Pré-requisitos

- Node.js (versão 14+)
- npm ou yarn

## Funcionalidades Principais

### Sistema de Autenticação
- Login e registro para clientes e colaboradores
- Dois tipos de usuários com permissões diferenciadas
- Sessões seguras com criptografia de senhas
- Banco de dados SQLite integrado

### Dashboard do Cliente
- Acompanhamento de status de serviços
- Visualização de laudos técnicos
- Histórico de atualizações de serviços
- Gerenciamento de perfil

### Painel do Colaborador
- Gerenciamento completo de serviços
- Criação e envio de laudos técnicos
- Atualizações de status em tempo real
- Gerenciamento de clientes
- Painel administrativo com estatísticas

### Banco de Dados
- Tabela de usuários (clientes e colaboradores)
- Tabela de serviços com status e prioridades
- Tabela de laudos técnicos
- Tabela de atualizações de serviços

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/PaoAmazing/OPUSENG.git
cd OPUSENG
```

2. Instale as dependências:
```bash
npm install
```

3. Inicialize o banco de dados:
```bash
node db/init.js
```

4. Configure as variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

## Configuração do Arquivo .env

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-ou-app-password
SMTP_FROM=noreply@opusengenharia.com.br
CONTACT_EMAIL=contato@opusengenharia.com.br
```

**Nota sobre Gmail:** Se estiver usando Gmail, gere uma [App Password](https://myaccount.google.com/apppasswords) em vez de usar a senha da conta.

## Como Executar

### Modo Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Modo Produção
```bash
npm start
```

O servidor estará disponível em: `http://localhost:3000`

## Estrutura do Projeto

```
OPUSENG/
├── app.js                 # Arquivo principal da aplicação
├── package.json          # Dependências do projeto
├── .env.example          # Exemplo de variáveis de ambiente
├── routes/               # Rotas da aplicação
│   ├── index.js         # Rotas principais (home, serviços, sobre, portfólio)
│   └── contato.js       # Rota de contato com envio de email
├── views/               # Templates EJS
│   ├── index.ejs       # Página inicial
│   ├── servicos.ejs    # Página de serviços
│   ├── sobre.ejs       # Página sobre
│   ├── portfolio.ejs   # Página de portfólio
│   ├── contato.ejs     # Página de contato
│   ├── 404.ejs         # Página de erro 404
│   └── partials/       # Componentes reutilizáveis
│       ├── header.ejs
│       └── footer.ejs
└── public/             # Arquivos estáticos
    ├── css/           # Estilos CSS
    │   ├── style.css
    │   ├── header.css
    │   ├── footer.css
    │   ├── contato.css
    │   ├── services.css
    │   ├── sobre.css
    │   └── portfolio.css
    ├── img/           # Imagens
    └── js/            # JavaScript cliente
        └── main.js
```

## Rotas Disponíveis

- `/` - Página inicial
- `/servicos` - Serviços oferecidos
- `/sobre` - Informações sobre a empresa
- `/portfolio` - Portfólio de projetos
- `/contato` - Página de contato com formulário

## Funcionalidades

✅ Página inicial com destaque de serviços
✅ Página de serviços com descrição detalhada
✅ Página sobre a empresa
✅ Portfólio de projetos realizados
✅ Formulário de contato com envio de email
✅ Integração com Google Analytics
✅ Links para WhatsApp e Instagram
✅ Design responsivo
✅ Página 404 customizada

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| PORT | Porta do servidor (padrão: 3000) |
| SMTP_HOST | Host SMTP para envio de emails |
| SMTP_PORT | Porta SMTP (Gmail usa 465) |
| SMTP_USER | Email para autenticação SMTP |
| SMTP_PASS | Senha ou app password SMTP |
| SMTP_FROM | Email que será exibido como remetente |
| CONTACT_EMAIL | Email para receber mensagens de contato |

## Troubleshooting

### Email não está sendo enviado
- Verifique as credenciais SMTP no arquivo `.env`
- Para Gmail, use [App Password](https://myaccount.google.com/apppasswords) em vez da senha
- Certifique-se de que a porta 465 não está bloqueada

### Porta já em uso
Altere a variável PORT no arquivo `.env` para uma porta disponível.

### Módulo não encontrado
Certifique-se de ter executado `npm install` corretamente.

## Deploy

O projeto está pronto para ser deployado em plataformas como:
- Heroku
- Railway
- AWS
- DigitalOcean
- Vercel (com ajustes)

## Contribuindo

Para fazer contribuições, abra uma `issue` ou um `pull request`.

## Licença

MIT - Veja o arquivo LICENSE para detalhes.

## Contato

- **WhatsApp:** (61) 9553-3123
- **Email:** opusengmec@gmail.com
- **Instagram:** [@opusengenharia61](https://www.instagram.com/opusengenharia61/)

---

Desenvolvido com ❤️ pela OPUS Engenharia
