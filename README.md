# Lista Fácil — API

API backend da aplicação **Lista Fácil**. Implementada com NestJS + TypeScript e usando Prisma como ORM. Preparada para execução local (Docker + pnpm) e deploy (Zeabur, outros).

## Tecnologias

- Node.js, TypeScript
- Framework: NestJS
- ORM: Prisma (PostgreSQL)
- Banco: PostgreSQL (docker-compose disponível)
- Deploy: Zeabur (ex.: DATABASE_URL no ambiente)

---

## Como rodar localmente

1. Clone o repositório:

```bash
git clone https://github.com/FabioMiguelNascimento/lista-facil-backend.git
cd lista-facil-backend
```

2. Instale dependências:

```bash
pnpm install
```

3. Variáveis de ambiente

Crie um arquivo `.env` na raiz (exemplos já existem no repositório). variáveis importantes:

```env
PORT=8080
DATABASE_URL="postgresql://user:password@localhost:55432/lista_facil?schema=public"
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="sua-chave-secreta-aqui"
```

4. (Opcional) Inicie Postgres via Docker Compose:

```bash
docker-compose up -d --build
```

5. Rode migrações do Prisma e gere client:

```bash
pnpm exec prisma migrate dev --name init
pnpm exec prisma generate
```

6. Inicie a aplicação (desenvolvimento):

```bash
pnpm run start:dev
```

A API usa a variável `PORT` (padrão no `.env` deste projeto: `8080`) e habilita CORS apenas para `FRONTEND_URL`.

---

## Scripts principais

- `pnpm run start:dev` — iniciar em modo watch (desenvolvimento)
- `pnpm run start` — iniciar (Nest)
- `pnpm run build` — compilar para produção
- `pnpm run start:prod` — executar build compilado
- `pnpm run lint` / `pnpm run format` — lint/format

---

## Docker / Deploy

- `docker-compose.yml` inclui um container PostgreSQL usado em desenvolvimento.
- Para deploy em Zeabur: configure `DATABASE_URL` e `JWT_SECRET` nas variáveis de ambiente da plataforma; a aplicação lê `PORT` e `FRONTEND_URL` do ambiente.

---

## Observações úteis

- Prisma schema: `prisma/schema.prisma` (provider: postgresql).
- Endpoints e DTOs estão em `src/modules/*`.

---

Se quiser, eu atualizo também o README do frontend para alinhar instruções (já incluso neste repositório).
