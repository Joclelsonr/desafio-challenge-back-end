# 🏥 Medical Appointment API

API REST desenvolvida para gerenciamento de agendamentos de consultas médicas. O sistema permite o cadastro de pacientes, médicos, gerenciamento de agendas complexas (com verificação de conflitos) e envio de e-mails de confirmação.

![NodeJS](https://img.shields.io/badge/Node.js-24-43853D?style=flat&logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-4.x-000000?style=flat&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)

# 📋 Sobre o Projeto

Este projeto foi desenvolvido como um desafio técnico para uma vaga Backend. O objetivo principal foi criar uma arquitetura robusta, desacoplada, sem depender excessivamente de frameworks opinados (como NestJS), mas aplicando os mesmos princípios de Injeção de Dependência e SOLID.

### Funcionalidades Principais

- **Pacientes**: Cadastro e perfil com histórico de consultas.

- **Médicos**: Cadastro e definição de preço da consulta.

- **Agenda**: Criação de horários de atendimento com validação de conflito (impede agendas sobrepostas).

- **Agendamento**: Marcação de consulta com validação de disponibilidade do médico e do paciente.

- **Cancelamento**: Permite cancelar consultas com antecedência mínima de 2 horas.

- **Notificações**: Envio de e-mail de confirmação (via SMTP fake/Mailhog).

## 🚀 Tecnologias e Ferramentas

- **Linguagem**: TypeScript

- **Framework**: Fastify

- **ORM**: Prisma

- **Validação**: Zod

- **Documentação**: Fastify Swagger (OpenAPI)

- **Testes de Email**: MailHog

## 🏗️ Arquitetura e Padrões de Projeto

O projeto segue os princípios da **Clean Architecture** e **SOLID**, organizado em camadas bem definidas:

```text
src/
  ├── config/ # Configurações de ambiente (Zod) e Swagger
  ├── controllers/ # Lidam com Request/Response
  ├── error/ # Classes de erros customizados (AppError) e Handler Global
  ├── factories/ # Composition Root (Injeção de Dependência)
  ├── interfaces/ # Contratos e Tipagens globais do sistema (DIP)
  ├── lib/ # Implementação concreta com Prisma
  ├── presenters/ # Formatação de dados para o cliente
  ├── repositories/ # Camada de Acesso a Dados (Gateway)
  ├── routes/ # Definição de endpoints
  ├── schemas/ # Schemas Zod para validação e documentação
  ├── services/ # Regras de Negócio puras (Use Cases)
  ├── utils/ # Formatadores e Helpers
  ├── app.ts # Configuração da instância do Fastify
  └── server.ts # Ponto de entrada (Entry Point)
```

### Decisões Técnicas

1. **Dependency Injection (DI)**: Implementada manualmente através de Factories e Constructor Injection. Isso desacopla o Service do Banco de Dados.

2. **Repository Pattern**: Abstrai a camada de dados. Permite trocar o Prisma por outro ORM ou Mock sem alterar a regra de negócio.

3. **Schema Segregation**: As validações Zod e configurações do Swagger ficam separadas dos Controllers e Rotas.

4. **Presenter Pattern**: Formata os dados de saída (ex: converter Decimal para R$ 100,00 ou formatar datas) apenas no momento da resposta, mantendo o Service limpo.

## 📦 Como Rodar

### Pré-requisitos

- Docker e Docker Compose instalados.

### Passo a Passo

1. **Clone o repositório**:

```bash
git clone https://github.com/Joclelsonr/desafio-challenge-back-end.git

cd desafio-challenge-back-end
```

2. **Suba os containers (App + Banco + Mailhog)**:

```bash
docker-compose up -d
```

_Aguarde alguns segundos para o banco de dados inicializar._

3. **Entre no Container**:

```bash
docker exec -it medical-api bash
```

4. **Execute as Migrations e Seeds (Popula o banco)**:

```bash
# Rodar migrations
npx prisma migrate dev

# Popular banco com dados de teste
npx prisma db seed

# Execute a aplicação
npm run docker:dev
```

5. **Acesse a Aplicação**:

- **API**: `http://localhost:3000`

- **Documentação Swagger**: `http://localhost:3000/docs`

- **Caixa de Entrada de Email (Mailhog)**: `http://localhost:8025`

## 📚 Documentação da API

A documentação é gerada automaticamente via Swagger.

Acesse **`http://localhost:3000/docs`** para ver todos os endpoints, testar requisições e ver os esquemas de entrada e saída.

### Endpoints Principais

| Método  | Rota                                  | Descrição                                |
| ------- | ------------------------------------- | ---------------------------------------- |
| `POST`  | `/patients`                           | Cria um paciente                         |
| `GET`   | `/patients/:patientId`                | Busca perfil e consultas do paciente     |
| `POST`  | `/doctors`                            | Cria um médico                           |
| `POST`  | `/doctors/:doctorId/schedule`         | Cria agenda de um médico (dias/horários) |
| `POST`  | `/appointments`                       | Realiza agendamento                      |
| `PATCH` | `/appointments/:appointmentId/cancel` | Cancela agendamento (Regra 2h)           |

## 🔎 Inspecionando os Dados (Prisma Studio)

Para visualizar, editar ou verificar os dados persistidos no banco de dados de forma gráfica (GUI), utilize o **Prisma Studio**. É uma ferramenta excelente para validar se os _Seeds_ foram aplicados corretamente ou para debugar criações de agendamentos.

1. **Abra um novo terminal e execute**:

```bash
   npx prisma studio
```

2. **Acesse no navegador**:

- **URL**: `http://localhost:5555`

Lá você terá acesso total às tabelas:

- `patients`

- `doctors`

- `doctor_schedules` (Verifique aqui os intervalos de horário criados)

- `appointments` (Verifique os status `SCHEDULED` ou `CANCELED`)

## 👨‍💻 Autor

Desenvolvido por [Joclelson Rodrigues](https://www.linkedin.com/in/joclelson-rodrigues).
