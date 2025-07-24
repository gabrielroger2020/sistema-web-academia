# Sistema de Acompanhamento de IMC - Teste Sooro by the Whey

Este é um projeto Full Stack desenvolvido como parte do teste técnico para Desenvolvedor Full Stack. O sistema web foi criado para uma academia que precisa acompanhar a evolução do Índice de Massa Corporal (IMC) de seus alunos, permitindo o cadastro de usuários (administradores, professores e alunos) e o registro de suas avaliações.

## Funcionalidades Principais

  - **Cadastro de Usuários**: O sistema permite o cadastro de usuários com três perfis distintos: Administrador, Professor e Aluno.
  - **Autenticação JWT**: Fluxo de autenticação completo com usuário e senha, utilizando JSON Web Token (JWT) para proteger as rotas da API.
  - **Gerenciamento de Usuários (Admin)**:
      - Administradores podem criar, editar e excluir outros usuários.
      - Permite ativar ou inativar usuários, controlando seu acesso ao sistema.
  - **Gerenciamento de Avaliações de IMC**:
      - Professores e Administradores podem cadastrar, editar e excluir avaliações de IMC para os alunos.
      - O IMC e sua classificação são calculados e armazenados automaticamente com base na altura e peso fornecidos.
  - **Sistema de Permissões (Regras de Negócio)**:
      - **Administrador**: Acesso total ao sistema, podendo visualizar e gerenciar todos os dados.
      - **Professor**: Gerencia apenas os alunos e as avaliações que ele mesmo criou.
      - **Aluno**: Acesso de somente leitura às suas próprias avaliações.
  - **Filtros de Consulta**: A tela de avaliações permite a filtragem por aluno ou professor.

## Tecnologias Utilizadas

O projeto foi construído seguindo a estrutura de monorepo, com o versionamento seguindo o padrão de Conventional Commits.

### Backend

  - **TypeScript**
  - **Node.js** com **Express.js**
  - **TypeORM** para o ORM e gerenciamento de Migrations
  - **SQLite** como banco de dados
  - **Zod** para validação de dados nos endpoints
  - **JSON Web Token (JWT)** para autenticação
  - **CORS** para permitir a comunicação com o frontend

### Frontend

  - **TypeScript**
  - **React** com **Next.js**
  - **Chakra UI** para a biblioteca de componentes
  - **TanStack Query (React Query)** para gerenciamento de estado assíncrono e cache
  - **React Hook Form** para construção de formulários
  - **Zod** para validação de schemas de formulário
  - **Axios** para as requisições à API

## Como Executar o Projeto

### Pré-requisitos

  - Node.js (v18 ou superior)
  - NPM ou Yarn

### 1\. Backend

Primeiro, configure e execute o servidor do backend.

```bash
# 1. Navegue até a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Rode as Migrations
# (Veja a seção abaixo para mais detalhes)
npm run typeorm -- -d src/shared/infra/typeorm/index.ts migration:run

# 4. Inicie o servidor em modo de desenvolvimento
npm run dev

# O servidor estará rodando em http://localhost:3333
```

### 2\. Frontend

Em um novo terminal, configure e execute a aplicação frontend.

```bash
# 1. Navegue até a pasta do frontend
cd web

# 2. Instale as dependências
npm install

# 3. Inicie a aplicação
npm run dev

# A aplicação estará disponível em http://localhost:3000
```

## Banco de Dados e Migrations

O projeto utiliza **SQLite**, então nenhuma configuração adicional de servidor de banco de dados é necessária. O arquivo `database.sqlite` será criado automaticamente na raiz da pasta `backend` na primeira vez que as migrations forem executadas.

  - **Onde estão localizadas as migrations?**
    Os arquivos de migration do TypeORM, que definem a estrutura do banco de dados, estão localizados em:
    `backend/src/shared/infra/typeorm/migrations`

  - **Como rodar as migrations?**
    Para criar as tabelas e popular o banco de dados com os dados iniciais, execute o seguinte comando na pasta `backend`:

    ```bash
    npm run typeorm -- -d src/shared/infra/typeorm/index.ts migration:run
    ```

## Credenciais de Acesso Inicial

A primeira migration do sistema cria automaticamente um usuário **Administrador** para permitir o primeiro acesso ao sistema.

  - **Usuário**: `admin`
  - **Senha**: `admin123`
