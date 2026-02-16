const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { 
    title: 'OPUS Engenharia - Soluções Técnicas Especializadas',
    active: 'home'
  });
});

router.get('/servicos', (req, res) => {
  res.render('servicos', { 
    title: 'Nossos Serviços - OPUS Engenharia',
    active: 'servicos',
    services: [
      {
        title: 'Laudos Técnicos',
        description: 'Elaboração de laudos técnicos completos e detalhados para atender às necessidades específicas de sua empresa.',
        icon: 'report'
      },
      {
        title: 'Projetos Mecânicos',
        description: 'Desenvolvimento de projetos mecânicos personalizados com tecnologia de ponta e atendimento às normas técnicas.',
        icon: 'engineering'
      },
      {
        title: 'NR12 com ART',
        description: 'Adequação à Norma Regulamentadora 12 com emissão de ART (Anotação de Responsabilidade Técnica).',
        icon: 'safety'
      },
      {
        title: 'Consultoria em Engenharia',
        description: 'Soluções especializadas para otimização de processos industriais e melhoria contínua.',
        icon: 'consultancy'
      },
      {
        title: 'PMOC - Plano de Manutenção de Ar Condicionado',
        description: 'Elaboração e implementação do PMOC. Garante qualidade do ar, eficiência energética e conformidade legal.',
        icon: 'thermometer-snowflake'
      }
    ]
  });
});

router.get('/sobre', (req, res) => {
  res.render('sobre', { 
    title: 'Sobre Nós - OPUS Engenharia',
    active: 'sobre',
    about: {
      mission: 'Fornecer soluções em engenharia com excelência técnica, qualidade e atendimento às normas, contribuindo para o sucesso de nossos clientes.',
      vision: 'Ser referência nacional em serviços de engenharia técnica, reconhecida pela qualidade e seriedade de nossos trabalhos.',
      values: ['Ética Profissional', 'Qualidade Técnica', 'Compromisso com prazos', 'Atendimento Personalizado']
    }
  });
});

router.get('/portfolio', (req, res) => {
  res.render('portfolio', { 
    title: 'Portfólio - OPUS Engenharia',
    active: 'portfolio',
    projects: [
      {
        name: 'Projeto Industrial Completo',
        client: 'Indústria Metalúrgica XYZ',
        description: 'Desenvolvimento de projeto mecânico completo para linha de produção com otimização de eficiência.',
        image: 'project1.jpg'
      },
      {
        name: 'Adequação NR12',
        client: 'Fábrica de Alimentos ABC',
        description: 'Adequação de máquinas e equipamentos à Norma Regulamentadora 12, garantindo segurança operacional.',
        image: 'project2.jpg'
      },
      {
        name: 'Laudo Técnico de Equipamentos',
        client: 'Empresa de Logística DEF',
        description: 'Elaboração de laudo técnico completo para frota de equipamentos de movimentação e armazenagem.',
        image: 'project3.jpg'
      },
      {
        name: 'Sistema PMOC - Ar Condicionado',
        client: 'Centro Administrativo GHI',
        description: 'Implementação completa do Plano de Manutenção, Operação e Controle (PMOC) e monitoramento de qualidade do ar.',
        image: 'project4.jpg'
      },
      {
        name: 'Reclassificação de Monta',
        client: 'Seguadora de Seguros JKL',
        description: 'Análise estrutural e mecânica de veículo sinistrado com emissão de laudo técnico conforme regulamentação.',
        image: 'project5.jpg'
      },
      {
        name: 'Consultoria de Otimização',
        client: 'Indústria de Manufatura MNO',
        description: 'Consultoria especializada para otimização de processos industriais e redução de custos operacionais.',
        image: 'project6.jpg'
      }
    ]
  });
});

module.exports = router;
