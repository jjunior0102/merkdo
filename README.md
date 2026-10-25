# Merkdo - Sistema de Gestão e E-commerce para Mercadinhos 🛒

Sistema web *full-stack* de nível profissional (SaaS-grade), desenvolvido para a disciplina de Programação Avançada do **IFES (Instituto Federal do Espírito Santo - Campus Alegre)**. O **Merkdo** atende ao Nicho 12 (Mercadinho de Bairro), oferecendo uma experiência de e-commerce moderna com checkout direto e um painel administrativo completo inspirado em padrões de tecnologia de ponta (como Vercel e Linear).

## 👥 Integrantes da Dupla
- **José Junior** (Dono do Repositório GitHub e Deploy na Vercel)
- **Jonas Neto** (Desenvolvedor Colaborador)

---

## 🔗 Links do Projeto
- **Repositório GitHub:** [https://github.com/jjunior0102/merkdo](https://github.com/jjunior0102/merkdo)
- **Deploy na Vercel:** [https://merkdo.vercel.app](https://merkdo.vercel.app) 

---

## 🚀 O que o sistema faz
1. **Vitrine Pública do Cliente (`/`):** 
   - Catálogo interativo com grelha de produtos e pré-visualização de imagens.
   - Filtros por categoria com suporte a *Drag-to-Scroll* fluido.
   - Barra de pesquisa global em tempo real.
   - Carrinho dinâmico lateral (*Sticky Bento Grid*) com controlo de quantidade e fluxo de finalização de pedido integrado diretamente na plataforma (sem dependência de redirecionamentos externos).
2. **Área Administrativa Protegida (`/admin`):** 
   - Dashboard centralizado em *Bento Grid* com acesso rápido às operações críticas.
   - Navegação fluida estilo *Workspace* com suporte a *Breadcrumbs* e botão de retorno rápido à vitrine e à home.
3. **CRUD Completo de Produtos e Fornecedores:** 
   - Criação, listagem, edição avançada e exclusão segura (com tratamento de restrições de chaves estrangeiras e produtos vinculados).
   - Suporte a upload de ficheiros de imagem convertidos de forma otimizada para o banco de dados.
4. **Fila de Pedidos em Tempo Real (`/admin/pedidos`):** 
   - Acompanhamento imediato das compras efetuadas pelos clientes na vitrine, permitindo alternar status (Pendente / Concluído) e gerir o fluxo operacional do mercadinho.
5. **Alerta de Estoque Mínimo:** 
   - Monitoramento automático de inventário para apoio direto ao lojista.

---

## 🛠️ Tecnologias Utilizadas (Tech Stack)
- **Front-end & Framework:** Next.js 15+ (App Router), React, Tailwind CSS, Lucide Icons.
- **Back-end & Server Actions:** Next.js Server Actions para mutações de dados seguras no servidor.
- **Base de Dados & ORM:** PostgreSQL hospedado no **Neon** com **Prisma ORM**.
- **Autenticação:** Better Auth.
- **Deploy e Hospedagem:** Vercel (com ambiente de produção contínua integrado ao GitHub).

---

## 📊 Modelo ER do Banco de Dados (Prisma Schema)
O sistema utiliza as seguintes entidades relacionais principais:
- **User / Session / Account:** Tabelas de autenticação e controlo de acesso administrativo.
- **Fornecedor (1) ──── (N) Produto:** Relacionamento onde cada fornecedor gerencia múltiplos produtos associados.
- **Produto:** Contém atributos como `nome`, `categoria`, `preco`, `estoqueAtual`, `estoqueMinimo`, `imagemUrl` e `fornecedorId`.
- **Pedido:** Regista as compras efetuadas pelos clientes (`cliente`, `telefone`, `itens`, `total`, `status`, `createdAt`).

---

## 💻 Instruções para Execução Local

Siga os passos abaixo para rodar o projeto na sua máquina:

1. Clone o repositório:
   ```bash
   git clone [https://github.com/jjunior0102/merkdo.git](https://github.com/jjunior0102/merkdo.git)
   cd merkdo
