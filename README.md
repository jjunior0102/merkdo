# Merkdo - Mercadinho de Bairro 🛒

Sistema web full-stack desenvolvido para a disciplina de Programação Avançada do **IFES (Instituto Federal do Espírito Santo - Campus Alegre)**. O **Merkdo** atende ao Nicho 12 (Mercadinho de Bairro), oferecendo catálogo de produtos, controle de estoque mínimo, gestão de fornecedores e integração com WhatsApp.

## 👥 Integrantes da Dupla
- **José Junior** (Dono do Repositório GitHub e Deploy na Vercel)
- **Jonas Neto** (Desenvolvedor Colaborador)

---

## 🔗 Links do Projeto
- **Repositório GitHub:** [https://github.com/jjunior0102/merkdo](https://github.com/jjunior0102/merkdo)
- **Deploy na Vercel:** [https://merkdo.vercel.app](https://merkdo.vercel.app) *(substitua pelo seu link real da Vercel)*

---

## 🚀 O que o sistema faz
1. **Vitrine Pública (`/`):** Catálogo no estilo folheto digital com abas de filtro rápido por categorias (Hortifrúti, Açougue, Padaria, Mercearia, Adega, Limpeza) e badges dinâmicas de funcionamento ("Aberto hoje até as 21h").
2. **Busca por URL (`/busca?q=...`):** Sistema de pesquisa integrado via `SearchParams` com tratamento de resultados vazios.
3. **Área Administrativa Protegida (`/admin`):** Acesso restrito controlado por autenticação segura no servidor.
4. **CRUD Completo de Fornecedores e Produtos:** Operações de criação, listagem e exclusão via Server Actions do Next.js.
5. **Upload de Imagens Reais:** Integração com **Vercel Blob** para armazenamento de fotos de produtos (com limite de 2MB validado por Zod).
6. **Alerta de Estoque Mínimo:** Indicador visual automático no painel do lojista quando o estoque atual atinge ou fica abaixo do mínimo estipulado.
7. **Botão WhatsApp Nativo:** Chamadas de ação flutuantes e em cada produto gerando mensagens pré-formatadas para pedidos rápidos.

---

## 📊 Modelo ER do Banco de Dados (Prisma Schema)
O sistema utiliza PostgreSQL hospedado no **Neon** com as seguintes entidades relacionais:
- **User / Session / Account / Verification:** Tabelas de autenticação (Better Auth).
- **Fornecedor (1) ──── (N) Produto:** Relacionamento 1 para N onde um fornecedor fornece múltiplos produtos.
- **Produto:** Contém campos como `nome`, `categoria`, `preco`, `estoqueAtual`, `estoqueMinimo`, `imagemUrl` e `fornecedorId`.

---

## 🛠️ Instruções para Execução Local

Siga os passos abaixo para rodar o projeto na sua máquina:

1. Clone o repositório:
   ```bash
   git clone [https://github.com/jjunior0102/merkdo.git](https://github.com/jjunior0102/merkdo.git)
   cd merkdo