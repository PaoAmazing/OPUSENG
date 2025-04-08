const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.get('/', (req, res) => {
  res.render('contato', { 
    title: 'Contato - OPUS Engenharia',
    active: 'contato',
    success: null,
    error: null
  });
});

router.post('/', async (req, res) => {
  const { nome, email, telefone, servico, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.render('contato', {
      title: 'Contato - OPUS Engenharia',
      active: 'contato',
      success: null,
      error: 'Por favor, preencha os campos obrigatórios (nome, e-mail e mensagem).'
    });
  }

  // Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Opções do e-mail
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_EMAIL,
    subject: `Novo contato de ${nome} - OPUS Engenharia`,
    html: `
      <h2>Novo contato recebido</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${telefone || 'Não informado'}</p>
      <p><strong>Serviço de interesse:</strong> ${servico || 'Não informado'}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${mensagem}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.render('contato', { 
      title: 'Contato - OPUS Engenharia',
      active: 'contato',
      success: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      error: null
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.render('contato', { 
      title: 'Contato - OPUS Engenharia',
      active: 'contato',
      success: null,
      error: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.'
    });
  }
});

module.exports = router;