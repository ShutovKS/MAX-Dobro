# MAX Dobro Project

[Русский](./README.ru.md) | [English](./README.md)

<!-- Place a project logo or banner here -->
<p align="center">
  <img src="icon.png" alt="MAX Dobro Banner" width="160"/>
</p>

> A full-featured platform for volunteers and charitable organizations, built to gamify good deeds and
> build an active community.

<p align="center">
  <img src="https://img.shields.io/badge/backend-NestJS-red" alt="Backend: NestJS">
  <img src="https://img.shields.io/badge/frontend-React-blue" alt="Frontend: React">
  <img src="https://img.shields.io/badge/database-PostgreSQL-blue" alt="Database: PostgreSQL">
  <img src="https://img.shields.io/badge/auth-Supabase-green" alt="Auth: Supabase">
</p>

---

## 📖 Table of Contents

- [✨ About the project](#-about-the-project)
- [📸 Screenshots](#-screenshots)
- [🚀 Key features](#-key-features)
    - [For volunteers](#for-volunteers)
    - [For organizers](#for-organizers)
    - [General functions](#general-functions)
- [🛠️ Tech stack and architecture](#️-tech-stack-and-architecture)
    - [Architecture](#architecture)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Chat Bot](#chat-bot)
- [⚙️ Quick start](#️-quick-start)
    - [Requirements](#requirements)
    - [1. Cloning the repository](#1-cloning-the-repository)
    - [2. Environment configuration (.env)](#2-environment-configuration-env)
    - [3. Running with Docker Compose](#3-running-with-docker-compose)
    - [4. Migrations and database seeding](#4-migrations-and-database-seeding)
- [🚶‍♂️ User scenarios](#️-user-scenarios)
    - [Scenario 1: A new volunteer looks for their first event](#scenario-1-a-new-volunteer-looks-for-their-first-event)
    - [Scenario 2: An organizer creates and manages an event](#scenario-2-an-organizer-creates-and-manages-an-event)
- [👨‍💻 Developer guide](#-developer-guide)
    - [Project structure](#project-structure)
    - [Main scripts](#main-scripts)
    - [Testing](#testing)
- [☁️ Deployment](#️-deployment)
- [👥 Authors and contacts](#-authors-and-contacts)
- [📜 License](#-license)

---

## ✨ About the project

**MAX Dobro** is a web application built to bring together people who want to do good deeds and organizations
that need help. The platform is not only a bulletin board for volunteer events, but also adds gamification
and social-network elements to boost engagement.

**Key project goals:**

- **Simplify** the search for volunteer activities.
- **Motivate** users through a karma system, achievements, and rewards.
- **Educate** volunteers via built-in courses and tests.
- **Build a community** through stories, comments, and a friends system.
- **Provide** convenient tools for event organizers.

---

## 📸 Screenshots

*Place a few key screenshots of the app here to clearly show its interface.*

|      Home screen       |       Event details       |      User profile       |
|:------------------------:|:--------------------------:|:-------------------------:|
| ![](res/Home-screen.png) | ![](res/Event-details.png) | ![](res/User-profile.png) |

|      Rewards shop       |     Organizer panel      |        Achievements         |
|:-------------------------:|:----------------------------:|:-------------------------:|
| ![](res/Shop-rewards.jpg) | ![](res/Organizer-panel.png) | ![](res/Achievements.png) |

---

## 🚀 Key features

### For volunteers

- **Event feed and map:** Find events as a list or on an interactive map.
- **Gamification:**
    - **Karma points and good hours:** Earned for participating in events.
    - **Achievements ("achievs"):** Awarded for completing specific goals.
    - **Rewards shop:** Spend karma on virtual items.
    - **Weekly challenges:** Extra tasks for bonus rewards.
- **Learning:** Built-in courses with tests and the ability to earn a certificate.
- **Social features:**
    - **Stories feed:** Share impressions from events.
    - **Friends, likes, comments:** Interact with other volunteers.
- **Profile:** Track your progress, stats, achievements, and certificates.
- **Subscriptions:** Follow news from your favorite organizations.

### For organizers

- **Control panel:** A convenient interface for managing an organization's activities.
- **Event creation and management:** The full lifecycle from draft to publication.
- **Participant management:** Approve and reject volunteer applications.
- **Statistics:** Analytics on subscribers, events, and ratings.

### General functions

- **Authentication:** Seamless login via the MAX platform and standard registration via Supabase (email/password).
- **AI assistant:** A chatbot for quick navigation and information lookup.
- **Leaderboards:** Compete with other volunteers for the title of most active.

---

## 🛠️ Tech stack and architecture

### Architecture

The project is built on a microservice (in this case, service-oriented) architecture and consists of three
independent parts:

1. **Backend (API):** The core of the application, handling all business logic.
2. **Frontend (Mini App):** The client application the user interacts with.
3. **Chat Bot:** The entry point for users of the MAX platform.

*A simple architecture diagram can be inserted here.*

```

[User] <--> [MAX Platform] <--> [Chat Bot]
|
+-----> [Frontend (Mini App)] <--> [Backend API] <--> [PostgreSQL (Supabase)]
^
|
[Supabase Auth (Webhooks)]

```

### Backend

- **Framework:** **NestJS** (Node.js)
- **Language:** **TypeScript**
- **Database:** **PostgreSQL** (managed via **Supabase**)
- **ORM:** **Prisma**
- **Authentication:** **Supabase Auth** + **JWT** + **MAX Auth**
- **API:** **REST API** with **Swagger** documentation

### Frontend

- **Framework:** **React**
- **Bundler:** **Vite**
- **Language:** **TypeScript**
- **Styling:** **Tailwind CSS**
- **Maps:** **Leaflet** + **React Leaflet**

### Chat Bot

- **Platform:** **MAX Bot API**
- **Runtime:** **Node.js** + **TypeScript**

---

## ⚙️ Quick start

### Requirements

- **Docker** and **Docker Compose**
- **Node.js** (v20+) and **npm**
- **Git**

### 1. Cloning the repository

```bash
git clone https://github.com/ShutovKS/MAX-Dobro.git
cd MAX-Dobro
```

### 2. Environment configuration (.env)

Create `.env` files in each of the folders (`backend`, `frontend`, `chat-bot`) based on the `*.env.example` files.

#### `backend/.env` (detailed description)

* `PORT`: Port for the backend server. **3001** is the default value.
* `MAX_BOT_TOKEN`: Your bot token from the MAX platform. Required for MAX login validation.
* `MINI_APP_URL`: The URL of your deployed frontend application.
* `JWT_INTERNAL_SECRET`: Secret key for signing internal JWTs. Generate it with `openssl rand -base64 32`.
* `DATABASE_URL`: The connection string to your Supabase database (Project Settings -> Database -> Connection string ->
  URI). **Add `?pgbouncer=true` at the end for better performance.**
* `DIRECT_URL`: The same as `DATABASE_URL`.
* `SUPABASE_URL`: Your Supabase project URL (Project Settings -> API -> Project URL).
* `SUPABASE_ANON_KEY`: Supabase anonymous public key (Project Settings -> API -> Project API Keys).
* `SUPABASE_WEBHOOK_SECRET`: Any secret string you come up with. It must be specified in the webhook settings in Supabase (
  Database -> Webhooks).

#### `frontend/.env`

* `VITE_API_BASE_URL`: The URL of your local backend (e.g., `http://localhost:3001`).
* `VITE_API_MODE`: Set to `real` to work with the backend or `mock` to use mock data.
* `VITE_SUPABASE_URL`: Your Supabase project URL.
* `VITE_SUPABASE_ANON_KEY`: Supabase anonymous public key.

#### `chat-bot/.env`

* `BOT_TOKEN`: The bot token from the MAX platform.
* `BOT_NAME`: The bot's MAX username without the @.

### 3. Running with Docker Compose

This file launches all three services (without a local DB, since Supabase is used).

```bash
docker-compose up --build -d
```

- **Frontend** will be available at: `http://localhost:3000`
- **Backend API** will be available at: `http://localhost:3001`
- **Swagger Docs** will be available at: `http://localhost:3001/api/docs`

### 4. Migrations and database seeding

After the first launch of the containers, apply migrations and seed the database.

```bash
# Apply migrations to the Supabase database
docker-compose exec backend npm run migrate:dev

# (Optional) Seed the database with test data
docker-compose exec backend npm run seed
```

---

## 🚶‍♂️ User scenarios

### Scenario 1: A new volunteer looks for their first event

1. The user registers in the app via Supabase or logs in via MAX.
2. Goes through a short onboarding, selecting the directions of interest (e.g., "Ecology", "Animals").
3. On the home screen, sees a map with nearby events and an event feed.
4. Finds "Park cleanup", opens the details, reads the requirements.
5. Clicks "I'll help" and confirms participation.
6. After the event, leaves feedback and receives karma points, hours, and possibly their first achievement.

### Scenario 2: An organizer creates and manages an event

1. A user with the `organization` role logs in. They are redirected to the control panel.
2. Clicks "Create event" and fills in all fields: title, description, date, location, requirements.
3. Publishes the event. It appears in the common feed for volunteers.
4. In the "Event management" section, tracks new applications.
5. Reviews volunteer profiles and confirms their participation.
6. After the event is held, the event chat is archived, and participants automatically receive rewards.

---

## 👨‍💻 Developer guide

### Project structure

The project is divided into three main directories:

- `/backend`: NestJS application.
- `/frontend`: React (Vite) application.
- `/chat-bot`: Node.js application for the MAX bot.

### Main scripts

All commands are run from the root folder of the corresponding service (e.g., `cd backend`).

- `npm run start:dev`: Start the service in development mode with hot-reload.
- `npm run build`: Build the production version.
- `npm run lint`: Check the code with ESLint.
- `npm run format`: Format the code with Prettier.

---

## ☁️ Deployment

- **Backend:** Configured for deployment on **Vercel** (`vercel.json`).
- **Frontend:** Docker container with **Nginx** for serving static files.
- **Chat Bot:** Can be deployed on any Node.js hosting (e.g., Render, Vercel).

---

## 👥 Authors and contacts

*Provide information about yourself or the team here.*

- **Mikhail Danilov** - *Backend
  developer* - [GitHub](https://github.com/seaG7) | [Telegram](https://t.me/yamishadanilov)
- **Kirill Kornilov** - *Backend developer* - [GitHub](https://github.com/krl76) | [Telegram](https://t.me/krl76)
- **Kirill Shutov** - *Frontend developer* - [GitHub](https://github.com/ShutovKS) | [Telegram](https://t.me/ShutovKS)
