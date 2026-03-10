# Rick & Morty App

Aplicação fullstack desenvolvida como teste técnico. Permite explorar personagens da [Rick and Morty API](https://rickandmortyapi.com/), fazer login e salvar sua coleção pessoal de personagens.

## Sobre o projeto

O backend é uma API REST construída com **NestJS** que serve dois propósitos: autenticar usuários com JWT e fazer proxy das requisições para a API pública do Rick & Morty (evitando problemas de CORS no browser). Os dados dos usuários e personagens salvos ficam em um banco **SQLite** local.

O frontend é uma SPA em **React + TypeScript** com roteamento via React Router. Usuários não autenticados podem navegar e buscar personagens livremente. Após login, é possível salvar personagens na coleção pessoal, editar e excluir.

### Stack

| Camada         | Tecnologias                                     |
| -------------- | ----------------------------------------------- |
| Frontend       | React 19, TypeScript, Vite, React Router, Axios |
| Backend        | NestJS 11, TypeScript, Passport JWT, bcryptjs   |
| Banco de dados | SQLite via better-sqlite3                       |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior (testado no v24)
- npm v9 ou superior

---

## Instalação e execução

### 1. Clone o repositório

```bash
git clone https://github.com/t-arievilo/Teste-RickAndMorty.git
cd Teste-RickAndMorty
```

### 2. Configure as variáveis de ambiente do backend

Crie o arquivo `.env` na raiz do `/backend` e defina um valor para `JWT_SECRET`:

```dotenv
PORT=3001
JWT_SECRET=coloque_aqui_uma_chave_longa_e_aleatoria
```

> O `JWT_SECRET` é obrigatório. O backend não funciona corretamente sem ele.

### 3. Instale as dependências e rode o backend

```bash
# dentro da pasta backend/
npm install
npm run start:dev
```

O backend estará disponível em `http://localhost:3001/api`.

> Na primeira execução o `better-sqlite3` compila um binário nativo. Se travar com erro de `node-gyp` no Windows, rode `npm install --build-from-source`.

### 4. Abra um novo terminal e rode o frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (ou na próxima porta disponível caso já esteja em uso).

## Estrutura do projeto

```
Teste-RickAndMorty/
├── backend/
│   ├── src/
│   │   ├── auth/            # Registro, login, estratégia JWT
│   │   ├── characters/      # CRUD de personagens salvos
│   │   ├── integrations/    # Proxy para a API do Rick & Morty
│   │   ├── guards/          # JwtAuthGuard
│   │   ├── database/        # Conexão SQLite e criação das tabelas
│   │   ├── types.ts         # Interfaces e DTOs do backend
│   │   └── main.ts          # Bootstrap da aplicação
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/             # Funções de chamada HTTP (Axios)
    │   ├── components/      # Navbar, CardPersonagem, RotaPrivada
    │   ├── contexts/        # AuthContext + AuthProvider
    │   ├── pages/           # Home, Personagens, Detalhe, Login, MeusPersonagens
    │   └── types/           # Interfaces e tipos TypeScript
    └── package.json
```
