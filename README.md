# Merkdo - Sistema de Gestão e E-commerce para Mercadinhos 🛒
**Nicho:** Nicho 12 (Mercadinho de Bairro) · **Grupo:** Projeto Final
**Dupla:** José Junior (@jjunior0102) · Jonas Neto (@jonasneto245)
**Sistema no ar:** https://merkdo.vercel.app

## O que o sistema faz
O **Merkdo** é um sistema web *full-stack* de nível profissional (SaaS-grade) desenvolvido para gerir mercadinhos de bairro. Ele oferece:
1. **Vitrine Pública (`/`):** Catálogo interativo com grelha de produtos e pré-visualização de imagens, filtros por categoria com suporte a *Drag-to-Scroll* fluido, barra de pesquisa global em tempo real e um carrinho dinâmico lateral (*Sticky Bento Grid*) com fluxo de finalização de pedido integrado diretamente na plataforma.
2. **Área Administrativa Protegida (`/admin`):** Dashboard centralizado em *Bento Grid* com acesso rápido às operações críticas, navegação fluida estilo *Workspace* com suporte a *Breadcrumbs* e botão de retorno rápido à vitrine.
3. **CRUD Completo de Produtos e Fornecedores:** Criação, listagem, edição avançada e exclusão segura (com tratamento de restrições de chaves estrangeiras e produtos vinculados) com suporte a upload de ficheiros de imagem convertidos para base64.
4. **Fila de Pedidos em Tempo Real (`/admin/pedidos`):** Acompanhamento imediato das compras efetuadas pelos clientes, permitindo alternar status (Pendente / Concluído).
5. **Alerta de Estoque Mínimo:** Monitoramento automático de inventário para apoio direto ao lojista.

## Páginas para testar
- Pública: /
- Busca (exemplo que encontra algo): /?busca=Arroz
- Protegida (pede login): /admin

## Banco de dados
O banco de dados utiliza PostgreSQL hospedado no **Neon** com as seguintes tabelas e relações principais via **Prisma ORM**:
- **User / Session / Account:** Tabelas de autenticação (Better Auth) para controlo de acesso administrativo.
- **Fornecedor (1) ──── (N) Produto:** Relacionamento onde um fornecedor gere múltiplos produtos associados.
- **Produto:** Contém os campos `id`, `nome`, `categoria`, `preco`, `estoqueAtual`, `estoqueMinimo`, `imagemUrl` e `fornecedorId`.
- **Pedido:** Contém os campos `id`, `cliente`, `telefone`, `itens`, `total`, `status` e `createdAt`.

## Como rodar no computador
Siga os passos abaixo para rodar o projeto na sua máquina:

1. Clone o repositório:
   ```bash
   git clone [https://github.com/jjunior0102/merkdo.git](https://github.com/jjunior0102/merkdo.git)
   cd merkdo
Instale as dependências:

Bash
npm install
Configure as variáveis de ambiente (.env):
Crie um ficheiro .env na raiz do projeto e defina a string de conexão com o banco de dados PostgreSQL (DATABASE_URL) e as chaves de autenticação necessárias.

Execute a geração do Prisma e inicie o servidor de desenvolvimento:

Bash
npx prisma generate
npm run dev
Como usamos a IA
IA usada: Google Gemini (como colaborador pessoal de desenvolvimento e engenharia de front-end).

Os 3 pedidos (prompts) que mais ajudaram:

"Transforme o design de TODAS as páginas do sistema para que fiquem com um visual extremamente moderno, sofisticado e humano — seguindo a estética de produtos de tecnologia de ponta (como Linear, Vercel ou Stripe), adotando Bento Grid e Dark Mode."

"Adicione a funcionalidade de arrastar para rolar (Drag-to-Scroll) nas categorias da vitrine pública e remova a barra de rolagem visual mantendo a fluidez."

"Corrija o erro de restrição de chave estrangeira (Foreign Key Constraint) no botão de apagar fornecedor, verificando ou removendo os produtos vinculados antes da exclusão."

Um erro da IA que percebemos e como corrigimos (arquivo e o que mudou):

Arquivo: src/app/page.tsx

O que mudou: Inicialmente, a IA gerou a página da vitrine com renderização estática padrão do Next.js, fazendo com que os produtos recém-cadastrados no painel administrativo não aparecessem em tempo real. Corrigimos adicionando a diretiva export const dynamic = 'force-dynamic' no topo da página para forçar a busca dinâmica e atualizada diretamente da base de dados a cada acesso.

O que aprendemos:
Aprendemos a estruturar uma aplicação full-stack moderna utilizando Server Actions do Next.js 15, a integrar o Prisma ORM com PostgreSQL em ambiente de produção (Vercel), e a importância de aplicar conceitos de UI/UX avançados (Invisible UI, Bento Grid e microinterações) para transformar um CRUD comum em um software com aspeto de produto tecnológico de ponta.
