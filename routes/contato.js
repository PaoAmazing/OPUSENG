const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// GET - Renderiza página de contato
router.get('/', (req, res) => {
  res.render('contato', { 
    title: 'Contato - OPUS Engenharia',
    active: 'contato',
    success: null,
    error: null
  });
});

// POST - Processa formulário de contato
router.post('/', async (req, res) => {
  const { nome, email, telefone, servico, mensagem } = req.body;

  console.log('📋 Formulário recebido:', { nome, email, telefone, servico });

  // Validação de campos obrigatórios
  if (!nome || !email || !mensagem) {
    return res.render('contato', {
      title: 'Contato - OPUS Engenharia',
      active: 'contato',
      success: null,
      error: 'Por favor, preencha os campos obrigatórios (nome, e-mail e mensagem).'
    });
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render('contato', {
      title: 'Contato - OPUS Engenharia',
      active: 'contato',
      success: null,
      error: 'Por favor, forneça um email válido.'
    });
  }

  try {
    // Configuração do transporter SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Opções do e-mail
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Novo contato de ${nome} - OPUS Engenharia`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0066cc;">Novo Contato Recebido</h2>
          <hr style="border: none; border-top: 1px solid #ddd;">
          
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Telefone:</strong> ${telefone || 'Não informado'}</p>
          <p><strong>Serviço de Interesse:</strong> ${servico || 'Não especificado'}</p>
          
          <hr style="border: none; border-top: 1px solid #ddd;">
          <h3>Mensagem:</h3>
          <p>${mensagem.replace(/\n/g, '<br>')}</p>
          
          <hr style="border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666;">
            Este é um email automático do formulário de contato do site OPUS Engenharia.
          </p>
        </div>
      `,
      text: `
        Novo Contato Recebido
        
        Nome: ${nome}
        Email: ${email}
        Telefone: ${telefone || 'Não informado'}
        Serviço de Interesse: ${servico || 'Não especificado'}
        
        Mensagem:
        ${mensagem}
      `
    };

    // Envia email
    console.log('📧 Enviando email para:', process.env.CONTACT_EMAIL);
    await transporter.sendMail(mailOptions);
    
    console.log('✓ Email enviado com sucesso');

    return res.render('contato', { 
      title: 'Contato - OPUS Engenharia',
      active: 'contato',
      success: 'Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.',
      error: null
    });

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
    
    return res.render('contato', { 
      title: 'Contato - OPUS Engenharia',
      active: 'contato',
      success: null,
      error: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde ou entre em contato conosco pelo WhatsApp.'
    });
  }
});

module.exports = router;