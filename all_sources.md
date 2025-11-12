Вот исходники проекта, ознакомься с ними


### .gitignore
```

.DS_Store


```


### README.md
```
# Mini-app-MAX-Good

```


### backend/.env.example
```
PORT=3000

# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.mvqcvuhuhngolsewmlob:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.mvqcvuhuhngolsewmlob:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

SUPABASE_URL="https://[YOUR-PROJECT-ID].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_WEBHOOK_SECRET="your-super-secret-string-here"

```


### backend/.github/workflows/run-tests.yml
```
name: Run Backend Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      # Запускаем контейнер с PostgreSQL для наших тестов
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: testdb
        ports:
          - 5432:5432 # Порт внутри контейнера
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run migrations on test database
        # Указываем переменные окружения для подключения к контейнеру
        env:
          DATABASE_URL: postgresql://testuser:testpassword@localhost:5432/testdb
        run: npx prisma migrate deploy

      - name: Run unit and integration tests
        env:
          DATABASE_URL: postgresql://testuser:testpassword@localhost:5432/testdb
        run: npm run test:e2e

```


### backend/.gitignore
```
# compiled output
/dist
/node_modules
/build

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# temp directory
.temp
.tmp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

/generated/prisma


```


### backend/.prettierrc
```
{
  "singleQuote": true,
  "trailingComma": "all"
}


```


### backend/all_sources.md
```
Вот исходники проекта, ознакомься с ними


### .env.example
```
PORT=3000

# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.mvqcvuhuhngolsewmlob:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.mvqcvuhuhngolsewmlob:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

SUPABASE_URL="https://[YOUR-PROJECT-ID].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_WEBHOOK_SECRET="your-super-secret-string-here"

```


### .gitignore
```
# compiled output
/dist
/node_modules
/build

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# temp directory
.temp
.tmp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

/generated/prisma


```


### .prettierrc
```
{
  "singleQuote": true,
  "trailingComma": "all"
}


```


### all_sources.md
```


```


### eslint.config.mjs
```
// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);


```


### get-token.html
```
<!DOCTYPE html>
<html>
<head>
  <title>Supabase Token Retriever</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <h1>Check the developer console for your JWT token.</h1>

  <script>
    // --- 1. Замени на свои значения ---
    const SUPABASE_URL = ''; // <-- Вставь свой URL из .env
    const SUPABASE_ANON_KEY = ''; // <-- Вставь свой ANON KEY из .env

    const userEmail = ''; // <-- Email твоего тестового пользователя
    const userPassword = ''; // <-- Пароль твоего тестового пользователя
    // ------------------------------------

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    async function getToken() {
      console.log('Attempting to sign in...');
      // Обращаемся к нашему созданному клиенту
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });

      if (error) {
        console.error('Sign-in failed:', error.message);
        return;
      }
      
      if (data.session) {
        console.log('✅ SUCCESS! Your JWT token is:');
        console.log(data.session.access_token);
        // Этот токен теперь можно скопировать и использовать в Swagger/Postman
      } else {
        console.error('Sign-in successful, but no session data received.');
      }
    }

    getToken();
  </script>
</body>
</html>

```


### nest-cli.json
```
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}


```


### package.json
```
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "scripts": {
    "postinstall": "dotenv -- prisma generate",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "dotenv -- nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "dotenv -- npx prisma generate",
    "seed": "dotenv -- npx prisma db seed",
    "migrate:dev": "dotenv -- npx prisma migrate dev",
    "migrate:dev:debug": "cross-env DEBUG=\"prisma:*\" npm run migrate:dev"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^11.0.1",
    "@nestjs/mapped-types": "^2.1.0",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/schedule": "^6.0.1",
    "@nestjs/swagger": "^11.2.1",
    "@prisma/client": "^6.19.0",
    "@supabase/supabase-js": "^2.80.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.2",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.18.0",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.1",
    "@types/express": "^5.0.0",
    "@types/jest": "^30.0.0",
    "@types/node": "^22.10.7",
    "@types/supertest": "^6.0.2",
    "cross-env": "^10.1.0",
    "dotenv-cli": "^11.0.0",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-prettier": "^5.2.2",
    "globals": "^16.0.0",
    "jest": "^30.0.0",
    "prettier": "^3.4.2",
    "prisma": "^6.19.0",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.20.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}


```


### prisma.config.ts
```
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env('DIRECT_URL'),
  },
});


```


### prisma/migrations/20251106224554_init/migration.sql
```
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supabase_user_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_participants" (
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_participants_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_supabase_user_id_key" ON "User"("supabase_user_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


```


### prisma/migrations/20251108170922_add_max_participants_to_event/migration.sql
```
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "maxParticipants" INTEGER;


```


### prisma/migrations/20251108173143_add_user_stats/migration.sql
```
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "karmaPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalHours" INTEGER NOT NULL DEFAULT 0;


```


### prisma/migrations/20251109120618_add_event_duration_and_status/migration.sql
```
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "durationHours" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PLANNED';


```


### prisma/migrations/migration_lock.toml
```
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"


```


### prisma/schema.prisma
```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Модель пользователя
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  totalHours  Int @default(0)
  karmaPoints Int @default(0)

  // Связи
  participations EventParticipant[]

  // Аутентификация через Supabase
  supabaseUserId String @unique @map("supabase_user_id") // ID из Supabase Auth
}

// Модель организации
model Organization {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Связи
  events Event[]
}

// Модель события (мероприятия)
model Event {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  date        DateTime
  location    String?
  maxParticipants Int?
  durationHours Int?
  status      String @default("PLANNED")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Связи
  organizationId Int
  organization   Organization       @relation(fields: [organizationId], references: [id])
  participants   EventParticipant[]

  @@map("events") // Явно указываем имя таблицы
}

// Связующая таблица для участников событий (многие-ко-многим)
model EventParticipant {
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  eventId   Int
  event     Event    @relation(fields: [eventId], references: [id])
  status    String   @default("pending") // e.g., pending, approved, rejected
  createdAt DateTime @default(now())

  @@id([userId, eventId]) // Составной первичный ключ
  @@map("event_participants")
}


```


### prisma/seed.ts
```
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Очистка
  console.log('Deleting old data...');
  await prisma.eventParticipant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // 2. Создание организации
  const org = await prisma.organization.create({
    data: { name: 'Тестовая Организация для Шедулера' },
  });

  // 3. Создание пользователя
  const user = await prisma.user.create({
    data: {
      email: 'scheduler-test@example.com',
      supabaseUserId: 'supabase-scheduler-test-id',
      name: 'Тестер Шедулера',
      totalHours: 0,
    },
  });

  // 4. Создание события, которое завершится через 15 секунд после старта приложения
  const eventDate = new Date();
  eventDate.setSeconds(eventDate.getSeconds() + 40);

  const eventToSchedule = await prisma.event.create({
    data: {
      title: 'Событие для теста шедулера',
      description: 'Должно завершиться через 15 секунд',
      date: eventDate,
      organizationId: org.id,
      durationHours: 0, // Завершится почти мгновенно после начала
      status: 'PLANNED',
    },
  });

  // 5. Регистрация пользователя на это событие
  await prisma.eventParticipant.create({
    data: {
      userId: user.id,
      eventId: eventToSchedule.id,
      status: 'approved',
    },
  });

  console.log(
    `Seeding finished. Event ${eventToSchedule.id} is set to start at ${eventDate.toISOString()}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```


### src/app.controller.spec.ts
```
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});


```


### src/app.controller.ts
```
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}


```


### src/app.module.ts
```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    EventsModule,
    PrismaModule,
    SupabaseModule,
    WebhooksModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```


### src/app.service.ts
```
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}


```


### src/auth/auth.module.ts
```
import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ProfileController } from './profile.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [ProfileController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}

```


### src/auth/auth.service.ts
```
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventEntity } from '../events/entities/event.entity';
import { PrismaService } from '../prisma/prisma.service';

interface SupabaseUserPayload {
  id: string;
  email?: string;
  raw_user_meta_data?: {
    name?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async createLocalUserAfterSignUp(payload: SupabaseUserPayload) {
    if (!payload.email) {
      throw new InternalServerErrorException('Email is required');
    }

    try {
      return await this.prisma.user.create({
        data: {
          supabaseUserId: payload.id,
          email: payload.email,
          name: payload.raw_user_meta_data?.name,
        },
      });
    } catch (error) {
      console.error('Error creating local user:', error);
      throw new InternalServerErrorException('Could not create local user.');
    }
  }

  async getUserEvents(userId: number, supabaseUserId: string) {
    return this.prisma.fromUser(supabaseUserId, async (prisma) => {
      const participations = await prisma.eventParticipant.findMany({
        where: { userId },
        include: {
          event: {
            include: {
              _count: {
                select: { participants: true },
              },
            },
          },
        },
        orderBy: {
          event: {
            date: 'asc',
          },
        },
      });

      const now = new Date();
      const upcoming: EventEntity[] = [];
      const past: EventEntity[] = [];

      for (const p of participations) {
        if (p.event.date >= now) {
          upcoming.push(p.event);
        } else {
          past.push(p.event);
        }
      }

      return { upcoming, past };
    });
  }
}

```


### src/auth/decorators/current-user.decorator.ts
```
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

```


### src/auth/entities/profile.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class ProfileEntity implements Omit<User, 'supabaseUserId'> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ default: 0 })
  totalHours: number;

  @ApiProperty({ default: 0 })
  karmaPoints: number;
}

```


### src/auth/entities/user-events.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { EventEntity } from '../../events/entities/event.entity';

export class UserEventsEntity {
    
    @ApiProperty({ type: [EventEntity] })
    upcoming: EventEntity[];

    @ApiProperty({ type: [EventEntity] })
    past: EventEntity[];
}

```


### src/auth/guards/auth.guard.ts
```
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const {
        data: { user: supabaseUser },
        error,
      } = await this.supabaseService.client.auth.getUser(token);

      if (error || !supabaseUser) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.prisma.user.findUnique({
        where: { supabaseUserId: supabaseUser.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found in local database');
      }

      request['user'] = user; // Прикрепляем нашего пользователя к запросу
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

```


### src/auth/guards/webhook.guard.ts
```
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const webhookSecret = this.configService.getOrThrow<string>(
      'SUPABASE_WEBHOOK_SECRET',
    );

    if (token !== webhookSecret) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

```


### src/auth/profile.controller.ts
```
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { ProfileEntity } from './entities/profile.entity';
import { UserEventsEntity } from './entities/user-events.entity';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user data with statistics.',
    type: ProfileEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMe(@CurrentUser() user: User): ProfileEntity {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { supabaseUserId, ...profile } = user;
    return profile;
  }

  @Get('me/events')
  @ApiOperation({ summary: "Get current user's events" })
  @ApiResponse({
    status: 200,
    description: 'Returns upcoming and past events for the current user.',
    type: UserEventsEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMyEvents(@CurrentUser() user: User) {
    return this.authService.getUserEvents(user.id, user.supabaseUserId);
  }
}

```


### src/events/dto/create-event.dto.ts
```
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Субботник в парке' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Убираем листья и сажаем деревья.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025-12-01T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Парк Горького, центральный вход' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of participants. If null, unlimited.',
    example: 50,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxParticipants?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  organizationId: number;
}

```


### src/events/dto/pagination-query.dto.ts
```
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

```


### src/events/dto/update-event.dto.ts
```
import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}

```


### src/events/entities/event-participant.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { EventParticipant } from '@prisma/client';

export class EventParticipantEntity implements EventParticipant {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  eventId: number;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty()
  createdAt: Date;
}

```


### src/events/entities/event.entity.ts
```
// src/events/entities/event.entity.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Event } from '@prisma/client';

// Вспомогательный класс для Swagger
class EventCount {
  @ApiProperty()
  participants: number;
}

export class EventEntity implements Event {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false, nullable: true })
  location: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Maximum number of participants. Null means unlimited.',
  })
  maxParticipants: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Duration of the event in hours.',
  })
  durationHours: number | null;

  @ApiProperty({
    description: 'Status of the event (e.g., PLANNED, COMPLETED)',
    example: 'PLANNED',
  })
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  organizationId: number;

  @ApiPropertyOptional({ type: EventCount })
  _count?: EventCount;
}

```


### src/events/events.controller.ts
```
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventParticipantEntity } from './entities/event-participant.entity';
import { EventEntity } from './entities/event.entity';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
    type: EventEntity,
  })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all events with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of events.',
    type: [EventEntity],
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.eventsService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single event by its ID' })
  @ApiParam({ name: 'id', required: true, description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'The event data.',
    type: EventEntity,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an event (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully updated.',
    type: EventEntity,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an event (admin only)' })
  @ApiResponse({
    status: 204,
    description: 'The event has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }

  @Post(':id/participate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Participate in an event' })
  @ApiResponse({
    status: 201,
    description: 'Successfully registered for the event.',
    type: EventParticipantEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({
    status: 409,
    description: 'User is already participating in this event.',
  })
  participate(
    @Param('id', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.participate(eventId, user.id);
  }

  @Delete(':id/participate')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel participation in an event' })
  @ApiResponse({
    status: 204,
    description: 'Successfully canceled participation.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Participation record not found.' })
  cancelParticipation(
    @Param('id', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.cancelParticipation(eventId, user.id);
  }

  @Patch(':eventId/participants/:userId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update participant status (organization admin only)' })
  updateParticipantStatus(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { status: string },
  ) {
    return this.eventsService.updateParticipantStatus(
      eventId,
      userId,
      body.status,
    );
  }
}

```


### src/events/events.module.ts
```
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { TasksModule } from '../tasks/tasks.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [AuthModule, SupabaseModule, TasksModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}

```


### src/events/events.service.ts
```
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateEventDto } from './dto/create-event.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}

  private readonly eventWithParticipantCount = {
    include: {
      _count: {
        select: { participants: true },
      },
    },
  };

  async create(createEventDto: CreateEventDto) {
    const newEvent = await this.prisma.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
        status: 'PLANNED',
      },
    });
    this.tasksService.scheduleEventCompletion(newEvent);

    return newEvent;
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    return this.prisma.event.findMany({
      skip,
      take: limit,
      orderBy: {
        date: 'asc',
      },
      ...this.eventWithParticipantCount,
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      ...this.eventWithParticipantCount,
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      return await this.prisma.event.update({
        where: { id },
        data: updateEventDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      throw error;
    }
  }

  async participate(eventId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: { _count: { select: { participants: true } } },
      });

      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }

      if (
        event.maxParticipants !== null &&
        event._count.participants >= event.maxParticipants
      ) {
        throw new ForbiddenException('No available spots for this event');
      }

      const existingParticipation = await tx.eventParticipant.findUnique({
        where: { userId_eventId: { userId, eventId } },
      });

      if (existingParticipation) {
        throw new ConflictException(
          'You are already participating in this event',
        );
      }

      return tx.eventParticipant.create({
        data: {
          eventId,
          userId,
        },
      });
    });
  }

  async cancelParticipation(eventId: number, userId: number) {
    try {
      await this.prisma.eventParticipant.delete({
        where: { userId_eventId: { userId, eventId } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Participation record not found for this user and event`,
        );
      }
      throw error;
    }
  }

  async updateParticipantStatus(
    eventId: number,
    userId: number,
    status: string,
  ) {
    try {
      return await this.prisma.eventParticipant.update({
        where: { userId_eventId: { userId, eventId } },
        data: { status },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Participation record not found for user ${userId} and event ${eventId}`,
        );
      }
      throw error;
    }
  }
}

```


### src/main.ts
```
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MAX Добро API')
    .setDescription('API для мини-приложения социальной направленности "MAX Добро"')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

```


### src/prisma/prisma.module.ts
```
import {Global, Module} from '@nestjs/common';
import {PrismaService} from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {
}

```


### src/prisma/prisma.service.spec.ts
```
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


```


### src/prisma/prisma.service.ts
```
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async fromUser<T>(
    supabaseUserId: string,
    callback: (prisma: PrismaClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (prisma) => {
      await prisma.$executeRaw`SELECT set_current_user_id(${supabaseUserId})`;
      return await callback(prisma as PrismaClient);
    });
  }
}

```


### src/supabase/supabase.module.ts
```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [ConfigModule],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}

```


### src/supabase/supabase.service.ts
```
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  public readonly client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient(
      this.configService.getOrThrow<string>('SUPABASE_URL'),
      this.configService.getOrThrow<string>('SUPABASE_ANON_KEY'),
    );
  }
}

```


### src/tasks/tasks.module.ts
```
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}

```


### src/tasks/tasks.service.ts
```
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Event } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    this.logger.log('Bootstrapping schedulers for existing events...');
    const eventsToSchedule = await this.prisma.event.findMany({
      where: {
        status: 'PLANNED',
      },
    });

    await Promise.all(
      eventsToSchedule.map((event) => this.scheduleEventCompletion(event)),
    );

    this.logger.log(
      `Bootstrap finished. Processed ${eventsToSchedule.length} PLANNED events.`,
    );
  }

  scheduleEventCompletion(event: Event) {
    if (event.durationHours === null) {
      return;
    }

    const jobName = `complete-event-${event.id}`;
    const now = new Date();
    const completionTime = new Date(
      event.date.getTime() + event.durationHours * 60 * 60 * 1000,
    );

    if (completionTime < now) {
      this.logger.warn(
        `Event ${event.id} completion time is in the past. Processing immediately.`,
      );
      this.handleEventCompletion(event.id);
      return;
    }

    const timeout = completionTime.getTime() - now.getTime();
    const callback = () => {
      this.handleEventCompletion(event.id);
      this.schedulerRegistry.deleteTimeout(jobName);
    };

    try {
      const MAX_TIMEOUT = 2147483647;
      if (timeout > MAX_TIMEOUT) {
        this.logger.warn(
          `Event ${event.id} is too far in the future to be scheduled with setTimeout. It will be picked up on next restart.`,
        );
        return;
      }
      this.schedulerRegistry.addTimeout(jobName, setTimeout(callback, timeout));
      this.logger.log(
        `Scheduled job for event ${event.id} to run at ${completionTime.toISOString()}`,
      );
    } catch (error) {
      if (error.message.includes('already exists')) {
        this.logger.warn(`Job ${jobName} already exists. Skipping.`);
      } else {
        throw error;
      }
    }
  }

  async handleEventCompletion(eventId: number) {
    this.logger.log(`Processing event completion for ID: ${eventId}`);

    try {
      await this.prisma.$transaction(async (tx) => {
        const event = await tx.event.findFirst({
          where: { id: eventId, status: 'PLANNED' },
          include: {
            participants: { where: { status: 'approved' } },
          },
        });

        if (!event || event.durationHours === null) {
          this.logger.warn(
            `Event ${eventId} not found or already processed. Skipping transaction.`,
          );
          return;
        }

        const userIds = event.participants.map((p) => p.userId);

        if (userIds.length > 0) {
          await tx.user.updateMany({
            where: { id: { in: userIds } },
            data: { totalHours: { increment: event.durationHours } },
          });
        }

        await tx.event.update({
          where: { id: eventId },
          data: { status: 'COMPLETED' },
        });

        this.logger.log(
          `Successfully processed event ${eventId} and awarded ${event.durationHours} hours to ${userIds.length} users.`,
        );
      });
    } catch (error) {
      this.logger.error(
        `Transaction failed for event ${eventId}: ${error.message}`,
      );
    }
  }
}

```


### src/users/users.module.ts
```
import { Module } from '@nestjs/common';

@Module({})
export class UsersModule {}


```


### src/webhooks/dto/supabase-payload.dto.ts
```
// Этот DTO описывает структуру данных, которую присылает вебхук Supabase
// при создании записи в таблице auth.users
export class SupabaseAuthPayloadDto {
  type: 'INSERT';
  table: 'users';
  record: {
    id: string;
    email?: string;
    raw_user_meta_data?: {
      name?: string;
    };
  };
}

```


### src/webhooks/webhooks.controller.ts
```
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { WebhookGuard } from '../auth/guards/webhook.guard';
import { SupabaseAuthPayloadDto } from './dto/supabase-payload.dto';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly authService: AuthService) {}

  @Post('supabase-auth')
  @UseGuards(WebhookGuard) // Защищаем эндпоинт нашим Guard'ом
  @HttpCode(200) // Отвечаем 200 OK, чтобы Supabase знал, что мы получили хук
  @ApiBearerAuth() // Указываем в Swagger, что нужен токен (наш секрет)
  @ApiOperation({ summary: 'Handles user creation webhook from Supabase' })
  async handleSupabaseAuthWebhook(
    @Body() payload: SupabaseAuthPayloadDto,
  ): Promise<{ received: boolean }> {
    // Мы реагируем только на событие создания нового пользователя
    if (payload.type === 'INSERT') {
      await this.authService.createLocalUserAfterSignUp(payload.record);
    }

    return { received: true };
  }
}

```


### src/webhooks/webhooks.module.ts
```
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WebhookGuard } from '../auth/guards/webhook.guard';
import { AuthService } from '../auth/auth.service';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [AuthModule],
  controllers: [WebhooksController],
  providers: [AuthService, WebhookGuard], // Регистрируем Guard и Service
})
export class WebhooksModule {}

```


### test/app.e2e-spec.ts
```
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});


```


### test/jest-e2e.json
```
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}


```


### tsconfig.build.json
```
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}


```


### tsconfig.json
```
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "resolvePackageJsonExports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "noFallthroughCasesInSwitch": false
  }
}


```




```


### backend/eslint.config.mjs
```
// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);


```


### backend/get-token.html
```
<!DOCTYPE html>
<html>
<head>
  <title>Supabase Token Retriever</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <h1>Check the developer console for your JWT token.</h1>

  <script>
    // --- 1. Замени на свои значения ---
    const SUPABASE_URL = ''; // <-- Вставь свой URL из .env
    const SUPABASE_ANON_KEY = ''; // <-- Вставь свой ANON KEY из .env

    const userEmail = ''; // <-- Email твоего тестового пользователя
    const userPassword = ''; // <-- Пароль твоего тестового пользователя
    // ------------------------------------

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    async function getToken() {
      console.log('Attempting to sign in...');
      // Обращаемся к нашему созданному клиенту
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });

      if (error) {
        console.error('Sign-in failed:', error.message);
        return;
      }
      
      if (data.session) {
        console.log('✅ SUCCESS! Your JWT token is:');
        console.log(data.session.access_token);
        // Этот токен теперь можно скопировать и использовать в Swagger/Postman
      } else {
        console.error('Sign-in successful, but no session data received.');
      }
    }

    getToken();
  </script>
</body>
</html>

```


### backend/nest-cli.json
```
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}


```


### backend/package.json
```
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "scripts": {
    "postinstall": "dotenv -- prisma generate",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "dotenv -- nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json --runInBand",
    "prisma:generate": "dotenv -- npx prisma generate",
    "seed": "dotenv -- npx prisma db seed",
    "migrate:dev": "dotenv -- npx prisma migrate dev",
    "migrate:dev:debug": "cross-env DEBUG=\"prisma:*\" npm run migrate:dev"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^11.0.1",
    "@nestjs/mapped-types": "^2.1.0",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/schedule": "^6.0.1",
    "@nestjs/swagger": "^11.2.1",
    "@prisma/client": "^6.19.0",
    "@supabase/supabase-js": "^2.80.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.2",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.18.0",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.1",
    "@types/express": "^5.0.0",
    "@types/jest": "^30.0.0",
    "@types/node": "^22.10.7",
    "@types/supertest": "^6.0.2",
    "cross-env": "^10.1.0",
    "dotenv-cli": "^11.0.0",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-prettier": "^5.2.2",
    "globals": "^16.0.0",
    "jest": "^30.0.0",
    "prettier": "^3.4.2",
    "prisma": "^6.19.0",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.20.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}


```


### backend/prisma.config.ts
```
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env('DIRECT_URL'),
  },
});


```


### backend/prisma/migrations/20251106224554_init/migration.sql
```
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supabase_user_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_participants" (
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_participants_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_supabase_user_id_key" ON "User"("supabase_user_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


```


### backend/prisma/migrations/20251108170922_add_max_participants_to_event/migration.sql
```
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "maxParticipants" INTEGER;


```


### backend/prisma/migrations/20251108173143_add_user_stats/migration.sql
```
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "karmaPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalHours" INTEGER NOT NULL DEFAULT 0;


```


### backend/prisma/migrations/20251109120618_add_event_duration_and_status/migration.sql
```
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "durationHours" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PLANNED';


```


### backend/prisma/migrations/20251110200919_add_achievements_system/migration.sql
```
-- CreateTable
CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "criteriaType" TEXT NOT NULL,
    "criteriaValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "userId" INTEGER NOT NULL,
    "achievementId" INTEGER NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("userId","achievementId")
);

-- CreateIndex
CREATE UNIQUE INDEX "achievements_name_key" ON "achievements"("name");

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


```


### backend/prisma/migrations/20251110211239_add_event_karma_points/migration.sql
```
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "karmaPoints" INTEGER NOT NULL DEFAULT 10;


```


### backend/prisma/migrations/20251110213937_add_learning_module/migration.sql
```
-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_answers" (
    "id" SERIAL NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_certificates" (
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_certificates_pkey" PRIMARY KEY ("userId","courseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_title_key" ON "courses"("title");

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_certificates" ADD CONSTRAINT "user_certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_certificates" ADD CONSTRAINT "user_certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


```


### backend/prisma/migrations/migration_lock.toml
```
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"


```


### backend/prisma/schema.prisma
```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Модель пользователя
model User {
  id             Int      @id @default(autoincrement())
  email          String   @unique
  name           String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  totalHours     Int      @default(0)
  karmaPoints    Int      @default(0)
  participations EventParticipant[]
  achievements   UserAchievement[]
  certificates   UserCertificate[]
  subscriptions  UserOrganizationSubscription[]

  supabaseUserId String @unique @map("supabase_user_id")
}

// Модель организации
model Organization {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  events      Event[]
  subscribers UserOrganizationSubscription[]
}

// Модель для подписок
model UserOrganizationSubscription {
  userId         Int
  user           User         @relation(fields: [userId], references: [id])
  organizationId Int
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime     @default(now())

  @@id([userId, organizationId])
  @@map("user_organization_subscriptions")
}

// Модель события (мероприятия)
model Event {
  id              Int      @id @default(autoincrement())
  title           String
  description     String
  date            DateTime
  location        String?
  maxParticipants Int?
  durationHours   Int?
  status          String   @default("PLANNED")
  karmaPoints     Int      @default(10)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  organizationId  Int
  organization    Organization       @relation(fields: [organizationId], references: [id])
  participants    EventParticipant[]

  @@map("events")
}

// Связующая таблица для участников событий (многие-ко-многим)
model EventParticipant {
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  eventId   Int
  event     Event    @relation(fields: [eventId], references: [id])
  status    String   @default("pending")
  createdAt DateTime @default(now())

  @@id([userId, eventId])
  @@map("event_participants")
}

// Модель достижения
model Achievement {
  id            Int               @id @default(autoincrement())
  name          String            @unique
  description   String
  icon          String?
  criteriaType  String
  criteriaValue Int
  createdAt     DateTime          @default(now())
  users         UserAchievement[]

  @@map("achievements")
}

// Связующая таблица для полученных пользователем достижений
model UserAchievement {
  userId        Int
  user          User        @relation(fields: [userId], references: [id])
  achievementId Int
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  unlockedAt    DateTime    @default(now())

  @@id([userId, achievementId])
  @@map("user_achievements")
}

model Course {
  id          Int      @id @default(autoincrement())
  title       String   @unique
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  lessons      Lesson[]
  certificates UserCertificate[]

  @@map("courses")
}

model Lesson {
  id        Int      @id @default(autoincrement())
  title     String
  content   String   @db.Text // Используем Text для длинного контента
  courseId  Int
  course    Course   @relation(fields: [courseId], references: [id])
  questions QuizQuestion[]

  @@map("lessons")
}

model QuizQuestion {
  id       Int    @id @default(autoincrement())
  question String
  lessonId Int
  lesson   Lesson @relation(fields: [lessonId], references: [id])
  answers  QuizAnswer[]

  @@map("quiz_questions")
}

model QuizAnswer {
  id         Int     @id @default(autoincrement())
  answer     String
  isCorrect  Boolean @default(false)
  questionId Int
  question   QuizQuestion @relation(fields: [questionId], references: [id])

  @@map("quiz_answers")
}

model UserCertificate {
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  courseId    Int
  course      Course   @relation(fields: [courseId], references: [id])
  completedAt DateTime @default(now())

  @@id([userId, courseId])
  @@map("user_certificates")
}

```


### backend/prisma/seed.ts
```
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_USER_SUPABASE_ID = '3eec394c-a786-44f6-b29d-3b201d540502';

async function main() {

  console.log('Start seeding...');

  // 1. Очистка
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.eventParticipant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organization.deleteMany();

  // 2. Создание или обновление тестового пользователя
  const user = await prisma.user.upsert({
    where: { supabaseUserId: TEST_USER_SUPABASE_ID },
    update: {
      totalHours: 0,
      karmaPoints: 0,
    },
    create: {
      email: 'test@example.com',
      supabaseUserId: TEST_USER_SUPABASE_ID,
      name: 'Реальный Тестер',
    },
  });

  // 3. Создание достижений
  await prisma.achievement.createMany({
    data: [
      {
        name: 'Новичок Добра',
        description: 'Провести 1 час, помогая другим.',
        criteriaType: 'TOTAL_HOURS',
        criteriaValue: 1,
      },
      {
        name: 'Опытный Волонтер',
        description: 'Накопить 10 часов добрых дел.',
        criteriaType: 'TOTAL_HOURS',
        criteriaValue: 10,
      },
    ],
  });

  // 4. Создание организации и "просроченного" события
  const org = await prisma.organization.create({
    data: { name: 'Организация для Теста Кармы' },
  });

  const pastEventDate = new Date();
  pastEventDate.setHours(pastEventDate.getHours() - 4);

  const event = await prisma.event.create({
    data: {
      title: 'Событие для Теста Кармы',
      description: 'Это событие уже должно было завершиться',
      date: pastEventDate,
      organizationId: org.id,
      durationHours: 1,
      karmaPoints: 100,
      status: 'PLANNED',
    },
  });

  // 5. Регистрация пользователя на это событие
  await prisma.eventParticipant.create({
    data: {
      userId: user.id,
      eventId: event.id,
      status: 'approved',
    },
  });

  console.log(
    'Seeding finished. A past event with karma has been created.',
  );

  // 6. Создание курсов
  console.log('Creating courses...');
  await prisma.course.create({
    data: {
      title: 'Основы Первой Помощи',
      description: 'Курс, который научит вас базовым действиям в экстренных ситуациях.',
      lessons: {
        create: [
          {
            title: 'Урок 1: Оценка ситуации',
            content: 'Первое, что нужно сделать - убедиться в собственной безопасности...',
            questions: {
              create: [
                {
                  question: 'Что является первым шагом при оказании первой помощи?',
                  answers: {
                    create: [
                      { answer: 'Начать сердечно-легочную реанимацию', isCorrect: false },
                      { answer: 'Убедиться в безопасности места происшествия', isCorrect: true },
                      { answer: 'Позвонить в скорую помощь', isCorrect: false },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('Courses created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```


### backend/src/achievements/achievements.controller.ts
```
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { AchievementEntity } from './dto/achievement.entity';

@ApiTags('Achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all possible achievements' })
  @ApiResponse({
    status: 200,
    description: 'List of all achievements.',
    type: [AchievementEntity],
  })
  findAll() {
    return this.achievementsService.findAll();
  }
}

```


### backend/src/achievements/achievements.module.ts
```
import { Module } from '@nestjs/common';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';

@Module({
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}

```


### backend/src/achievements/achievements.service.spec.ts
```
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AchievementsService } from './achievements.service';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
  achievement: {
    findMany: jest.fn(),
  },
  userAchievement: {
    createMany: jest.fn(),
  },
};

describe('AchievementsService', () => {
  let service: AchievementsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AchievementsService>(AchievementsService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  it('should award a new achievement if criteria are met', async () => {
    // 1. Arrange
    const userId = 1;
    const userWithNoAchievements = {
      id: userId,
      totalHours: 10,
      karmaPoints: 100,
      achievements: [],
    };
    const allAchievements = [
      { id: 1, criteriaType: 'TOTAL_HOURS', criteriaValue: 10 },
      { id: 2, criteriaType: 'KARMA_POINTS', criteriaValue: 500 },
    ];

    prisma.user.findUnique.mockResolvedValue(userWithNoAchievements);
    prisma.achievement.findMany.mockResolvedValue(allAchievements);

    // 2. Act
    await service.checkAndAwardAchievements(userId);

    // 3. Assert
    expect(prisma.userAchievement.createMany).toHaveBeenCalledWith({
      data: [{ userId, achievementId: 1 }],
    });
    expect(prisma.userAchievement.createMany).toHaveBeenCalledTimes(1);
  });

  it('should not award an achievement if user already has it', async () => {
    // 1. Arrange
    const userId = 1;
    const userWithOneAchievement = {
      id: userId,
      totalHours: 10,
      karmaPoints: 100,
      achievements: [{ userId: 1, achievementId: 1 }],
    };
    const allAchievements = [
      { id: 1, criteriaType: 'TOTAL_HOURS', criteriaValue: 10 },
    ];

    prisma.user.findUnique.mockResolvedValue(userWithOneAchievement);
    prisma.achievement.findMany.mockResolvedValue(allAchievements);

    // 2. Act
    await service.checkAndAwardAchievements(userId);

    // 3. Assert
    expect(prisma.userAchievement.createMany).not.toHaveBeenCalled();
  });

  it('should not award an achievement if criteria are not met', async () => {
    // 1. Arrange
    const userId = 1;
    const userWithLowStats = {
      id: userId,
      totalHours: 5,
      karmaPoints: 50,
      achievements: [],
    };
    const allAchievements = [
      { id: 1, criteriaType: 'TOTAL_HOURS', criteriaValue: 10 },
    ];

    prisma.user.findUnique.mockResolvedValue(userWithLowStats);
    prisma.achievement.findMany.mockResolvedValue(allAchievements);

    // 2. Act
    await service.checkAndAwardAchievements(userId);

    // 3. Assert
    expect(prisma.userAchievement.createMany).not.toHaveBeenCalled();
  });
});

```


### backend/src/achievements/achievements.service.ts
```
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.achievement.findMany();
  }

  async checkAndAwardAchievements(userId: number) {
    this.logger.log(`Checking achievements for user ID: ${userId}`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { achievements: true },
    });

    if (!user) {
      this.logger.warn(`User ${userId} not found, skipping achievement check.`);
      return;
    }

    const allAchievements = await this.findAll();
    const userAchievementIds = new Set(
      user.achievements.map((ua) => ua.achievementId),
    );

    const achievementsToAward: number[] = [];

    for (const achievement of allAchievements) {
      if (userAchievementIds.has(achievement.id)) {
        continue;
      }

      let unlocked = false;
      switch (achievement.criteriaType) {
        case 'TOTAL_HOURS':
          if (user.totalHours >= achievement.criteriaValue) {
            unlocked = true;
          }
          break;
        case 'KARMA_POINTS':
          if (user.karmaPoints >= achievement.criteriaValue) {
            unlocked = true;
          }
          break;
      }

      if (unlocked) {
        achievementsToAward.push(achievement.id);
      }
    }

    if (achievementsToAward.length > 0) {
      await this.prisma.userAchievement.createMany({
        data: achievementsToAward.map((achievementId) => ({
          userId,
          achievementId,
        })),
      });
      this.logger.log(
        `Awarded ${achievementsToAward.length} new achievements to user ${userId}.`,
      );
    }
  }
}

```


### backend/src/achievements/dto/achievement.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { Achievement } from '@prisma/client';

export class AchievementEntity implements Achievement {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false, nullable: true })
  icon: string | null;

  @ApiProperty()
  criteriaType: string;

  @ApiProperty()
  criteriaValue: number;

  @ApiProperty()
  createdAt: Date;
}

```


### backend/src/app.controller.spec.ts
```
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});


```


### backend/src/app.controller.ts
```
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}


```


### backend/src/app.module.ts
```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AchievementsModule } from './achievements/achievements.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { LearningModule } from './learning/learning.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    EventsModule,
    PrismaModule,
    SupabaseModule,
    WebhooksModule,
    TasksModule,
    AchievementsModule,
    LearningModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```


### backend/src/app.service.ts
```
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}


```


### backend/src/auth/auth.module.ts
```
import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ProfileController } from './profile.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [ProfileController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}

```


### backend/src/auth/auth.service.ts
```
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventEntity } from '../events/entities/event.entity';
import { PrismaService } from '../prisma/prisma.service';

interface SupabaseUserPayload {
  id: string;
  email?: string;
  raw_user_meta_data?: {
    name?: string;
  };
}
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });
  }

  calculateLevel(karmaPoints: number): string {
    if (karmaPoints <= 100) return 'Новичок';
    if (karmaPoints <= 500) return 'Активист';
    if (karmaPoints <= 1500) return 'Лидер';
    if (karmaPoints <= 5000) return 'Мастер';
    return 'Амбассадор';
  }

  async createLocalUserAfterSignUp(payload: SupabaseUserPayload) {
    if (!payload.email) {
      throw new InternalServerErrorException('Email is required');
    }

    try {
      return await this.prisma.user.create({
        data: {
          supabaseUserId: payload.id,
          email: payload.email,
          name: payload.raw_user_meta_data?.name,
        },
      });
    } catch (error) {
      console.error('Error creating local user:', error);
      throw new InternalServerErrorException('Could not create local user.');
    }
  }

  async getUserEvents(userId: number, supabaseUserId: string) {
    return this.prisma.fromUser(supabaseUserId, async (prisma) => {
      const participations = await prisma.eventParticipant.findMany({
        where: { userId },
        include: {
          event: {
            include: {
              _count: {
                select: { participants: true },
              },
            },
          },
        },
        orderBy: {
          event: {
            date: 'asc',
          },
        },
      });

      const now = new Date();
      const upcoming: EventEntity[] = [];
      const past: EventEntity[] = [];

      for (const p of participations) {
        if (p.event.date >= now) {
          upcoming.push(p.event);
        } else {
          past.push(p.event);
        }
      }

      return { upcoming, past };
    });
  }

   async getUserCertificates(userId: number) {
    return this.prisma.userCertificate.findMany({
      where: { userId },
      include: {
        course: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });
  }
}

```


### backend/src/auth/decorators/current-user.decorator.ts
```
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

```


### backend/src/auth/entities/profile.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserAchievementEntity } from './user-achievement.entity';

export class ProfileEntity implements Omit<User, 'supabaseUserId'> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ default: 0 })
  totalHours: number;

  @ApiProperty({ default: 0 })
  karmaPoints: number;

  @ApiProperty({ type: [UserAchievementEntity] })
  achievements: UserAchievementEntity[];

  @ApiProperty({ example: 'Новичок', description: 'User level name' })
  levelName: string;
}

```


### backend/src/auth/entities/user-achievement.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { UserAchievement } from '@prisma/client';
import { AchievementEntity } from '../../achievements/dto/achievement.entity';

export class UserAchievementEntity implements UserAchievement {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  achievementId: number;

  @ApiProperty()
  unlockedAt: Date;

  @ApiProperty({ type: () => AchievementEntity })
  achievement: AchievementEntity;
}

```


### backend/src/auth/entities/user-certificate.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { CourseEntity } from '../../learning/entities/course.entity';

export class UserCertificateEntity {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  courseId: number;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty({ type: () => CourseEntity })
  course: CourseEntity;
}

```


### backend/src/auth/entities/user-events.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { EventEntity } from '../../events/entities/event.entity';

export class UserEventsEntity {
    
    @ApiProperty({ type: [EventEntity] })
    upcoming: EventEntity[];

    @ApiProperty({ type: [EventEntity] })
    past: EventEntity[];
}

```


### backend/src/auth/guards/auth.guard.ts
```
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const {
        data: { user: supabaseUser },
        error,
      } = await this.supabaseService.client.auth.getUser(token);

      if (error || !supabaseUser) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.prisma.user.findUnique({
        where: { supabaseUserId: supabaseUser.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found in local database');
      }

      request['user'] = user; // Прикрепляем нашего пользователя к запросу
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    return true;
  }

  protected extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

```


### backend/src/auth/guards/webhook.guard.ts
```
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const webhookSecret = this.configService.getOrThrow<string>(
      'SUPABASE_WEBHOOK_SECRET',
    );

    if (token !== webhookSecret) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

```


### backend/src/auth/profile.controller.ts
```
import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { ProfileEntity } from './entities/profile.entity';
import { UserEventsEntity } from './entities/user-events.entity';
import { UserCertificateEntity } from './entities/user-certificate.entity';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile with achievements' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user data with statistics & achievements.',
    type: ProfileEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  async getMe(@CurrentUser() user: User): Promise<ProfileEntity> {
    const fullProfile = await this.authService.getProfile(user.id);

    if (!fullProfile) {
      throw new NotFoundException('User profile could not be found.');
    }
    const levelName = this.authService.calculateLevel(fullProfile.karmaPoints);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { supabaseUserId, ...profileData } = fullProfile;

    return { ...profileData, levelName };
  }

  @Get('me/events')
  @ApiOperation({ summary: "Get current user's events" })
  @ApiResponse({
    status: 200,
    description: 'Returns upcoming and past events for the current user.',
    type: UserEventsEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMyEvents(@CurrentUser() user: User) {
    return this.authService.getUserEvents(user.id, user.supabaseUserId);
  }

  @Get('me/certificates')
  @ApiOperation({ summary: "Get current user's certificates" })
  @ApiResponse({ status: 200, type: [UserCertificateEntity] })
  getMyCertificates(@CurrentUser() user: User) {
    return this.authService.getUserCertificates(user.id);
  }
}

```


### backend/src/events/dto/create-event.dto.ts
```
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Субботник в парке' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Убираем листья и сажаем деревья.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025-12-01T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Парк Горького, центральный вход' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of participants. If null, unlimited.',
    example: 50,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxParticipants?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  organizationId: number;
}

```


### backend/src/events/dto/pagination-query.dto.ts
```
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

```


### backend/src/events/dto/update-event.dto.ts
```
import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}

```


### backend/src/events/entities/event-participant.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { EventParticipant } from '@prisma/client';

export class EventParticipantEntity implements EventParticipant {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  eventId: number;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty()
  createdAt: Date;
}

```


### backend/src/events/entities/event.entity.ts
```
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Event } from '@prisma/client';

class EventCount {
  @ApiProperty()
  participants: number;
}

export class EventEntity implements Event {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false, nullable: true })
  location: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Maximum number of participants. Null means unlimited.',
  })
  maxParticipants: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Duration of the event in hours.',
  })
  durationHours: number | null;

  @ApiProperty({
    description: 'Status of the event (e.g., PLANNED, COMPLETED)',
    example: 'PLANNED',
  })
  status: string;

  @ApiProperty({
    description: 'Karma points awarded for completing the event.',
    default: 10,
  })
  karmaPoints: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  organizationId: number;

  @ApiPropertyOptional({ type: EventCount })
  _count?: EventCount;
}

```


### backend/src/events/events.controller.ts
```
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventParticipantEntity } from './entities/event-participant.entity';
import { EventEntity } from './entities/event.entity';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
    type: EventEntity,
  })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all events with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of events.',
    type: [EventEntity],
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.eventsService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single event by its ID' })
  @ApiParam({ name: 'id', required: true, description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'The event data.',
    type: EventEntity,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an event (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully updated.',
    type: EventEntity,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an event (admin only)' })
  @ApiResponse({
    status: 204,
    description: 'The event has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }

  @Post(':id/participate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Participate in an event' })
  @ApiResponse({
    status: 201,
    description: 'Successfully registered for the event.',
    type: EventParticipantEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({
    status: 409,
    description: 'User is already participating in this event.',
  })
  participate(
    @Param('id', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.participate(eventId, user.id);
  }

  @Delete(':id/participate')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel participation in an event' })
  @ApiResponse({
    status: 204,
    description: 'Successfully canceled participation.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Participation record not found.' })
  cancelParticipation(
    @Param('id', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.cancelParticipation(eventId, user.id);
  }

  @Patch(':eventId/participants/:userId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update participant status (organization admin only)' })
  updateParticipantStatus(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { status: string },
  ) {
    return this.eventsService.updateParticipantStatus(
      eventId,
      userId,
      body.status,
    );
  }
}

```


### backend/src/events/events.module.ts
```
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { TasksModule } from '../tasks/tasks.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [AuthModule, SupabaseModule, TasksModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}

```


### backend/src/events/events.service.ts
```
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateEventDto } from './dto/create-event.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}

  private readonly eventWithParticipantCount = {
    include: {
      _count: {
        select: { participants: true },
      },
    },
  };

  async create(createEventDto: CreateEventDto) {
    const newEvent = await this.prisma.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
        status: 'PLANNED',
      },
    });
    this.tasksService.scheduleEventCompletion(newEvent);

    return newEvent;
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    return this.prisma.event.findMany({
      skip,
      take: limit,
      orderBy: {
        date: 'asc',
      },
      ...this.eventWithParticipantCount,
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      ...this.eventWithParticipantCount,
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      return await this.prisma.event.update({
        where: { id },
        data: updateEventDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      throw error;
    }
  }

  async participate(eventId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: { _count: { select: { participants: true } } },
      });

      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }

      if (
        event.maxParticipants !== null &&
        event._count.participants >= event.maxParticipants
      ) {
        throw new ForbiddenException('No available spots for this event');
      }

      const existingParticipation = await tx.eventParticipant.findUnique({
        where: { userId_eventId: { userId, eventId } },
      });

      if (existingParticipation) {
        throw new ConflictException(
          'You are already participating in this event',
        );
      }

      return tx.eventParticipant.create({
        data: {
          eventId,
          userId,
        },
      });
    });
  }

  async cancelParticipation(eventId: number, userId: number) {
    try {
      await this.prisma.eventParticipant.delete({
        where: { userId_eventId: { userId, eventId } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Participation record not found for this user and event`,
        );
      }
      throw error;
    }
  }

  async updateParticipantStatus(
    eventId: number,
    userId: number,
    status: string,
  ) {
    try {
      return await this.prisma.eventParticipant.update({
        where: { userId_eventId: { userId, eventId } },
        data: { status },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Participation record not found for user ${userId} and event ${eventId}`,
        );
      }
      throw error;
    }
  }
}

```


### backend/src/learning/dto/complete-course.dto.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';

class UserAnswerDto {
  @ApiProperty()
  @IsInt()
  questionId: number;

  @ApiProperty()
  @IsInt()
  answerId: number;
}

export class CompleteCourseDto {
  @ApiProperty({ type: [UserAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAnswerDto)
  answers: UserAnswerDto[];
}

```


### backend/src/learning/entities/course.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { LessonEntity } from './lesson.entity';

export class CourseEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [LessonEntity] })
  lessons: LessonEntity[];
}

```


### backend/src/learning/entities/lesson.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { QuizQuestionEntity } from './quiz-question.entity';

export class LessonEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: [QuizQuestionEntity] })
  questions: QuizQuestionEntity[];
}

```


### backend/src/learning/entities/quiz-answer.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';

export class QuizAnswerEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  answer: string;
}

```


### backend/src/learning/entities/quiz-question.entity.ts
```
import { ApiProperty } from '@nestjs/swagger';
import { QuizAnswerEntity } from './quiz-answer.entity';

export class QuizQuestionEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  question: string;

  @ApiProperty({ type: [QuizAnswerEntity] })
  answers: QuizAnswerEntity[];
}

```


### backend/src/learning/learning.controller.ts
```
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CompleteCourseDto } from './dto/complete-course.dto';
import { CourseEntity } from './entities/course.entity';
import { LearningService } from './learning.service';

@ApiTags('Learning')
@Controller('courses')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all courses' })
  @ApiResponse({ status: 200, type: [CourseEntity] })
  findAll() {
    return this.learningService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single course with lessons and questions' })
  @ApiResponse({ status: 200, type: CourseEntity })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.learningService.findOne(id);
  }

  @Post(':id/complete')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete a course by submitting quiz answers' })
  @ApiResponse({ status: 201, description: 'Course completed successfully' })
  @ApiResponse({ status: 400, description: 'Quiz failed' })
  @ApiResponse({ status: 409, description: 'Course already completed' })
  completeCourse(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() completionDto: CompleteCourseDto,
  ) {
    return this.learningService.completeCourse(user.id, id, completionDto);
  }
}

```


### backend/src/learning/learning.module.ts
```
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';

@Module({
  imports: [
    AuthModule,
    SupabaseModule,
  ],
  controllers: [LearningController],
  providers: [LearningService],
})
export class LearningModule {}

```


### backend/src/learning/learning.service.ts
```
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteCourseDto } from './dto/complete-course.dto';

@Injectable()
export class LearningService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.course.findMany();
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          include: {
            questions: {
              include: {
                answers: {
                  select: { id: true, answer: true },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async completeCourse(
    userId: number,
    courseId: number,
    completionDto: CompleteCourseDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: { lessons: { include: { questions: true } } },
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      const existingCertificate = await tx.userCertificate.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (existingCertificate) {
        throw new ConflictException('You have already completed this course.');
      }

      const totalQuestions = course.lessons.reduce(
        (acc, lesson) => acc + lesson.questions.length,
        0,
      );

      const questionIds = course.lessons.flatMap((l) =>
        l.questions.map((q) => q.id),
      );

      const correctAnswers = await tx.quizAnswer.findMany({
        where: { questionId: { in: questionIds }, isCorrect: true },
      });

      const correctAnswersMap = new Map(
        correctAnswers.map((a) => [a.questionId, a.id]),
      );

      let userCorrectAnswers = 0;
      for (const userAnswer of completionDto.answers) {
        if (
          correctAnswersMap.get(userAnswer.questionId) === userAnswer.answerId
        ) {
          userCorrectAnswers++;
        }
      }

      if (userCorrectAnswers !== totalQuestions) {
        throw new BadRequestException('Quiz failed. Please try again.');
      }

      return tx.userCertificate.create({
        data: { userId, courseId },
      });
    });
  }
}

```


### backend/src/main.ts
```
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MAX Добро API')
    .setDescription('API для мини-приложения социальной направленности "MAX Добро"')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

```


### backend/src/prisma/prisma.module.ts
```
import {Global, Module} from '@nestjs/common';
import {PrismaService} from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {
}

```


### backend/src/prisma/prisma.service.spec.ts
```
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


```


### backend/src/prisma/prisma.service.ts
```
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async fromUser<T>(
    supabaseUserId: string,
    callback: (prisma: PrismaClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (prisma) => {
      await prisma.$executeRaw`SELECT set_current_user_id(${supabaseUserId})`;
      return await callback(prisma as PrismaClient);
    });
  }
}

```


### backend/src/supabase/supabase.module.ts
```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [ConfigModule],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}

```


### backend/src/supabase/supabase.service.ts
```
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  public readonly client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient(
      this.configService.getOrThrow<string>('SUPABASE_URL'),
      this.configService.getOrThrow<string>('SUPABASE_ANON_KEY'),
    );
  }
}

```


### backend/src/tasks/tasks.module.ts
```
import { Module } from '@nestjs/common';
import { AchievementsModule } from '../achievements/achievements.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [AchievementsModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}

```


### backend/src/tasks/tasks.service.ts
```
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Event } from '@prisma/client';
import { AchievementsService } from '../achievements/achievements.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly achievementsService: AchievementsService,
  ) {}

  async onModuleInit() {
    this.logger.log('Bootstrapping schedulers for existing events...');
    const eventsToSchedule = await this.prisma.event.findMany({
      where: {
        status: 'PLANNED',
      },
    });

    for (const event of eventsToSchedule) {
      this.scheduleEventCompletion(event);
    }

    this.logger.log(
      `Bootstrap finished. Processed ${eventsToSchedule.length} PLANNED events.`,
    );
  }

  scheduleEventCompletion(event: Event) {
    if (event.durationHours === null) {
      return;
    }

    const jobName = `complete-event-${event.id}`;
    const now = new Date();
    const completionTime = new Date(
      event.date.getTime() + event.durationHours * 60 * 60 * 1000,
    );

    if (completionTime <= now) {
      this.logger.warn(
        `Event ${event.id} completion time is in the past. Processing immediately.`,
      );
      setTimeout(() => this.handleEventCompletion(event.id), 0);
      return;
    }

    const timeout = completionTime.getTime() - now.getTime();
    const callback = () => {
      this.handleEventCompletion(event.id);
      this.schedulerRegistry.deleteTimeout(jobName);
    };

    try {
      const MAX_TIMEOUT = 2147483647;
      if (timeout > MAX_TIMEOUT) {
        this.logger.warn(
          `Event ${event.id} is too far in the future to be scheduled. It will be picked up on next restart.`,
        );
        return;
      }
      if (this.schedulerRegistry.doesExist('timeout', jobName)) {
        this.schedulerRegistry.deleteTimeout(jobName);
      }
      this.schedulerRegistry.addTimeout(jobName, setTimeout(callback, timeout));
      this.logger.log(
        `Scheduled job for event ${event.id} to run at ${completionTime.toISOString()}`,
      );
    } catch (error) {
      this.logger.error(`Failed to schedule job ${jobName}: ${error.message}`);
    }
  }

  async handleEventCompletion(eventId: number) {
    this.logger.log(`Processing event completion for ID: ${eventId}`);

    try {
      const completedEvent = await this.prisma.$transaction(async (tx) => {
        const event = await tx.event.findFirst({
          where: { id: eventId, status: 'PLANNED' },
          include: {
            participants: { where: { status: 'approved' } },
          },
        });

        if (!event || event.durationHours === null) {
          this.logger.warn(
            `Event ${eventId} not found or already processed. Skipping transaction.`,
          );
          return null;
        }

        const userIds = event.participants.map((p) => p.userId);

        if (userIds.length > 0) {
          // --- ИЗМЕНЕНИЕ: Начисляем часы И карму ---
          await tx.user.updateMany({
            where: { id: { in: userIds } },
            data: {
              totalHours: { increment: event.durationHours },
              karmaPoints: { increment: event.karmaPoints },
            },
          });
        }

        await tx.event.update({
          where: { id: eventId },
          data: { status: 'COMPLETED' },
        });

        this.logger.log(
          `Successfully processed event ${eventId}. Awarded ${event.durationHours} hours and ${event.karmaPoints} karma to ${userIds.length} users.`,
        );
        return { userIds };
      });

      if (completedEvent?.userIds) {
        this.logger.log(
          `Triggering achievement checks for ${completedEvent.userIds.length} users.`,
        );
        for (const userId of completedEvent.userIds) {
          try {
            await this.achievementsService.checkAndAwardAchievements(userId);
          } catch (e) {
            this.logger.error(
              `Failed to check achievements for user ${userId}: ${e.message}`,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `Transaction failed for event ${eventId}: ${error.message}`,
      );
    }
  }
}

```


### backend/src/users/users.module.ts
```
import { Module } from '@nestjs/common';

@Module({})
export class UsersModule {}


```


### backend/src/webhooks/dto/supabase-payload.dto.ts
```
// Этот DTO описывает структуру данных, которую присылает вебхук Supabase
// при создании записи в таблице auth.users
export class SupabaseAuthPayloadDto {
  type: 'INSERT';
  table: 'users';
  record: {
    id: string;
    email?: string;
    raw_user_meta_data?: {
      name?: string;
    };
  };
}

```


### backend/src/webhooks/webhooks.controller.ts
```
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { WebhookGuard } from '../auth/guards/webhook.guard';
import { SupabaseAuthPayloadDto } from './dto/supabase-payload.dto';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly authService: AuthService) {}

  @Post('supabase-auth')
  @UseGuards(WebhookGuard) // Защищаем эндпоинт нашим Guard'ом
  @HttpCode(200) // Отвечаем 200 OK, чтобы Supabase знал, что мы получили хук
  @ApiBearerAuth() // Указываем в Swagger, что нужен токен (наш секрет)
  @ApiOperation({ summary: 'Handles user creation webhook from Supabase' })
  async handleSupabaseAuthWebhook(
    @Body() payload: SupabaseAuthPayloadDto,
  ): Promise<{ received: boolean }> {
    // Мы реагируем только на событие создания нового пользователя
    if (payload.type === 'INSERT') {
      await this.authService.createLocalUserAfterSignUp(payload.record);
    }

    return { received: true };
  }
}

```


### backend/src/webhooks/webhooks.module.ts
```
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WebhookGuard } from '../auth/guards/webhook.guard';
import { AuthService } from '../auth/auth.service';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [AuthModule],
  controllers: [WebhooksController],
  providers: [AuthService, WebhookGuard], // Регистрируем Guard и Service
})
export class WebhooksModule {}

```


### backend/test/auth.e2e-spec.ts
```
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('should return 401 Unauthorized for a protected route without a token', () => {
    return request(app.getHttpServer()).get('/profile/me').expect(401);
  });

  it('should return 401 Unauthorized for a protected route with an invalid token', () => {
    return request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });
});

```


### backend/test/docker-compose.yml
```
version: '3.8'

services:
  test-db:
    image: postgres:15
    container_name: max-dobro-test-db
    restart: always
    environment:
      POSTGRES_USER: testuser
      POSTGRES_PASSWORD: testpassword
      POSTGRES_DB: testdb
    ports:
      - '5433:5432'
    volumes:
      - test-db-volume:/var/lib/postgresql/data

volumes:
  test-db-volume:

```


### backend/test/dotenv-config.js
```
require('dotenv').config({ path: './test/.env' });

```


### backend/test/events.e2e-spec.ts
```
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { TasksService } from '../src/tasks/tasks.service';

describe('Events (e2e)', () => {
  let app: INestApplication;
  let tasksService: TasksService;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  const mockUser: Omit<User, 'createdAt' | 'updatedAt'> = {
    id: 10,
    supabaseUserId: 'test-supabase-id-events',
    email: 'events-test@example.com',
    name: 'Events Tester',
    totalHours: 0,
    karmaPoints: 0,
  };

  const mockAuthGuard = {
    canActivate: (context: any) => {
      const request = context.switchToHttp().getRequest();
      request.user = mockUser;
      return true;
    },
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    tasksService = app.get(TasksService);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  beforeEach(async () => {
    await prisma.userOrganizationSubscription.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.userCertificate.deleteMany();
    await prisma.eventParticipant.deleteMany();
    await prisma.quizAnswer.deleteMany();
    await prisma.quizQuestion.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.course.deleteMany();
    await prisma.event.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.user.deleteMany();
    await prisma.user.create({ data: mockUser as User });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  describe('/events/:id/participate (POST)', () => {
    it('should allow a user to participate in an event', async () => {
      const org = await prisma.organization.create({ data: { name: 'Org' } });
      const event = await prisma.event.create({
        data: {
          title: 'Event 1',
          description: 'Desc',
          date: new Date(),
          organizationId: org.id,
        },
      });

      await request(app.getHttpServer())
        .post(`/events/${event.id}/participate`)
        .expect(201);

      const participation = await prisma.eventParticipant.findFirst();
      expect(participation).not.toBeNull();
      expect(participation?.userId).toBe(mockUser.id);
      expect(participation?.eventId).toBe(event.id);
    });

    it('should return 409 Conflict if user is already participating', async () => {
      const org = await prisma.organization.create({ data: { name: 'Org' } });
      const event = await prisma.event.create({
        data: {
          title: 'Event 2',
          description: 'Desc',
          date: new Date(),
          organizationId: org.id,
        },
      });
      await prisma.eventParticipant.create({
        data: { eventId: event.id, userId: mockUser.id },
      });

      await request(app.getHttpServer())
        .post(`/events/${event.id}/participate`)
        .expect(409);
    });
  });
});

```


### backend/test/general.e2e-spec.ts
```
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('General Endpoints (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  describe('/events', () => {
    it('GET /events/:id with non-numeric id should return 400', () => {
      return request(app.getHttpServer()).get('/events/abc').expect(400);
    });

    it('GET /events/:id with non-existent id should return 404', () => {
      return request(app.getHttpServer()).get('/events/999999').expect(404);
    });
  });

  describe('/courses', () => {
    it('GET /courses/:id with non-existent id should return 404', () => {
      return request(app.getHttpServer()).get('/courses/999999').expect(404);
    });
  });
});

```


### backend/test/jest-e2e.json
```
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "globalSetup": "./global-setup.ts",
  "globalTeardown": "./global-teardown.ts",
  "setupFiles": ["./dotenv-config.js"]
}

```


### backend/test/learning.e2e-spec.ts
```
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';

describe('Learning (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  const mockUser: Omit<User, 'createdAt' | 'updatedAt'> = {
    id: 2,
    supabaseUserId: 'test-supabase-id-learning',
    email: 'learning-test@example.com',
    name: 'Learning Tester',
    totalHours: 0,
    karmaPoints: 0,
  };

  const mockAuthGuard = {
    canActivate: (context: any) => {
      const request = context.switchToHttp().getRequest();
      request.user = mockUser;
      return true;
    },
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  beforeEach(async () => {
    await prisma.userCertificate.deleteMany();
    await prisma.quizAnswer.deleteMany();
    await prisma.quizQuestion.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.course.deleteMany();
    await prisma.eventParticipant.deleteMany();
    await prisma.user.deleteMany();
    await prisma.user.create({ data: mockUser as User });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  describe('/courses/:id/complete (POST)', () => {
    it('should successfully complete a course with correct answers', async () => {
      const course = await prisma.course.create({
        data: {
          title: 'Test Course',
          description: 'Desc',
          lessons: {
            create: {
              title: 'Lesson 1',
              content: 'Content',
              questions: {
                create: {
                  question: 'Q1',
                  answers: {
                    create: [
                      { answer: 'Wrong', isCorrect: false },
                      { answer: 'Correct', isCorrect: true },
                    ],
                  },
                },
              },
            },
          },
        },
        include: {
          lessons: { include: { questions: { include: { answers: true } } } },
        },
      });

      const questionId = course.lessons[0].questions[0].id;
      const correctAnswerId = course.lessons[0].questions[0].answers.find(
        (a) => a.isCorrect,
      )!.id;

      await request(app.getHttpServer())
        .post(`/courses/${course.id}/complete`)
        .send({ answers: [{ questionId, answerId: correctAnswerId }] })
        .expect(201);

      const certificate = await prisma.userCertificate.findFirst();
      expect(certificate).not.toBeNull();
      expect(certificate?.userId).toBe(mockUser.id);
    });

    it('should return 400 Bad Request for incorrect answers', async () => {
      const course = await prisma.course.create({
        data: {
          title: 'Test Course 2',
          description: 'Desc',
          lessons: {
            create: {
              title: 'Lesson 1',
              content: 'Content',
              questions: {
                create: {
                  question: 'Q1',
                  answers: {
                    create: [
                      { answer: 'Wrong', isCorrect: false },
                      { answer: 'Correct', isCorrect: true },
                    ],
                  },
                },
              },
            },
          },
        },
        include: {
          lessons: { include: { questions: { include: { answers: true } } } },
        },
      });

      const questionId = course.lessons[0].questions[0].id;
      const wrongAnswerId = course.lessons[0].questions[0].answers.find(
        (a) => !a.isCorrect,
      )!.id;

      await request(app.getHttpServer())
        .post(`/courses/${course.id}/complete`)
        .send({ answers: [{ questionId, answerId: wrongAnswerId }] })
        .expect(400);
    });
  });
});

```


### backend/test/profile.e2e-spec.ts
```
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';

describe('Profile (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  const mockUser: Omit<User, 'createdAt' | 'updatedAt'> = {
    id: 1,
    supabaseUserId: 'test-supabase-id-profile',
    email: 'profile-test@example.com',
    name: 'Test User',
    totalHours: 0,
    karmaPoints: 0,
  };

  const mockAuthGuard = {
    canActivate: (context: any) => {
      const request = context.switchToHttp().getRequest();
      request.user = mockUser;
      return true;
    },
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  beforeEach(async () => {
    await prisma.userOrganizationSubscription.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.userCertificate.deleteMany();
    await prisma.eventParticipant.deleteMany();
    await prisma.quizAnswer.deleteMany();
    await prisma.quizQuestion.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.course.deleteMany();
    await prisma.event.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.user.deleteMany();
    await prisma.user.create({ data: mockUser as User });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) {
      await app.close();
    }
  });

  it('/profile/me (GET) - should return current user profile', async () => {
    return request(app.getHttpServer())
      .get('/profile/me')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(mockUser.id);
        expect(res.body.email).toBe(mockUser.email);
        expect(res.body).toHaveProperty('levelName');
      });
  });
});

```


### backend/tsconfig.build.json
```
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}


```


### backend/tsconfig.json
```
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "resolvePackageJsonExports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "noFallthroughCasesInSwitch": false
  }
}


```


### docs/api/README.md
```
В это директории будет размещена документация по API backend.

```


### frontend/.env
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
GEMINI_API_KEY=PLACEHOLDER_API_KEY


```


### frontend/.env.example
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
GEMINI_API_KEY=PLACEHOLDER_API_KEY


```


### frontend/.eslintrc.json
```
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ]
}

```


### frontend/.gitignore
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?


```


### frontend/.next/types/routes.d.ts
```
// This file is generated automatically by Next.js
// Do not edit this file manually

type AppRoutes = "/"
type PageRoutes = never
type LayoutRoutes = "/"
type RedirectRoutes = never
type RewriteRoutes = never
type Routes = AppRoutes | PageRoutes | LayoutRoutes | RedirectRoutes | RewriteRoutes


interface ParamMap {
  "/": {}
}


export type ParamsOf<Route extends Routes> = ParamMap[Route]

interface LayoutSlotMap {
  "/": never
}


export type { AppRoutes, PageRoutes, LayoutRoutes, RedirectRoutes, RewriteRoutes, ParamMap }

declare global {
  /**
   * Props for Next.js App Router page components
   * @example
   * ```tsx
   * export default function Page(props: PageProps<'/blog/[slug]'>) {
   *   const { slug } = await props.params
   *   return <div>Blog post: {slug}</div>
   * }
   * ```
   */
  interface PageProps<AppRoute extends AppRoutes> {
    params: Promise<ParamMap[AppRoute]>
    searchParams: Promise<Record<string, string | string[] | undefined>>
  }

  /**
   * Props for Next.js App Router layout components
   * @example
   * ```tsx
   * export default function Layout(props: LayoutProps<'/dashboard'>) {
   *   return <div>{props.children}</div>
   * }
   * ```
   */
  type LayoutProps<LayoutRoute extends LayoutRoutes> = {
    params: Promise<ParamMap[LayoutRoute]>
    children: React.ReactNode
  } & {
    [K in LayoutSlotMap[LayoutRoute]]: React.ReactNode
  }
}


```


### frontend/.next/types/validator.ts
```
// This file is generated automatically by Next.js
// Do not edit this file manually
// This file validates that all pages and layouts export the correct types

import type { AppRoutes, LayoutRoutes, ParamMap } from "./routes.js"
import type { ResolvingMetadata, ResolvingViewport } from "next/types.js"

type AppPageConfig<Route extends AppRoutes = AppRoutes> = {
  default: React.ComponentType<{ params: Promise<ParamMap[Route]> } & any> | ((props: { params: Promise<ParamMap[Route]> } & any) => React.ReactNode | Promise<React.ReactNode> | never | void | Promise<void>)
  generateStaticParams?: (props: { params: ParamMap[Route] }) => Promise<any[]> | any[]
  generateMetadata?: (
    props: { params: Promise<ParamMap[Route]> } & any,
    parent: ResolvingMetadata
  ) => Promise<any> | any
  generateViewport?: (
    props: { params: Promise<ParamMap[Route]> } & any,
    parent: ResolvingViewport
  ) => Promise<any> | any
  metadata?: any
  viewport?: any
}

type LayoutConfig<Route extends LayoutRoutes = LayoutRoutes> = {
  default: React.ComponentType<LayoutProps<Route>> | ((props: LayoutProps<Route>) => React.ReactNode | Promise<React.ReactNode> | never | void | Promise<void>)
  generateStaticParams?: (props: { params: ParamMap[Route] }) => Promise<any[]> | any[]
  generateMetadata?: (
    props: { params: Promise<ParamMap[Route]> } & any,
    parent: ResolvingMetadata
  ) => Promise<any> | any
  generateViewport?: (
    props: { params: Promise<ParamMap[Route]> } & any,
    parent: ResolvingViewport
  ) => Promise<any> | any
  metadata?: any
  viewport?: any
}


// Validate ../../src/app/page.tsx
{
  type __IsExpected<Specific extends AppPageConfig<"/">> = Specific
  const handler = {} as typeof import("../../src/app/page.js")
  type __Check = __IsExpected<typeof handler>
  // @ts-ignore
  type __Unused = __Check
}







// Validate ../../src/app/layout.tsx
{
  type __IsExpected<Specific extends LayoutConfig<"/">> = Specific
  const handler = {} as typeof import("../../src/app/layout.js")
  type __Check = __IsExpected<typeof handler>
  // @ts-ignore
  type __Unused = __Check
}


```


### frontend/.prettierrc.json
```
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}

```


### frontend/README.md
```


```


### frontend/eslint.config.mjs
```
import {defineConfig, globalIgnores} from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
]);

export default eslintConfig;


```


### frontend/index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>MAX Dobro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/index.css">
</head>
<body>
<div id="root"></div>
<script type="module" src="/index.tsx"></script>
</body>
</html>

```


### frontend/index.tsx
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter} from 'react-router';
import App from './src/app/page';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App/>
    </HashRouter>
  </React.StrictMode>
);

```


### frontend/metadata.json
```
{
  "name": "MAX Dobro Mini-App",
  "description": "",
  "requestFramePermissions": []
}

```


### frontend/next-env.d.ts
```
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.


```


### frontend/next.config.ts
```
import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


```


### frontend/package.json
```
{
  "name": "max-dobro-mini-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^0.14.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router": "^7.9.5"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react-dom": "^19.2.2",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}


```


### frontend/src/app/auth/page.tsx
```
import React, {useMemo, useState} from 'react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeOffIcon,
  HeartHandIcon,
  LockIcon,
  MaxIcon,
  RefreshIcon,
  UserIcon
} from '../../components/ui/icons';
import {login, register} from '../../lib/auth';
import type {User} from '../../lib/types';
import {defaultUserData} from '../../lib/mockData';

const Spinner: React.FC = () => (
  <RefreshIcon className="w-5 h-5 text-white animate-spin"/>
);

// --- Login View ---
const LoginView: React.FC<{
  onAuthSuccess: (user: User) => void,
  onSwitchToRegister: () => void,
  onSwitchToForgotPassword: () => void
}> = ({onAuthSuccess, onSwitchToRegister, onSwitchToForgotPassword}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleContinue = async () => {
    let isValid = true;
    setLoginError('');
    if (!email) {
      setEmailError('Пожалуйста, введите email');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Пожалуйста, введите корректный email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Пожалуйста, введите пароль');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      setIsLoading(true);
      try {
        const {user} = await login(email, password);
        onAuthSuccess(user);
      } catch (err) {
        setLoginError('Неверный email или пароль. Попробуйте снова.');
        setIsLoading(false);
      }
    }
  };

  const handleMaxLogin = () => {
    // In a real app, this would trigger an OAuth flow.
    // Here, we just simulate a successful login with default data.
    onAuthSuccess(defaultUserData);
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
    if (loginError) setLoginError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
    if (loginError) setLoginError('');
  };

  return (
    <div className="bg-white w-full h-screen flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-sm flex flex-col items-center">
        <HeartHandIcon className="w-24 h-24 text-[#007AFF] mb-8"/>
        <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-10 text-center">
          Добро пожаловать!
        </h1>
        {loginError && <p className="text-red-600 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg">{loginError}</p>}
        <div className="w-full flex flex-col items-center space-y-4">
          <button
            onClick={handleMaxLogin}
            className="w-full flex items-center justify-center bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
            <MaxIcon className="w-6 h-6 mr-3"/>
            Войти через MAX
          </button>
          <div className="flex items-center w-full py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-[rgb(12,13,14,0.52)] text-sm font-medium">или</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <EnvelopeIcon className="w-5 h-5 text-gray-400"/>
              </span>
              <input type="email" value={email} onChange={handleEmailChange} placeholder="Ваш email"
                     className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                     aria-label="Email" aria-invalid={!!emailError} aria-describedby="email-error"/>
            </div>
            {emailError && <p id="email-error" className="text-red-600 text-xs mt-1 ml-1">{emailError}</p>}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon className="w-5 h-5 text-gray-400"/>
              </span>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange}
                     placeholder="Пароль"
                     className="w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                     aria-label="Password" aria-invalid={!!passwordError} aria-describedby="password-error"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}>
                {showPassword ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
              </button>
            </div>
            {passwordError && <p id="password-error" className="text-red-600 text-xs mt-1 ml-1">{passwordError}</p>}
          </div>
          <button onClick={handleContinue} disabled={isLoading}
                  className="w-full bg-transparent border-2 border-[#007AFF] text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mt-2 h-[50px] flex items-center justify-center disabled:opacity-50">
            {isLoading ? <Spinner/> : 'Продолжить'}
          </button>
          <div className="w-full flex justify-between items-center pt-2">
            <button onClick={onSwitchToForgotPassword} className="text-sm text-[#007AFF] hover:underline">
              Забыли пароль?
            </button>
            <button onClick={onSwitchToRegister} className="text-sm text-[#007AFF] hover:underline font-semibold">
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Register View ---
const RegisterView: React.FC<{
  onRegisterSuccess: (user: User) => void,
  onSwitchToLogin: () => void
}> = ({onRegisterSuccess, onSwitchToLogin}) => {
  const [formData, setFormData] = useState({firstName: '', lastName: '', email: '', password: '', confirmPassword: ''});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Введите имя';
    if (!formData.lastName) newErrors.lastName = 'Введите фамилию';
    if (!formData.email) newErrors.email = 'Введите email';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Неверный формат email';
    if (!formData.password) newErrors.password = 'Введите пароль';
    else if (formData.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    if (errors[name]) setErrors(prev => ({...prev, [name]: ''}));
    if (registerError) setRegisterError('');
  };

  const handleRegister = async () => {
    if (validate()) {
      setIsLoading(true);
      setRegisterError('');
      try {
        const {user} = await register(formData);
        onRegisterSuccess(user);
      } catch (err) {
        setRegisterError('Не удалось зарегистрироваться. Попробуйте позже.');
        setIsLoading(false);
      }
    }
  };

  const isFormValid = useMemo(() => {
    return Object.values(formData).every(value => value.length > 0) && formData.password.length >= 6 && formData.password === formData.confirmPassword && /^\S+@\S+\.\S+$/.test(formData.email);
  }, [formData]);

  return (
    <div className="bg-white w-full min-h-screen flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-sm flex flex-col items-center">
        <HeartHandIcon className="w-16 h-16 text-[#007AFF] mb-6"/>
        <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-8 text-center">Создать аккаунт</h1>
        {registerError &&
            <p className="text-red-600 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg">{registerError}</p>}
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><UserIcon
                className="w-5 h-5 text-gray-400"/></span>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Имя"
                     className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
            </div>
            {errors.firstName && <p className="text-red-600 text-xs mt-1 ml-1">{errors.firstName}</p>}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><UserIcon
                className="w-5 h-5 text-gray-400"/></span>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Фамилия"
                     className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
            </div>
            {errors.lastName && <p className="text-red-600 text-xs mt-1 ml-1">{errors.lastName}</p>}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><EnvelopeIcon
                className="w-5 h-5 text-gray-400"/></span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"
                     className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
            </div>
            {errors.email && <p className="text-red-600 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><LockIcon
                className="w-5 h-5 text-gray-400"/></span>
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                     onChange={handleChange} placeholder="Пароль"
                     className="w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><LockIcon
                className="w-5 h-5 text-gray-400"/></span>
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                     value={formData.confirmPassword} onChange={handleChange} placeholder="Повторите пароль"
                     className="w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                {showConfirmPassword ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
          </div>
          <button onClick={handleRegister} disabled={!isFormValid || isLoading}
                  className="w-full bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed h-[50px] flex items-center justify-center">
            {isLoading ? <Spinner/> : 'Зарегистрироваться'}
          </button>
          <p className="text-sm pt-4">
            <span className="text-[rgb(12,13,14,0.52)]">Уже есть аккаунт? </span>
            <button onClick={onSwitchToLogin} className="font-semibold text-[#007AFF] hover:underline">
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Forgot Password View ---
const ForgotPasswordView: React.FC<{ onBackToLogin: () => void }> = ({onBackToLogin}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSendRequest = () => {
    if (email && /^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('');
      setIsSubmitted(true);
    } else {
      setEmailError('Пожалуйста, введите корректный email');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  if (isSubmitted) {
    return (
      <div
        className="bg-white w-full h-screen flex flex-col items-center justify-center p-6 font-sans antialiased text-center">
        <div className="w-full max-w-sm flex flex-col items-center">
          <CheckCircleIcon className="w-24 h-24 text-green-500 mb-6"/>
          <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-4">Письмо отправлено!</h1>
          <p className="text-[rgb(12,13,14,0.52)] mb-8">
            Мы отправили ссылку для восстановления пароля на <span
            className="font-semibold text-[#0C0D0E]">{email}</span>. Пожалуйста, проверьте ваш почтовый ящик.
          </p>
          <button onClick={onBackToLogin}
                  className="w-full flex items-center justify-center bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-all duration-200">
            Вернуться ко входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full h-screen flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-sm flex flex-col items-center">
        <HeartHandIcon className="w-16 h-16 text-[#007AFF] mb-6"/>
        <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-2 text-center">Забыли пароль?</h1>
        <p className="text-[rgb(12,13,14,0.52)] mb-8 text-center">
          Введите email, и мы пришлем вам ссылку для восстановления.
        </p>
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <EnvelopeIcon className="w-5 h-5 text-gray-400"/>
              </span>
              <input type="email" value={email} onChange={handleEmailChange} placeholder="Ваш email"
                     className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                     aria-label="Email" aria-invalid={!!emailError} aria-describedby="email-error"/>
            </div>
            {emailError && <p id="email-error" className="text-red-600 text-xs mt-1 ml-1">{emailError}</p>}
          </div>
          <button onClick={handleSendRequest} disabled={!email}
                  className="w-full bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed">
            Отправить ссылку
          </button>
          <button onClick={onBackToLogin}
                  className="flex items-center space-x-2 text-sm text-[#007AFF] hover:underline font-semibold pt-4">
            <ArrowLeftIcon className="w-4 h-4"/>
            <span>Вернуться ко входу</span>
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---
type AuthMode = 'login' | 'register' | 'forgotPassword';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({onAuthSuccess}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  switch (authMode) {
    case 'register':
      return <RegisterView onRegisterSuccess={onAuthSuccess} onSwitchToLogin={() => setAuthMode('login')}/>;
    case 'forgotPassword':
      return <ForgotPasswordView onBackToLogin={() => setAuthMode('login')}/>;
    case 'login':
    default:
      return <LoginView onAuthSuccess={onAuthSuccess} onSwitchToRegister={() => setAuthMode('register')}
                        onSwitchToForgotPassword={() => setAuthMode('forgotPassword')}/>;
  }
}

export default AuthPage;


```


### frontend/src/app/chat/page.tsx
```
import React, {useEffect, useRef, useState} from 'react';
import type {ChatMessage, User} from '../../lib/types';
import {GoogleGenAI, Type} from '@google/genai';
import {allEvents} from '../../lib/mockData';
import {ArrowLeftIcon, PaperAirplaneIcon, SparklesIcon} from '../../components/ui/icons';
import EventCard from '../../components/ui/EventCard';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: 'The conversational response to the user.',
    },
    event: {
      type: Type.OBJECT,
      description: 'An event object if the user is asking to find an event. Only include if an event is explicitly found.',
      nullable: true,
      properties: {
        id: {
          type: Type.NUMBER,
          description: 'The ID of the event found.'
        },
        title: {
          type: Type.STRING,
          description: 'The title of the event.'
        }
      }
    }
  }
};

const AssistantChatPage: React.FC<{
  onClose: () => void;
  user: User;
}> = ({onClose, user}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'assistant',
        type: 'text',
        text: `Привет, ${user.firstName}! Я ваш Помощник Добра. Я могу помочь найти события, курсы или ответить на ваши вопросы по приложению.`
      },
      {
        id: 2,
        sender: 'assistant',
        type: 'suggestion-chips',
        suggestions: ["Найди события по экологии", "Какие курсы для новичков?", "Что ты умеешь?"]
      }
    ]);
    inputRef.current?.focus();
  }, [user.firstName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages, isLoading]);

  const onSelectEvent = (id: number) => {
    window.location.hash = `#/events/${id}`;
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      text: textToSend,
    };

    const messagesWithoutSuggestions = messages.filter(m => m.type !== 'suggestion-chips');
    setMessages([...messagesWithoutSuggestions, userMessage]);

    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textToSend,
        config: {
          systemInstruction: `You are Помощник Добра (Helper of Good), a friendly and helpful AI assistant for a volunteering app called MAXДобро. You help users find volunteering events, answer questions about the app, and encourage them to do good deeds. Your name is Max. Keep your answers concise, friendly and helpful. Respond in Russian. The user's name is ${user.firstName}. If you find an event for the user, include the event object in your response.`,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      let assistantResponse: ChatMessage;

      try {
        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse.event && jsonResponse.event.id) {
          const foundEvent = allEvents.find(e => e.id === jsonResponse.event.id);
          if (foundEvent) {
            assistantResponse = {
              id: Date.now() + 1,
              sender: 'assistant',
              type: 'event-card',
              text: jsonResponse.text || `Нашел для вас событие!`,
              event: foundEvent,
            };
          } else {
            assistantResponse = {
              id: Date.now() + 1,
              sender: 'assistant',
              type: 'text',
              text: jsonResponse.text || "Я нашел событие, но не смог загрузить детали."
            };
          }
        } else {
          assistantResponse = {id: Date.now() + 1, sender: 'assistant', type: 'text', text: jsonResponse.text};
        }
      } catch (e) {
        console.error("JSON parsing error, falling back to text:", e);
        assistantResponse = {id: Date.now() + 1, sender: 'assistant', type: 'text', text: response.text};
      }

      setMessages(prev => [...prev, assistantResponse]);

    } catch (error) {
      console.error("Gemini API error:", error);
      const errorResponse: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        type: 'text',
        text: 'К сожалению, у меня возникла небольшая проблема. Попробуйте спросить что-нибудь еще чуть позже.',
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Назад">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-6 h-6 text-[#007AFF]"/>
            <h1 className="text-lg font-bold text-[#0C0D0E]">Помощник</h1>
          </div>
          <p className="text-sm text-green-500 font-semibold">онлайн</p>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-xs md:max-w-md">
              {msg.type === 'text' && (
                <div
                  className={`px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-bl-lg' : 'bg-white text-[#0C0D0E] shadow-sm rounded-br-lg'}`}>
                  {msg.text}
                </div>
              )}
              {msg.type === 'suggestion-chips' && msg.suggestions && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.suggestions.map(s => (
                    <button key={s} onClick={() => handleSend(s)}
                            className="px-3 py-1.5 text-sm font-semibold bg-white shadow-sm text-[#007AFF] rounded-full hover:bg-gray-100 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {msg.type === 'event-card' && msg.event && (
                <div className="space-y-2">
                  {msg.text && <div
                      className="px-4 py-2 rounded-2xl bg-white text-[#0C0D0E] shadow-sm rounded-br-lg">{msg.text}</div>}
                  <button onClick={() => onSelectEvent(msg.event!.id)}
                          className="w-full transition-transform duration-200 active:scale-95">
                    <EventCard event={msg.event}/>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs">
              <div
                className="px-4 py-2 rounded-2xl bg-white text-[#0C0D0E] shadow-sm rounded-br-lg flex items-center space-x-1">
                <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}/>
      </main>

      <footer className="flex-shrink-0 p-3 bg-white/90 backdrop-blur-sm border-t border-gray-200 sticky bottom-0 z-20">
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Спросите что-нибудь..."
            className="flex-grow bg-gray-100 border-transparent rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button type="submit" disabled={!input.trim() || isLoading}
                  className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center text-white disabled:bg-gray-300 transition-colors">
            <PaperAirplaneIcon className="w-6 h-6"/>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default AssistantChatPage;

```


### frontend/src/app/courses/certificate/page.tsx
```
import React from 'react';
import type {Course, User} from '../../../lib/types';
import {ArrowLeftIcon, DownloadIcon, HeartHandIcon, ShareIcon} from '../../../components/ui/icons';

const CertificatePage: React.FC<{
  courseId: number;
  allCourses: Course[]; // Passed down to avoid re-fetching all courses
  user: User;
  onBack: () => void;
}> = ({courseId, allCourses, user, onBack}) => {

  const course = allCourses.find(c => c.id === courseId);

  if (!course) {
    return <div className="w-full h-screen flex items-center justify-center">Сертификат не найден.</div>;
  }

  const userName = `${user.firstName} ${user.lastName}`;
  const issueDate = new Date().toLocaleDateString('ru-RU');
  const certificateId = `CERT-${String(course.id).padStart(4, '0')}-${new Date().getFullYear()}`;

  return (
    <div className="w-full h-screen font-sans antialiased bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                  aria-label="Назад">
            <ArrowLeftIcon className="w-6 h-6 text-gray-600"/>
          </button>
          <h1 className="text-lg font-bold text-[#0C0D0E] mx-auto">Ваш сертификат</h1>
          <div className="w-10"></div>
          {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {/* Certificate Element */}
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border-2 border-blue-200 aspect-[5/7] flex flex-col relative overflow-hidden">
          {/* Watermark */}
          <HeartHandIcon className="absolute -bottom-10 -right-10 w-48 h-48 text-gray-100/50 transform rotate-12"/>

          {/* Header with Logo */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <HeartHandIcon className="w-8 h-8 text-[#007AFF]"/>
              <span className="font-bold text-lg">MAX<span className="text-[#007AFF]">Добро</span></span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow flex flex-col justify-center items-center text-center space-y-3">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-gray-500 uppercase">СЕРТИФИКАТ</h2>
            <p className="text-base text-gray-600 pt-4">Настоящим подтверждается, что</p>
            <h1 className="text-4xl font-serif text-[#0C0D0E]">{userName}</h1>
            <p className="text-base text-gray-600">успешно прошел(а) курс</p>
            <h3 className="text-2xl font-serif text-[#007AFF] leading-tight">«{course.title}»</h3>
          </div>

          {/* Footer with Date/ID */}
          <div className="text-xs text-gray-400 flex justify-between pt-4 border-t border-gray-100 mt-4">
            <span>Дата: {issueDate}</span>
            <span>ID: {certificateId}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 w-full max-w-sm flex space-x-4">
          <button
            className="flex-1 flex items-center justify-center space-x-2 bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-colors">
            <ShareIcon className="w-5 h-5"/>
            <span>Поделиться</span>
          </button>
          <button
            className="flex-1 flex items-center justify-center space-x-2 bg-white border-2 border-[#007AFF] text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors">
            <DownloadIcon className="w-5 h-5"/>
            <span>Сохранить в PDF</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default CertificatePage;


```


### frontend/src/app/courses/detail/page.tsx
```
import React, {useEffect, useState} from 'react';
import {fetchCourseById} from '../../../lib/api';
import type {Course, CourseLesson} from '../../../lib/types';
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
  PlayCircleIcon,
  ShareIcon,
  UserIcon
} from '../../../components/ui/icons';

const LessonRow: React.FC<{ lesson: CourseLesson; index: number; onSelect: () => void }> = ({
                                                                                              lesson,
                                                                                              index,
                                                                                              onSelect
                                                                                            }) => {
  const getIcon = () => {
    switch (lesson.status) {
      case 'completed':
        return <CheckCircleIcon className="w-6 h-6 text-green-500"/>;
      case 'current':
        return <PlayCircleIcon className="w-6 h-6 text-[#007AFF]"/>;
      case 'locked':
        return <LockClosedIcon className="w-6 h-6 text-gray-400"/>;
      default:
        return null;
    }
  };

  const isClickable = lesson.status !== 'locked' && (lesson.type === 'test' || lesson.content);
  const textColor = lesson.status === 'locked' ? 'text-gray-400' : 'text-[#0C0D0E]';

  return (
    <button
      onClick={onSelect}
      disabled={!isClickable}
      className={`w-full flex items-center p-4 rounded-xl space-x-4 ${isClickable ? 'hover:bg-gray-100' : 'cursor-default'} ${lesson.status === 'current' ? 'bg-blue-50' : ''} transition-colors text-left`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        <p
          className={`font-semibold ${textColor}`}>{`${index + 1}. ${lesson.type === 'test' ? 'Тест' : 'Урок'}: ${lesson.title}`}</p>
      </div>
    </button>
  );
};

const CourseDetailPage: React.FC<{
  id: number;
}> = ({id}) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      const data = await fetchCourseById(id);
      if (data) setCourse(data);
      setLoading(false);
    };
    loadCourse();
  }, [id]);

  const onBack = () => window.location.hash = '#/training';
  const onSelectLesson = (courseId: number, lessonIndex: number) => window.location.hash = `#/courses/${courseId}/lesson/${lessonIndex}`;
  const onViewCertificate = (courseId: number) => window.location.hash = `#/courses/${courseId}/certificate`;

  const handleCtaClick = () => {
    if (!course) return;
    if (course.status === 'completed') {
      onViewCertificate(course.id);
    } else {
      const currentLessonIndex = course.program.findIndex(l => l.status === 'current');
      if (currentLessonIndex !== -1) {
        onSelectLesson(course.id, currentLessonIndex);
      } else {
        // If no 'current', start from the first non-completed one
        const firstLessonIndex = course.program.findIndex(l => l.status !== 'completed');
        if (firstLessonIndex !== -1) {
          onSelectLesson(course.id, firstLessonIndex);
        }
      }
    }
  };

  const getButtonText = () => {
    if (!course) return '';
    switch (course.status) {
      case 'completed':
        return 'Посмотреть сертификат';
      case 'in-progress':
        return 'Продолжить';
      default:
        return 'Начать обучение';
    }
  };

  if (loading || !course) {
    return <div className="w-full h-screen flex items-center justify-center">Загрузка курса...</div>;
  }

  return (
    <div className="relative w-full h-screen font-sans antialiased bg-white overflow-y-auto">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
        <button onClick={onBack} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                aria-label="Назад">
          <ArrowLeftIcon className="w-6 h-6 text-white"/>
        </button>
        <button className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center" aria-label="Поделиться">
          <ShareIcon className="w-5 h-5 text-white"/>
        </button>
      </header>

      {/* Course Cover */}
      <div
        className="h-[40vh] w-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex flex-col items-center justify-center text-center p-4">
        <course.Icon className="w-24 h-24 text-white/60 mb-4"/>
        <h1 className="text-3xl font-bold text-white shadow-sm">{course.title}</h1>
      </div>

      <div className="relative bg-white rounded-t-2xl -mt-6 p-6 space-y-6">
        {/* Meta-information */}
        <section className="flex justify-around items-center bg-gray-50 rounded-xl p-3 text-sm text-center">
          <div className="flex flex-col items-center space-y-1">
            <ClockIcon className="w-5 h-5 text-gray-500"/>
            <span className="font-semibold text-[rgb(12,13,14,0.52)]">{course.duration}</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <AcademicCapIcon className="w-5 h-5 text-gray-500"/>
            <span
              className="font-semibold text-[rgb(12,13,14,0.52)]">{course.hasCertificate ? 'Сертификат' : 'Без сертификата'}</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <UserIcon className="w-5 h-5 text-gray-500"/>
            <span className="font-semibold text-[rgb(12,13,14,0.52)]">{course.level}</span>
          </div>
        </section>

        {/* Description */}
        <section>
          <h2 className="text-xl font-bold text-[#0C0D0E] mb-2">О чем этот курс?</h2>
          <p className="text-[rgb(12,13,14,0.52)] leading-relaxed">{course.description}</p>
        </section>

        {/* Program */}
        <section>
          <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Программа</h2>
          <div className="space-y-2">
            {course.program.map((lesson, index) => (
              <LessonRow key={index} lesson={lesson} index={index} onSelect={() => onSelectLesson(course.id, index)}/>
            ))}
          </div>
        </section>
      </div>

      <div className="h-28"></div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <button
          onClick={handleCtaClick}
          className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] hover:opacity-90"
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default CourseDetailPage;


```


### frontend/src/app/courses/lesson/page.tsx
```
import React, {useMemo, useState} from 'react';
import type {Course} from '../../../lib/types';
import {CheckIcon, PuzzleIcon, TrophyIcon, XIcon} from '../../../components/ui/icons';
import CourseCompleteModal from '../../../components/ui/CourseCompleteModal';

const TestResultModal: React.FC<{
  isOpen: boolean;
  result: 'passed' | 'failed' | null;
  score: number;
  totalQuestions: number;
  onTryAgain: () => void;
  onViewCertificate: () => void;
  onBackToLesson: () => void;
}> = ({isOpen, result, score, totalQuestions, onTryAgain, onViewCertificate, onBackToLesson}) => {
  if (!isOpen) return null;

  const isSuccess = result === 'passed';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        {isSuccess ? (
          <>
            <TrophyIcon className="w-24 h-24 text-yellow-400"/>
            <h2 className="text-2xl font-bold text-[#1ABE43]">Отлично! Тест пройден!</h2>
            <p className="text-[rgb(12,13,14,0.52)]">
              Вы набрали {score}/{totalQuestions} баллов. Теперь вы готовы помогать еще эффективнее!
            </p>
            <button
              onClick={onViewCertificate}
              className="w-full bg-[linear-gradient(158deg,#14E1D5_6.15%,#03C722_85.68%)] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            >
              Посмотреть сертификат
            </button>
            <button onClick={onBackToLesson} className="text-sm text-[rgb(12,13,14,0.52)] font-semibold">
              Закрыть
            </button>
          </>
        ) : (
          <>
            <PuzzleIcon className="w-24 h-24 text-[#FF9315]"/>
            <h2 className="text-2xl font-bold text-[#0C0D0E]">Почти у цели!</h2>
            <p className="text-[rgb(12,13,14,0.52)]">
              {`Ваш результат: ${score} из ${totalQuestions}. Повторение — мать учения. Попробуйте еще раз, чтобы закрепить знания!`}
            </p>
            <div className="w-full flex flex-col space-y-3 pt-2">
              <button
                onClick={onTryAgain}
                className="w-full bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
              >
                Попробовать снова
              </button>
              <button
                onClick={onBackToLesson}
                className="w-full bg-transparent text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Вернуться к уроку
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .animate-scale-in { animation: scale-in 0.2s ease-out; }
            `}</style>
    </div>
  );
};

const LessonPage: React.FC<{
  courseId: number;
  lessonIndex: number;
  allCourses: Course[]; // Passed down to avoid re-fetching
  onClose: () => void;
  onComplete: (courseId: number) => void;
}> = ({courseId, lessonIndex, allCourses, onClose, onComplete}) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<'passed' | 'failed' | null>(null);
  const [score, setScore] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showCourseCompleteModal, setShowCourseCompleteModal] = useState(false);

  const course = useMemo(() => allCourses.find(c => c.id === courseId), [allCourses, courseId]);
  const lesson = useMemo(() => course?.program[lessonIndex], [course, lessonIndex]);

  if (!course || !lesson) {
    return <div className="w-full h-screen flex items-center justify-center">Урок не найден.</div>;
  }

  const quiz = lesson.quiz || [];
  const questionsCount = quiz.length;

  const answeredQuestionsCount = Object.keys(answers).filter(key => {
    const answer = answers[key];
    return Array.isArray(answer) ? answer.length > 0 : !!answer;
  }).length;

  const isCtaActive = answeredQuestionsCount === questionsCount;

  const handleAnswerChange = (questionId: string, value: string, type: 'single' | 'multiple') => {
    if (isSubmitted) return;
    setAnswers(prev => {
      if (type === 'single') {
        return {...prev, [questionId]: value};
      } else {
        const currentAnswers = (prev[questionId] as string[] || []);
        const newAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter(a => a !== value)
          : [...currentAnswers, value];
        return {...prev, [questionId]: newAnswers};
      }
    });
  };

  const handleCheckAnswers = () => {
    if (!isCtaActive || isSubmitted) return;

    setIsSubmitted(true);
    let correctCount = 0;

    for (const q of quiz) {
      const userAnswer = answers[q.id];
      if (q.type === 'single') {
        if (userAnswer === q.correctAnswer) {
          correctCount++;
        }
      } else if (q.type === 'multiple') {
        const correct = q.correctAnswers || [];
        const user = (userAnswer as string[] || []);
        if (correct.length === user.length && correct.every(a => user.includes(a))) {
          correctCount++;
        }
      }
    }

    setScore(correctCount);
    const isPass = correctCount === questionsCount;
    const isFinalTestWithCert = course.hasCertificate &&
      course.program.indexOf(lesson) === course.program.length - 1 &&
      lesson.type === 'test';

    if (isPass && isFinalTestWithCert) {
      setShowCourseCompleteModal(true);
    } else {
      setTestResult(isPass ? 'passed' : 'failed');
      setShowResultModal(true);
    }
  };

  const handleTryAgain = () => {
    setAnswers({});
    setIsSubmitted(false);
    setTestResult(null);
    setScore(0);
    setShowResultModal(false);
  }

  const progressPercentage = questionsCount > 0 ? (answeredQuestionsCount / questionsCount) * 100 : 0;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans antialiased">
        {/* Header */}
        <header className="flex-shrink-0 p-4 flex items-center justify-between border-b border-gray-200">
          <div className="w-10"></div>
          <div className="text-center">
            <p className="text-sm text-gray-500">{course.title}</p>
            <h1 className="text-lg font-bold text-[#0C0D0E]">{lesson.title}</h1>
          </div>
          <button onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                  aria-label="Закрыть">
            <XIcon className="w-6 h-6 text-gray-600"/>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto p-6 space-y-6">
          {lesson.content && (
            <section>
              <h2 className="text-2xl font-bold text-[#0C0D0E] mb-3">{lesson.contentTitle}</h2>
              <div className="prose text-[rgb(12,13,14,0.52)] leading-relaxed whitespace-pre-line">
                {lesson.content}
              </div>
            </section>
          )}

          {quiz.length > 0 && (
            <section className="space-y-6">
              {quiz.map((q, index) => (
                <div key={q.id} className="bg-gray-50 p-4 rounded-xl">
                  <p className="font-semibold text-[#0C0D0E] mb-3">{index + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map(option => {
                      const isChecked = q.type === 'single' ? answers[q.id] === option : (answers[q.id] as string[] || []).includes(option);
                      const isCorrect = isSubmitted && (q.type === 'single' ? option === q.correctAnswer : (q.correctAnswers || []).includes(option));
                      const isIncorrect = isSubmitted && isChecked && !isCorrect;

                      return (
                        <button
                          key={option}
                          onClick={() => handleAnswerChange(q.id, option, q.type)}
                          disabled={isSubmitted}
                          className={`w-full text-left flex items-center p-3 rounded-lg border-2 transition-colors ${
                            isSubmitted ?
                              isCorrect ? 'bg-[#1ABE43]/10 border-[#1ABE43]/40 text-green-800 font-semibold' :
                                isIncorrect ? 'bg-[#FF303C]/10 border-[#FF303C]/40 text-red-800 font-semibold' :
                                  'border-gray-200 text-gray-500'
                              : isChecked ?
                                'bg-blue-100 border-blue-400 text-blue-800 font-semibold' :
                                'bg-white border-gray-200 hover:bg-gray-100 text-[#0C0D0E]'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center mr-3 ${
                              isChecked ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                            }`}>
                            {isChecked && <CheckIcon className="w-3 h-3 text-white"/>}
                          </div>
                          <span className="flex-1">{option}</span>
                          {isSubmitted && isCorrect && <CheckIcon className="w-5 h-5 text-[#1ABE43]"/>}
                          {isSubmitted && isIncorrect && <XIcon className="w-5 h-5 text-[#FF303C]"/>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>

        {quiz.length > 0 && (
          <footer className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div className="bg-[#007AFF] h-1.5 rounded-full" style={{width: `${progressPercentage}%`}}></div>
            </div>
            <button
              onClick={handleCheckAnswers}
              disabled={!isCtaActive || isSubmitted}
              className="w-full text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#007AFF] hover:bg-blue-600 shadow-lg"
            >
              {isSubmitted ? (isSubmitted && score === questionsCount ? 'Отлично!' : 'Попробовать снова') : 'Проверить ответы'}
            </button>
          </footer>
        )}
      </div>

      <TestResultModal
        isOpen={showResultModal}
        result={testResult}
        score={score}
        totalQuestions={questionsCount}
        onTryAgain={handleTryAgain}
        onViewCertificate={() => onComplete(course.id)}
        onBackToLesson={() => setShowResultModal(false)}
      />

      <CourseCompleteModal
        isOpen={showCourseCompleteModal}
        courseTitle={course.title}
        onViewCertificate={() => onComplete(course.id)}
        onClose={onClose}
      />
    </>
  );
};

export default LessonPage;


```


### frontend/src/app/error/page.tsx
```
import React from 'react';
import {NoNetworkIcon, RefreshIcon, ServerErrorIcon} from '../../components/ui/icons';

type ErrorPageProps = {
  type: 'network' | 'server';
  onRetry: () => void;
};

const errorDetails = {
  network: {
    Icon: NoNetworkIcon,
    title: "Ой, нет подключения!",
    subtitle: "Пожалуйста, проверьте ваше интернет-соединение и попробуйте снова."
  },
  server: {
    Icon: ServerErrorIcon,
    title: "Что-то пошло не так",
    subtitle: "Мы уже знаем о проблеме и чиним ее. Пожалуйста, попробуйте позже."
  }
};

const ErrorPage: React.FC<ErrorPageProps> = ({type, onRetry}) => {
  const {Icon, title, subtitle} = errorDetails[type];

  return (
    <div
      className="bg-white w-full h-screen flex flex-col items-center justify-center p-6 font-sans antialiased text-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        <Icon className="w-48 h-48 mb-8"/>
        <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-2">{title}</h1>
        <p className="text-[rgb(12,13,14,0.52)] mb-8">{subtitle}</p>
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <RefreshIcon className="w-5 h-5 mr-2"/>
          Попробовать снова
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;


```


### frontend/src/app/events/chat/page.tsx
```
import React, {useEffect, useRef, useState} from 'react';
import type {AppEvent, EventChatMessage, User} from '../../../lib/types';
import {fetchEventById} from '../../../lib/api';
import {
  ArrowLeftIcon,
  DotsHorizontalIcon,
  PaperAirplaneIcon,
  PaperclipIcon,
  PinIcon,
  XIcon
} from '../../../components/ui/icons';
import {CURRENT_USER_ID} from '../../../lib/mockData';

const MOCK_MESSAGES: EventChatMessage[] = [
  {
    id: 1,
    author: {id: 10, name: 'Организатор', avatarUrl: 'https://i.pravatar.cc/48?img=11'},
    text: 'Всем привет! Рад видеть всех, кто откликнулся. Встречаемся завтра в 10:00 у главного входа в парк.',
    timestamp: '14:20'
  },
  {
    id: 2,
    author: {id: 2, name: 'Александр С.', avatarUrl: 'https://i.pravatar.cc/48?img=21'},
    text: 'Отлично, буду на месте!',
    timestamp: '14:22'
  },
  {
    id: 3,
    author: {id: 3, name: 'Мария И.', avatarUrl: 'https://i.pravatar.cc/48?img=22'},
    text: 'А парковка там есть рядом?',
    timestamp: '14:25'
  },
  {
    id: 4,
    author: {id: 10, name: 'Организатор', avatarUrl: 'https://i.pravatar.cc/48?img=11'},
    text: 'Да, есть платная городская парковка вдоль улицы.',
    timestamp: '14:26'
  },
  {
    id: 5,
    author: {id: CURRENT_USER_ID, name: 'Елена Иванова', avatarUrl: 'https://i.pravatar.cc/150?img=1'},
    text: 'Поняла, спасибо! Постараюсь быть вовремя.',
    timestamp: '14:30'
  },
  {
    id: 6,
    author: {id: 4, name: 'Анна П.', avatarUrl: 'https://i.pravatar.cc/48?img=24'},
    text: 'Если кто-то поедет от метро Сокольники, можем встретиться и пойти вместе!',
    timestamp: '14:31'
  },
  {
    id: 7,
    author: {id: CURRENT_USER_ID, name: 'Елена Иванова', avatarUrl: 'https://i.pravatar.cc/150?img=1'},
    text: 'Отличная идея!',
    timestamp: '14:32'
  },
];

const MessageBubble: React.FC<{ message: EventChatMessage; isOutgoing: boolean; showAuthor: boolean }> = ({
                                                                                                            message,
                                                                                                            isOutgoing,
                                                                                                            showAuthor
                                                                                                          }) => (
  <div className={`flex items-end gap-2 ${isOutgoing ? 'flex-row-reverse' : ''}`}>
    {!isOutgoing && (
      <img src={message.author.avatarUrl} alt={message.author.name}
           className={`w-8 h-8 rounded-full ${showAuthor ? 'opacity-100' : 'opacity-0'}`}/>
    )}
    <div className={`max-w-xs md:max-w-md ${isOutgoing ? 'ml-10' : 'mr-10'}`}>
      {!isOutgoing && showAuthor &&
          <p className="text-sm font-semibold text-gray-600 mb-1 ml-3">{message.author.name}</p>}
      <div
        className={`px-4 py-2 text-base ${isOutgoing ? 'bg-[linear-gradient(155deg,#526EFF_6.6%,#007AFF_84.12%)] text-white rounded-t-2xl rounded-bl-2xl' : 'bg-white text-[#0C0D0E] shadow-sm rounded-t-2xl rounded-br-2xl'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        <p
          className={`text-xs mt-1 ${isOutgoing ? 'text-white/70 text-right' : 'text-gray-400 text-right'}`}>{message.timestamp}</p>
      </div>
    </div>
  </div>
);

const PinnedMessage: React.FC<{ onDismiss: () => void }> = ({onDismiss}) => (
  <div className="flex-shrink-0 bg-blue-50/70 backdrop-blur-sm p-3 flex items-start space-x-3">
    <PinIcon className="w-5 h-5 text-[#007AFF] mt-0.5 flex-shrink-0"/>
    <div className="flex-1 text-sm text-blue-900">
      <span className="font-semibold">Организатор:</span> Встречаемся у главного входа в 10:00. Мой телефон: +7 (999)
      123-45-67
    </div>
    <button onClick={onDismiss} className="text-blue-500 hover:text-blue-700">
      <XIcon className="w-5 h-5"/>
    </button>
  </div>
);

const EventChatPage: React.FC<{
  eventId: number;
  user: User;
  onBack: () => void;
}> = ({eventId, user, onBack}) => {
  const [event, setEvent] = useState<AppEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<EventChatMessage[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [showPinned, setShowPinned] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      const data = await fetchEventById(eventId);
      if (data) setEvent(data as AppEvent);
      setLoading(false);
    };
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: EventChatMessage = {
      id: Date.now(),
      author: {id: CURRENT_USER_ID, name: `${user.firstName} ${user.lastName}`, avatarUrl: user.avatarUrl},
      text: input,
      timestamp: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  if (loading || !event) {
    return <div className="w-full h-screen flex items-center justify-center">Загрузка чата...</div>
  }

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Назад">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold text-[#0C0D0E] text-center leading-tight">{event.title}</h1>
          <p className="text-sm text-gray-500 font-medium">15 участников</p>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Действия">
          <DotsHorizontalIcon className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      {showPinned && <PinnedMessage onDismiss={() => setShowPinned(false)}/>}

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        <div
          className="text-center text-sm text-gray-400 bg-gray-200 rounded-full px-3 py-1 inline-block mx-auto">Сегодня
        </div>
        {messages.map((msg, index) => {
          const prevMessage = messages[index - 1];
          const showAuthor = !prevMessage || prevMessage.author.id !== msg.author.id;
          return (
            <MessageBubble key={msg.id} message={msg} isOutgoing={msg.author.id === CURRENT_USER_ID}
                           showAuthor={showAuthor}/>
          );
        })}
        <div ref={messagesEndRef}/>
      </main>

      <footer className="flex-shrink-0 p-3 bg-white/90 backdrop-blur-sm border-t border-gray-200 sticky bottom-0 z-20">
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
          <button type="button" className="p-2 text-gray-500 hover:text-[#007AFF]">
            <PaperclipIcon className="w-6 h-6"/>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Сообщение..."
            className="flex-grow bg-gray-100 border-transparent rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button type="submit" disabled={!input.trim()}
                  className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center text-white disabled:bg-gray-300 transition-colors">
            <PaperAirplaneIcon className="w-6 h-6"/>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default EventChatPage;


```


### frontend/src/app/events/detail/page.tsx
```
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router';
import type {Achievement, AppEvent, ProfileSubScreen} from '../../../lib/types';
import {fetchEventById} from '../../../lib/api';
import {allAchievements} from '../../../lib/mockData';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ListIcon,
  LocationMarkerIcon,
  ShareIcon,
  StarIcon
} from '../../../components/ui/icons';
import InviteFriendModal from '../../../features/invites/components/InviteFriendModal';
import Toast from '../../../components/ui/Toast';
import NewAchievementModal from '../../../components/ui/NewAchievementModal';
import CancelModal from '../../../components/ui/CancelModal';

const ConfirmationModal: React.FC<{
  isOpen: boolean;
  event: AppEvent;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({isOpen, event, onConfirm, onCancel}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}
      onClick={onCancel}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-6 pt-4 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <h2 id="confirm-title" className="text-xl font-bold text-[#0C0D0E] text-center mb-6">Подтвердите участие</h2>
        <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center space-x-4">
            <ListIcon className="w-6 h-6 text-gray-500 flex-shrink-0"/>
            <span className="font-semibold text-[#0C0D0E]">{event.title}</span>
          </div>
          <div className="flex items-center space-x-4">
            <CalendarIcon className="w-6 h-6 text-gray-500 flex-shrink-0"/>
            <span className="text-[rgb(12,13,14,0.52)]">{event.date}</span>
          </div>
          <div className="flex items-center space-x-4">
            <LocationMarkerIcon className="w-6 h-6 text-gray-500 flex-shrink-0"/>
            <span className="text-[rgb(12,13,14,0.52)]">{event.location}</span>
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 text-center mb-6">
          Организатор рассчитывает на вашу помощь. Если планы изменятся, пожалуйста, отмените запись в своем профиле.
        </div>
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-[#007AFF] text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-600 transition-colors"
          >
            Подтвердить
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-transparent text-[#007AFF] font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal: React.FC<{
  event: AppEvent;
  onClose: () => void;
  isOpen: boolean;
  onInvite: () => void;
}> = ({event, onClose, isOpen, onInvite}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" role="dialog"
         aria-modal="true">
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        <div className="w-24 h-24">
          <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14 27l5.917 4.917L37.75 22"/>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-[#1ABE43]">Вы в деле!</h2>
        <p className="text-[rgb(12,13,14,0.52)]">
          Мы добавили событие в ваш календарь. Спасибо, что делаете мир лучше!
        </p>
        <div className="w-full bg-gray-50 rounded-xl p-4 mt-2 text-center border border-gray-200">
          <p className="font-semibold text-gray-700">Позовите друзей — вместе веселее!</p>
          <button
            onClick={onInvite}
            className="mt-3 text-sm font-semibold bg-transparent border-2 border-[#007AFF] text-[#007AFF] py-2 px-5 rounded-xl hover:bg-blue-50 transition-colors">
            Пригласить друга
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity mt-2"
        >
          Отлично!
        </button>
      </div>
      <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
                .checkmark-circle-bg { stroke-width: 3; stroke-miterlimit: 10; stroke: #1ABE43; fill: none; opacity: 0.1; }
                .checkmark-circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 3; stroke-miterlimit: 10; stroke: #1ABE43; fill: none; animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
                .checkmark-check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 4; stroke-linecap: round; stroke: #1ABE43; animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards; }
                @keyframes stroke { 100% { stroke-dashoffset: 0; } }
            `}</style>
    </div>
  );
};

const EventDetailPage: React.FC = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<AppEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; onUndo?: () => void }>({
    show: false,
    message: ''
  });
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (id) {
        setLoading(true);
        const eventId = parseInt(id, 10);
        const data = await fetchEventById(eventId);
        if (data) {
          setEvent(data as AppEvent);
        }
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  const onBack = () => navigate(-1);
  const onNavigateProfile = (screen: ProfileSubScreen) => navigate(`/profile/${screen}`);
  const onSelectOrganization = (orgId: number) => navigate(`/organizations/${orgId}`);
  const onOpenChat = (evt: AppEvent) => navigate(`/events/${evt.id}/chat`);

  const handleSignUpClick = () => setShowConfirmation(true);
  const handleConfirmSignUp = () => {
    setShowConfirmation(false);
    setIsSignedUp(true);
    setTimeout(() => setShowSuccess(true), 300);
  };
  const handleCancelSignUp = () => setShowConfirmation(false);
  const handleCloseSuccessModal = () => {
    setShowSuccess(false);
    const firstAchievement = allAchievements.find(a => a.id === 1);
    if (firstAchievement) setTimeout(() => setUnlockedAchievement(firstAchievement), 300);
  };
  const handleNavigateToAchievements = () => {
    setUnlockedAchievement(null);
    onNavigateProfile('allAchievements');
  }
  const handleOpenCancelModal = () => setShowCancelConfirm(true);
  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    setIsSignedUp(false);
    setToast({show: true, message: "Ваша запись отменена", onUndo: () => setIsSignedUp(true)});
  };
  const handleCloseCancelModal = () => setShowCancelConfirm(false);
  const handleInvite = () => {
    setShowSuccess(false);
    setShowInviteModal(true);
  };
  const handleSendInvites = () => {
    setShowInviteModal(false);
    setToast({show: true, message: "Приглашения отправлены!"});
  };

  const mainButtonAction = isSignedUp ? handleOpenCancelModal : handleSignUpClick;

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Загрузка события...</div>;
  }

  if (!event) {
    return <div className="w-full h-screen flex items-center justify-center">Событие не найдено.</div>;
  }

  return (
    <>
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({...toast, show: false})}
             onUndo={toast.onUndo} type="success"/>
      <div className="relative w-full h-screen font-sans antialiased bg-white overflow-y-auto">
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
          <button onClick={onBack} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                  aria-label="Назад"><ArrowLeftIcon className="w-6 h-6 text-white"/></button>
          <button className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                  aria-label="Поделиться"><ShareIcon className="w-5 h-5 text-white"/></button>
        </header>
        <div
          className="h-[40vh] w-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex items-center justify-center">
          <event.Icon className="w-32 h-32 text-white/60"/>
        </div>
        <div className="relative bg-white rounded-t-2xl -mt-6 p-6 space-y-6">
          <section>
            <div className="flex space-x-2 mb-2"><span
              className="text-xs font-semibold bg-blue-100 text-[#007AFF] px-3 py-1 rounded-full">{event.category}</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#0C0D0E]">{event.title}</h1>
            <div className="mt-4 space-y-2 text-[rgb(12,13,14,0.52)]">
              <div className="flex items-center space-x-3"><CalendarIcon
                className="w-5 h-5 text-gray-400"/><span>{event.date}</span></div>
              <div className="flex items-center space-x-3"><LocationMarkerIcon
                className="w-5 h-5 text-gray-400"/><span>{event.location}</span></div>
            </div>
          </section>
          <section>
            {isSignedUp ? (
              <button onClick={() => onOpenChat(event)}
                      className="w-full flex items-center justify-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors relative">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#007AFF]"/>
                <span className="font-semibold text-lg text-[#0C0D0E]">Чат мероприятия</span>
                <span
                  className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">3</span>
              </button>
            ) : (
              <div
                className="w-full flex items-center justify-center space-x-3 p-4 bg-gray-50 rounded-2xl relative text-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-400"/>
                <span className="font-semibold text-lg text-gray-400">Чат доступен после записи</span>
              </div>
            )}
          </section>
          <section>
            <button onClick={() => onSelectOrganization(event.organizationId)}
                    className="w-full flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors">
              <img src={`https://i.pravatar.cc/48?img=${event.organizationId + 10}`} alt="Логотип организатора"
                   className="w-12 h-12 rounded-full"/>
              <div className="text-left">
                <h3 className="font-semibold text-[#0C0D0E]">Организатор "{event.organizationName}"</h3>
                <div className="flex items-center text-sm text-[rgb(12,13,14,0.52)]"><StarIcon
                  className="w-4 h-4 text-yellow-400 mr-1"/><span>4.9 (120 отзывов)</span></div>
              </div>
            </button>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#0C0D0E] mb-2">Что нужно делать?</h2>
            <p className="text-[rgb(12,13,14,0.52)] leading-relaxed">Присоединяйтесь к нам в эту субботу, чтобы сделать
              парк "Сокольники" чище и уютнее! Мы будем убирать мусор, сажать новые цветы и приводить в порядок дорожки.
              Отличное настроение и работа в дружной команде гарантированы.</p>
          </section>
          {event.requirements && event.requirements.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Требования к волонтерам</h2>
              <ul className="space-y-3">
                {event.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div
                      className="w-6 h-6 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <CheckIcon className="w-4 h-4 text-[#007AFF]"/></div>
                    <span className="text-[rgb(12,13,14,0.52)] leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Что вы получите?</h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3"><span className="text-2xl">✨</span> <span
                className="text-[rgb(12,13,14,0.52)]">+50 баллов кармы</span></li>
              <li className="flex items-center space-x-3"><span className="text-2xl">🕒</span> <span
                className="text-[rgb(12,13,14,0.52)]">+3 часа добра в вашу копилку</span></li>
              <li className="flex items-center space-x-3"><span className="text-2xl">📜</span> <span
                className="text-[rgb(12,13,14,0.52)]">Сертификат участника</span></li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Кто из друзей идет?</h2>
            <div className="flex -space-x-2">
              <img loading="lazy" className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                   src="https://i.pravatar.cc/40?img=1" alt="User 1"/>
              <img loading="lazy" className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                   src="https://i.pravatar.cc/40?img=2" alt="User 2"/>
              <img loading="lazy" className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                   src="https://i.pravatar.cc/40?img=3" alt="User 3"/>
              <div
                className="h-10 w-10 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-[rgb(12,13,14,0.52)]">+5
              </div>
            </div>
          </section>
        </div>
        <div className="h-28"></div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <button onClick={mainButtonAction}
                  className={`w-full py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg ${isSignedUp ? 'bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300' : 'bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] text-white font-bold hover:opacity-90'}`}>
            {isSignedUp ? (<><CheckIcon className="w-5 h-5 mr-2"/>Вы участвуете</>) : ('Я помогу!')}
          </button>
        </div>
      </div>
      <ConfirmationModal isOpen={showConfirmation} event={event} onConfirm={handleConfirmSignUp}
                         onCancel={handleCancelSignUp}/>
      <SuccessModal isOpen={showSuccess} event={event} onClose={handleCloseSuccessModal} onInvite={handleInvite}/>
      <CancelModal isOpen={showCancelConfirm} onConfirm={handleConfirmCancel} onCancel={handleCloseCancelModal}/>
      <InviteFriendModal isOpen={showInviteModal} event={event} onClose={() => setShowInviteModal(false)}
                         onSend={handleSendInvites}/>
      <NewAchievementModal achievement={unlockedAchievement} onClose={() => setUnlockedAchievement(null)}
                           onNavigateToAchievements={handleNavigateToAchievements}/>
    </>
  );
};

export default EventDetailPage;


```


### frontend/src/app/onboarding/page.tsx
```
import React, {useState} from 'react';
import {
  AnimalFriendIcon,
  ArtVolunteerIcon,
  CheckCircleIcon,
  ElderlyHelperIcon,
  NatureProtectorIcon
} from '../../components/ui/icons';

const interests = [
  {id: 'nature', title: 'Защитник природы', Icon: NatureProtectorIcon},
  {id: 'animals', title: 'Друг животных', Icon: AnimalFriendIcon},
  {id: 'seniors', title: 'Помощник старшим', Icon: ElderlyHelperIcon},
  {id: 'art', title: 'Арт-волонтер', Icon: ArtVolunteerIcon},
];

interface InterestCardProps {
  title: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isSelected: boolean;
  onClick: () => void;
}

const InterestCard: React.FC<InterestCardProps> = ({title, Icon, isSelected, onClick}) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full aspect-square bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-end items-center text-center transition-all duration-200 ${isSelected ? 'border-2 border-[#007AFF]' : 'border-2 border-transparent'}`}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 text-white bg-[#007AFF] rounded-full">
          <CheckCircleIcon className="w-6 h-6"/>
        </div>
      )}
      <div className="flex-grow flex items-center justify-center">
        <Icon className="w-20 h-20"/>
      </div>
      <h3 className="font-bold text-[#0C0D0E] text-md mt-2">{title}</h3>
    </button>
  );
};

const OnboardingPage: React.FC<{ onComplete: () => void }> = ({onComplete}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isContinueEnabled = selectedInterests.length > 0;

  return (
    <div className="bg-white w-full min-h-screen flex flex-col p-6 font-sans antialiased">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[#0C0D0E]">Какой вы герой?</h1>
          <p className="text-[rgb(12,13,14,0.52)] mt-2">Выберите одно или несколько направлений, которые вам близки.</p>
        </div>

        <div className="w-full max-w-sm grid grid-cols-2 gap-4">
          {interests.map(interest => (
            <InterestCard
              key={interest.id}
              title={interest.title}
              Icon={interest.Icon}
              isSelected={selectedInterests.includes(interest.id)}
              onClick={() => toggleInterest(interest.id)}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto mt-8">
        <button
          onClick={onComplete}
          disabled={!isContinueEnabled}
          className={`w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${isContinueEnabled ? 'bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] hover:opacity-90 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;


```


### frontend/src/app/organization/dashboard/page.tsx
```
import React from 'react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  EyeIcon,
  ListIcon,
  PlusIcon,
  SettingsIcon,
  TrendingUpIcon,
  UserIcon
} from '../../../components/ui/icons';

// Mock data for the dashboard
const mockStats = [
  {id: 'new_volunteers', label: 'Новых волонтеров', value: '12', Icon: UserIcon, change: '+5%'},
  {id: 'total_regs', label: 'Всего регистраций', value: '87', Icon: CheckCircleIcon, change: '+12%'},
  {id: 'event_views', label: 'Просмотры событий', value: '1.2k', Icon: EyeIcon, change: '-3%'},
  {id: 'response_rate', label: 'Коэффициент отклика', value: '23%', Icon: TrendingUpIcon, change: '+1.5%'},
];

const StatCard: React.FC<{ label: string; value: string; Icon: React.FC<any>; change: string; }> = ({
                                                                                                      label,
                                                                                                      value,
                                                                                                      Icon,
                                                                                                      change
                                                                                                    }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm">
    <div className="flex justify-between items-start">
      <div className="bg-blue-100 rounded-lg p-2">
        <Icon className="w-6 h-6 text-[#007AFF]"/>
      </div>
      <span
        className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
    </div>
    <p className="text-3xl font-bold mt-4">{value}</p>
    <p className="text-sm text-[rgb(12,13,14,0.52)]">{label}</p>
  </div>
);

interface OrganizationDashboardPageProps {
  onSwitchToVolunteer: () => void;
  onManageEvents: () => void;
  onCreateEvent: () => void;
}

const OrganizationDashboardPage: React.FC<OrganizationDashboardPageProps> = ({
                                                                               onSwitchToVolunteer,
                                                                               onManageEvents,
                                                                               onCreateEvent
                                                                             }) => {

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm flex items-center justify-between">
        <button onClick={onSwitchToVolunteer}
                className="flex items-center space-x-2 text-sm font-semibold text-[#007AFF]">
          <ArrowLeftIcon className="w-5 h-5"/>
          <span>Режим волонтера</span>
        </button>
        <h1 className="text-lg font-bold text-[#0C0D0E]">Фонд "Подари жизнь"</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Настройки организации">
          <SettingsIcon className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      <main className="flex-grow overflow-y-auto p-6 space-y-6">
        {/* Primary CTA */}
        <button onClick={onCreateEvent}
                className="w-full flex items-center justify-center space-x-2 bg-[#007AFF] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-600 transition-colors">
          <PlusIcon className="w-6 h-6"/>
          <span>Создать новое событие</span>
        </button>

        {/* Statistics */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            {mockStats.map(stat => <StatCard key={stat.id} {...stat} />)}
          </div>
        </section>

        {/* Management */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0C0D0E]">Управление</h2>
          </div>
          <div className="space-y-3">
            <button onClick={onManageEvents}
                    className="w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:bg-gray-50 transition-colors flex items-center space-x-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <ListIcon className="w-6 h-6 text-[#007AFF]"/>
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#0C0D0E]">Мои события</h4>
                <p className="text-sm text-[rgb(12,13,14,0.52)]">Просмотр и управление</p>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrganizationDashboardPage;

```


### frontend/src/app/organization/detail/page.tsx
```
import React, {useEffect, useState} from 'react';
import type {AppEvent, Organization} from '../../../lib/types';
import {fetchAllEvents, fetchOrganizationById, updateOrganizationSubscription} from '../../../lib/api';
import {
  ArrowLeftIcon,
  EmptySearchIcon,
  GlobeAltIcon,
  ShareIcon,
  StarIcon,
  VerifiedIcon
} from '../../../components/ui/icons';
import SubscribeModal from '../../../components/ui/SubscribeModal';
import Toast from '../../../components/ui/Toast';
import SkeletonCard from '../../../components/ui/SkeletonCard';
import EventCard from '../../../components/ui/EventCard';
import EmptyState from '../../../components/ui/EmptyState';

const OrganizationProfilePage: React.FC<{
  id: number;
}> = ({id}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'events'>('description');
  const [eventsLoading, setEventsLoading] = useState(true);
  const [organizationEvents, setOrganizationEvents] = useState<AppEvent[]>([]);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; onUndo?: () => void }>({
    show: false,
    message: ''
  });

  useEffect(() => {
    const loadOrg = async () => {
      setLoading(true);
      const data = await fetchOrganizationById(id);
      if (data) setOrganization(data);
      setLoading(false);
    };
    loadOrg();
  }, [id]);

  useEffect(() => {
    if (!organization) return;
    const loadOrgEvents = async () => {
      if (activeTab === 'events') {
        setEventsLoading(true);
        const allEvents = await fetchAllEvents();
        setOrganizationEvents(allEvents.filter(event => event.organizationId === organization.id));
        setEventsLoading(false);
      }
    };
    loadOrgEvents();
  }, [activeTab, organization]);

  const onBack = () => window.location.hash = '#/organizations';
  const onSelectEvent = (eventId: number) => window.location.hash = `#/events/${eventId}`;

  const onToggleSubscription = async () => {
    if (!organization) return;
    const newSubStatus = !organization.isSubscribed;
    await updateOrganizationSubscription(organization.id, newSubStatus);
    setOrganization(org => org ? ({...org, isSubscribed: newSubStatus}) : null);
  };

  const handleSubscriptionClick = () => {
    if (!organization) return;
    if (organization.isSubscribed) {
      onToggleSubscription();
      setToast({
        show: true,
        message: `Вы отписались от "${organization.name}"`,
        onUndo: onToggleSubscription,
      });
    } else {
      setShowSubscribeModal(true);
    }
  };

  const handleConfirmSubscription = async () => {
    if (!organization) return;
    await onToggleSubscription();
    setShowSubscribeModal(false);
    setToast({
      show: true,
      message: `Вы подписались на "${organization.name}"`,
      onUndo: onToggleSubscription,
    });
  };

  if (loading || !organization) {
    return <div className="w-full h-screen flex items-center justify-center">Загрузка организации...</div>;
  }

  return (
    <>
      <div className="relative w-full h-screen font-sans antialiased bg-white overflow-y-auto">
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
          <button onClick={onBack} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                  aria-label="Назад">
            <ArrowLeftIcon className="w-6 h-6 text-white"/>
          </button>
          <button className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                  aria-label="Поделиться">
            <ShareIcon className="w-5 h-5 text-white"/>
          </button>
        </header>

        <div className="relative">
          <div
            className="h-[25vh] w-full bg-gray-300 bg-cover bg-center"
            style={{backgroundImage: `url(${organization.coverImageUrl})`}}
          ></div>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <img
              src={organization.logoUrl}
              alt={`Логотип ${organization.name}`}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>

        <section className="text-center pt-16 px-6 pb-4">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-[28px] font-bold text-[#0C0D0E]">{organization.name}</h1>
            {organization.isVerified && <VerifiedIcon className="w-6 h-6 text-[#007AFF]"/>}
          </div>
          <p className="text-[rgb(12,13,14,0.52)] mt-1">{organization.description}</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-[rgb(12,13,14,0.52)] mt-2">
            <StarIcon className="w-4 h-4 text-yellow-400"/>
            <span className="font-semibold text-[#0C0D0E]">{organization.rating}</span>
            <span>&middot;</span>
            <span>{Intl.NumberFormat('ru-RU').format(organization.subscribers)} подписчиков</span>
          </div>
        </section>

        <section className="px-6 flex space-x-3">
          <button
            onClick={handleSubscriptionClick}
            className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-colors ${
              organization.isSubscribed
                ? 'bg-gray-100 text-gray-600'
                : 'bg-[#007AFF] text-white shadow-md'
            }`}
          >
            {organization.isSubscribed ? 'Вы подписаны' : 'Подписаться'}
          </button>
          <a href={organization.websiteUrl} target="_blank" rel="noopener noreferrer"
             className="flex-1 flex items-center justify-center space-x-2 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 text-[#0C0D0E] hover:bg-gray-50 transition-colors">
            <GlobeAltIcon className="w-5 h-5"/>
            <span>Сайт</span>
          </a>
        </section>

        <section className="mt-6 border-b border-gray-200">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 font-semibold w-full transition-colors ${activeTab === 'description' ? 'text-[#007AFF] border-b-2 border-[#007AFF]' : 'text-gray-500'}`}
            >
              Описание
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-3 font-semibold w-full transition-colors ${activeTab === 'events' ? 'text-[#007AFF] border-b-2 border-[#007AFF]' : 'text-gray-500'}`}
            >
              События
            </button>
          </div>
        </section>

        <section className="p-6">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#0C0D0E]">О фонде</h2>
              <p
                className="text-[rgb(12,13,14,0.52)] leading-relaxed whitespace-pre-line">{organization.fullDescription}</p>
              <h2 className="text-xl font-bold text-[#0C0D0E] pt-4">Контакты</h2>
              <p className="text-[rgb(12,13,14,0.52)]">Москва, ул. Добрая, д. 1</p>
            </div>
          )}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {eventsLoading ? (
                <>
                  <SkeletonCard/>
                  <SkeletonCard/>
                  <SkeletonCard/>
                </>
              ) : organizationEvents.length > 0 ? (
                organizationEvents.map(event => (
                  <button key={event.id} onClick={() => onSelectEvent(event.id)}
                          className="w-full transition-transform duration-200 active:scale-95">
                    <EventCard event={event}/>
                  </button>
                ))
              ) : (
                <EmptyState
                  Icon={EmptySearchIcon}
                  title="Пока здесь тихо"
                  subtitle="У этой организации сейчас нет активных мероприятий. Подпишитесь, чтобы узнать о новых первыми!"
                  action={!organization.isSubscribed ? {
                    text: 'Подписаться на организацию',
                    onClick: handleSubscriptionClick,
                    type: 'secondary',
                  } : undefined}
                />
              )}
            </div>
          )}
        </section>

        <div className="h-10"></div>
      </div>
      <SubscribeModal
        isOpen={showSubscribeModal}
        organizationName={organization.name}
        onConfirm={handleConfirmSubscription}
        onCancel={() => setShowSubscribeModal(false)}
      />
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({...toast, show: false})}
        onUndo={toast.onUndo}
        type="info"
      />
    </>
  );
};

export default OrganizationProfilePage;

```


### frontend/src/app/organization/events/create/page.tsx
```
import React, {useEffect, useState} from 'react';
import type {OrganizationEvent} from '../../../../lib/types';
import {allCategories} from '../../../../lib/mockData';
import {fetchOrganizationEvents} from '../../../../lib/api';
import {ArrowLeftIcon, CameraIcon, MapPinIcon, UserGroupIcon} from '../../../../components/ui/icons';

const toDateTimeLocal = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const monthMap: { [key: string]: number } = {
      'января': 0,
      'февраля': 1,
      'марта': 2,
      'апреля': 3,
      'мая': 4,
      'июня': 5,
      'июля': 6,
      'августа': 7,
      'сентября': 8,
      'октября': 9,
      'ноября': 10,
      'декабря': 11
    };
    const parts = dateString.replace(',', '').split(' ');
    if (parts.length < 3) return '';

    const day = parseInt(parts[0], 10);
    const month = monthMap[parts[1].toLowerCase()];
    const time = parts[2].split(':');
    const hour = parseInt(time[0], 10);
    const minute = parseInt(time[1], 10);

    if (isNaN(day) || month === undefined || isNaN(hour) || isNaN(minute)) return '';

    const now = new Date();
    const currentYear = now.getFullYear();

    let eventDate = new Date(currentYear, month, day, hour, minute);

    // If the parsed date is in the past (e.g., event is "Jan" but we are in "Dec"), assume it's for the next year.
    if (eventDate < now) {
      eventDate.setFullYear(currentYear + 1);
    }

    const ten = (i: number) => (i < 10 ? '0' : '') + i;
    const YYYY = eventDate.getFullYear();
    const MM = ten(eventDate.getMonth() + 1);
    const DD = ten(eventDate.getDate());
    const HH = ten(eventDate.getHours());
    const mm = ten(eventDate.getMinutes());
    return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
  } catch {
    return '';
  }
};

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({title, children}) => (
  <section className="bg-white rounded-2xl shadow-sm">
    <h2 className="px-4 pt-4 pb-2 text-xl font-bold text-[#0C0D0E]">{title}</h2>
    <div className="p-4 space-y-4">
      {children}
    </div>
  </section>
);

const InputField: React.FC<{ label: string; children: React.ReactNode }> = ({label, children}) => (
  <div>
    <label className="text-sm font-semibold text-gray-600 mb-1 block">{label}</label>
    {children}
  </div>
);

const ToggleSwitch: React.FC<{
  options: [string, string];
  selected: string;
  onChange: (value: string) => void
}> = ({options, selected, onChange}) => (
  <div className="flex bg-gray-100 rounded-xl p-1">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${selected === opt ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
      >
        {opt}
      </button>
    ))}
  </div>
);


interface CreateEventPageProps {
  event?: OrganizationEvent | null;
  onBack: () => void;
  onPublish: (data: any) => void;
}

const CreateEventPage: React.FC<CreateEventPageProps> = ({event, onBack, onPublish}) => {
  const [title, setTitle] = useState(event?.title || '');
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(toDateTimeLocal(event?.date));
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState<'Офлайн' | 'Онлайн'>('Офлайн');
  const [address, setAddress] = useState('');
  const [volunteerCount, setVolunteerCount] = useState(event?.capacity.toString() || '10');
  const [requirements, setRequirements] = useState('');
  const [rewards, setRewards] = useState('');

  useEffect(() => {
    if (event?.id) {
      const loadEventData = async () => {
        const allOrgEvents = await fetchOrganizationEvents();
        const existingEvent = allOrgEvents.find(e => e.id === event.id);
        if (existingEvent) {
          setTitle(existingEvent.title);
          setStartDate(toDateTimeLocal(existingEvent.date));
          setVolunteerCount(existingEvent.capacity.toString());
          // NOTE: The mock data for OrganizationEvent is simple. In a real app,
          // you would pre-fill all other fields like description, category, etc. here.
        }
      };
      loadEventData();
    }
  }, [event]);

  const isFormValid = title && category && description && startDate && (format === 'Онлайн' || address);

  const handlePublish = () => {
    if (isFormValid) {
      onPublish({
        title,
        category,
        description,
        startDate,
        endDate,
        format,
        address,
        volunteerCount,
        requirements,
        rewards
      });
    }
  }

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
        <div className="w-10">
          <button onClick={onBack}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 -ml-2"
                  aria-label="Назад">
            <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
          </button>
        </div>
        <h1 className="text-lg font-bold text-[#0C0D0E]">{event ? 'Редактирование события' : 'Новое событие'}</h1>
        <div className="w-10"></div>
        {/* Spacer to balance the back button */}
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4 pb-28">
        <FormSection title="Основная информация">
          <InputField label="Название события*">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                   placeholder="Например, Субботник в парке"
                   className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </InputField>
          <InputField label="Обложка">
            <button
              className="w-full aspect-[16/9] bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200 border-2 border-dashed border-gray-300">
              <CameraIcon className="w-8 h-8 mb-2"/>
              <span className="font-semibold">Загрузить фото</span>
            </button>
          </InputField>
          <InputField label="Категория события*">
            <div className="flex flex-wrap gap-2">
              {allCategories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${category === cat ? 'bg-[#007AFF] text-white border-transparent' : 'bg-white text-[#007AFF] border-[#007AFF]/50'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </InputField>
          <InputField label="Подробное описание*">
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5}
                      placeholder="Расскажите, что предстоит делать волонтерам, какая цель у события..."
                      className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          </InputField>
        </FormSection>

        <FormSection title="Дата и место">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Начало*">
              <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)}
                     className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </InputField>
            <InputField label="Окончание">
              <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)}
                     className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </InputField>
          </div>
          <InputField label="Формат">
            <ToggleSwitch options={['Офлайн', 'Онлайн']} selected={format} onChange={val => setFormat(val as any)}/>
          </InputField>
          {format === 'Офлайн' && (
            <InputField label="Адрес*">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><MapPinIcon
                  className="w-5 h-5 text-gray-400"/></span>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                       placeholder="Укажите место на карте"
                       className="w-full p-3 pl-10 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </InputField>
          )}
        </FormSection>

        <FormSection title="Требования к волонтерам">
          <InputField label="Количество волонтеров">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><UserGroupIcon
                className="w-5 h-5 text-gray-400"/></span>
              <input type="number" value={volunteerCount} onChange={e => setVolunteerCount(e.target.value)}
                     placeholder="10"
                     className="w-full p-3 pl-10 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </InputField>
          <InputField label="Требования">
            <textarea value={requirements} onChange={e => setRequirements(e.target.value)} rows={3}
                      placeholder="Например: возраст 18+, удобная одежда"
                      className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          </InputField>
          <InputField label="Что получат волонтеры">
            <textarea value={rewards} onChange={e => setRewards(e.target.value)} rows={3}
                      placeholder="Например: +50 кармы, +3 часа добра"
                      className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          </InputField>
        </FormSection>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100 z-30">
        <div className="flex items-center space-x-2">
          <button
            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl hover:bg-gray-300">Сохранить
            в черновик
          </button>
          <button
            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl hover:bg-gray-300">Предпросмотр
          </button>
          <button onClick={handlePublish} disabled={!isFormValid}
                  className="flex-1 bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">Опубликовать
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CreateEventPage;

```


### frontend/src/app/organization/events/page.tsx
```
import React, {useEffect, useMemo, useState} from 'react';
import {fetchOrganizationEvents} from '../../../lib/api';
import type {OrganizationEvent} from '../../../lib/types';
import {ArrowLeftIcon, ListIcon, PlusIcon} from '../../../components/ui/icons';
import EventManagementCard from '../../../features/organization/components/EventManagementCard';
import EmptyState from '../../../components/ui/EmptyState';

// A simple skeleton card for loading state
const SkeletonCard = () => (
  <div className="w-full bg-white rounded-2xl p-4 shadow-sm animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-5 bg-gray-200 rounded w-3/5 mb-4"></div>
    <div className="flex justify-end border-t border-gray-100 pt-3 mt-3">
      <div className="h-9 w-32 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);


const EventManagementPage: React.FC<{
  onBack: () => void;
  onCreateEvent: () => void;
  onEditEvent: (event: OrganizationEvent) => void;
  onManageParticipants: (event: OrganizationEvent) => void;
}> = ({onBack, onCreateEvent, onEditEvent, onManageParticipants}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'drafts'>('active');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<OrganizationEvent[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const data = await fetchOrganizationEvents();
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (activeTab === 'drafts') return event.status === 'draft';
      return event.status === activeTab;
    });
  }, [activeTab, events]);

  const handleMore = (id: number) => console.log(`More options for event ${id}`);
  const handleSelect = (event: OrganizationEvent) => onManageParticipants(event);
  const handleCreate = () => onCreateEvent();

  const renderEmptyState = () => {
    switch (activeTab) {
      case 'active':
        return (
          <EmptyState
            Icon={ListIcon}
            title="У вас пока нет активных событий"
            subtitle="Создайте ваше первое событие, чтобы привлечь волонтеров и сделать доброе дело."
            action={{text: 'Создать событие', onClick: handleCreate, type: 'primary'}}
          />
        );
      case 'past':
        return (
          <EmptyState
            Icon={ListIcon}
            title="Здесь будет архив"
            subtitle="Ваши завершенные мероприятия появятся в этом разделе."
          />
        );
      case 'drafts':
        return (
          <EmptyState
            Icon={ListIcon}
            title="Нет черновиков"
            subtitle="Здесь будут сохраняться ваши незаконченные события."
          />
        );
    }
  };

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-2xl font-bold text-[#0C0D0E]">Мои события</h1>
        <button onClick={handleCreate}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
          <PlusIcon className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      <nav className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button onClick={() => setActiveTab('active')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'active' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Активные
          </button>
          <button onClick={() => setActiveTab('past')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'past' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Прошедшие
          </button>
          <button onClick={() => setActiveTab('drafts')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'drafts' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Черновики
          </button>
        </div>
      </nav>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {loading ? (
          <>
            <SkeletonCard/>
            <SkeletonCard/>
            <SkeletonCard/>
          </>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventManagementCard
              key={event.id}
              event={event}
              onEdit={() => onEditEvent(event)}
              onMore={handleMore}
              onSelect={() => handleSelect(event)}
            />
          ))
        ) : (
          <div className="pt-10">{renderEmptyState()}</div>
        )}
      </main>
    </div>
  );
};

export default EventManagementPage;

```


### frontend/src/app/organization/events/participants/page.tsx
```
import React, {useEffect, useMemo, useState} from 'react';
import {fetchEventParticipants} from '../../../../lib/api';
import type {EventParticipant, OrganizationEvent} from '../../../../lib/types';
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  DotsHorizontalIcon,
  StarIcon,
  UserGroupIcon
} from '../../../../components/ui/icons';
import EmptyState from '../../../../components/ui/EmptyState';

type ParticipantTab = 'new' | 'confirmed' | 'rejected';

const ParticipantCell: React.FC<{
  participant: EventParticipant;
  tab: ParticipantTab;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}> = ({participant, tab, onAccept, onReject}) => {
  return (
    <div className="flex items-center space-x-4 p-4 w-full">
      <img src={participant.avatarUrl} alt={participant.name} className="w-12 h-12 rounded-full"/>
      <div className="flex-1">
        <p className="font-bold text-md text-[#0C0D0E]">{participant.name}</p>
        <div className="flex items-center text-sm text-[rgb(12,13,14,0.52)]">
          <StarIcon className="w-4 h-4 text-yellow-400 mr-1"/>
          <span>{participant.rating}</span>
        </div>
      </div>

      {tab === 'new' && (
        <div className="flex space-x-2">
          <button onClick={() => onReject(participant.id)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">Отклонить
          </button>
          <button onClick={() => onAccept(participant.id)}
                  className="px-4 py-2 rounded-lg bg-[#1ABE43]/20 text-[#1ABE43] font-semibold hover:bg-[#1ABE43]/30 transition-colors">Принять
          </button>
        </div>
      )}
      {tab === 'confirmed' && (
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-200"><ChatBubbleLeftRightIcon
            className="w-6 h-6 text-gray-600"/></button>
          <button className="p-2 rounded-lg hover:bg-gray-200"><DotsHorizontalIcon className="w-6 h-6 text-gray-600"/>
          </button>
        </div>
      )}
      {tab === 'rejected' && (
        <p className="text-sm font-semibold text-gray-500">Заявка отклонена</p>
      )}
    </div>
  );
};

const ParticipantCellSkeleton: React.FC = () => (
  <div className="flex items-center space-x-4 p-4 w-full animate-pulse">
    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
    <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
  </div>
);

const EventParticipantsPage: React.FC<{
  event: OrganizationEvent;
  onBack: () => void;
}> = ({event, onBack}) => {
  const [activeTab, setActiveTab] = useState<ParticipantTab>('new');
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchEventParticipants(event.id);
      setParticipants(data);
      setLoading(false);
    };
    loadData();
  }, [event.id]);

  const newApplications = useMemo(() => participants.filter(p => p.status === 'new'), [participants]);
  const confirmedParticipants = useMemo(() => participants.filter(p => p.status === 'confirmed'), [participants]);
  const rejectedParticipants = useMemo(() => participants.filter(p => p.status === 'rejected'), [participants]);

  const handleStatusChange = (id: number, newStatus: ParticipantTab) => {
    setParticipants(prev => prev.map(p => p.id === id ? {...p, status: newStatus} : p));
  };

  const currentList = useMemo(() => {
    switch (activeTab) {
      case 'new':
        return newApplications;
      case 'confirmed':
        return confirmedParticipants;
      case 'rejected':
        return rejectedParticipants;
    }
  }, [activeTab, newApplications, confirmedParticipants, rejectedParticipants]);

  const renderEmptyState = () => {
    const emptyStates = {
      new: {title: "Новых заявок пока нет", subtitle: "Как только кто-то откликнется, вы увидите заявку здесь."},
      confirmed: {
        title: "Вы еще не подтвердили ни одного участника",
        subtitle: "Подтвержденные волонтеры появятся в этом списке."
      },
      rejected: {title: "Нет отклоненных заявок", subtitle: "Здесь будут заявки, которые вы отклонили."},
    };
    const {title, subtitle} = emptyStates[activeTab];

    return <EmptyState Icon={UserGroupIcon} title={title} subtitle={subtitle}/>;
  };

  const isTotallyEmpty = !loading && participants.length === 0;

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 -ml-2"
                aria-label="Назад">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-lg font-bold text-[#0C0D0E] text-center truncate px-2">Участники: {event.title}</h1>
        <div className="w-8"></div>
      </header>

      <section className="flex-shrink-0 p-4 bg-white">
        <div className="bg-gray-100 rounded-xl p-3 text-center grid grid-cols-3 gap-2">
          <div>
            <p className="font-bold text-lg text-[#0C0D0E]">{confirmedParticipants.length}/{event.capacity}</p>
            <p className="text-xs text-gray-500">Подтверждено</p>
          </div>
          <div>
            <p className="font-bold text-lg text-[#0C0D0E]">{newApplications.length}</p>
            <p className="text-xs text-gray-500">Новых заявок</p>
          </div>
          <div>
            <p className="font-bold text-lg text-[#0C0D0E]">{rejectedParticipants.length}</p>
            <p className="text-xs text-gray-500">Отклонено</p>
          </div>
        </div>
      </section>

      <nav className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button onClick={() => setActiveTab('new')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'new' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Новые
            ({newApplications.length})
          </button>
          <button onClick={() => setActiveTab('confirmed')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'confirmed' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Подтвержденные
            ({confirmedParticipants.length})
          </button>
          <button onClick={() => setActiveTab('rejected')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'rejected' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Отклоненные
            ({rejectedParticipants.length})
          </button>
        </div>
      </nav>

      <main className="flex-grow overflow-y-auto bg-white">
        {isTotallyEmpty ? (
          <div className="pt-10">
            <EmptyState
              Icon={UserGroupIcon}
              title="Пока никто не записался"
              subtitle="Поделитесь событием, чтобы привлечь больше волонтеров!"
              action={{
                text: 'Поделиться событием',
                onClick: () => console.log('Share event'),
                type: 'secondary'
              }}
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {loading ? (
              <>
                <ParticipantCellSkeleton/>
                <ParticipantCellSkeleton/>
                <ParticipantCellSkeleton/>
              </>
            ) : currentList.length > 0 ? (
              currentList.map(p => (
                <ParticipantCell
                  key={p.id}
                  participant={p}
                  tab={activeTab}
                  onAccept={(id) => handleStatusChange(id, 'confirmed')}
                  onReject={(id) => handleStatusChange(id, 'rejected')}
                />
              ))
            ) : (
              <div className="pt-10">{renderEmptyState()}</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventParticipantsPage;

```


### frontend/src/app/organizations/detail/page.tsx
```
import React, {useEffect, useState} from 'react';
import type {AppEvent, Organization} from '../../../lib/types';
import {fetchAllEvents, fetchOrganizationById, updateOrganizationSubscription} from '../../../lib/api';
import {
  ArrowLeftIcon,
  EmptySearchIcon,
  GlobeAltIcon,
  ShareIcon,
  StarIcon,
  VerifiedIcon
} from '../../../components/ui/icons';
import SubscribeModal from '../../../components/ui/SubscribeModal';
import Toast from '../../../components/ui/Toast';
import SkeletonCard from '../../../components/ui/SkeletonCard';
import EventCard from '../../../components/ui/EventCard';
import EmptyState from '../../../components/ui/EmptyState';

const OrganizationProfilePage: React.FC<{
  id: number;
}> = ({id}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'events'>('description');
  const [eventsLoading, setEventsLoading] = useState(true);
  const [organizationEvents, setOrganizationEvents] = useState<AppEvent[]>([]);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; onUndo?: () => void }>({
    show: false,
    message: ''
  });

  useEffect(() => {
    const loadOrg = async () => {
      setLoading(true);
      const data = await fetchOrganizationById(id);
      if (data) setOrganization(data);
      setLoading(false);
    };
    loadOrg();
  }, [id]);

  useEffect(() => {
    if (!organization) return;
    const loadOrgEvents = async () => {
      if (activeTab === 'events') {
        setEventsLoading(true);
        const allEvents = await fetchAllEvents();
        setOrganizationEvents(allEvents.filter(event => event.organizationId === organization.id));
        setEventsLoading(false);
      }
    };
    loadOrgEvents();
  }, [activeTab, organization]);

  const onBack = () => window.location.hash = '#/organizations';
  const onSelectEvent = (eventId: number) => window.location.hash = `#/events/${eventId}`;

  const onToggleSubscription = async () => {
    if (!organization) return;
    const newSubStatus = !organization.isSubscribed;
    await updateOrganizationSubscription(organization.id, newSubStatus);
    setOrganization(org => org ? ({...org, isSubscribed: newSubStatus}) : null);
  };

  const handleSubscriptionClick = () => {
    if (!organization) return;
    if (organization.isSubscribed) {
      onToggleSubscription();
      setToast({
        show: true,
        message: `Вы отписались от "${organization.name}"`,
        onUndo: onToggleSubscription,
      });
    } else {
      setShowSubscribeModal(true);
    }
  };

  const handleConfirmSubscription = async () => {
    if (!organization) return;
    await onToggleSubscription();
    setShowSubscribeModal(false);
    setToast({
      show: true,
      message: `Вы подписались на "${organization.name}"`,
      onUndo: onToggleSubscription,
    });
  };

  if (loading || !organization) {
    return <div className="w-full h-screen flex items-center justify-center">Загрузка организации...</div>;
  }

  return (
    <>
      <div className="relative w-full h-screen font-sans antialiased bg-white overflow-y-auto">
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
          <button onClick={onBack} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                  aria-label="Назад">
            <ArrowLeftIcon className="w-6 h-6 text-white"/>
          </button>
          <button className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                  aria-label="Поделиться">
            <ShareIcon className="w-5 h-5 text-white"/>
          </button>
        </header>

        <div className="relative">
          <div
            className="h-[25vh] w-full bg-gray-300 bg-cover bg-center"
            style={{backgroundImage: `url(${organization.coverImageUrl})`}}
          ></div>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <img
              src={organization.logoUrl}
              alt={`Логотип ${organization.name}`}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>

        <section className="text-center pt-16 px-6 pb-4">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-[28px] font-bold text-[#0C0D0E]">{organization.name}</h1>
            {organization.isVerified && <VerifiedIcon className="w-6 h-6 text-[#007AFF]"/>}
          </div>
          <p className="text-[rgb(12,13,14,0.52)] mt-1">{organization.description}</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-[rgb(12,13,14,0.52)] mt-2">
            <StarIcon className="w-4 h-4 text-yellow-400"/>
            <span className="font-semibold text-[#0C0D0E]">{organization.rating}</span>
            <span>&middot;</span>
            <span>{Intl.NumberFormat('ru-RU').format(organization.subscribers)} подписчиков</span>
          </div>
        </section>

        <section className="px-6 flex space-x-3">
          <button
            onClick={handleSubscriptionClick}
            className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-colors ${
              organization.isSubscribed
                ? 'bg-gray-100 text-gray-600'
                : 'bg-[#007AFF] text-white shadow-md'
            }`}
          >
            {organization.isSubscribed ? 'Вы подписаны' : 'Подписаться'}
          </button>
          <a href={organization.websiteUrl} target="_blank" rel="noopener noreferrer"
             className="flex-1 flex items-center justify-center space-x-2 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 text-[#0C0D0E] hover:bg-gray-50 transition-colors">
            <GlobeAltIcon className="w-5 h-5"/>
            <span>Сайт</span>
          </a>
        </section>

        <section className="mt-6 border-b border-gray-200">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 font-semibold w-full transition-colors ${activeTab === 'description' ? 'text-[#007AFF] border-b-2 border-[#007AFF]' : 'text-gray-500'}`}
            >
              Описание
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-3 font-semibold w-full transition-colors ${activeTab === 'events' ? 'text-[#007AFF] border-b-2 border-[#007AFF]' : 'text-gray-500'}`}
            >
              События
            </button>
          </div>
        </section>

        <section className="p-6">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#0C0D0E]">О фонде</h2>
              <p
                className="text-[rgb(12,13,14,0.52)] leading-relaxed whitespace-pre-line">{organization.fullDescription}</p>
              <h2 className="text-xl font-bold text-[#0C0D0E] pt-4">Контакты</h2>
              <p className="text-[rgb(12,13,14,0.52)]">Москва, ул. Добрая, д. 1</p>
            </div>
          )}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {eventsLoading ? (
                <>
                  <SkeletonCard/>
                  <SkeletonCard/>
                  <SkeletonCard/>
                </>
              ) : organizationEvents.length > 0 ? (
                organizationEvents.map(event => (
                  <button key={event.id} onClick={() => onSelectEvent(event.id)}
                          className="w-full transition-transform duration-200 active:scale-95">
                    <EventCard event={event}/>
                  </button>
                ))
              ) : (
                <EmptyState
                  Icon={EmptySearchIcon}
                  title="Пока здесь тихо"
                  subtitle="У этой организации сейчас нет активных мероприятий. Подпишитесь, чтобы узнать о новых первыми!"
                  action={!organization.isSubscribed ? {
                    text: 'Подписаться на организацию',
                    onClick: handleSubscriptionClick,
                    type: 'secondary',
                  } : undefined}
                />
              )}
            </div>
          )}
        </section>

        <div className="h-10"></div>
      </div>
      <SubscribeModal
        isOpen={showSubscribeModal}
        organizationName={organization.name}
        onConfirm={handleConfirmSubscription}
        onCancel={() => setShowSubscribeModal(false)}
      />
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({...toast, show: false})}
        onUndo={toast.onUndo}
        type="info"
      />
    </>
  );
};

export default OrganizationProfilePage;

```


### frontend/src/app/page.tsx
```
import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams} from 'react-router';

// Page Imports
import SplashPage from './splash/page';
import AuthPage from './auth/page';
import OnboardingPage from './onboarding/page';
import TabsLayout from './tabs/layout';
import EventDetailPage from './events/detail/page';
import CourseDetailPage from './courses/detail/page';
import OrganizationProfilePage from './organizations/detail/page';
import LessonPage from './courses/lesson/page';
import CertificatePage from './courses/certificate/page';
import ActivityHistoryPage from './profile/history/page';
import AllAchievementsPage from './profile/achievements/page';
import CalendarPage from './profile/calendar/page';
import LeaderboardPage from './profile/leaderboard/page';
import SettingsPage from './profile/settings/page';
import EditProfilePage from './profile/edit/page';
import MyCertificatesPage from './profile/myCertificates/page';
import MyChatsPage from './profile/chats/page';
import ErrorPage from './error/page';
import StoryDetailPage from './tabs/stories/detail/page';
import CreateStoryPage from './stories/create/page';
import AssistantChatPage from './chat/page';
import EventChatPage from './events/chat/page';
import Toast from '../components/ui/Toast';
import RewardsStorePage from './profile/rewards/page';
import RewardsDetailPage from './profile/rewards/detail/page';
import OrganizationDashboardPage from './organization/dashboard/page';
import EventManagementPage from './organization/events/page';
import CreateEventPage from './organization/events/create/page';
import EventParticipantsPage from './organization/events/participants/page';

import type {Course, OrganizationEvent, RewardItem, User} from '../lib/types';
import {fetchAllCourses, fetchRewards} from '../lib/api';
import {getCurrentSession, isOnboardingComplete, logout, setOnboardingComplete} from '../lib/auth';


type AppMode = 'volunteer' | 'organization';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('volunteer');
  const [error, setError] = useState<'network' | 'server' | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [allRewards, setAllRewards] = useState<RewardItem[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string; type?: 'success' | 'info' }>({
    show: false,
    message: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!userData;

  const initializeApp = async () => {
    setError(null);
    try {
      const rewardsPromise = fetchRewards();
      const coursesPromise = fetchAllCourses();

      const session = await getCurrentSession();
      const onboardingComplete = isOnboardingComplete();

      const [rewards, courses] = await Promise.all([rewardsPromise, coursesPromise]);

      setAllRewards(rewards);
      setAllCourses(courses);

      if (session) {
        setUserData(session.user);
        if (!onboardingComplete) {
          navigate('/onboarding');
        } else if (['', '/', '#/', '/auth'].includes(location.pathname)) {
          navigate('/home');
        }
      } else {
        navigate('/auth');
      }
      setIsInitialized(true);

    } catch (err) {
      setError('network');
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const handleAuthSuccess = (user: User) => {
    setUserData(user);
    // Decide navigation based on onboarding status
    if (!isOnboardingComplete()) {
      navigate('/onboarding');
    } else {
      navigate('/home');
    }
  };

  const handleOnboardingComplete = () => {
    setOnboardingComplete();
    navigate('/home');
  };

  const handleLogout = async () => {
    await logout();
    setUserData(null);
    navigate('/auth');
  }

  const handleSaveProfile = (updatedUser: User) => {
    setUserData(updatedUser);
    navigate('/profile/settings');
  }

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({show: true, message, type});
  };

  // --- Wrapper Components for Pages ---
  const EventChatPageWrapper = () => {
    const {id} = useParams();
    return <EventChatPage eventId={parseInt(id || '0', 10)} user={userData!} onBack={() => navigate(`/events/${id}`)}/>;
  };

  const CourseDetailPageWrapper = () => {
    const {id} = useParams();
    return <CourseDetailPage id={parseInt(id || '0', 10)}/>;
  };

  const LessonPageWrapper = () => {
    const {id, subId} = useParams();
    const courseId = parseInt(id || '0', 10);
    return <LessonPage courseId={courseId} lessonIndex={parseInt(subId || '0', 10)} allCourses={allCourses}
                       onClose={() => navigate(`/courses/${courseId}`)}
                       onComplete={(cId) => navigate(`/courses/${cId}/certificate`)}/>;
  };

  const CertificatePageWrapper = () => {
    const {id} = useParams();
    const courseId = parseInt(id || '0', 10);
    return <CertificatePage courseId={courseId} allCourses={allCourses} user={userData!}
                            onBack={() => navigate(`/courses/${courseId}`)}/>;
  };

  const OrganizationProfilePageWrapper = () => {
    const {id} = useParams();
    return <OrganizationProfilePage id={parseInt(id || '0', 10)}/>;
  };

  const CreateStoryPageWrapper = () => {
    const [searchParams] = useSearchParams();
    return <CreateStoryPage onCancel={() => navigate('/stories')} onPublish={() => {
      showToast('Ваша история опубликована!', 'success');
      navigate('/stories');
    }} initialEventId={searchParams.get('eventId')}/>;
  };

  const StoryDetailPageWrapper = () => {
    const {id} = useParams();
    return <StoryDetailPage id={parseInt(id || '0', 10)} currentUserAvatar={userData!.avatarUrl}/>;
  };

  const RewardsDetailPageWrapper = () => {
    const {id} = useParams();
    const rewardId = parseInt(id || '0', 10);
    return <RewardsDetailPage rewardId={rewardId} allRewards={allRewards} user={userData!} onPurchase={(rId) => {
      setAllRewards(prev => prev.map(r => r.id === rId ? {...r, isPurchased: true} : r));
      showToast('Поздравляем с покупкой!', 'success');
      navigate('/profile/rewardsStore');
    }}/>;
  };

  const LeaderboardPageWrapper = () => <LeaderboardPage user={userData!} onBack={() => navigate('/profile')}/>;
  const SettingsPageWrapper = () => <SettingsPage onBack={() => navigate('/profile')} onLogout={handleLogout}/>;
  const EditProfilePageWrapper = () => <EditProfilePage user={userData!} onCancel={() => navigate('/profile/settings')}
                                                        onSave={handleSaveProfile}/>;
  const MyCertificatesPageWrapper = () => <MyCertificatesPage user={userData!} onBack={() => navigate('/profile')}
                                                              onSelectCertificate={(courseId) => navigate(`/courses/${courseId}/certificate`)}
                                                              onGoToTraining={() => navigate('/training')}/>;
  const RewardsStorePageWrapper = () => <RewardsStorePage user={userData!} rewards={allRewards}
                                                          onBack={() => navigate('/profile')}/>;

  const EventManagementPageWrapper = () => <EventManagementPage onBack={() => setAppMode('volunteer')}
                                                                onCreateEvent={() => navigate('/organization-events/create')}
                                                                onEditEvent={(e) => navigate(`/organization-events/edit/${e.id}`)}
                                                                onManageParticipants={(e) => navigate(`/organization-events/participants/${e.id}`)}/>;
  const CreateEventPageWrapper = () => <CreateEventPage onBack={() => navigate('/organization-events')}
                                                        onPublish={() => {
                                                          showToast('Событие опубликовано!', 'success');
                                                          navigate('/organization-events');
                                                        }}/>;
  const EditEventPageWrapper = () => {
    const {eventId} = useParams();
    return <CreateEventPage event={{id: parseInt(eventId!, 10)} as OrganizationEvent}
                            onBack={() => navigate('/organization-events')} onPublish={() => {
      showToast('Событие сохранено!', 'success');
      navigate('/organization-events');
    }}/>
  };
  const EventParticipantsPageWrapper = () => {
    const {eventId} = useParams();
    return <EventParticipantsPage event={{id: parseInt(eventId!, 10)} as OrganizationEvent}
                                  onBack={() => navigate('/organization-events')}/>;
  };

  const renderRoutes = () => {
    if (appMode === 'organization') {
      return (
        <Routes>
          <Route path="/organization-dashboard"
                 element={<OrganizationDashboardPage onSwitchToVolunteer={() => setAppMode('volunteer')}
                                                     onManageEvents={() => navigate('/organization-events')}
                                                     onCreateEvent={() => navigate('/organization-events/create')}/>}/>
          <Route path="/organization-events" element={<EventManagementPageWrapper/>}/>
          <Route path="/organization-events/create" element={<CreateEventPageWrapper/>}/>
          <Route path="/organization-events/edit/:eventId" element={<EditEventPageWrapper/>}/>
          <Route path="/organization-events/participants/:eventId" element={<EventParticipantsPageWrapper/>}/>
          <Route path="*" element={<Navigate to="/organization-dashboard" replace/>}/>
        </Routes>
      );
    }

    if (!isAuthenticated) {
      return (
        <Routes>
          <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthSuccess}/>}/>
          <Route path="/onboarding" element={<OnboardingPage onComplete={handleOnboardingComplete}/>}/>
          <Route path="*" element={<Navigate to="/auth" replace/>}/>
        </Routes>
      );
    }

    if (!userData || !allCourses) {
      return <SplashPage/>;
    }

    return (
      <Routes>
        <Route path="/home" element={<TabsLayout user={userData} activeTab="home"
                                                 onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path="/training" element={<TabsLayout user={userData} activeTab="training"
                                                     onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path="/organizations" element={<TabsLayout user={userData} activeTab="organizations"
                                                          onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path="/stories" element={<TabsLayout user={userData} activeTab="stories"
                                                    onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path="/profile" element={<TabsLayout user={userData} activeTab="profile"
                                                    onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>

        <Route path="/events/:id/chat" element={<EventChatPageWrapper/>}/>
        <Route path="/events/:id" element={<EventDetailPage/>}/>
        <Route path="/courses/:id/lesson/:subId" element={<LessonPageWrapper/>}/>
        <Route path="/courses/:id/certificate" element={<CertificatePageWrapper/>}/>
        <Route path="/courses/:id" element={<CourseDetailPageWrapper/>}/>
        <Route path="/organizations/:id" element={<OrganizationProfilePageWrapper/>}/>
        <Route path="/stories/create" element={<CreateStoryPageWrapper/>}/>
        <Route path="/stories/:id" element={<StoryDetailPageWrapper/>}/>
        <Route path="/rewards/:id" element={<RewardsDetailPageWrapper/>}/>
        <Route path="/chat" element={<AssistantChatPage onClose={() => navigate('/home')} user={userData}/>}/>

        <Route path="/profile/activityHistory" element={<ActivityHistoryPage/>}/>
        <Route path="/profile/allAchievements" element={<AllAchievementsPage/>}/>
        <Route path="/profile/calendar" element={<CalendarPage/>}/>
        <Route path="/profile/leaderboards" element={<LeaderboardPageWrapper/>}/>
        <Route path="/profile/settings" element={<SettingsPageWrapper/>}/>
        <Route path="/profile/editProfile" element={<EditProfilePageWrapper/>}/>
        <Route path="/profile/myCertificates" element={<MyCertificatesPageWrapper/>}/>
        <Route path="/profile/myChats" element={<MyChatsPage/>}/>
        <Route path="/profile/rewardsStore" element={<RewardsStorePageWrapper/>}/>

        <Route path="/" element={<Navigate to="/home" replace/>}/>

        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    );
  };

  if (error) return <ErrorPage type={error} onRetry={initializeApp}/>;

  if (!isInitialized) return <SplashPage/>;

  return (
    <>
      {renderRoutes()}
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast(prev => ({...prev, show: false}))}
        type={toast.type || 'info'}
      />
    </>
  );
};

export default App;


```


### frontend/src/app/profile/achievements/page.tsx
```
import React, {useEffect, useState} from 'react';
import {fetchAllAchievements} from '../../../lib/api';
import type {Achievement} from '../../../lib/types';
import {ArrowLeftIcon, EmptyShelfIllustrationIcon, LockClosedIcon} from '../../../components/ui/icons';
import AchievementDetailModal from '../../../features/achievements/components/AchievementDetailModal';
import EmptyState from '../../../components/ui/EmptyState';


const CircularProgressBar: React.FC<{ progress: number; size: number; strokeWidth: number; }> = ({
                                                                                                   progress,
                                                                                                   size,
                                                                                                   strokeWidth
                                                                                                 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        className="text-gray-200"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="text-[#007AFF]"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          transition: 'stroke-dashoffset 0.5s ease-out'
        }}
      />
    </svg>
  );
};

const AchievementBadge: React.FC<{ achievement: Achievement }> = ({achievement}) => {
  if (achievement.unlocked) {
    return (
      <div className="flex flex-col items-center text-center">
        <div
          className="w-24 h-24 rounded-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex items-center justify-center shadow-md mb-2">
          <achievement.Icon className="w-14 h-14 text-white"/>
        </div>
        <h4 className="font-bold text-sm text-[#0C0D0E]">{achievement.name}</h4>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center" title={achievement.description}>
      <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
        <LockClosedIcon className="w-12 h-12 text-gray-400"/>
      </div>
      <h4 className="font-semibold text-sm text-[rgb(12,13,14,0.52)]">{achievement.name}</h4>
    </div>
  );
};

const AllAchievementsPage: React.FC = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const onBack = () => window.location.hash = '#/profile';

  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true);
      const data = await fetchAllAchievements();
      setAchievements(data);
      setLoading(false);
    };
    loadAchievements();
  }, []);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const totalCount = achievements.length;
  const unlockedCount = unlockedAchievements.length;
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const handleNavigateWithFilter = (category: string) => {
    setSelectedAchievement(null);
    if (category === 'Обучение') {
      window.location.hash = '#/training';
    } else if (category === 'Организации') {
      window.location.hash = '#/organizations';
    } else {
      // For other categories, just go home and user can filter
      window.location.hash = '#/home';
    }
  };

  const onFindEvent = () => window.location.hash = '#/home';

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-2xl font-bold text-[#0C0D0E] mx-auto">Мои достижения</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-6 space-y-8">
        {loading ? <p className="text-center text-gray-500">Загрузка достижений...</p> : (
          <>
            <section className="bg-white rounded-2xl shadow-sm p-6 flex items-center space-x-6">
              <div className="relative">
                <CircularProgressBar progress={progress} size={80} strokeWidth={8}/>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#0C0D0E]">
                               {progress}%
                            </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0C0D0E]">Ваш прогресс</h2>
                <p className="text-[rgb(12,13,14,0.52)]">Открыто <span
                  className="font-semibold text-[#007AFF]">{unlockedCount}</span> из <span
                  className="font-semibold">{totalCount}</span> достижений</p>
              </div>
            </section>

            {unlockedCount === 0 ? (
              <EmptyState
                Icon={EmptyShelfIllustrationIcon}
                title="Ваш путь героя начинается!"
                subtitle="Совершайте добрые дела, и здесь появится ваша коллекция наград."
                action={{
                  text: 'К списку возможностей',
                  onClick: onFindEvent,
                  type: 'primary'
                }}
              />
            ) : (
              <>
                <section>
                  <h3 className="text-xl font-bold text-[#0C0D0E] mb-4">Полученные</h3>
                  <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                    {unlockedAchievements.map(ach => (
                      <button key={ach.id} onClick={() => setSelectedAchievement(ach)}
                              className="transition-transform active:scale-95">
                        <AchievementBadge achievement={ach}/>
                      </button>
                    ))}
                  </div>
                </section>
                {lockedAchievements.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold text-[#0C0D0E] mb-4">Еще можно открыть</h3>
                    <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                      {lockedAchievements.map(ach => (
                        <button key={ach.id} onClick={() => setSelectedAchievement(ach)}
                                className="transition-transform active:scale-95">
                          <AchievementBadge achievement={ach}/>
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </main>

      <AchievementDetailModal
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        onNavigateWithFilter={handleNavigateWithFilter}
      />
    </div>
  );
};

export default AllAchievementsPage;


```


### frontend/src/app/profile/calendar/page.tsx
```
import React, {useEffect, useMemo, useState} from 'react';
import {fetchActivityHistoryEvents} from '../../../lib/api';
import type {HistoryEvent} from '../../../lib/types';
import {ArrowLeftIcon, CalendarEmptyIcon, ChevronRightIcon} from '../../../components/ui/icons';

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const categoryColors: { [key: string]: string } = {
  'Спорт': 'bg-[#FF303C]',
  'Арт': 'bg-purple-500',
  'Экология': 'bg-[#1ABE43]',
  'Животные': 'bg-[#FF9315]',
  'Помощь старшим': 'bg-yellow-500',
  'Онлайн': 'bg-indigo-500',
  'default': 'bg-[#007AFF]'
};

const parseRuDate = (dateString: string): Date | null => {
  const monthMap: { [key: string]: number } = {
    'января': 0,
    'февраля': 1,
    'марта': 2,
    'апреля': 3,
    'мая': 4,
    'июня': 5,
    'июля': 6,
    'августа': 7,
    'сентября': 8,
    'октября': 9,
    'ноября': 10,
    'декабря': 11
  };
  const parts = dateString.replace(',', '').split(' ');
  if (parts.length < 3) return null;

  const day = parseInt(parts[0], 10);
  const month = monthMap[parts[1].toLowerCase()];
  const time = parts[2].split(':');
  const hour = parseInt(time[0], 10);
  const minute = parseInt(time[1], 10);

  if (isNaN(day) || month === undefined || isNaN(hour) || isNaN(minute)) return null;

  const year = new Date().getFullYear();
  return new Date(year, month, day, hour, minute);
};


const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<(HistoryEvent & { parsedDate: Date | null })[]>([]);

  const onBack = () => window.location.hash = '#/profile';
  const onFindEvent = () => window.location.hash = '#/home';
  const onSelectEvent = (id: number) => window.location.hash = `#/events/${id}`;

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const events = await fetchActivityHistoryEvents();
      const processedEvents = events
        .filter(e => e.status === 'upcoming')
        .map(e => ({...e, parsedDate: parseRuDate(e.date)}))
        .filter(e => e.parsedDate !== null);
      setUpcomingEvents(processedEvents);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    upcomingEvents.forEach(event => {
      if (event.parsedDate) {
        dates.add(event.parsedDate.toDateString());
      }
    });
    return dates;
  }, [upcomingEvents]);

  const eventsForSelectedDay = useMemo(() => {
    return upcomingEvents
      .filter(event => event.parsedDate?.toDateString() === selectedDate.toDateString())
      .sort((a, b) => (a.parsedDate?.getTime() || 0) - (b.parsedDate?.getTime() || 0));
  }, [selectedDate, upcomingEvents]);

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const startOffset = (firstDay === 0) ? 6 : firstDay - 1;

    const grid: (Date | null)[] = Array(startOffset).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(new Date(year, month, day));
    }
    return grid;
  };

  const today = new Date();
  const calendarGrid = generateCalendarGrid();

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header className="flex-shrink-0 p-6 pb-4 bg-white flex items-center">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      <main className="flex-grow overflow-y-auto">
        <div className="bg-white p-6 rounded-b-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon
              className="w-6 h-6 text-gray-500 transform rotate-180"/></button>
            <h2
              className="text-xl font-bold text-[#0C0D0E]">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon
              className="w-6 h-6 text-gray-500"/></button>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center">
            {dayNames.map(day => <div key={day} className="text-sm font-semibold text-gray-400">{day}</div>)}
            {calendarGrid.map((day, index) => {
              if (!day) return <div key={`empty-${index}`}></div>;
              const isToday = day.toDateString() === today.toDateString();
              const isSelected = day.toDateString() === selectedDate.toDateString();
              const hasEvent = eventDates.has(day.toDateString());

              return (
                <div key={index} className="flex justify-center items-center py-1">
                  <button
                    onClick={() => setSelectedDate(day)}
                    className={`w-10 h-10 rounded-full flex flex-col items-center justify-center transition-colors duration-200
                                            ${isSelected ? 'bg-[#007AFF] text-white shadow-md' : 'hover:bg-blue-100'}
                                            ${!isSelected && isToday ? 'border-2 border-[#007AFF]' : ''}
                                            ${!isSelected ? 'text-[#0C0D0E]' : ''}
                                        `}>
                    <span className="font-semibold">{day.getDate()}</span>
                    {hasEvent && <div
                        className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-[#007AFF]'}`}></div>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {loading ? <p className="text-center text-gray-500">Загрузка событий...</p> : (
            upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <CalendarEmptyIcon className="w-24 h-24 text-gray-300 mb-4"/>
                <h3 className="font-bold text-xl text-[#0C0D0E]">Ваш календарь пока пуст</h3>
                <p className="text-[rgb(12,13,14,0.52)] max-w-xs mt-1 mb-6">Как только вы запишетесь на событие, оно
                  появится здесь.</p>
                <button
                  onClick={onFindEvent}
                  className="bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                >
                  Найти доброе дело
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#0C0D0E] mb-4">События
                  на {selectedDate.toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'})}</h3>
                {eventsForSelectedDay.length > 0 ? (
                  <div className="space-y-3">
                    {eventsForSelectedDay.map(event => (
                      <button key={event.id} onClick={() => onSelectEvent(event.id)}
                              className="w-full bg-white rounded-2xl shadow-sm p-4 text-left flex items-start space-x-4 transition-transform active:scale-95">
                        <div className="flex-shrink-0 w-12 text-center">
                          <p
                            className="font-bold text-lg text-[#0C0D0E]">{event.parsedDate?.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                        <div
                          className={`w-1 flex-shrink-0 h-16 rounded-full ${categoryColors[event.category] || categoryColors.default}`}></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#0C0D0E]">{event.title}</h4>
                          <p className="text-sm text-[rgb(12,13,14,0.52)]">{event.location}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-[rgb(12,13,14,0.52)] py-10">
                    <p>На этот день дел не запланировано</p>
                  </div>
                )}
              </>
            )
          )}
        </div>

      </main>
    </div>
  );
};

export default CalendarPage;


```


### frontend/src/app/profile/certificates/page.tsx
```
import React, {useMemo} from 'react';
import {allCourses} from '../../../lib/mockData';
import type {Course, User} from '../../../lib/types';
import {ArrowLeftIcon, DiplomaStandIllustrationIcon, HeartHandIcon} from '../../../components/ui/icons';
import EmptyState from '../../../components/ui/EmptyState';

const CertificatePreviewCard: React.FC<{ course: Course; userName: string; onSelect: () => void; }> = ({
                                                                                                         course,
                                                                                                         userName,
                                                                                                         onSelect
                                                                                                       }) => (
  <button onClick={onSelect}
          className="bg-white rounded-2xl shadow-lg w-full p-4 border-2 border-transparent hover:border-blue-400 aspect-[5/7] flex flex-col relative overflow-hidden transition-all duration-200 active:scale-95">
    <HeartHandIcon className="absolute -bottom-6 -right-6 w-24 h-24 text-gray-100/70 transform rotate-12"/>
    <div className="flex items-center space-x-1.5 mb-4">
      <HeartHandIcon className="w-6 h-6 text-[#007AFF]"/>
      <span className="font-bold text-sm">MAX<span className="text-[#007AFF]">Добро</span></span>
    </div>
    <div className="flex-grow flex flex-col justify-center items-center text-center space-y-1">
      <h2 className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">СЕРТИФИКАТ</h2>
      <p className="text-xs text-gray-500 pt-2">Настоящим подтверждается, что</p>
      <h1 className="text-xl font-serif text-[#0C0D0E] leading-tight">{userName}</h1>
      <p className="text-xs text-gray-500">успешно прошел(а) курс</p>
      <h3 className="text-base font-serif text-[#007AFF] leading-tight mt-1">«{course.title}»</h3>
    </div>
  </button>
);

const MyCertificatesPage: React.FC<{
  user: User;
  onBack: () => void;
  onSelectCertificate: (courseId: number) => void;
  onGoToTraining: () => void;
}> = ({user, onBack, onSelectCertificate, onGoToTraining}) => {

  const completedCourses = useMemo(() => {
    return allCourses.filter(c => c.status === 'completed' && c.hasCertificate);
  }, []);

  const userName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-2xl font-bold text-[#0C0D0E] mx-auto">Мои сертификаты</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-6">
        {completedCourses.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {completedCourses.map(course => (
              <CertificatePreviewCard
                key={course.id}
                course={course}
                userName={userName}
                onSelect={() => onSelectCertificate(course.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            Icon={DiplomaStandIllustrationIcon}
            title="Знания ждут вас"
            subtitle="Пройдите свой первый курс, чтобы получить красивый сертификат и новые навыки."
            action={{
              text: 'Перейти к обучению',
              onClick: onGoToTraining,
              type: 'primary'
            }}
          />
        )}
      </main>
    </div>
  );
};

export default MyCertificatesPage;


```


### frontend/src/app/profile/chats/page.tsx
```
import React, {useEffect, useMemo, useState} from 'react';
import {fetchMyChats} from '../../../lib/api';
import type {MyChatItem} from '../../../lib/types';
import {ArrowLeftIcon, EmptyChatIllustrationIcon, SearchIcon} from '../../../components/ui/icons';
import EmptyState from '../../../components/ui/EmptyState';

const ChatCell: React.FC<{ chat: MyChatItem; onSelect: () => void }> = ({chat, onSelect}) => (
  <button onClick={onSelect}
          className="w-full flex items-start px-4 text-left space-x-4 hover:bg-gray-50 transition-colors">
    <div className="relative flex-shrink-0 py-3">
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
        <chat.Icon className="w-8 h-8 text-gray-500"/>
      </div>
    </div>
    <div className="flex-1 min-w-0 border-t border-gray-100 py-3 flex flex-col justify-center">
      <div className="flex justify-between items-start">
        <p className="font-bold text-md text-[#0C0D0E] truncate pr-2">{chat.eventTitle}</p>
        <p className="text-xs text-gray-400 flex-shrink-0">{chat.timestamp}</p>
      </div>
      <div className="flex justify-between items-start mt-1">
        <p className="text-sm text-[rgb(12,13,14,0.52)] truncate pr-2">{chat.lastMessage}</p>
        {chat.unreadCount > 0 && (
          <span
            className="bg-[#007AFF] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">
                        {chat.unreadCount}
                    </span>
        )}
      </div>
    </div>
  </button>
);


const MyChatsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [loading, setLoading] = useState(true);
  const [allChats, setAllChats] = useState<MyChatItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const onBack = () => window.location.hash = '#/profile';
  const onSelectChat = (id: number) => window.location.hash = `#/events/${id}/chat`;
  const onFindEvent = () => window.location.hash = '#/home';


  useEffect(() => {
    const loadChats = async () => {
      setLoading(true);
      const chats = await fetchMyChats();
      setAllChats(chats);
      setLoading(false);
    };
    loadChats();
  }, []);

  const filteredChats = useMemo(() => {
    const chatsForTab = allChats.filter(chat => (activeTab === 'active' ? !chat.isArchived : chat.isArchived));
    if (!searchQuery) {
      return chatsForTab;
    }
    return chatsForTab.filter(chat => chat.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allChats, activeTab, searchQuery]);

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-500 p-8">Загрузка чатов...</p>;
    }
    if (filteredChats.length === 0) {
      return (
        <div className="pt-10">
          <EmptyState
            Icon={EmptyChatIllustrationIcon}
            title="Здесь пока тихо"
            subtitle={
              activeTab === 'active'
                ? "Когда вы присоединитесь к событию, здесь появится чат для общения с другими волонтерами."
                : "У вас пока нет архивных чатов."
            }
            action={activeTab === 'active' ? {
              text: 'Найти событие',
              onClick: onFindEvent,
              type: 'primary',
            } : undefined
            }
          />
        </div>
      );
    }
    return (
      <div className="[&>*:first-child_>_div:last-child]:border-t-0">
        {filteredChats.map(chat => (
          <ChatCell key={chat.id} chat={chat} onSelect={() => onSelectChat(chat.eventId)}/>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-screen font-sans antialiased bg-white flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Назад">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-lg font-bold text-[#0C0D0E]">Мои чаты</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Поиск">
          <SearchIcon className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      <nav className="flex-shrink-0 p-4 bg-white">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('active')}
            className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'active' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
          >
            Активные
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'archived' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
          >
            Архивные
          </button>
        </div>
      </nav>

      <main className="flex-grow overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default MyChatsPage;


```


### frontend/src/app/profile/edit/page.tsx
```
import React, {useEffect, useState} from 'react';
import type {User} from '../../../lib/types';
import {CameraIcon} from '../../../components/ui/icons';

const EditProfilePage: React.FC<{
  user: User;
  onCancel: () => void;
  onSave: (updatedUser: User) => void;
}> = ({user, onCancel, onSave}) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    about: user.about,
  });
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const hasChanged = formData.firstName !== user.firstName ||
      formData.lastName !== user.lastName ||
      formData.about !== user.about ||
      avatar !== user.avatarUrl;
    setIsChanged(hasChanged);
  }, [formData, avatar, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSave = () => {
    if (isChanged) {
      onSave({...user, ...formData, avatarUrl: avatar});
    }
  };

  const handleChangePhoto = () => {
    const newImgId = Math.floor(Math.random() * 70);
    setAvatar(`https://i.pravatar.cc/150?img=${newImgId}`);
  }

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between">
        <button onClick={onCancel} className="text-lg font-medium text-[#007AFF]">Отмена</button>
        <h1 className="text-lg font-bold text-[#0C0D0E]">Редактирование</h1>
        <button
          onClick={handleSave}
          disabled={!isChanged}
          className={`text-lg font-bold ${isChanged ? 'text-[#007AFF]' : 'text-gray-400'}`}
        >
          Готово
        </button>
      </header>

      <main className="flex-grow overflow-y-auto pt-8 space-y-8 pb-8">
        <section className="flex flex-col items-center">
          <div className="relative mb-2">
            <img src={avatar} alt="User Avatar" className="w-28 h-28 rounded-full shadow-lg"/>
          </div>
          <button onClick={handleChangePhoto}
                  className="flex items-center space-x-2 text-lg font-medium text-[#007AFF]">
            <CameraIcon className="w-5 h-5"/>
            <span>Изменить фото</span>
          </button>
        </section>

        <section>
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mx-4">
            <div className="p-4">
              <label htmlFor="firstName" className="text-xs text-gray-500">Имя</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-transparent text-lg text-[#0C0D0E] focus:outline-none"
              />
            </div>
            <div className="p-4">
              <label htmlFor="lastName" className="text-xs text-gray-500">Фамилия</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-transparent text-lg text-[#0C0D0E] focus:outline-none"
              />
            </div>
            <div className="p-4">
              <label htmlFor="about" className="text-xs text-gray-500">О себе</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                className="w-full bg-transparent text-lg text-[#0C0D0E] focus:outline-none resize-none"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditProfilePage;


```


### frontend/src/app/profile/history/page.tsx
```
import React, {useEffect, useState} from 'react';
import {fetchActivityHistoryEvents} from '../../../lib/api';
import type {HistoryEvent} from '../../../lib/types';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  DownloadIcon,
  EmptyCalendarIllustrationIcon,
  ListIcon,
  UserCircleIcon
} from '../../../components/ui/icons';
import Toast from '../../../components/ui/Toast';
import ReviewModal from '../../../features/reviews/components/ReviewModal';
import EmptyState from '../../../components/ui/EmptyState';
import CancelModal from '../../../components/ui/CancelModal';

const UpcomingEventCard: React.FC<{
  event: HistoryEvent;
  onCancelClick: () => void;
  onSelect: (id: number) => void;
}> = ({event, onCancelClick, onSelect}) => (
  <div className="bg-white rounded-2xl shadow-md p-4 w-full">
    <div className="flex items-start space-x-4">
      <div className="w-16 h-16 flex-shrink-0 bg-blue-100 rounded-xl flex items-center justify-center">
        <event.Icon className="w-10 h-10 text-[#007AFF]"/>
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-bold text-md text-[#0C0D0E]">{event.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{event.date}</p>
        <p className="text-sm text-gray-500">{event.location}</p>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-2">
      <button
        onClick={onCancelClick}
        className="flex-1 text-sm font-semibold py-2 px-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
        Отменить запись
      </button>
      <button onClick={() => onSelect(event.id)}
              className="flex-1 text-sm font-semibold py-2 px-3 rounded-lg bg-[#007AFF] text-white hover:bg-blue-600 transition-colors">
        Подробнее
      </button>
    </div>
  </div>
);

const PastEventCard: React.FC<{
  event: HistoryEvent;
  onReviewClick: () => void;
  onSelect: (id: number) => void;
  onStoryClick: () => void;
}> = ({event, onReviewClick, onSelect, onStoryClick}) => (
  <div className="bg-white rounded-2xl shadow-sm p-4 w-full opacity-90 event-card-print">
    <button onClick={() => onSelect(event.id)} className="flex items-start space-x-4 w-full text-left">
      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center">
        <event.Icon className="w-10 h-10 text-gray-400"/>
        <div className="absolute -top-1 -right-1 bg-[#1ABE43] text-white rounded-full print:hidden">
          <CheckCircleIcon className="w-5 h-5"/>
        </div>
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-bold text-md text-gray-700">{event.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{event.date}</p>
        {event.role && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <UserCircleIcon className="w-4 h-4"/>
            <span>Роль: {event.role}</span>
          </div>
        )}
        <div className="flex space-x-4 mt-2">
          <span className="text-sm font-semibold text-[#1ABE43]">+{event.rewards?.hours} часа добра</span>
          <span className="text-sm font-semibold text-[#FF9315]">+{event.rewards?.karma} кармы</span>
        </div>
      </div>
    </button>
    <div className="mt-3 pt-3 border-t border-gray-100 print:hidden flex space-x-2">
      <button
        onClick={onReviewClick}
        className="flex-1 text-sm font-semibold py-2 px-3 rounded-lg bg-transparent border-2 border-[#007AFF] text-[#007AFF] hover:bg-blue-50 transition-colors">
        Оставить отзыв
      </button>
      <button
        onClick={onStoryClick}
        className="flex-1 text-sm font-semibold py-2 px-3 rounded-lg bg-[#007AFF] text-white hover:bg-blue-600 transition-colors">
        Рассказать историю
      </button>
    </div>
  </div>
);

const ActivityHistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState<HistoryEvent[]>([]);

  const [upcomingEvents, setUpcomingEvents] = useState<HistoryEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<HistoryEvent[]>([]);

  const [cancellingEvent, setCancellingEvent] = useState<HistoryEvent | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    onUndo?: () => void;
    type?: 'success' | 'info'
  }>({show: false, message: ''});
  const [lastCancelledEvent, setLastCancelledEvent] = useState<HistoryEvent | null>(null);
  const [reviewingEvent, setReviewingEvent] = useState<HistoryEvent | null>(null);

  const onBack = () => window.location.hash = '#/profile';
  const onFindEvent = () => window.location.hash = '#/home';
  const onSelectEvent = (id: number) => window.location.hash = `#/events/${id}`;
  const onStartCreateStory = (event: HistoryEvent) => window.location.hash = `#/stories/create?eventId=${event.id}`;

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      const events = await fetchActivityHistoryEvents();
      setAllEvents(events);
      setUpcomingEvents(events.filter(e => e.status === 'upcoming'));
      setPastEvents(events.filter(e => e.status === 'past'));
      setLoading(false);
    };
    loadHistory();
  }, []);

  const handleConfirmCancel = () => {
    if (!cancellingEvent) return;

    setLastCancelledEvent(cancellingEvent);
    setUpcomingEvents(prev => prev.filter(e => e.id !== cancellingEvent.id));
    setCancellingEvent(null);

    setToast({
      show: true,
      message: "Ваша запись отменена",
      onUndo: handleUndoCancel,
      type: 'info'
    });
  };

  const handleUndoCancel = () => {
    if (lastCancelledEvent) {
      setUpcomingEvents(prev => [...prev, lastCancelledEvent]);
      setLastCancelledEvent(null);
    }
  };

  const handleReviewSubmit = () => {
    setReviewingEvent(null);
    setToast({
      show: true,
      message: "Спасибо за ваш отзыв!",
      type: "success",
    });
  };

  return (
    <>
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({...toast, show: false})}
        onUndo={toast.onUndo}
        type={toast.type || 'info'}
      />
      <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col" id="activity-history-screen">
        <header
          className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex justify-between items-center print:hidden">
          <button onClick={onBack}
                  className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
          </button>
          <h1 className="text-2xl font-bold text-[#0C0D0E]">История активностей</h1>
          <button onClick={() => window.print()}
                  className="flex items-center space-x-1.5 text-sm font-semibold text-[#007AFF]">
            <DownloadIcon className="w-5 h-5"/>
            <span>Выгрузить в PDF</span>
          </button>
        </header>

        <div id="print-header" className="hidden print:block text-center p-4 border-b">
          <h1 className="text-2xl font-bold">История активностей</h1>
          <p className="text-lg">Отчет сформирован {new Date().toLocaleDateString('ru-RU')}</p>
        </div>

        <nav className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm print:hidden">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'upcoming' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
            >
              Предстоящие
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'past' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
            >
              Прошедшие
            </button>
          </div>
        </nav>

        <main className="flex-grow overflow-y-auto p-4 space-y-4">
          <div className="print:hidden">
            {loading ? (
              <p className="text-center text-gray-500">Загрузка...</p>
            ) : activeTab === 'upcoming' ? (
              upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => <UpcomingEventCard key={event.id} event={event}
                                                               onCancelClick={() => setCancellingEvent(event)}
                                                               onSelect={onSelectEvent}/>)
              ) : (
                <EmptyState
                  Icon={EmptyCalendarIllustrationIcon}
                  title="Время для новых дел!"
                  subtitle="Ваш список пока пуст. Самое время найти первое доброе дело и запланировать его!"
                  action={{
                    text: 'Найти событие',
                    onClick: onFindEvent,
                    type: 'primary',
                  }}
                />
              )
            ) : (
              pastEvents.length > 0 ? (
                pastEvents.map(event => <PastEventCard key={event.id} event={event}
                                                       onReviewClick={() => setReviewingEvent(event)}
                                                       onSelect={onSelectEvent}
                                                       onStoryClick={() => onStartCreateStory(event)}/>)
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                  <ListIcon className="w-24 h-24 text-gray-300 mb-4"/>
                  <h3 className="font-bold text-xl text-[#0C0D0E]">История пока пуста</h3>
                  <p className="text-gray-500 max-w-xs mt-1">Ваши завершенные дела появятся здесь после первого
                    участия.</p>
                </div>
              )
            )}
          </div>
          <div className="hidden print:block space-y-4">
            <h2 className="text-xl font-bold">Прошедшие события</h2>
            {pastEvents.length > 0 ? (
              pastEvents.map(event => <PastEventCard key={event.id} event={event} onReviewClick={() => {
              }} onSelect={() => {
              }} onStoryClick={() => {
              }}/>)
            ) : (
              <p>Нет прошедших событий для отображения.</p>
            )}
          </div>
        </main>
      </div>
      <CancelModal
        isOpen={!!cancellingEvent}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancellingEvent(null)}
      />
      <ReviewModal
        isOpen={!!reviewingEvent}
        event={reviewingEvent}
        onClose={() => setReviewingEvent(null)}
        onSubmit={handleReviewSubmit}
      />
      <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #activity-history-screen, #activity-history-screen * { visibility: visible; }
                    #activity-history-screen { position: absolute; left: 0; top: 0; width: 100%; height: auto; background-color: white !important; font-size: 12px; }
                    main { overflow: visible; padding: 1rem; }
                    .print\\:hidden { display: none !important; }
                    .hidden.print\\:block { display: block !important; }
                    .event-card-print { box-shadow: none; border: 1px solid #e5e7eb; margin-bottom: 1rem; page-break-inside: avoid; }
                }
            `}</style>
    </>
  );
};

export default ActivityHistoryPage;


```


### frontend/src/app/profile/leaderboard/page.tsx
```
import React, {useEffect, useMemo, useState} from 'react';
import {fetchLeaderboardData} from '../../../lib/api';
import {CURRENT_USER_ID} from '../../../lib/mockData';
import type {LeaderboardUser, User} from '../../../lib/types';
import {ArrowLeftIcon, BronzeMedalIcon, GoldMedalIcon, SilverMedalIcon, StarIcon} from '../../../components/ui/icons';

type Period = 'week' | 'month' | 'allTime';

const PodiumMember: React.FC<{
  user: LeaderboardUser;
  rank: number;
  className?: string;
  medal: React.ReactNode
}> = React.memo(({user, rank, className, medal}) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div className="relative">
      <img loading="lazy" src={user.avatarUrl} alt={user.name}
           className="w-20 h-20 rounded-full border-4 border-white shadow-lg"/>
      <div className="absolute -bottom-2 -right-2">{medal}</div>
    </div>
    <h3 className="font-bold text-md text-[#0C0D0E] mt-2">{user.name}</h3>
    <p className="text-sm font-semibold text-[#007AFF]">{user.karma.toLocaleString('ru-RU')} кармы</p>
  </div>
));

const Podium: React.FC<{ users: LeaderboardUser[] }> = React.memo(({users}) => {
  const [first, second, third] = users;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-around items-end">
      {second &&
          <PodiumMember user={second} rank={2} className="w-1/3 mt-6" medal={<SilverMedalIcon className="w-8 h-8"/>}/>}
      {first &&
          <PodiumMember user={first} rank={1} className="w-1/3 mb-6" medal={<GoldMedalIcon className="w-10 h-10"/>}/>}
      {third &&
          <PodiumMember user={third} rank={3} className="w-1/3 mt-8" medal={<BronzeMedalIcon className="w-8 h-8"/>}/>}
    </div>
  );
});

const LeaderboardRow: React.FC<{ user: LeaderboardUser; isCurrentUser: boolean; }> = React.memo(({
                                                                                                   user,
                                                                                                   isCurrentUser
                                                                                                 }) => (
  <div className={`flex items-center p-4 rounded-xl ${isCurrentUser ? 'bg-blue-100' : ''}`}>
    <span className="font-bold text-lg text-gray-500 w-8">{user.rank}</span>
    <img loading="lazy" src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mx-4"/>
    <span className="font-semibold text-md text-[#0C0D0E] flex-1">{user.name}</span>
    <div className="flex items-center space-x-1">
      <span className="font-bold text-md text-[#0C0D0E]">{user.karma.toLocaleString('ru-RU')}</span>
      <StarIcon className="w-4 h-4 text-yellow-400"/>
    </div>
  </div>
));

const UserPositionFooter: React.FC<{ user: LeaderboardUser | undefined }> = ({user}) => {
  if (!user) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-center p-4 rounded-xl">
          <p className="text-[rgb(12,13,14,0.52)] font-semibold">У вас пока 0 баллов. Начните помогать, чтобы попасть в
            рейтинг!</p>
        </div>
      </div>
    );
  }
  return (
    <div
      className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <LeaderboardRow user={user} isCurrentUser={true}/>
    </div>
  );
};

const SkeletonPodium = () => (
  <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-around items-end animate-pulse">
    <div className="flex flex-col items-center w-1/3 mt-6">
      <div className="w-20 h-20 rounded-full bg-gray-200"></div>
      <div className="h-4 bg-gray-200 rounded w-20 mt-2"></div>
      <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
    </div>
    <div className="flex flex-col items-center w-1/3 mb-6">
      <div className="w-20 h-20 rounded-full bg-gray-200"></div>
      <div className="h-4 bg-gray-200 rounded w-20 mt-2"></div>
      <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
    </div>
    <div className="flex flex-col items-center w-1/3 mt-8">
      <div className="w-20 h-20 rounded-full bg-gray-200"></div>
      <div className="h-4 bg-gray-200 rounded w-20 mt-2"></div>
      <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
    </div>
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center p-4 animate-pulse">
    <div className="w-8 h-6 bg-gray-200 rounded"></div>
    <div className="w-12 h-12 rounded-full bg-gray-200 mx-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3 flex-1"></div>
    <div className="h-5 bg-gray-200 rounded w-16"></div>
  </div>
);

const LeaderboardPage: React.FC<{ user: User; onBack: () => void; }> = ({user, onBack}) => {
  const [activeTab, setActiveTab] = useState<Period>('month');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const leaderboardData = await fetchLeaderboardData(activeTab);
      const updatedData = leaderboardData.map(u =>
        u.id === CURRENT_USER_ID ? {...u, name: `${user.firstName} ${user.lastName}`} : u
      );
      setData(updatedData);
      setLoading(false);
    };
    loadData();
  }, [activeTab, user]);

  const topThree = useMemo(() => data.slice(0, 3), [data]);
  const listData = useMemo(() => data.slice(3, 100), [data]);
  const currentUserData = useMemo(() => data.find(u => u.id === CURRENT_USER_ID), [data]);

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-2xl font-bold text-[#0C0D0E] mx-auto">Рейтинг героев</h1>
        <div className="w-8"></div>
      </header>

      <nav className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button onClick={() => setActiveTab('week')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'week' ? 'bg-white shadow text-[#007AFF]' : 'text-[rgb(12,13,14,0.52)]'}`}>За
            неделю
          </button>
          <button onClick={() => setActiveTab('month')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'month' ? 'bg-white shadow text-[#007AFF]' : 'text-[rgb(12,13,14,0.52)]'}`}>За
            месяц
          </button>
          <button onClick={() => setActiveTab('allTime')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'allTime' ? 'bg-white shadow text-[#007AFF]' : 'text-[rgb(12,13,14,0.52)]'}`}>За
            все время
          </button>
        </div>
      </nav>

      <main className="flex-grow overflow-y-auto p-6 space-y-6 pb-28">
        {loading ? (
          <>
            <SkeletonPodium/>
            <div className="bg-white rounded-2xl shadow-sm p-2 space-y-2">
              <SkeletonRow/>
              <SkeletonRow/>
              <SkeletonRow/>
              <SkeletonRow/>
            </div>
          </>
        ) : (
          <>
            <Podium users={topThree}/>
            <div className="bg-white rounded-2xl shadow-sm p-2">
              {listData.map(user => (
                <LeaderboardRow key={user.id} user={user} isCurrentUser={user.id === CURRENT_USER_ID}/>
              ))}
            </div>
          </>
        )}
      </main>

      <UserPositionFooter user={currentUserData}/>
    </div>
  );
};

export default LeaderboardPage;


```


### frontend/src/app/profile/myCertificates/page.tsx
```
import React, {useMemo} from 'react';
import {allCourses} from '../../../lib/mockData';
import type {Course, User} from '../../../lib/types';
import {ArrowLeftIcon, DiplomaStandIllustrationIcon, HeartHandIcon} from '../../../components/ui/icons';
import EmptyState from '../../../components/ui/EmptyState';

const CertificatePreviewCard: React.FC<{ course: Course; userName: string; onSelect: () => void; }> = ({
                                                                                                         course,
                                                                                                         userName,
                                                                                                         onSelect
                                                                                                       }) => (
  <button onClick={onSelect}
          className="bg-white rounded-2xl shadow-lg w-full p-4 border-2 border-transparent hover:border-blue-400 aspect-[5/7] flex flex-col relative overflow-hidden transition-all duration-200 active:scale-95">
    <HeartHandIcon className="absolute -bottom-6 -right-6 w-24 h-24 text-gray-100/70 transform rotate-12"/>
    <div className="flex items-center space-x-1.5 mb-4">
      <HeartHandIcon className="w-6 h-6 text-[#007AFF]"/>
      <span className="font-bold text-sm">MAX<span className="text-[#007AFF]">Добро</span></span>
    </div>
    <div className="flex-grow flex flex-col justify-center items-center text-center space-y-1">
      <h2 className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">СЕРТИФИКАТ</h2>
      <p className="text-xs text-gray-500 pt-2">Настоящим подтверждается, что</p>
      <h1 className="text-xl font-serif text-[#0C0D0E] leading-tight">{userName}</h1>
      <p className="text-xs text-gray-500">успешно прошел(а) курс</p>
      <h3 className="text-base font-serif text-[#007AFF] leading-tight mt-1">«{course.title}»</h3>
    </div>
  </button>
);

const MyCertificatesPage: React.FC<{
  user: User;
  onBack: () => void;
  onSelectCertificate: (courseId: number) => void;
  onGoToTraining: () => void;
}> = ({user, onBack, onSelectCertificate, onGoToTraining}) => {

  const completedCourses = useMemo(() => {
    return allCourses.filter(c => c.status === 'completed' && c.hasCertificate);
  }, []);

  const userName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-2xl font-bold text-[#0C0D0E] mx-auto">Мои сертификаты</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-6">
        {completedCourses.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {completedCourses.map(course => (
              <CertificatePreviewCard
                key={course.id}
                course={course}
                userName={userName}
                onSelect={() => onSelectCertificate(course.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            Icon={DiplomaStandIllustrationIcon}
            title="Знания ждут вас"
            subtitle="Пройдите свой первый курс, чтобы получить красивый сертификат и новые навыки."
            action={{
              text: 'Перейти к обучению',
              onClick: onGoToTraining,
              type: 'primary'
            }}
          />
        )}
      </main>
    </div>
  );
};

export default MyCertificatesPage;


```


### frontend/src/app/profile/myChats/page.tsx
```
import React, {useEffect, useMemo, useState} from 'react';
import {fetchMyChats} from '../../../lib/api';
import type {MyChatItem} from '../../../lib/types';
import {ArrowLeftIcon, EmptyChatIllustrationIcon, SearchIcon, XIcon} from '../../../components/ui/icons';
import EmptyState from '../../../components/ui/EmptyState';

const ChatCell: React.FC<{ chat: MyChatItem; onSelect: () => void }> = ({chat, onSelect}) => (
  <button onClick={onSelect}
          className="w-full flex items-start px-4 text-left space-x-4 hover:bg-gray-50 transition-colors">
    <div className="relative flex-shrink-0 py-3">
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
        <chat.Icon className="w-8 h-8 text-gray-500"/>
      </div>
    </div>
    <div className="flex-1 min-w-0 border-t border-gray-100 py-3 flex flex-col justify-center">
      <div className="flex justify-between items-start">
        <p className="font-bold text-md text-[#0C0D0E] truncate pr-2">{chat.eventTitle}</p>
        <p className="text-xs text-gray-400 flex-shrink-0">{chat.timestamp}</p>
      </div>
      <div className="flex justify-between items-start mt-1">
        <p className="text-sm text-[rgb(12,13,14,0.52)] truncate pr-2">{chat.lastMessage}</p>
        {chat.unreadCount > 0 && (
          <span
            className="bg-[#007AFF] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">
                        {chat.unreadCount}
                    </span>
        )}
      </div>
    </div>
  </button>
);


const MyChatsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [loading, setLoading] = useState(true);
  const [allChats, setAllChats] = useState<MyChatItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onBack = () => window.location.hash = '#/profile';
  const onSelectChat = (id: number) => window.location.hash = `#/events/${id}/chat`;
  const onFindEvent = () => window.location.hash = '#/home';

  useEffect(() => {
    const loadChats = async () => {
      setLoading(true);
      const chats = await fetchMyChats();
      setAllChats(chats);
      setLoading(false);
    };
    loadChats();
  }, []);

  const filteredChats = useMemo(() => {
    const chatsForTab = allChats.filter(chat => (activeTab === 'active' ? !chat.isArchived : chat.isArchived));
    if (!searchQuery) {
      return chatsForTab;
    }
    return chatsForTab.filter(chat => chat.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allChats, activeTab, searchQuery]);

  const handleSearchToggle = () => {
    if (isSearchVisible) {
      setSearchQuery('');
    }
    setIsSearchVisible(!isSearchVisible);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-500 p-8">Загрузка чатов...</p>;
    }
    if (filteredChats.length === 0) {
      return (
        <div className="pt-10">
          <EmptyState
            Icon={EmptyChatIllustrationIcon}
            title={searchQuery ? "Чаты не найдены" : "Здесь пока тихо"}
            subtitle={
              searchQuery
                ? "Попробуйте изменить поисковый запрос."
                : activeTab === 'active'
                  ? "Когда вы присоединитесь к событию, здесь появится чат для общения с другими волонтерами."
                  : "У вас пока нет архивных чатов."
            }
            action={activeTab === 'active' && !searchQuery ? {
              text: 'Найти событие',
              onClick: onFindEvent,
              type: 'primary',
            } : undefined
            }
          />
        </div>
      );
    }
    return (
      <div className="[&>*:first-child_>_div:last-child]:border-t-0">
        {filteredChats.map(chat => (
          <ChatCell key={chat.id} chat={chat} onSelect={() => onSelectChat(chat.eventId)}/>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-screen font-sans antialiased bg-white flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 -ml-2"
                aria-label="Назад">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        {isSearchVisible ? (
          <div className="relative flex-grow flex items-center mx-2">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-gray-400"/>
                        </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти чат..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        ) : (
          <h1 className="text-lg font-bold text-[#0C0D0E] absolute left-1/2 -translate-x-1/2">Мои чаты</h1>
        )}
        <button onClick={handleSearchToggle}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label={isSearchVisible ? "Закрыть поиск" : "Поиск"}>
          {isSearchVisible ? <XIcon className="w-6 h-6 text-gray-700"/> :
            <SearchIcon className="w-6 h-6 text-gray-700"/>}
        </button>
      </header>

      {!isSearchVisible && (
        <nav className="flex-shrink-0 p-4 bg-white">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'active' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
            >
              Активные
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'archived' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
            >
              Архивные
            </button>
          </div>
        </nav>
      )}

      <main className="flex-grow overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default MyChatsPage;

```


### frontend/src/app/profile/rewards/detail/page.tsx
```
import React, {useMemo, useState} from 'react';
import type {RewardItem, User} from '../../../../lib/types';
import {ArrowLeftIcon, CheckCircleIcon, SparklesIcon} from '../../../../components/ui/icons';
import PurchaseConfirmationModal from '../../../../components/ui/PurchaseConfirmationModal';

interface RewardsDetailPageProps {
  rewardId: number;
  allRewards: RewardItem[];
  user: User;
  onPurchase: (rewardId: number) => void;
}

const RewardsDetailPage: React.FC<RewardsDetailPageProps> = ({rewardId, allRewards, user, onPurchase}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const reward = useMemo(() => allRewards.find(r => r.id === rewardId), [rewardId, allRewards]);

  const karmaBalance = useMemo(() => {
    const karmaStat = user.stats.find(s => s.id === 'karma');
    return karmaStat ? parseInt(karmaStat.value.replace(/,/g, ''), 10) : 0;
  }, [user.stats]);

  const onBack = () => window.location.hash = '#/profile/rewardsStore';

  if (!reward) {
    return <div className="w-full h-screen flex items-center justify-center">Награда не найдена.</div>;
  }

  const canAfford = karmaBalance >= reward.price;

  const handlePurchaseClick = () => {
    if (canAfford && !reward.isPurchased) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmPurchase = () => {
    onPurchase(reward.id);
    setIsConfirmModalOpen(false);
  };

  const renderFooterButton = () => {
    if (reward.isPurchased) {
      return (
        <div className="flex items-center justify-center space-x-2 font-semibold text-lg text-green-600 h-[52px]">
          <CheckCircleIcon className="w-6 h-6"/>
          <span>Уже в коллекции</span>
        </div>
      );
    }

    if (!canAfford) {
      return (
        <button disabled className="w-full bg-gray-300 text-white font-bold py-4 px-4 rounded-xl cursor-not-allowed">
          Недостаточно баллов
        </button>
      );
    }

    return (
      <button onClick={handlePurchaseClick}
              className="w-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity">
        Купить
      </button>
    );
  };

  return (
    <>
      <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
        <header className="flex-shrink-0 p-4 bg-[#F0F0F0] flex items-center sticky top-0 z-10">
          <button onClick={onBack}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/90 shadow-sm"
                  aria-label="Назад">
            <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
          </button>
          <h1 className="text-lg font-bold text-[#0C0D0E] mx-auto">Награда</h1>
          <div className="w-10"></div>
        </header>

        <main className="flex-grow overflow-y-auto px-6 pb-28">
          {/* Image Card */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
            <img src={reward.imageUrl} alt={reward.name} className="w-full aspect-square object-cover rounded-xl"/>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#0C0D0E]">{reward.name}</h2>
            <p
              className="font-semibold text-gray-500">{reward.category === 'Значки' ? 'Эксклюзивный значок для профиля' : 'Тема оформления для приложения'}</p>
            <p className="text-gray-600 leading-relaxed pt-2">
              Это уникальная награда, которая покажет всем ваш вклад в добрые дела. Используйте ее, чтобы украсить свой
              профиль и вдохновить других!
            </p>
          </div>
        </main>

        <footer
          className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-500">Цена:</p>
              <div className="flex items-center space-x-1 font-bold text-lg text-[#0C0D0E]">
                <SparklesIcon className="w-5 h-5 text-[#007AFF]"/>
                <span>{reward.price.toLocaleString('ru-RU')}</span>
              </div>
            </div>
            <div className="w-2/3 max-w-[250px]">
              {renderFooterButton()}
            </div>
          </div>
        </footer>
      </div>

      <PurchaseConfirmationModal
        isOpen={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmPurchase}
        rewardName={reward.name}
        rewardPrice={reward.price}
        userKarma={karmaBalance}
      />
    </>
  );
};

export default RewardsDetailPage;


```


### frontend/src/app/profile/rewards/page.tsx
```
import React, {useMemo, useState} from 'react';
import type {RewardItem, User} from '../../../lib/types';
import {ArrowLeftIcon, CheckCircleIcon, EmptyShelfIllustrationIcon, SparklesIcon} from '../../../components/ui/icons';
import EmptyState from '../../../components/ui/EmptyState';

// Reward Card Skeleton
const RewardCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm p-3 animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-xl mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// Reward Card Component
const RewardCard: React.FC<{ reward: RewardItem; onSelect: () => void; }> = ({reward, onSelect}) => {
  return (
    <button onClick={onSelect}
            className="bg-white rounded-2xl shadow-sm p-3 text-left w-full transition-transform active:scale-95">
      <div className="relative aspect-square mb-2">
        <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover rounded-xl"/>
        {reward.isPurchased && (
          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12 text-white/80"/>
          </div>
        )}
      </div>
      <h3 className="font-bold text-[#0C0D0E] truncate">{reward.name}</h3>
      <div className="flex items-center space-x-1 font-bold text-[#007AFF]">
        <SparklesIcon className="w-5 h-5"/>
        <span>{reward.price.toLocaleString('ru-RU')}</span>
      </div>
    </button>
  );
};

// Main Page Component
interface RewardsStorePageProps {
  user: User;
  rewards: RewardItem[];
  onBack: () => void;
}

const RewardsStorePage: React.FC<RewardsStorePageProps> = ({user, rewards, onBack}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Все' | 'Значки' | 'Темы оформления'>('Все');

  const onSelectReward = (reward: RewardItem) => {
    window.location.hash = `#/rewards/${reward.id}`;
  };

  const karmaBalance = useMemo(() => {
    const karmaStat = user.stats.find(s => s.id === 'karma');
    return karmaStat ? parseInt(karmaStat.value.replace(/,/g, ''), 10) : 0;
  }, [user.stats]);

  const filteredRewards = useMemo(() => {
    if (selectedCategory === 'Все') return rewards;
    return rewards.filter(r => r.category === selectedCategory);
  }, [selectedCategory, rewards]);

  const categories: ('Все' | 'Значки' | 'Темы оформления')[] = ['Все', 'Значки', 'Темы оформления'];
  const loading = rewards.length === 0;

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-2xl font-bold text-[#0C0D0E] mx-auto">Магазин наград</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-6 space-y-6">
        {/* User Balance */}
        <section
          className="bg-[linear-gradient(155deg,#BF97FF_6.6%,#526EFF_84.12%)] text-white rounded-2xl shadow-lg p-6 text-center">
          <p className="font-semibold opacity-80">Ваш баланс:</p>
          <div className="flex items-center justify-center space-x-2 mt-1">
            <SparklesIcon className="w-8 h-8 text-yellow-300"/>
            <span className="text-4xl font-bold">{karmaBalance.toLocaleString('ru-RU')}</span>
          </div>
        </section>

        {/* Category Filters */}
        <section>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-[#007AFF] text-white' : 'bg-white text-[#0C0D0E] shadow-sm'}`}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Items Grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              <RewardCardSkeleton/>
              <RewardCardSkeleton/>
              <RewardCardSkeleton/>
              <RewardCardSkeleton/>
            </div>
          ) : filteredRewards.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredRewards.map(reward => (
                <RewardCard key={reward.id} reward={reward} onSelect={() => onSelectReward(reward)}/>
              ))}
            </div>
          ) : (
            <EmptyState
              Icon={EmptyShelfIllustrationIcon}
              title="Новые награды уже в пути!"
              subtitle="Загляните сюда позже, мы постоянно добавляем что-то интересное."
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default RewardsStorePage;


```


### frontend/src/app/profile/settings/page.tsx
```
import React, {useState} from 'react';
import {
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from '../../../components/ui/icons';
import type {ProfileSubScreen} from '../../../lib/types';
import LogoutConfirmationModal from '../../../components/ui/LogoutConfirmationModal';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({title, children}) => (
  <section>
    <h2 className="px-6 pb-2 text-sm font-semibold text-[rgb(12,13,14,0.52)] uppercase tracking-wider">{title}</h2>
    <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mx-4">
      {children}
    </div>
  </section>
);

const SettingsRow: React.FC<{
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  isDestructive?: boolean;
  info?: string
}> = ({label, Icon, onClick, isDestructive, info}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors disabled:hover:bg-transparent"
    disabled={!onClick}
  >
    <div className="flex items-center space-x-4">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDestructive ? 'bg-red-100' : 'bg-blue-100'}`}>
        <Icon className={`w-5 h-5 ${isDestructive ? 'text-[#FF303C]' : 'text-[#007AFF]'}`}/>
      </div>
      <span className={`font-semibold ${isDestructive ? 'text-[#FF303C]' : 'text-[#0C0D0E]'}`}>{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      {info && <span className="text-gray-400 text-sm">{info}</span>}
      {onClick && <ChevronRightIcon className="w-5 h-5 text-gray-400"/>}
    </div>
  </button>
);


const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({enabled, onChange}) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-[#007AFF]' : 'bg-gray-200'}`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}/>
  </button>
);


const ToggleRow: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({
                                                                                                           label,
                                                                                                           enabled,
                                                                                                           onChange
                                                                                                         }) => (
  <div className="w-full flex items-center justify-between p-4 text-left">
    <span className="font-semibold text-[#0C0D0E]">{label}</span>
    <ToggleSwitch enabled={enabled} onChange={onChange}/>
  </div>
);


const SettingsPage: React.FC<{ onBack: () => void; onLogout: () => void; }> = ({onBack, onLogout}) => {
  const [notifications, setNotifications] = useState({newEvents: true, reminders: true, achievements: false});
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const onNavigate = (screen: ProfileSubScreen) => {
    window.location.hash = `#/profile/${screen}`;
  };

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({...prev, [key]: !prev[key]}));
  }

  return (
    <>
      <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
        <header
          className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center">
          <button onClick={onBack}
                  className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
          </button>
          <h1 className="text-2xl font-bold text-[#0C0D0E] mx-auto">Настройки</h1>
          <div className="w-8"></div>
        </header>

        <main className="flex-grow overflow-y-auto pt-8 space-y-8 pb-8">
          <SettingsSection title="Аккаунт">
            <SettingsRow label="Редактировать профиль" Icon={UserCircleIcon} onClick={() => onNavigate('editProfile')}/>
            <SettingsRow label="Приватность" Icon={ShieldCheckIcon} onClick={() => {
            }}/>
          </SettingsSection>

          <SettingsSection title="Уведомления">
            <div className="p-4 flex items-center space-x-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
                <BellIcon className="w-5 h-5 text-[#007AFF]"/>
              </div>
              <span className="font-semibold text-[#0C0D0E]">Push-уведомления</span>
            </div>
            <div className="pl-16 pr-4 py-2 border-t border-gray-100">
              <ToggleRow label="Новые события от подписок" enabled={notifications.newEvents}
                         onChange={() => handleToggle('newEvents')}/>
            </div>
            <div className="pl-16 pr-4 py-2 border-t border-gray-100">
              <ToggleRow label="Напоминания о моих событиях" enabled={notifications.reminders}
                         onChange={() => handleToggle('reminders')}/>
            </div>
            <div className="pl-16 pr-4 py-2 border-t border-gray-100">
              <ToggleRow label="Новые достижения" enabled={notifications.achievements}
                         onChange={() => handleToggle('achievements')}/>
            </div>
          </SettingsSection>

          <SettingsSection title="О платформе">
            <SettingsRow label="Написать в поддержку" Icon={ChatBubbleLeftRightIcon} onClick={() => {
            }}/>
            <SettingsRow label="Политика конфиденциальности" Icon={DocumentTextIcon} onClick={() => {
            }}/>
            <SettingsRow label="Версия" Icon={DocumentTextIcon} info="1.0.0"/>
          </SettingsSection>

          <div className="pt-4">
            <div className="bg-white rounded-2xl shadow-sm mx-4">
              <SettingsRow label="Выйти из аккаунта" Icon={ArrowRightOnRectangleIcon}
                           onClick={() => setShowLogoutConfirm(true)} isDestructive/>
            </div>
          </div>
        </main>
      </div>
      <LogoutConfirmationModal
        isOpen={showLogoutConfirm}
        onConfirm={onLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

export default SettingsPage;


```


### frontend/src/app/splash/page.tsx
```
import React from 'react';
import {HeartHandIcon} from '../../components/ui/icons';

const SplashPage: React.FC = () => {
  return (
    <div className="bg-white w-full h-screen flex items-center justify-center font-sans antialiased">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <HeartHandIcon className="w-28 h-28 text-[#007AFF]"/>
        <h1 className="text-5xl font-bold tracking-tight text-[#0C0D0E]">
          MAX<span className="text-[#007AFF]">Добро</span>
        </h1>
        <p className="text-sm font-medium tracking-[0.2em] text-[rgba(12,13,14,0.52)] uppercase">
          Платформа для волонтеров
        </p>
      </div>
    </div>
  );
};

export default SplashPage;


```


### frontend/src/app/stories/create/SelectEventModal.tsx
```
import React, {useEffect, useState} from 'react';
import {fetchActivityHistoryEvents} from '../../../lib/api';
import type {HistoryEvent} from '../../../lib/types';
import {SearchIcon, XIcon} from '../../../components/ui/icons';

const SelectEventModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (event: HistoryEvent) => void;
}> = ({isOpen, onClose, onSelect}) => {
  const [pastEvents, setPastEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      const loadEvents = async () => {
        setLoading(true);
        const all = await fetchActivityHistoryEvents();
        setPastEvents(all.filter(e => e.status === 'past'));
        setLoading(false);
      };
      loadEvents();
    }
  }, [isOpen]);

  const filteredEvents = pastEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`fixed inset-0 z-[60] transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{height: '75vh'}}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="w-12"></div>
          <h2 className="text-xl font-bold text-[#0C0D0E]">Выбрать событие</h2>
          <button onClick={onClose}
                  className="w-12 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800"
                  aria-label="Закрыть">
            <XIcon className="w-6 h-6"/>
          </button>
        </header>

        <div className="p-4 flex-shrink-0">
          <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-gray-400"/>
                        </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти событие по названию"
              className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <main className="flex-grow overflow-y-auto px-4">
          <div className="divide-y divide-gray-100">
            {loading ? (
              <p className="text-center text-gray-500 p-4">Загрузка...</p>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <button
                  key={event.id}
                  onClick={() => onSelect(event)}
                  className="w-full flex items-center py-3 text-left space-x-4 hover:bg-gray-50 rounded-lg p-2"
                >
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center">
                    <event.Icon className="w-8 h-8 text-gray-500"/>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#0C0D0E]">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-gray-500 p-4">Прошедшие события не найдены.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SelectEventModal;


```


### frontend/src/app/stories/create/page.tsx
```
import React, {useEffect, useState} from 'react';
import type {HistoryEvent} from '../../../lib/types';
import {fetchActivityHistoryEvents} from '../../../lib/api';
import {PlusIcon, XIcon} from '../../../components/ui/icons';
import SelectEventModal from './SelectEventModal';

interface CreateStoryPageProps {
  onCancel: () => void;
  onPublish: (storyData: { event: HistoryEvent; text: string; photos: string[] }) => void;
  initialEventId: string | null;
}

const CreateStoryPage: React.FC<CreateStoryPageProps> = ({onCancel, onPublish, initialEventId}) => {
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  useEffect(() => {
    if (initialEventId) {
      const loadInitialEvent = async () => {
        const events = await fetchActivityHistoryEvents();
        const event = events.find(e => e.id === parseInt(initialEventId));
        if (event) setSelectedEvent(event);
      };
      loadInitialEvent();
    }
  }, [initialEventId]);

  const isPublishEnabled = !!selectedEvent && text.trim().length > 0 && photos.length > 0;

  const handleAddPhoto = () => {
    // Simulate adding a photo from a gallery
    const newPhoto = `https://picsum.photos/seed/${Date.now()}/600/400`;
    setPhotos(prev => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handlePublishClick = () => {
    if (isPublishEnabled && selectedEvent) {
      onPublish({
        event: selectedEvent,
        text,
        photos,
      });
    }
  };

  return (
    <>
      <div className="w-full h-screen font-sans antialiased bg-white flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
          <button onClick={onCancel} className="text-lg font-medium text-[#007AFF]">Отмена</button>
          <h1 className="text-lg font-bold text-[#0C0D0E]">Новая история</h1>
          <button
            onClick={handlePublishClick}
            disabled={!isPublishEnabled}
            className={`text-lg font-bold ${isPublishEnabled ? 'text-[#007AFF]' : 'text-gray-400'}`}
          >
            Опубликовать
          </button>
        </header>

        <main className="flex-grow overflow-y-auto p-4 space-y-4">
          {/* Event Selector */}
          <section className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
            <p className="text-sm text-gray-700 flex-1 truncate">
              История о событии: <span
              className="font-semibold text-[#0C0D0E]">{selectedEvent?.title || 'Не выбрано'}</span>
            </p>
            <button onClick={() => setIsEventModalOpen(true)}
                    className="ml-2 text-sm font-semibold text-[#007AFF] hover:underline">
              {selectedEvent ? 'Изменить' : 'Выбрать'}
            </button>
          </section>

          {/* Photo Uploader */}
          <section>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {photos.map((photoUrl, index) => (
                <div key={index} className="relative flex-shrink-0 w-28 h-28">
                  <img src={photoUrl} alt={`Upload preview ${index + 1}`}
                       className="w-full h-full object-cover rounded-lg"/>
                  <button onClick={() => handleRemovePhoto(index)}
                          className="absolute -top-1 -right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          aria-label="Удалить фото">
                    <XIcon className="w-4 h-4"/>
                  </button>
                </div>
              ))}
              <button onClick={handleAddPhoto}
                      className="flex-shrink-0 w-28 h-28 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <PlusIcon className="w-8 h-8"/>
                <span className="text-xs font-semibold mt-1">Добавить фото</span>
              </button>
            </div>
          </section>

          {/* Text Editor */}
          <section className="flex-grow flex">
                        <textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Расскажите, как все прошло..."
                          className="w-full h-full min-h-[200px] bg-transparent text-lg text-[#0C0D0E] placeholder-gray-400 focus:outline-none resize-none"
                        />
          </section>
        </main>
      </div>
      <SelectEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSelect={(event) => {
          setSelectedEvent(event);
          setIsEventModalOpen(false);
        }}
      />
    </>
  );
};

export default CreateStoryPage;


```


### frontend/src/app/tabs/courses/page.tsx
```
import React, {useEffect, useMemo, useState} from 'react';
import {courseCategories} from '../../../lib/mockData';
import {fetchAllCourses} from '../../../lib/api';
import type {Course} from '../../../lib/types';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  EmptySearchIcon,
  NatureProtectorIcon
} from '../../../components/ui/icons';
import EmptyState from '../../../components/ui/EmptyState';

const CourseSkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 animate-pulse w-full">
    <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0"></div>
    <div className="flex-1 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-2 bg-gray-200 rounded-full w-full mt-2"></div>
    </div>
  </div>
);

const CourseCard: React.FC<{ course: Course; onSelect: () => void; }> = React.memo(({course, onSelect}) => (
  <button onClick={onSelect}
          className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 w-full text-left transition-transform duration-200 active:scale-95">
    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center">
      <course.Icon className="w-14 h-14"/>
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-lg text-[#0C0D0E]">{course.title}</h3>
      <p className="text-sm text-[rgb(12,13,14,0.52)] mt-1">{course.description}</p>
      <div className="flex items-center space-x-4 text-xs text-[rgb(12,13,14,0.52)] mt-2">
        <div className="flex items-center space-x-1">
          <ClockIcon className="w-4 h-4"/>
          <span>{course.duration}</span>
        </div>
        {course.hasCertificate && (
          <div className="flex items-center space-x-1">
            <AcademicCapIcon className="w-4 h-4"/>
            <span>Сертификат</span>
          </div>
        )}
      </div>
      {course.status === 'in-progress' && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-[#007AFF] h-1.5 rounded-full" style={{width: `${course.progress}%`}}></div>
          </div>
        </div>
      )}
      {course.status === 'completed' && (
        <div className="flex items-center space-x-1 text-[#1ABE43] mt-2 font-semibold text-sm">
          <CheckCircleIcon className="w-5 h-5"/>
          <span>Курс пройден</span>
        </div>
      )}
    </div>
  </button>
));

const CoursesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const courses = await fetchAllCourses();
        setAllCourses(courses);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить курсы.");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const onSelectCourse = (id: number) => {
    window.location.hash = `#/courses/${id}`;
  };

  const filteredCourses = useMemo(() => {
    if (selectedCategory === 'Все') return allCourses;
    return allCourses.filter(c => c.category === selectedCategory);
  }, [selectedCategory, allCourses]);

  return (
    <div className="w-full bg-white">
      <header className="p-6">
        <h1 className="text-[28px] font-bold text-[#0C0D0E]">Обучение</h1>
      </header>

      <div className="px-6 mb-6">
        <div
          className="bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] rounded-[20px] p-6 flex items-center text-white shadow-lg">
          <div className="flex-1">
            <h2 className="font-bold text-xl">Курс недели</h2>
            <p className="text-sm mt-1 opacity-90">Эко-волонтерство: С чего начать?</p>
            <button onClick={() => onSelectCourse(2)}
                    className="mt-4 bg-white/30 text-white font-semibold py-2 px-4 rounded-lg text-sm">Начать
            </button>
          </div>
          <NatureProtectorIcon className="w-20 h-20 opacity-80"/>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 -mx-6 px-6">
          {courseCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-[#007AFF] text-white' : 'bg-gray-100 text-[#0C0D0E]'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="px-6 space-y-4">
        {loading ? (
          <>
            <CourseSkeletonCard/>
            <CourseSkeletonCard/>
            <CourseSkeletonCard/>
          </>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onSelect={() => onSelectCourse(course.id)}/>
          ))
        ) : (
          <EmptyState
            Icon={EmptySearchIcon}
            title="Курсы не найдены"
            subtitle="Новые курсы по этой теме скоро появятся здесь!"
          />
        )}
      </main>
    </div>
  );
};

export default CoursesPage;


```


### frontend/src/app/tabs/layout.tsx
```
import React from 'react';
import TabBar from '../../components/layout/TabBar';
import HomePage from './page';
import CoursesPage from './courses/page';
import OrganizationsPage from './organizations/page';
import ProfilePage from './profile/page';
import StoriesPage from './stories/page';
import type {Tab, User} from '../../lib/types';

interface TabsLayoutProps {
  user: User;
  activeTab: Tab;
  onSwitchToOrganizationMode: () => void;
}

const TabsLayout: React.FC<TabsLayoutProps> = ({
                                                 user, activeTab, onSwitchToOrganizationMode
                                               }) => {

  const handleTabChange = (tab: Tab) => {
    window.location.hash = `#/${tab}`;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage/>;
      case 'training':
        return <CoursesPage/>;
      case 'organizations':
        return <OrganizationsPage/>;
      case 'stories':
        return <StoriesPage/>;
      case 'profile':
        return <ProfilePage user={user} onSwitchToOrganizationMode={onSwitchToOrganizationMode}/>;
      default:
        return <HomePage/>;
    }
  };

  return (
    <div className="w-full h-screen font-sans antialiased relative overflow-hidden bg-[#F0F0F0]">
      <div className="w-full h-full overflow-y-auto pb-20">
        {renderContent()}
      </div>
      <TabBar activeTab={activeTab} onTabChange={handleTabChange}/>
    </div>
  );
};

export default TabsLayout;


```


### frontend/src/app/tabs/organizations/page.tsx
```
import React, {useEffect, useMemo, useState} from 'react';
import {defaultOrganizationFilters, organizationCategories} from '../../../lib/mockData';
import {fetchAllOrganizations, updateOrganizationSubscription} from '../../../lib/api';
import type {Organization, OrganizationFilters} from '../../../lib/types';
import {CheckIcon, EmptySearchIcon, FilterIcon, SearchIcon, VerifiedIcon} from '../../../components/ui/icons';
import SubscribeModal from '../../../components/ui/SubscribeModal';
import Toast from '../../../components/ui/Toast';
import EmptyState from '../../../components/ui/EmptyState';

const OrganizationSkeletonCell: React.FC = () => (
  <div className="flex items-center space-x-4 p-4 animate-pulse">
    <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="w-32 h-9 bg-gray-200 rounded-lg"></div>
  </div>
);

const OrganizationCell: React.FC<{
  organization: Organization;
  onSubscribe: (id: number) => void;
  onSelect: (id: number) => void;
}> = React.memo(({organization, onSubscribe, onSelect}) => (
  <div className="flex items-center space-x-4 p-4 w-full">
    <button onClick={() => onSelect(organization.id)} className="flex items-center space-x-4 flex-1 text-left">
      <img loading="lazy" src={organization.logoUrl} alt={`Логотип ${organization.name}`}
           className="w-14 h-14 rounded-full flex-shrink-0"/>
      <div className="flex-1">
        <div className="flex items-center space-x-1.5">
          <h3 className="font-bold text-md text-[#0C0D0E]">{organization.name}</h3>
          {organization.isVerified && <VerifiedIcon className="w-5 h-5 text-[#007AFF]"/>}
        </div>
        <p className="text-sm text-[rgb(12,13,14,0.52)]">{organization.description}</p>
      </div>
    </button>
    <button
      onClick={() => onSubscribe(organization.id)}
      className={`flex-shrink-0 w-36 text-sm font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
        organization.isSubscribed
          ? 'bg-gray-100 text-gray-500'
          : 'bg-transparent border-2 border-[#007AFF] text-[#007AFF] hover:bg-blue-50'
      }`}
    >
      {organization.isSubscribed ? (
        <>
          <CheckIcon className="w-4 h-4"/>
          <span>Вы подписаны</span>
        </>
      ) : (
        <span>Подписаться</span>
      )}
    </button>
  </div>
));

const OrganizationFilterPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: OrganizationFilters) => void;
  initialFilters: OrganizationFilters;
}> = ({isOpen, onClose, onApply, initialFilters}) => {
  const [city, setCity] = useState(initialFilters.city);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
  const [verifiedOnly, setVerifiedOnly] = useState(initialFilters.verifiedOnly);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleReset = () => {
    setCity(defaultOrganizationFilters.city);
    setSelectedCategories(defaultOrganizationFilters.categories);
    setVerifiedOnly(defaultOrganizationFilters.verifiedOnly);
  };

  const handleApply = () => {
    onApply({city, categories: selectedCategories, verifiedOnly});
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}>
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{height: '70vh'}}
        role="dialog"
        aria-modal="true"
        aria-labelledby="org-filter-panel-title"
      >
        <div className="flex flex-col h-full">
          <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="w-16"></div>
            <div className="text-center">
              <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <h2 id="org-filter-panel-title" className="text-xl font-bold text-[#0C0D0E]">Фильтры</h2>
            </div>
            <button onClick={handleReset} className="text-sm font-semibold text-[#007AFF] w-16 text-right">Сбросить
            </button>
          </header>

          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Город</h3>
              <button
                className="w-full flex justify-between items-center p-3 border border-gray-300 rounded-xl text-left">
                <span className="text-[#0C0D0E]">{city}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                     fill="currentColor">
                  <path fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"/>
                </svg>
              </button>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Направления</h3>
              <div className="flex flex-wrap gap-2">
                {organizationCategories.map(cat => (
                  <button key={cat} onClick={() => toggleCategory(cat)}
                          className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedCategories.includes(cat) ? 'bg-[#007AFF] text-white border-transparent' : 'bg-white text-[#007AFF] border-[#007AFF]/50'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#0C0D0E]">Только верифицированные</h3>
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${verifiedOnly ? 'bg-[#007AFF]' : 'bg-gray-200'}`}
                  role="switch"
                  aria-checked={verifiedOnly}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${verifiedOnly ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
              </div>
            </section>
          </div>

          <footer className="p-4 border-t border-gray-200 flex-shrink-0">
            <button onClick={handleApply}
                    className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] hover:opacity-90 shadow-lg">
              Показать организации
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

const OrganizationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<OrganizationFilters>(defaultOrganizationFilters);
  const [subscribingOrg, setSubscribingOrg] = useState<Organization | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; onUndo?: () => void }>({
    show: false,
    message: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrgs = async () => {
      try {
        setLoading(true);
        const orgs = await fetchAllOrganizations();
        setOrganizations(orgs);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить организации.");
      } finally {
        setLoading(false);
      }
    };
    loadOrgs();
  }, []);

  const onSelectOrganization = (id: number) => {
    window.location.hash = `#/organizations/${id}`;
  };

  const filteredOrganizations = useMemo(() => {
    let filtered = organizations.filter(org => {
      const categoryMatch = appliedFilters.categories.length === 0 || appliedFilters.categories.includes(org.category);
      const verifiedMatch = !appliedFilters.verifiedOnly || org.isVerified;
      return categoryMatch && verifiedMatch;
    });

    if (!searchQuery) return filtered;

    return filtered.filter(org => org.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, organizations, appliedFilters]);

  const handleSubscribeClick = async (id: number) => {
    const orgToUpdate = organizations.find(org => org.id === id);
    if (!orgToUpdate) return;

    if (orgToUpdate.isSubscribed) {
      await updateOrganizationSubscription(id, false);
      setOrganizations(prevOrgs => prevOrgs.map(org => org.id === id ? {...org, isSubscribed: false} : org));
    } else {
      setSubscribingOrg(orgToUpdate);
    }
  };

  const handleConfirmSubscription = async () => {
    if (!subscribingOrg) return;
    const {id, name} = subscribingOrg;

    await updateOrganizationSubscription(id, true);
    setOrganizations(prevOrgs => prevOrgs.map(org => org.id === id ? {...org, isSubscribed: true} : org));

    setSubscribingOrg(null);
    setToast({show: true, message: `Вы подписались на "${name}"`, onUndo: () => handleUndoSubscription(id)});
  };

  const handleUndoSubscription = async (orgId: number) => {
    await updateOrganizationSubscription(orgId, false);
    setOrganizations(prevOrgs => prevOrgs.map(org => org.id === orgId ? {...org, isSubscribed: false} : org));
  };

  const handleApplyFilters = (filters: OrganizationFilters) => {
    setAppliedFilters(filters);
    setIsFilterPanelOpen(false);
  };

  return (
    <>
      <div className="w-full min-h-full bg-white flex flex-col">
        <header className="p-6 pb-4">
          <h1 className="text-[28px] font-bold text-[#0C0D0E]">Организации и фонды</h1>
        </header>
        <div className="px-6 pb-4 flex items-center space-x-2">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><SearchIcon
              className="w-5 h-5 text-gray-400"/></span>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Найти по названию"
                   className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                   aria-label="Поиск организаций"/>
          </div>
          <button onClick={() => setIsFilterPanelOpen(true)} aria-label="Фильтры"
                  className="flex-shrink-0 p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <FilterIcon className="w-6 h-6 text-gray-600"/>
          </button>
        </div>
        <main className="flex-grow">
          <div className="divide-y divide-gray-100">
            {loading ? (<> <OrganizationSkeletonCell/> <OrganizationSkeletonCell/> <OrganizationSkeletonCell/>
                <OrganizationSkeletonCell/> <OrganizationSkeletonCell/> </>
            ) : error ? (<div className="text-center py-10 text-red-500">{error}</div>
            ) : filteredOrganizations.length > 0 ? (
              filteredOrganizations.map(org => <OrganizationCell key={org.id} organization={org}
                                                                 onSubscribe={handleSubscribeClick}
                                                                 onSelect={onSelectOrganization}/>)
            ) : (
              <div className="pt-10"><EmptyState Icon={EmptySearchIcon} title="Организации не найдены"
                                                 subtitle="По вашим фильтрам ничего не найдено. Попробуйте изменить параметры."/>
              </div>
            )}
          </div>
        </main>
        <OrganizationFilterPanel isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)}
                                 onApply={handleApplyFilters} initialFilters={appliedFilters}/>
      </div>
      <SubscribeModal isOpen={!!subscribingOrg} organizationName={subscribingOrg?.name || ''}
                      onConfirm={handleConfirmSubscription} onCancel={() => setSubscribingOrg(null)}/>
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({...toast, show: false})}
             onUndo={toast.onUndo} type="success"/>
    </>
  );
};

export default OrganizationsPage;

```


### frontend/src/app/tabs/page.tsx
```
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  BinocularsIllustrationIcon,
  CalendarIcon,
  FilterIcon,
  GeolocationIcon,
  ListIcon,
  LocationMarkerIcon,
  MagnifyingGlassIllustrationIcon,
  SearchIcon,
  ServerErrorIcon,
  SparklesIcon,
  XIcon
} from '../../components/ui/icons';
import EmptyState from '../../components/ui/EmptyState';
import {allCategories, defaultFilters} from '../../lib/mockData';
import {fetchAllEvents, fetchAllStories} from '../../lib/api';
import type {AppEvent, FilterDate, FilterFormat, Filters, Story} from '../../lib/types';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EventCard from '../../components/ui/EventCard';

const StoryPreviewCard: React.FC<{ story: Story; onSelectStory: (id: number) => void }> = ({story, onSelectStory}) => (
  <div onClick={() => onSelectStory(story.id)} className="flex-shrink-0 w-40 space-y-2 cursor-pointer group">
    <div className="w-full h-48 overflow-hidden rounded-xl">
      <img src={story.imageUrl} alt={story.text}
           className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"/>
    </div>
    <div>
      <p className="text-xs font-bold truncate text-[#0C0D0E]">{story.author.name}</p>
      <p className="text-xs text-gray-500 truncate">{story.text}</p>
    </div>
  </div>
);

const StoriesCarousel: React.FC<{ stories: Story[]; onSelectStory: (id: number) => void }> = ({
                                                                                                stories,
                                                                                                onSelectStory
                                                                                              }) => (
  <section className="py-4 bg-gray-50 -mx-4 px-4">
    <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Лучшие истории</h2>
    <div className="flex space-x-4 overflow-x-auto pb-2 -mr-4">
      {stories.map(story => (
        <StoryPreviewCard key={story.id} story={story} onSelectStory={onSelectStory}/>
      ))}
    </div>
  </section>
);

const FilterPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  initialFilters: Filters;
  eventCount: number;
}> = ({isOpen, onClose, onApply, initialFilters, eventCount}) => {
  const [format, setFormat] = useState<FilterFormat>(initialFilters.format);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
  const [date, setDate] = useState<FilterDate>(initialFilters.date);
  const [distance, setDistance] = useState(initialFilters.distance);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleReset = () => {
    setFormat(defaultFilters.format);
    setSelectedCategories(defaultFilters.categories);
    setDate(defaultFilters.date);
    setDistance(defaultFilters.distance);
  };

  const handleApply = () => {
    onApply({format, categories: selectedCategories, date, distance});
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}>
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{height: '80vh'}}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-panel-title"
      >
        <div className="flex flex-col h-full">
          <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="w-10"></div>
            <div className="text-center">
              <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <h2 id="filter-panel-title" className="text-xl font-bold text-[#0C0D0E]">Фильтры</h2>
            </div>
            <button onClick={handleReset} className="text-sm font-semibold text-[#007AFF]">Сбросить</button>
          </header>

          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Формат</h3>
              <div className="flex bg-gray-100 rounded-xl p-1">
                {(['Все', 'Офлайн', 'Онлайн'] as FilterFormat[]).map(f => (
                  <button key={f} onClick={() => setFormat(f)}
                          className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${format === f ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Категории</h3>
              <div className="flex flex-wrap gap-2">
                {allCategories.map(cat => (
                  <button key={cat} onClick={() => toggleCategory(cat)}
                          className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedCategories.includes(cat) ? 'bg-[#007AFF] text-white border-transparent' : 'bg-white text-[#007AFF] border-[#007AFF]/50'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Дата</h3>
              <div className="flex bg-gray-100 rounded-xl p-1 mb-3">
                {(['Любая', 'Сегодня', 'На неделе'] as FilterDate[]).map(d => (
                  <button key={d} onClick={() => setDate(d)}
                          className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${date === d ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>
                    {d}
                  </button>
                ))}
              </div>
              <button
                className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                <CalendarIcon className="w-5 h-5"/>
                <span>Выбрать даты</span>
              </button>
            </section>
            <section>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-[#0C0D0E]">Расстояние</h3>
                <span className="font-semibold text-[#0C0D0E]">до {distance} км</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-[#007AFF]"
              />
            </section>
          </div>

          <footer className="p-4 border-t border-gray-200 flex-shrink-0">
            <button onClick={handleApply}
                    className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] hover:opacity-90 shadow-lg">
              Показать {eventCount} событий
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<{
  onFilterClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}> = ({onFilterClick, searchQuery, onSearchChange}) => (
  <header className="absolute top-0 left-0 right-0 p-4 z-40">
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md flex items-center px-4 py-2">
      <SearchIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"/>
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Поиск событий"
          className="w-full bg-transparent focus:outline-none text-[#0C0D0E] placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                  aria-label="Очистить поиск">
            <XIcon className="w-5 h-5"/>
          </button>
        )}
      </div>
      <button onClick={onFilterClick} aria-label="Фильтры" className="ml-2 flex-shrink-0">
        <FilterIcon className="w-6 h-6 text-gray-600"/>
      </button>
    </div>
  </header>
);

const SearchResultsInfo: React.FC<{ count: number; query: string; onReset: () => void; }> = ({
                                                                                               count,
                                                                                               query,
                                                                                               onReset
                                                                                             }) => (
  <div
    className="absolute top-24 left-4 right-4 bg-gray-100 p-3 rounded-xl flex justify-between items-center z-30 shadow-sm animate-fade-in-down">
    <p className="text-sm text-gray-700">Найдено {count} по запросу: <span
      className="font-semibold text-[#0C0D0E]">"{query}"</span></p>
    <button onClick={onReset} className="text-sm font-semibold text-[#007AFF] hover:underline">
      Сбросить
    </button>
    <style>{`
          @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }
        `}</style>
  </div>
);

const MapScreen: React.FC<{
  events: AppEvent[],
  onSwitchView: () => void;
  isSearchActive: boolean;
  onResetSearch: () => void;
  onResetFilters: () => void;
}> = ({events, onSwitchView, isSearchActive, onResetSearch, onResetFilters}) => {

  return (
    <div className="w-full h-full">
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa4ce07ce9e1982fdf2ff91bcaab73d5e7813568038d64c30469157376330f447&amp;source=constructor"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Яндекс Карта событий"
        ></iframe>
      </div>

      {events.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 p-4 bg-white/80 backdrop-blur-sm">
          {isSearchActive ? (
            <EmptyState Icon={MagnifyingGlassIllustrationIcon} title="Ничего не найдено"
                        subtitle="Возможно, в запросе опечатка? Попробуйте переформулировать."
                        action={{text: "Сбросить поиск", onClick: onResetSearch, type: 'secondary'}}/>
          ) : (
            <EmptyState Icon={BinocularsIllustrationIcon} title="По этим фильтрам тихо"
                        subtitle="Попробуйте изменить параметры или расширить радиус поиска."
                        action={{text: "Сбросить фильтры", onClick: onResetFilters, type: 'secondary'}}/>
          )}
        </div>
      )}

      <div className="absolute top-24 right-4 z-40 space-y-3">
        <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg"
                aria-label="Найти меня"><GeolocationIcon className="w-7 h-7 text-[#007AFF]"/></button>
        <button onClick={onSwitchView}
                className="w-14 h-14 bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] rounded-full flex items-center justify-center shadow-lg"
                aria-label="Переключить на список"><ListIcon className="w-7 h-7 text-white"/></button>
        <button
          onClick={() => window.location.hash = '#/chat'}
          className="w-14 h-14 bg-[linear-gradient(155deg,#BF97FF_6.6%,#526EFF_84.12%)] rounded-full flex items-center justify-center shadow-lg"
          aria-label="Открыть Помощника Добра"
        >
          <SparklesIcon className="w-7 h-7 text-white"/>
        </button>
      </div>
    </div>
  );
};

const FeedScreen: React.FC<{
  events: AppEvent[],
  loading: boolean;
  onSwitchView: () => void;
  isSearchActive: boolean;
  onResetSearch: () => void;
  onResetFilters: () => void;
  stories: Story[];
}> = ({events, loading, onSwitchView, isSearchActive, onResetSearch, onResetFilters, stories}) => {

  const onSelectEvent = (id: number) => {
    window.location.hash = `#/events/${id}`;
  };

  const onSelectStory = (id: number) => {
    window.location.hash = `#/stories/${id}`;
  };

  return (
    <div className={`w-full bg-gray-50 transition-all duration-300 ${isSearchActive ? 'pt-40' : 'pt-24'}`}>
      <main className="px-4 space-y-4">
        {loading ? (<> <SkeletonCard/> <SkeletonCard/> <SkeletonCard/> </>)
          : (
            <>
              {stories.length > 0 && <StoriesCarousel stories={stories} onSelectStory={onSelectStory}/>}
              {events.length > 0 ? (
                events.map(event => (<button key={event.id} onClick={() => onSelectEvent(event.id)}
                                             className="w-full transition-transform duration-200 active:scale-95">
                  <EventCard event={event}/></button>))
              ) : (
                isSearchActive ? (
                  <EmptyState Icon={MagnifyingGlassIllustrationIcon} title="Ничего не найдено"
                              subtitle="Возможно, в запросе опечатка? Попробуйте переформулировать."
                              action={{text: "Сбросить поиск", onClick: onResetSearch, type: 'secondary'}}/>
                ) : (
                  <EmptyState Icon={BinocularsIllustrationIcon} title="По этим фильтрам тихо"
                              subtitle="Попробуйте изменить параметры или расширить радиус поиска."
                              action={{text: "Сбросить фильтры", onClick: onResetFilters, type: 'secondary'}}/>
                )
              )}
            </>
          )}
      </main>

      <div className="absolute top-24 right-4 z-40 space-y-3">
        <button onClick={onSwitchView}
                className="w-14 h-14 bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] rounded-full flex items-center justify-center shadow-lg"
                aria-label="Переключить на карту">
          <LocationMarkerIcon className="w-7 h-7 text-white"/>
        </button>
        <button
          onClick={() => window.location.hash = '#/chat'}
          className="w-14 h-14 bg-[linear-gradient(155deg,#BF97FF_6.6%,#526EFF_84.12%)] rounded-full flex items-center justify-center shadow-lg"
          aria-label="Открыть Помощника Добра"
        >
          <SparklesIcon className="w-7 h-7 text-white"/>
        </button>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [view, setView] = useState<'map' | 'feed'>('map');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [allEvents, setAllEvents] = useState<AppEvent[]>([]);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const events = await fetchAllEvents();
      setAllEvents(events);
    } catch (err) {
      setError("Не удалось загрузить события. Проверьте ваше интернет-соединение и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    const loadStories = async () => {
      try {
        const stories = await fetchAllStories();
        setAllStories(stories.slice(0, 5));
      } catch (err) {
        console.error("Failed to load stories for carousel");
      }
    };
    loadStories();
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    const baseFiltered = allEvents.filter(event => {
      const {format, categories} = appliedFilters;
      const formatMatch = format === 'Все' || (format === 'Онлайн' ? event.location === 'Онлайн' : event.location !== 'Онлайн');
      const categoryMatch = categories.length === 0 || categories.includes(event.category);
      return formatMatch && categoryMatch;
    });
    if (!searchQuery) return baseFiltered;
    return baseFiltered.filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [appliedFilters, searchQuery, allEvents]);

  const handleApplyFilters = (newFilters: Filters) => {
    setAppliedFilters(newFilters);
    setIsFilterPanelOpen(false);
  };

  const handleResetFilters = () => setAppliedFilters(defaultFilters);
  const isSearchActive = searchQuery.length > 0;

  if (error && !loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <EmptyState Icon={ServerErrorIcon} title="Что-то пошло не так" subtitle={error}
                    action={{text: 'Попробовать снова', onClick: loadEvents, type: 'primary'}}/>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Header onFilterClick={() => setIsFilterPanelOpen(true)} searchQuery={searchQuery}
              onSearchChange={setSearchQuery}/>
      {isSearchActive && (
        <SearchResultsInfo count={filteredEvents.length} query={searchQuery} onReset={() => setSearchQuery('')}/>)}
      {view === 'map' ? (
        <MapScreen events={filteredEvents} onSwitchView={() => setView('feed')} isSearchActive={isSearchActive}
                   onResetSearch={() => setSearchQuery('')} onResetFilters={handleResetFilters}/>
      ) : (
        <FeedScreen
          events={filteredEvents}
          loading={loading}
          onSwitchView={() => setView('map')}
          isSearchActive={isSearchActive}
          onResetSearch={() => setSearchQuery('')}
          onResetFilters={handleResetFilters}
          stories={allStories}
        />
      )}
      <FilterPanel isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} onApply={handleApplyFilters}
                   initialFilters={appliedFilters} eventCount={filteredEvents.length}/>
    </div>
  );
};

export default HomePage;

```


### frontend/src/app/tabs/profile/page.tsx
```
import React from 'react';
import type {ProfileSubScreen, User} from '../../../lib/types';
import {AnimalFriendIcon, ChevronRightIcon, SettingsIcon} from '../../../components/ui/icons';
import WeeklyChallengeWidget from '../../../features/challenges/components/WeeklyChallengeWidget';

const StatCard: React.FC<{
  value: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}> = React.memo(({value, label, Icon, onClick}) => {
  const content = (
    <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-full">
      <Icon className="w-8 h-8 text-[#007AFF] mb-2"/>
      <span className="text-2xl font-bold text-[#0C0D0E]">{value}</span>
      <span className="text-sm text-[rgb(12,13,14,0.52)] leading-tight">{label}</span>
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="w-full h-full transition-transform active:scale-95">{content}</button>;
  }
  return content;
});

const AchievementBadge: React.FC<{ achievement: User['achievements'][0] }> = React.memo(({achievement}) => (
  <div className="flex-shrink-0 w-24 text-center">
    <div
      className="w-20 h-20 mx-auto rounded-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex items-center justify-center shadow-md mb-1">
      <achievement.Icon className="w-12 h-12 text-white"/>
    </div>
    <span className="text-xs font-semibold text-[rgb(12,13,14,0.52)]">{achievement.name}</span>
  </div>
));

const mockChallenge = {
  title: "Челлендж недели",
  description: "Помогите животным 1 раз",
  reward: "Награда: +100 баллов кармы ✨",
  Icon: AnimalFriendIcon,
  progress: 0,
  target: 1,
  filterCategory: "Животные",
};

const ProfilePage: React.FC<{ user: User; onSwitchToOrganizationMode: () => void; }> = ({
                                                                                          user,
                                                                                          onSwitchToOrganizationMode
                                                                                        }) => {

  const onNavigate = (screen: ProfileSubScreen) => {
    window.location.hash = `#/profile/${screen}`;
  };

  const onFindEvent = (category?: string) => {
    // A more robust solution would involve passing query params
    // For now, we just navigate to the home page for filtering
    window.location.hash = '#/home';
  };

  const handleStatClick = (statId: string) => {
    switch (statId) {
      case 'hours':
      case 'events':
        onNavigate('activityHistory');
        break;
      case 'achievements':
        onNavigate('allAchievements');
        break;
      case 'karma':
        onNavigate('rewardsStore');
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full min-h-full bg-gray-50 pb-10">
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-[28px] font-bold text-[#0C0D0E]">Мой путь</h1>
        <button onClick={() => onNavigate('settings')} className="text-gray-500 hover:text-[#007AFF]">
          <SettingsIcon className="w-6 h-6"/>
        </button>
      </header>

      <section className="px-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img src={user.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full shadow-lg"/>
            </div>
            <h2 className="text-2xl font-bold text-[#0C0D0E]">{`${user.firstName} ${user.lastName}`}</h2>
            <p className="text-sm font-semibold text-[#007AFF]">{user.level}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 my-6">
            {user.stats.map(stat => (
              <StatCard
                key={stat.id}
                {...stat}
                onClick={() => handleStatClick(stat.id)}
              />
            ))}
          </div>

          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] h-2.5 rounded-full"
                   style={{width: `${user.progress}%`}}></div>
            </div>
            <div className="flex justify-between text-xs text-[rgb(12,13,14,0.52)] mt-1">
              <span>Прогресс</span>
              <span>{user.progress}% до "{user.nextLevel}"</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 mb-6">
        <WeeklyChallengeWidget
          challenge={mockChallenge}
          isCompleted={false}
          onCtaClick={onFindEvent}
        />
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center px-6 mb-3">
          <h3 className="text-xl font-bold text-[#0C0D0E]">Последние достижения</h3>
          <button onClick={() => onNavigate('allAchievements')} className="text-sm font-semibold text-[#007AFF]">Все
          </button>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-2 -mx-6 px-6">
          {user.achievements.map(ach => (
            <AchievementBadge key={ach.id} achievement={ach}/>
          ))}
          <div className="flex-shrink-0 w-24 flex items-center justify-center">
            <button onClick={() => onNavigate('allAchievements')}
                    className="w-20 h-20 rounded-full bg-gray-100 flex flex-col items-center justify-center text-center text-xs font-semibold text-[rgb(12,13,14,0.52)] hover:bg-gray-200 transition-colors">
              <span>Все</span>
              <span>достижения</span>
            </button>
          </div>
        </div>
      </section>

      <section className="px-6">
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {user.navigation.map(item => {
            const handleClick = () => {
              if (item.id === 'switchToOrganization') {
                onSwitchToOrganizationMode();
              } else {
                onNavigate(item.id as ProfileSubScreen);
              }
            };
            return (
              <button
                key={item.id}
                onClick={handleClick}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors">
                <div className="flex items-center space-x-4">
                  <item.Icon className="w-6 h-6 text-gray-500"/>
                  <span className="font-semibold text-[#0C0D0E]">{item.label}</span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400"/>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;

```


### frontend/src/app/tabs/stories/components/StoryCard.tsx
```
import React from 'react';
import type {Story} from '../../../../lib/types';
import {ChatBubbleLeftRightIcon, HeartIcon, ShareIcon} from '../../../../components/ui/icons';

const StoryCard: React.FC<{
  story: Story;
}> = React.memo(({story}) => {

  const onSelectEvent = (id: number) => {
    window.location.hash = `#/events/${id}`;
  };

  const onSelectStory = (id: number) => {
    window.location.hash = `#/stories/${id}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg mx-auto">
      <div className="p-4 cursor-pointer" onClick={() => onSelectStory(story.id)}>
        {/* Header */}
        <div className="flex items-center mb-3">
          <img src={story.author.avatarUrl} alt={story.author.name} className="w-10 h-10 rounded-full"/>
          <div className="ml-3">
            <p className="font-bold text-[#0C0D0E] text-sm">{story.author.name}</p>
            <p className="text-xs text-[rgb(12,13,14,0.52)]">{story.timestamp}</p>
          </div>
        </div>

        {/* Context */}
        <p className="text-sm text-[rgb(12,13,14,0.52)] mb-2">
          поделился(-ась) историей с события{" "}
          <button onClick={(e) => {
            e.stopPropagation();
            onSelectEvent(story.event.id);
          }} className="font-semibold text-[#007AFF] hover:underline text-left">
            «{story.event.name}»
          </button>
        </p>

        {/* Text */}
        <p className="text-[#0C0D0E] text-sm mb-3 leading-relaxed">
          {story.text}
        </p>

        {/* Media */}
        <div className="mb-3">
          <img src={story.imageUrl} alt="Story visual" className="w-full rounded-lg object-cover"/>
        </div>
      </div>
      {/* Actions */}
      <div className="flex justify-between items-center text-[rgb(12,13,14,0.52)] p-4 pt-0"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-1.5 hover:text-[#FF303C]">
            <HeartIcon className="w-6 h-6"/>
            <span className="font-semibold text-sm">{story.likes}</span>
          </button>
          <button className="flex items-center space-x-1.5 hover:text-[#007AFF]">
            <ChatBubbleLeftRightIcon className="w-6 h-6"/>
            <span className="font-semibold text-sm">{story.comments}</span>
          </button>
        </div>
        <button className="hover:text-[#007AFF]">
          <ShareIcon className="w-6 h-6"/>
        </button>
      </div>
    </div>
  );
});

export default StoryCard;


```


### frontend/src/app/tabs/stories/components/StorySkeletonCard.tsx
```
import React from 'react';

const StorySkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm p-4 animate-pulse w-full max-w-lg mx-auto">
    <div className="flex items-center mb-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="ml-3 flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="w-full h-64 bg-gray-200 rounded-lg mb-3"></div>
    <div className="flex justify-between items-center">
      <div className="flex space-x-4">
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 w-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default StorySkeletonCard;

```


### frontend/src/app/tabs/stories/detail/page.tsx
```
import React, {useEffect, useState} from 'react';
import {fetchStoryById} from '../../../../lib/api';
import type {Comment, Story} from '../../../../lib/types';
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon
} from '../../../../components/ui/icons';


const CommentView: React.FC<{ comment: Comment }> = ({comment}) => (
  <div className="flex items-start space-x-3">
    <img src={comment.author.avatarUrl} alt={comment.author.name} className="w-10 h-10 rounded-full"/>
    <div className="flex-1">
      <div className="bg-gray-100 rounded-2xl p-3">
        <div className="flex items-baseline space-x-2">
          <p className="font-semibold text-sm text-[#0C0D0E]">{comment.author.name}</p>
          <p className="text-xs text-gray-500">{comment.timestamp}</p>
        </div>
        <p className="text-sm text-[#0C0D0E] mt-1">{comment.text}</p>
      </div>
    </div>
  </div>
);

const StoryDetailPage: React.FC<{
  id: number;
  currentUserAvatar: string;
}> = ({id, currentUserAvatar}) => {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadStory = async () => {
      setLoading(true);
      const data = await fetchStoryById(id);
      if (data) {
        setStory(data);
        setComments(data.commentsData);
      }
      setLoading(false);
    };
    loadStory();
  }, [id]);

  const onBack = () => window.location.hash = '#/stories';
  const onSelectEvent = (eventId: number) => window.location.hash = `#/events/${eventId}`;

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    const newCommentObj: Comment = {
      id: Date.now(),
      author: {name: 'Вы', avatarUrl: currentUserAvatar},
      timestamp: 'только что',
      text: newComment,
    };
    setComments(prev => [...prev, newCommentObj]);
    setNewComment('');
  };

  if (loading || !story) {
    return <div className="w-full h-screen flex items-center justify-center">Загрузка истории...</div>;
  }

  return (
    <div className="w-full h-screen font-sans antialiased bg-white flex flex-col">
      {/* Header */}
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Назад">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-lg font-bold text-[#0C0D0E]">История</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Действия">
          <DotsHorizontalIcon className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      {/* Scrollable Content */}
      <main className="flex-grow overflow-y-auto">
        {/* Author Info */}
        <div className="p-4 flex items-center">
          <img src={story.author.avatarUrl} alt={story.author.name} className="w-12 h-12 rounded-full"/>
          <div className="ml-3">
            <p className="font-bold text-[#0C0D0E]">{story.author.name}</p>
            <p className="text-sm text-[rgb(12,13,14,0.52)]">{story.timestamp}</p>
          </div>
        </div>

        {/* Media */}
        <img src={story.imageUrl} alt="Story visual" className="w-full object-cover"/>

        {/* Story Text */}
        <div className="p-4">
          <p className="text-[#0C0D0E] leading-relaxed whitespace-pre-line">{story.text}</p>
        </div>

        {/* Event Context */}
        <div className="px-4 pb-2">
          <button onClick={() => onSelectEvent(story.event.id)}
                  className="inline-block bg-gray-100 rounded-lg p-3 w-full text-left hover:bg-gray-200 transition-colors">
            <p className="text-sm text-[rgb(12,13,14,0.52)]">
              История с события <span className="font-semibold text-[#007AFF]">«{story.event.name}»</span>
            </p>
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center text-[rgb(12,13,14,0.52)] p-4 border-y border-gray-100">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-1.5 hover:text-[#FF303C]">
              <HeartIcon className="w-6 h-6"/>
              <span className="font-semibold text-sm">{story.likes}</span>
            </button>
            <div className="flex items-center space-x-1.5">
              <ChatBubbleLeftRightIcon className="w-6 h-6"/>
              <span className="font-semibold text-sm">{comments.length}</span>
            </div>
          </div>
          <button className="hover:text-[#007AFF]">
            <ShareIcon className="w-6 h-6"/>
          </button>
        </div>

        {/* Comments Section */}
        <section className="p-4 space-y-4">
          <h2 className="font-bold text-[#0C0D0E]">Комментарии ({comments.length})</h2>
          {comments.length > 0 ? (
            comments.map(comment => <CommentView key={comment.id} comment={comment}/>)
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Станьте первым, кто прокомментирует эту историю!</p>
            </div>
          )}
        </section>
        <div className="h-24"></div>
        {/* Spacer for sticky footer */}
      </main>

      {/* Sticky Footer for Comment Input */}
      <footer className="flex-shrink-0 p-3 bg-white/90 backdrop-blur-sm border-t border-gray-200 sticky bottom-0 z-20">
        <div className="flex items-center space-x-3">
          <img src={currentUserAvatar} alt="Ваш аватар" className="w-10 h-10 rounded-full"/>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
            placeholder="Ваш комментарий..."
            className="flex-grow bg-gray-100 border-transparent rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handlePostComment}
            disabled={!newComment.trim()}
            className="text-sm font-semibold text-[#007AFF] disabled:text-gray-400 px-3"
          >
            Отправить
          </button>
        </div>
      </footer>
    </div>
  );
};

export default StoryDetailPage;


```


### frontend/src/app/tabs/stories/page.tsx
```
import React, {useEffect, useState} from 'react';
import {fetchAllStories} from '../../../lib/api';
import type {Story} from '../../../lib/types';
import {PhotoAlbumIllustrationIcon, PlusIcon} from '../../../components/ui/icons';
import EmptyState from '../../../components/ui/EmptyState';
import StoryCard from './components/StoryCard';
import StorySkeletonCard from './components/StorySkeletonCard';

const StoriesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        const fetchedStories = await fetchAllStories();
        setStories(fetchedStories);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить истории.");
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  const onStartCreateStory = () => {
    window.location.hash = '#/stories/create';
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <StorySkeletonCard/>
          <StorySkeletonCard/>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    if (stories.length === 0) {
      return (
        <EmptyState
          Icon={PhotoAlbumIllustrationIcon}
          title="Лента пока пуста"
          subtitle="Станьте первым, кто расскажет о своем волонтерском опыте и вдохновит других!"
          action={{
            text: 'Рассказать свою историю',
            onClick: onStartCreateStory,
            type: 'primary'
          }}
        />
      );
    }

    return (
      <div className="space-y-4">
        {stories.map(story => (
          <StoryCard key={story.id} story={story}/>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#F0F0F0] min-h-full relative">
      <header className="p-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-[28px] font-bold text-[#0C0D0E]">Истории</h1>
        <button
          onClick={onStartCreateStory}
          className="w-12 h-12 bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] rounded-full flex items-center justify-center shadow-lg"
          aria-label="Создать историю"
        >
          <PlusIcon className="w-6 h-6 text-white"/>
        </button>
      </header>

      <main className="p-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default StoriesPage;

```


### frontend/src/components/layout/TabBar.tsx
```
import React from 'react';
import {ChatBubbleLeftRightIcon, HomeIcon, OrganizationsIcon, ProfileIcon, TrainingIcon} from '../ui/icons';
import type {Tab} from '../../lib/types';

const TabBar: React.FC<{ activeTab: Tab; onTabChange: (tab: Tab) => void; }> = React.memo(({
                                                                                             activeTab,
                                                                                             onTabChange
                                                                                           }) => {
  const navItems = [
    {id: 'home', label: 'Главная', Icon: HomeIcon},
    {id: 'training', label: 'Обучение', Icon: TrainingIcon},
    {id: 'organizations', label: 'Организации', Icon: OrganizationsIcon},
    {id: 'stories', label: 'Истории', Icon: ChatBubbleLeftRightIcon},
    {id: 'profile', label: 'Профиль', Icon: ProfileIcon},
  ];
  return (
    <footer
      className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40 rounded-t-2xl">
      <nav className="flex justify-around items-center h-20">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as Tab)}
            className={`flex flex-col items-center transition-colors w-1/5 ${activeTab === item.id ? 'text-[#007AFF]' : 'text-[rgb(12,13,14,0.52)]'}`}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <item.Icon className="w-7 h-7"/>
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
});

export default TabBar;

```


### frontend/src/components/ui/CancelModal.tsx
```
import React from 'react';

const CancelModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({isOpen, onConfirm, onCancel}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" role="dialog"
         aria-modal="true">
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        {/* Element 1: Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
             className="w-20 h-20 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/>
        </svg>

        {/* Element 2: Title */}
        <h2 className="text-2xl font-bold text-[#0C0D0E]">Отменить участие?</h2>

        {/* Element 3: Subtitle */}
        <p className="text-[rgb(12,13,14,0.52)]">
          Организатор рассчитывает на вас. Если вы отмените запись, ваше место может занять кто-то другой. Вы уверены?
        </p>

        {/* Element 4: Buttons */}
        <div
          className="w-full flex flex-col-reverse sm:flex-row space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 pt-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-transparent text-[#FF303C] font-semibold py-3 px-4 rounded-xl hover:bg-red-50 transition-colors"
          >
            Да, отменить
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Остаться
          </button>
        </div>
      </div>
      <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .animate-scale-in { animation: scale-in 0.2s ease-out; }
            `}</style>
    </div>
  );
};

export default CancelModal;


```


### frontend/src/components/ui/CourseCompleteModal.tsx
```
import React from 'react';
import {AcademicCapIcon} from './icons';

interface CourseCompleteModalProps {
  isOpen: boolean;
  courseTitle: string;
  onViewCertificate: () => void;
  onClose: () => void;
}

const CourseCompleteModal: React.FC<CourseCompleteModalProps> = ({
                                                                   isOpen,
                                                                   courseTitle,
                                                                   onViewCertificate,
                                                                   onClose
                                                                 }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        {/* Element 1: Animated Icon */}
        <div className="w-32 h-32 flex items-center justify-center animate-pop-in">
          <AcademicCapIcon className="w-24 h-24 text-[#007AFF]"/>
        </div>

        {/* Element 2: Title */}
        <h2 className="text-3xl font-bold text-[#1ABE43]">Курс пройден!</h2>

        {/* Element 3: Subtitle */}
        <p className="text-[rgb(12,13,14,0.52)]">
          Вы успешно завершили курс «{courseTitle}». Ваш сертификат уже в профиле!
        </p>

        {/* Element 4: Primary Button */}
        <button
          onClick={onViewCertificate}
          className="w-full bg-[linear-gradient(158deg,#14E1D5_6.15%,#03C722_85.68%)] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
        >
          Посмотреть сертификат
        </button>

        {/* Element 5: Secondary Button */}
        <button onClick={onClose} className="text-sm text-[rgb(12,13,14,0.52)] font-semibold hover:underline">
          Закрыть
        </button>
      </div>
      <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                
                @keyframes scale-in { 
                    from { transform: scale(0.95); opacity: 0; } 
                    to { transform: scale(1); opacity: 1; } 
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
                
                @keyframes pop-in { 
                    0% { transform: scale(0.8) rotate(-15deg); opacity: 0; } 
                    60% { transform: scale(1.1) rotate(5deg); }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; } 
                }
                .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards; animation-fill-mode: backwards; }
            `}</style>
    </div>
  );
};

export default CourseCompleteModal;


```


### frontend/src/components/ui/EmptyState.tsx
```
import React from 'react';

interface EmptyStateProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
  action?: {
    text: string;
    onClick: () => void;
    type: 'primary' | 'secondary';
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({Icon, title, subtitle, action}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
      <Icon className="w-40 h-40 text-gray-300 mb-6"/>
      <h3 className="font-bold text-xl text-[#0C0D0E]">{title}</h3>
      <p className="text-[rgb(12,13,14,0.52)] max-w-xs mt-1 mb-6">{subtitle}</p>
      {action && (
        action.type === 'primary' ? (
          <button
            onClick={action.onClick}
            className="bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
          >
            {action.text}
          </button>
        ) : (
          <button
            onClick={action.onClick}
            className="bg-transparent border-2 border-[#007AFF] text-[#007AFF] font-semibold py-2 px-5 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            {action.text}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;


```


### frontend/src/components/ui/EventCard.tsx
```
import React from 'react';
import type {AppEvent} from '../../lib/types';

const EventCard: React.FC<{ event: AppEvent }> = React.memo(({event}) => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 w-full">
    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center">
      <event.Icon className="w-12 h-12"/>
    </div>
    <div className="text-left">
      <h3 className="font-bold text-md text-[#0C0D0E]">{event.title}</h3>
      <p className="text-sm text-gray-500">{event.category}</p>
      <p className="text-xs text-gray-400 mt-1">{event.date} &middot; {event.location}</p>
    </div>
  </div>
));

export default EventCard;


```


### frontend/src/components/ui/LogoutConfirmationModal.tsx
```
import React from 'react';

const LogoutConfirmationModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({isOpen, onConfirm, onCancel}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" role="dialog"
         aria-modal="true" aria-labelledby="logout-title">
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        {/* Element 1: Title */}
        <h2 id="logout-title" className="text-2xl font-bold text-[#0C0D0E]">Вы уверены, что хотите выйти?</h2>

        {/* Element 2: Subtitle */}
        <p className="text-[rgb(12,13,14,0.52)]">
          Вам потребуется снова войти, чтобы продолжить.
        </p>

        {/* Element 3: Buttons */}
        <div className="w-full flex flex-col space-y-3 pt-2">
          {/* Safe button on top */}
          <button
            onClick={onCancel}
            className="w-full bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Остаться
          </button>
          {/* Destructive button below */}
          <button
            onClick={onConfirm}
            className="w-full bg-transparent text-[#FF303C] font-semibold py-3 px-4 rounded-xl hover:bg-red-50 transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
      <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .animate-scale-in { animation: scale-in 0.2s ease-out; }
            `}</style>
    </div>
  );
};

export default LogoutConfirmationModal;


```


### frontend/src/components/ui/NewAchievementModal.tsx
```
import React from 'react';
import type {Achievement} from '../../lib/types';

const NewAchievementModal: React.FC<{
  achievement: Achievement | null;
  onClose: () => void;
  onNavigateToAchievements: () => void;
}> = ({achievement, onClose, onNavigateToAchievements}) => {
  if (!achievement) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Element 1: Animated Achievement Icon */}
        <div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 flex items-center justify-center shadow-lg mb-2 animate-pop-in">
          <achievement.Icon className="w-20 h-20 text-white"/>
        </div>

        {/* Element 2: Title */}
        <h2 className="text-3xl font-bold text-[#0C0D0E]">Новое достижение!</h2>

        {/* Element 3: Achievement Name */}
        <p className="text-gray-600">
          Получена ачивка «<span className="font-semibold">{achievement.name}</span>»
        </p>

        {/* Element 4: Action Buttons */}
        <div className="w-full flex space-x-3 pt-2">
          <button
            onClick={onNavigateToAchievements}
            className="flex-1 bg-transparent text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            К достижениям
          </button>
          <button
            // onClick={onShare} // Future functionality
            className="flex-1 bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Поделиться
          </button>
        </div>
      </div>
      <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                
                @keyframes scale-in { 
                    from { transform: scale(0.95); opacity: 0; } 
                    to { transform: scale(1); opacity: 1; } 
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
                
                @keyframes pop-in { 
                    0% { transform: scale(0.8); opacity: 0; } 
                    60% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; } 
                }
                .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards; }
            `}</style>
    </div>
  );
};

export default NewAchievementModal;


```


### frontend/src/components/ui/PurchaseConfirmationModal.tsx
```
import React from 'react';
import {SparklesIcon} from './icons';

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  rewardName: string;
  rewardPrice: number;
  userKarma: number;
}

const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({
                                                                               isOpen,
                                                                               onConfirm,
                                                                               onCancel,
                                                                               rewardName,
                                                                               rewardPrice,
                                                                               userKarma
                                                                             }) => {
  if (!isOpen) return null;

  const remainingKarma = userKarma - rewardPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" role="dialog"
         aria-modal="true" aria-labelledby="purchase-title">
      <div
        className="bg-white rounded-[20px] shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-6 animate-scale-in">
        {/* Title */}
        <h2 id="purchase-title" className="text-2xl font-bold text-[#0C0D0E]">Подтвердите покупку</h2>

        {/* Details */}
        <div className="w-full text-left text-base space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Товар:</span>
            <span className="font-semibold text-[#0C0D0E]">{rewardName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Стоимость:</span>
            <div className="flex items-center space-x-1 font-semibold text-[#0C0D0E]">
              <SparklesIcon className="w-4 h-4 text-gray-500"/>
              <span>{rewardPrice.toLocaleString('ru-RU')}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Ваш баланс:</span>
            <div className="flex items-center space-x-1 font-semibold text-[#0C0D0E]">
              <SparklesIcon className="w-4 h-4 text-gray-500"/>
              <span>{userKarma.toLocaleString('ru-RU')}</span>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-3">
            <span className="text-gray-500">Останется:</span>
            <div className="flex items-center space-x-1 font-bold text-[#0C0D0E]">
              <SparklesIcon className="w-4 h-4 text-gray-500"/>
              <span>{remainingKarma.toLocaleString('ru-RU')}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-transparent text-[#007AFF] font-semibold py-3 px-4 rounded-[12px] hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#007AFF] text-white font-bold py-3 px-4 rounded-[12px] shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Купить
          </button>
        </div>
      </div>
      <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .animate-scale-in { animation: scale-in 0.2s ease-out; }
            `}</style>
    </div>
  );
};

export default PurchaseConfirmationModal;


```


### frontend/src/components/ui/SkeletonCard.tsx
```
import React from 'react';

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 animate-pulse">
    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export default SkeletonCard;


```


### frontend/src/components/ui/SubscribeModal.tsx
```
import React from 'react';
import {BellIcon} from './icons';

const SubscribeModal: React.FC<{
  isOpen: boolean;
  organizationName: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({isOpen, organizationName, onConfirm, onCancel}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" role="dialog"
         aria-modal="true" aria-labelledby="subscribe-title">
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        {/* Element 1: Icon */}
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <BellIcon className="w-12 h-12 text-[#007AFF]"/>
        </div>

        {/* Element 2: Title */}
        <h2 id="subscribe-title" className="text-2xl font-bold text-[#0C0D0E]">Подписаться на обновления?</h2>

        {/* Element 3: Subtitle */}
        <p className="text-[rgb(12,13,14,0.52)]">
          Вы будете получать уведомления о новых событиях от организации "<span
          className="font-semibold">{organizationName}</span>".
        </p>

        {/* Element 4: Buttons */}
        <div className="w-full flex space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-transparent text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Подписаться
          </button>
        </div>
      </div>
      <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .animate-scale-in { animation: scale-in 0.2s ease-out; }
            `}</style>
    </div>
  );
};

export default SubscribeModal;


```


### frontend/src/components/ui/Toast.tsx
```
import React, {useEffect} from 'react';
import {CheckCircleIcon} from './icons';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'info';
  onUndo?: () => void;
}

const Toast: React.FC<ToastProps> = ({
                                       message,
                                       show,
                                       onClose,
                                       duration = 5000, // 5 seconds as per spec
                                       type = 'info',
                                       onUndo,
                                     }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const handleUndoClick = () => {
    if (onUndo) {
      onUndo();
    }
    onClose(); // Close toast immediately when undo is clicked
  };

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-11/12 max-w-sm transform transition-all duration-300 ease-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}
    >
      <div className="bg-gray-800 text-white py-3 px-4 rounded-2xl shadow-lg flex flex-col items-start space-y-2">
        <div className="flex items-center space-x-3">
          {type === 'success' && <CheckCircleIcon className="w-6 h-6 text-[#1ABE43]"/>}
          <span className="text-sm">{message}</span>
        </div>
        {onUndo && (
          <button onClick={handleUndoClick}
                  className="font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap self-end text-sm">
            Отменить
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;

```


### frontend/src/components/ui/icons/AcademicCapIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const AcademicCapIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c0 1.66 4 3 6 3s6-1.34 6-3v-5"/>
  </svg>
);

export default AcademicCapIcon;

```


### frontend/src/components/ui/icons/AnimalFriendIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const AnimalFriendIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50,15 C25,15 15,40 15,55 C15,80 30,90 50,90 C70,90 85,80 85,55 C85,40 75,15 50,15 Z" fill="#ffd3b6"/>
    <circle cx="35" cy="45" r="8" fill="#6c5b7b"/>
    <circle cx="65" cy="45" r="8" fill="#6c5b7b"/>
    <path d="M50,65 C55,75 45,75 50,65 Z" fill="#6c5b7b"/>
    <path d="M30,25 A10,10 0 0,1 20,15" fill="none" stroke="#6c5b7b" strokeWidth="4"/>
    <path d="M70,25 A10,10 0 0,0 80,15" fill="none" stroke="#6c5b7b" strokeWidth="4"/>
  </svg>
);

export default AnimalFriendIcon;

```


### frontend/src/components/ui/icons/ArrowLeftIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ArrowLeftIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 12H5"/>
    <path d="m12 19-7-7 7-7"/>
  </svg>
);

export default ArrowLeftIcon;

```


### frontend/src/components/ui/icons/ArrowRightOnRectangleIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ArrowRightOnRectangleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

export default ArrowRightOnRectangleIcon;

```


### frontend/src/components/ui/icons/ArtVolunteerIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ArtVolunteerIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20,80 C40,90 60,90 80,80 C90,70 90,50 80,40 C70,30 50,20 40,30 C30,40 10,70 20,80 Z" fill="#a2d5f2"/>
    <circle cx="35" cy="55" r="8" fill="#ffc107"/>
    <circle cx="55" cy="45" r="10" fill="#e91e63"/>
    <circle cx="70" cy="60" r="7" fill="#4caf50"/>
    <path d="M25,25 L45,15 L50,35 L30,45 Z" fill="#8d6e63"/>
    <path d="M45,15 L80,50" stroke="#5d4037" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

export default ArtVolunteerIcon;

```


### frontend/src/components/ui/icons/BellIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const BellIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

export default BellIcon;

```


### frontend/src/components/ui/icons/BinocularsIllustrationIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const BinocularsIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Person */}
      <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
      <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>

      {/* Binoculars */}
      <g transform="translate(0, -25)">
        <path d="M -30 -10 L -10 -15 L -10 15 L -30 10 Z" fill="#616161"/>
        <path d="M 30 -10 L 10 -15 L 10 15 L 30 10 Z" fill="#616161"/>
        <rect x="-15" y="-5" width="30" height="10" fill="#424242"/>
        <circle cx="-30" cy="0" r="12" fill="#9e9e9e"/>
        <circle cx="30" cy="0" r="12" fill="#9e9e9e"/>
        <circle cx="-30" cy="0" r="8" fill="#e0e0e0"/>
        <circle cx="30" cy="0" r="8" fill="#e0e0e0"/>
      </g>

      {/* Background elements */}
      <path d="M 50, -40 a 5,5 0 1,1 -10,0 5,5 0 1,1 10,0" fill="#e0e0e0" opacity="0.7"/>
      <path d="M -60, 20 a 8,8 0 1,1 -16,0 8,8 0 1,1 16,0" fill="#e0e0e0" opacity="0.7"/>
      <path d="M 60, 50 a 4,4 0 1,1 -8,0 4,4 0 1,1 8,0" fill="#e0e0e0" opacity="0.7"/>
    </g>
  </svg>
);

export default BinocularsIllustrationIcon;

```


### frontend/src/components/ui/icons/BriefcaseIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const BriefcaseIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M20.25 14.15v4.075c0 1.313-.964 2.446-2.25 2.654l-5.25 1.106a2.25 2.25 0 01-1.998 0l-5.25-1.106A2.25 2.25 0 013.75 18.225V14.15M3.75 14.15L2.25 13.5m18 0l-1.5.65M12 7.5h.008v.008H12V7.5zm0 3.75h.008v.008H12v-.008zm0 3.75h.008v.008H12v-.008zm-3.75-3.75h.008v.008H8.25v-.008zm0 3.75h.008v.008H8.25v-.008zm3.75-7.5h.008v.008H12V3.75zM8.25 7.5h.008v.008H8.25V7.5z"/>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v4.159c0 .714-.383 1.37-1.002 1.7L12 15.25l-7.248-3.389A1.875 1.875 0 013.75 10.159V6z"/>
  </svg>
);

export default BriefcaseIcon;


```


### frontend/src/components/ui/icons/BronzeMedalIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const BronzeMedalIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <defs>
      <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CD7F32"/>
        <stop offset="100%" stopColor="#A0522D"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="8" r="6" fill="url(#bronzeGradient)" stroke="#8B4513" strokeWidth="1"/>
    <path d="M8 14v4l4 2 4-2v-4" stroke="#8B4513" strokeWidth="1.5" fill="#CD7F32"/>
    <path d="M12 11l-1-2h2l-1 2Z" fill="white"/>
  </svg>
);

export default BronzeMedalIcon;

```


### frontend/src/components/ui/icons/CalendarEmptyIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const CalendarEmptyIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M12 14v.01"/>
    <path d="M12 18v.01"/>
    <path d="M16 14v.01"/>
    <path d="M8 14v.01"/>
    <path d="M8 18v.01"/>
  </svg>
);

export default CalendarEmptyIcon;

```


### frontend/src/components/ui/icons/CalendarIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const CalendarIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default CalendarIcon;

```


### frontend/src/components/ui/icons/CameraIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const CameraIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

export default CameraIcon;

```


### frontend/src/components/ui/icons/ChatBubbleLeftRightIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ChatBubbleLeftRightIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export default ChatBubbleLeftRightIcon;

```


### frontend/src/components/ui/icons/CheckCircleIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
          clipRule="evenodd"/>
  </svg>
);

export default CheckCircleIcon;

```


### frontend/src/components/ui/icons/CheckIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const CheckIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

export default CheckIcon;

```


### frontend/src/components/ui/icons/ChevronRightIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ChevronRightIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default ChevronRightIcon;

```


### frontend/src/components/ui/icons/ClockIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ClockIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default ClockIcon;

```


### frontend/src/components/ui/icons/DiplomaStandIllustrationIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const DiplomaStandIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Diploma Stand */}
      <g transform="translate(-30, 0)">
        <rect x="-30" y="-50" width="60" height="80" rx="5" fill="#fff" stroke="#e0e0e0" strokeWidth="2"/>
        <path d="M -10 30 L 0 50 L 10 30" fill="none" stroke="#bdbdbd" strokeWidth="4"/>
        <rect x="-5" y="30" width="10" height="10" fill="#bdbdbd"/>
      </g>

      {/* Person */}
      <g transform="translate(45, 10)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>
    </g>
  </svg>
);

export default DiplomaStandIllustrationIcon;

```


### frontend/src/components/ui/icons/DocumentTextIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const DocumentTextIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

export default DocumentTextIcon;

```


### frontend/src/components/ui/icons/DotsHorizontalIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const DotsHorizontalIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd"
          d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
          clipRule="evenodd"/>
  </svg>
);

export default DotsHorizontalIcon;


```


### frontend/src/components/ui/icons/DownloadIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const DownloadIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export default DownloadIcon;

```


### frontend/src/components/ui/icons/ElderlyHelperIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ElderlyHelperIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50,10 C20,10 10,40 10,60 C10,90 50,95 50,95 C50,95 90,90 90,60 C90,40 80,10 50,10 Z" fill="#ffaaa5"/>
    <path d="M50,15 C25,15 15,40 15,60 C15,85 50,90 50,90 C50,90 85,85 85,60 C85,40 75,15 50,15 Z" fill="#ff8b94"/>
    <path d="M50,30 L50,70" stroke="white" strokeWidth="6" strokeLinecap="round"/>
    <path d="M30,50 L70,50" stroke="white" strokeWidth="6" strokeLinecap="round"/>
  </svg>
);

export default ElderlyHelperIcon;

```


### frontend/src/components/ui/icons/EmptyCalendarIllustrationIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const EmptyCalendarIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Calendar */}
      <rect x="-50" y="-40" width="100" height="80" rx="10" fill="#fff" stroke="#e0e0e0" strokeWidth="2"/>
      <rect x="-50" y="-40" width="100" height="20" rx="10" ry="10" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="2"/>
      <circle cx="-35" cy="-30" r="4" fill="#e0e0e0"/>
      <circle cx="-15" cy="-30" r="4" fill="#e0e0e0"/>
      <circle cx="5" cy="-30" r="4" fill="#e0e0e0"/>

      {/* Person */}
      <g transform="translate(45, 10)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>
      {/* Question Mark */}
      <text x="0" y="10" fontSize="40" fill="#bdbdbd" textAnchor="middle" fontFamily="Arial, sans-serif"
            fontWeight="bold">?
      </text>
    </g>
  </svg>
);

export default EmptyCalendarIllustrationIcon;

```


### frontend/src/components/ui/icons/EmptyChatIllustrationIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const EmptyChatIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Phone */}
      <rect x="10" y="-30" width="40" height="80" rx="8" fill="#e0e0e0"/>
      <rect x="15" y="-25" width="30" height="60" fill="#f5f5f5"/>
      <circle cx="30" cy="40" r="3" fill="#bdbdbd"/>

      {/* Person */}
      <g transform="translate(-30, 10)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>
      {/* Zzz */}
      <g transform="translate(50, -20) rotate(15)">
        <text fontSize="12" fill="#bdbdbd" fontFamily="Arial" fontWeight="bold">z</text>
        <text x="5" y="5" fontSize="16" fill="#bdbdbd" fontFamily="Arial" fontWeight="bold">Z</text>
        <text x="12" y="12" fontSize="20" fill="#bdbdbd" fontFamily="Arial" fontWeight="bold">z</text>
      </g>
    </g>
  </svg>
);

export default EmptyChatIllustrationIcon;


```


### frontend/src/components/ui/icons/EmptySearchIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const EmptySearchIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19Z"/>
    <path d="M22 22 18 18"/>
    <path d="m8.5 8.5 7 7"/>
    <path d="m15.5 8.5-7 7"/>
  </svg>
);

export default EmptySearchIcon;

```


### frontend/src/components/ui/icons/EmptyShelfIllustrationIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const EmptyShelfIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Shelf */}
      <rect x="-60" y="20" width="120" height="8" rx="2" fill="#bdbdbd"/>
      <path d="M -50 20 L -40 40 L -30 20" fill="none" stroke="#bdbdbd" strokeWidth="4"/>
      <path d="M 50 20 L 40 40 L 30 20" fill="none" stroke="#bdbdbd" strokeWidth="4"/>

      {/* Person */}
      <g transform="translate(0, -10)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>

      {/* Thought Bubble */}
      <g transform="translate(-40, -50)">
        <path d="M 0,0 a 20,15 0 1,1 0,0.1 z" fill="#f5f5f5"/>
        <circle cx="-15" cy="15" r="3" fill="#f5f5f5"/>
        <circle cx="-10" cy="20" r="2" fill="#f5f5f5"/>
      </g>
    </g>
  </svg>
);

export default EmptyShelfIllustrationIcon;

```


### frontend/src/components/ui/icons/EnvelopeIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const EnvelopeIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

export default EnvelopeIcon;

```


### frontend/src/components/ui/icons/EyeIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const EyeIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default EyeIcon;

```


### frontend/src/components/ui/icons/EyeOffIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const EyeOffIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
);

export default EyeOffIcon;

```


### frontend/src/components/ui/icons/FilterIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const FilterIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

export default FilterIcon;

```


### frontend/src/components/ui/icons/GeolocationIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const GeolocationIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);

export default GeolocationIcon;

```


### frontend/src/components/ui/icons/GlobeAltIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const GlobeAltIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 18 15.3 15.3 0 0 1-8 0 15.3 15.3 0 0 1 4-18z"/>
  </svg>
);

export default GlobeAltIcon;

```


### frontend/src/components/ui/icons/GoldMedalIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const GoldMedalIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="100%" stopColor="#FFA500"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="8" r="6" fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="1"/>
    <path d="M8 14v4l4 2 4-2v-4" stroke="#B8860B" strokeWidth="1.5" fill="#FFD700"/>
    <path d="M12 11l-1-2h2l-1 2Z" fill="white"/>
  </svg>
);

export default GoldMedalIcon;

```


### frontend/src/components/ui/icons/HeartHandIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const HeartHandIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#007AFF"/>
        <stop offset="100%" stopColor="#5856D6"/>
      </linearGradient>
    </defs>
    <path
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      fill="url(#logoGradient)" stroke="none" className="animate-pulse" style={{animationDuration: '1.5s'}}/>
    <path d="M12 5.524a5.5 5.5 0 0 1 0 13.052c-4.34-2.6-4.9-6-4.9-6s.56-3.4 4.9-6Z" fill="white" stroke="none"/>
    <path
      d="M12.57 18.52a.5.5 0 0 0 .86 0L19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l2.71 2.71a.5.5 0 0 0 .71 0Z"
      stroke="url(#logoGradient)"/>
  </svg>
);

export default HeartHandIcon;

```


### frontend/src/components/ui/icons/HeartIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const HeartIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
  </svg>
);

export default HeartIcon;

```


### frontend/src/components/ui/icons/HomeIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const HomeIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

export default HomeIcon;

```


### frontend/src/components/ui/icons/ListIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ListIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

export default ListIcon;

```


### frontend/src/components/ui/icons/LocationMarkerIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const LocationMarkerIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export default LocationMarkerIcon;

```


### frontend/src/components/ui/icons/LockClosedIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const LockClosedIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd"
          d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
          clipRule="evenodd"/>
  </svg>
);

export default LockClosedIcon;

```


### frontend/src/components/ui/icons/LockIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const LockIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default LockIcon;

```


### frontend/src/components/ui/icons/MagnifyingGlassIllustrationIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const MagnifyingGlassIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Person */}
      <circle cx="25" cy="-25" r="12" fill="#e0e0e0"/>
      <path d="M 10 -10 C 10 20, 40 20, 40 -10 L 35 -10 A 10 10 0 0 1 15 -10 Z" fill="#f5f5f5"/>

      {/* Magnifying Glass */}
      <g transform="rotate(45)">
        <circle cx="-15" cy="-15" r="30" fill="#e0e0e0"/>
        <circle cx="-15" cy="-15" r="24" fill="#f5f5f5"/>
        <rect x="10" y="-20" width="25" height="10" rx="5" fill="#bdbdbd"/>
      </g>

      {/* Empty Paper */}
      <path d="M -50, 0 L 10, -30 L 30, 20 L -30, 50 Z" fill="#fff" stroke="#e0e0e0" strokeWidth="2"/>
    </g>
  </svg>
);

export default MagnifyingGlassIllustrationIcon;

```


### frontend/src/components/ui/icons/MapPinIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const MapPinIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#007AFF"/>
        <stop offset="100%" stopColor="#5856D6"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
        <feOffset dx="0" dy="1" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="url(#pinGradient)" filter="url(#shadow)"/>
    <path d="M12 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill="white"/>
  </svg>
);

export default MapPinIcon;

```


### frontend/src/components/ui/icons/MaxIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const MaxIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      d="M22 6.5a4.5 4.5 0 0 0-4.5-4.5H6.5A4.5 4.5 0 0 0 2 6.5v6.25a4.5 4.5 0 0 0 4.5 4.5h2.25a.75.75 0 0 1 .69.46L11.25 22h1.5l1.81-4.29a.75.75 0 0 1 .69-.46h2.25a4.5 4.5 0 0 0 4.5-4.5V6.5Z"/>
  </svg>
);

export default MaxIcon;

```


### frontend/src/components/ui/icons/MegaphoneIllustrationIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const MegaphoneIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Person */}
      <g transform="translate(-30, 0)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>

      {/* Megaphone */}
      <g transform="translate(15, -15) rotate(15)">
        <path d="M 0 0 L -10 -15 L 30 -25 L 40 -5 Z" fill="#bdbdbd"/>
        <rect x="0" y="-5" width="20" height="10" rx="3" fill="#9e9e9e"/>
        <circle cx="40" cy="-15" r="20" fill="#f5f5f5"/>
        <circle cx="40" cy="-15" r="15" fill="#e0e0e0"/>
      </g>
    </g>
  </svg>
);

export default MegaphoneIllustrationIcon;


```


### frontend/src/components/ui/icons/NatureProtectorIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const NatureProtectorIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50,95 C50,95 20,75 20,45 C20,25 35,10 50,25 C65,10 80,25 80,45 C80,75 50,95 50,95 Z" fill="#a8e6cf"/>
    <path d="M50,90 C50,90 25,70 25,45 C25,28 38,15 50,28 C62,15 75,28 75,45 C75,70 50,90 50,90 Z" fill="#81c784"/>
    <path d="M50,28 C50,20 55,15 60,20 C65,25 60,30 55,30 C50,30 50,35 50,28 Z" fill="#dcedc8"/>
  </svg>
);

export default NatureProtectorIcon;

```


### frontend/src/components/ui/icons/NoNetworkIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const NoNetworkIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
       strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 5L19 19" stroke="#FF303C" strokeWidth="2"/>

    <g stroke="#d1d5db">
      <path d="M8.7 9.8a7 7 0 0 1 6.6 0"/>
      <path d="M6.3 12.2a11 11 0 0 1 11.4 0"/>
      <path d="M12 17.1h.01"/>
    </g>
  </svg>
);

export default NoNetworkIcon;


```


### frontend/src/components/ui/icons/OrganizationsIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const OrganizationsIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default OrganizationsIcon;

```


### frontend/src/components/ui/icons/PaperAirplaneIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const PaperAirplaneIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
  </svg>
);

export default PaperAirplaneIcon;

```


### frontend/src/components/ui/icons/PaperclipIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const PaperclipIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81"/>
  </svg>
);

export default PaperclipIcon;


```


### frontend/src/components/ui/icons/PencilIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const PencilIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>
  </svg>
);

export default PencilIcon;

```


### frontend/src/components/ui/icons/PhotoAlbumIllustrationIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const PhotoAlbumIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Person */}
      <g transform="translate(45, 10)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>

      {/* Camera */}
      <g transform="translate(-30, 0)">
        <rect x="-30" y="-20" width="60" height="40" rx="5" fill="#bdbdbd"/>
        <circle cx="0" cy="0" r="15" fill="#f5f5f5"/>
        <circle cx="0" cy="0" r="10" fill="#616161"/>
        <rect x="15" y="-28" width="10" height="8" rx="2" fill="#9e9e9e"/>
      </g>
    </g>
  </svg>
);

export default PhotoAlbumIllustrationIcon;

```


### frontend/src/components/ui/icons/PinIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const PinIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd"
          d="M9.528 1.718a.75.75 0 01.744.042l8.25 6a.75.75 0 01-.042 1.33L12 11.25v6.542l3.43-2.287a.75.75 0 11.74 1.33l-4.5 3a.75.75 0 01-.86 0l-4.5-3a.75.75 0 11.74-1.33L10.5 17.792v-6.542L3.528 9.09a.75.75 0 01-.042-1.33l8.25-6a.75.75 0 01.792-.042z"
          clipRule="evenodd"/>
  </svg>
);

export default PinIcon;


```


### frontend/src/components/ui/icons/PlayCircleIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const PlayCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-3.028a.75.75 0 01.75.75v6.546a.75.75 0 01-1.141.662l-5.223-3.272a.75.75 0 010-1.324l5.223-3.272a.75.75 0 01.391-.138z"
          clipRule="evenodd"/>
  </svg>
);

export default PlayCircleIcon;

```


### frontend/src/components/ui/icons/PlusIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const PlusIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
  </svg>
);

export default PlusIcon;

```


### frontend/src/components/ui/icons/ProfileIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ProfileIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export default ProfileIcon;

```


### frontend/src/components/ui/icons/PuzzleIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const PuzzleIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
       strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14 7h.01"/>
    <path d="M10.5 17.5v.01"/>
    <path d="M17.5 10.5h.01"/>
    <path d="M7 14v.01"/>
    <path
      d="M17.5 14a3.5 3.5 0 0 0-3.5-3.5h-1a3.5 3.5 0 0 0-3.5 3.5v1a3.5 3.5 0 0 0 3.5 3.5h1a3.5 3.5 0 0 0 3.5-3.5v-1"/>
    <path d="M3.5 14a3.5 3.5 0 0 0 3.5 3.5h1"/>
    <path d="M14 3.5a3.5 3.5 0 0 0-3.5 3.5v1"/>
    <path d="M10.5 20.5a3.5 3.5 0 0 0 3.5-3.5v-1"/>
    <path d="M20.5 10.5a3.5 3.5 0 0 0-3.5-3.5h-1"/>
  </svg>
);

export default PuzzleIcon;

```


### frontend/src/components/ui/icons/RefreshIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const RefreshIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348A9 9 0 1 1 5.977 9.348"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.999 2.083v4.667h4.667"/>
  </svg>
);

export default RefreshIcon;

```


### frontend/src/components/ui/icons/SearchIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const SearchIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default SearchIcon;

```


### frontend/src/components/ui/icons/ServerErrorIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ServerErrorIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
       strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g stroke="#d1d5db">
      <path d="M12 20v-3.5"/>
      <path d="M12 7.5V4"/>
      <path d="m4.93 4.93 2.47 2.47"/>
      <path d="M17.66 17.66-2.47-2.47"/>
      <path d="m19.07 4.93-2.47 2.47"/>
      <path d="M22 12h-3.5"/>
      <path d="M5.5 12H2"/>
      <path d="m6.34 17.66 1.05-1.05"/>
    </g>

    <path d="M13.4 15.6a4 4 0 0 0-2.8 0l-2.4-4.1a4 4 0 0 0 6.8-.1l-1.6 4.2z" stroke="#d1d5db"/>

    <path d="M16.6 15.6 14 11.5" stroke="#FF303C" strokeWidth="2"/>
  </svg>
);

export default ServerErrorIcon;


```


### frontend/src/components/ui/icons/SettingsIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const SettingsIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3"></circle>
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export default SettingsIcon;

```


### frontend/src/components/ui/icons/ShareIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ShareIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);

export default ShareIcon;

```


### frontend/src/components/ui/icons/ShieldCheckIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

export default ShieldCheckIcon;

```


### frontend/src/components/ui/icons/SilverMedalIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const SilverMedalIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <defs>
      <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0E0E0"/>
        <stop offset="100%" stopColor="#B0B0B0"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="8" r="6" fill="url(#silverGradient)" stroke="#808080" strokeWidth="1"/>
    <path d="M8 14v4l4 2 4-2v-4" stroke="#808080" strokeWidth="1.5" fill="#C0C0C0"/>
    <path d="M12 11l-1-2h2l-1 2Z" fill="white"/>
  </svg>
);

export default SilverMedalIcon;

```


### frontend/src/components/ui/icons/SparklesIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const SparklesIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.476-1.476L12.938 18l1.188-.648a2.25 2.25 0 011.476-1.476l1.188-.648.648 1.188a2.25 2.25 0 011.476 1.476l.648 1.188-1.188.648a2.25 2.25 0 01-1.476 1.476z"/>
  </svg>
);

export default SparklesIcon;

```


### frontend/src/components/ui/icons/StarIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const StarIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default StarIcon;

```


### frontend/src/components/ui/icons/TrainingIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const TrainingIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
  </svg>
);

export default TrainingIcon;

```


### frontend/src/components/ui/icons/TrendingUpIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const TrendingUpIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.182.825m3.182-.825V18m0-12.75l-3.182.825"/>
  </svg>
);

export default TrendingUpIcon;


```


### frontend/src/components/ui/icons/TrophyIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const TrophyIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.87 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.13 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

export default TrophyIcon;

```


### frontend/src/components/ui/icons/UserCircleIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const UserCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="10" r="4"/>
    <path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

export default UserCircleIcon;

```


### frontend/src/components/ui/icons/UserGroupIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const UserGroupIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.964A3.375 3.375 0 0112 12.75a3.375 3.375 0 013.75 3.75m-3.75 0h-7.5a3.375 3.375 0 01-3.75-3.75A3.375 3.375 0 014.5 12.75v-2.53c0-.946.38-1.823 1.03-2.474l.493-.37c.21-.159.443-.28.693-.368m11.583 3.126c.25-.088.483-.209.693-.368l.493-.37a3.375 3.375 0 001.03-2.474v-2.53a3.375 3.375 0 00-3.75-3.75V6.75A3.375 3.375 0 0012 3.375a3.375 3.375 0 00-3.75 3.375v.098a3.375 3.375 0 00-1.5 2.894m15.375 6.465c-.325-.09-.65-.197-.983-.295m-12.39 0c-.333.098-.658.205-.983.295m7.5 0h-7.5"/>
  </svg>
);

export default UserGroupIcon;

```


### frontend/src/components/ui/icons/UserIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const UserIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export default UserIcon;

```


### frontend/src/components/ui/icons/VerifiedIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const VerifiedIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd"
          d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12c0 1.357-.6 2.573-1.549 3.397a4.49 4.49 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
          clipRule="evenodd"/>
  </svg>
);

export default VerifiedIcon;

```


### frontend/src/components/ui/icons/XIcon.tsx
```
import React from 'react';
import type {IconProps} from './types';

const XIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default XIcon;

```


### frontend/src/components/ui/icons/index.ts
```
export {default as AcademicCapIcon} from './AcademicCapIcon';
export {default as AnimalFriendIcon} from './AnimalFriendIcon';
export {default as ArrowLeftIcon} from './ArrowLeftIcon';
export {default as ArrowRightOnRectangleIcon} from './ArrowRightOnRectangleIcon';
export {default as ArtVolunteerIcon} from './ArtVolunteerIcon';
export {default as BellIcon} from './BellIcon';
export {default as BinocularsIllustrationIcon} from './BinocularsIllustrationIcon';
export {default as BriefcaseIcon} from './BriefcaseIcon';
export {default as BronzeMedalIcon} from './BronzeMedalIcon';
export {default as CalendarIcon} from './CalendarIcon';
export {default as CalendarEmptyIcon} from './CalendarEmptyIcon';
export {default as CameraIcon} from './CameraIcon';
export {default as ChatBubbleLeftRightIcon} from './ChatBubbleLeftRightIcon';
export {default as CheckCircleIcon} from './CheckCircleIcon';
export {default as CheckIcon} from './CheckIcon';
export {default as ChevronRightIcon} from './ChevronRightIcon';
export {default as ClockIcon} from './ClockIcon';
export {default as DiplomaStandIllustrationIcon} from './DiplomaStandIllustrationIcon';
export {default as DocumentTextIcon} from './DocumentTextIcon';
export {default as DotsHorizontalIcon} from './DotsHorizontalIcon';
export {default as DownloadIcon} from './DownloadIcon';
export {default as ElderlyHelperIcon} from './ElderlyHelperIcon';
export {default as EmptyCalendarIllustrationIcon} from './EmptyCalendarIllustrationIcon';
export {default as EmptyChatIllustrationIcon} from './EmptyChatIllustrationIcon';
export {default as EmptySearchIcon} from './EmptySearchIcon';
export {default as EmptyShelfIllustrationIcon} from './EmptyShelfIllustrationIcon';
export {default as EnvelopeIcon} from './EnvelopeIcon';
export {default as EyeIcon} from './EyeIcon';
export {default as EyeOffIcon} from './EyeOffIcon';
export {default as FilterIcon} from './FilterIcon';
export {default as GeolocationIcon} from './GeolocationIcon';
export {default as GlobeAltIcon} from './GlobeAltIcon';
export {default as GoldMedalIcon} from './GoldMedalIcon';
export {default as HeartHandIcon} from './HeartHandIcon';
export {default as HeartIcon} from './HeartIcon';
export {default as HomeIcon} from './HomeIcon';
export {default as ListIcon} from './ListIcon';
export {default as LocationMarkerIcon} from './LocationMarkerIcon';
export {default as LockClosedIcon} from './LockClosedIcon';
export {default as LockIcon} from './LockIcon';
export {default as MagnifyingGlassIllustrationIcon} from './MagnifyingGlassIllustrationIcon';
export {default as MapPinIcon} from './MapPinIcon';
export {default as MaxIcon} from './MaxIcon';
export {default as MegaphoneIllustrationIcon} from './MegaphoneIllustrationIcon';
export {default as NatureProtectorIcon} from './NatureProtectorIcon';
export {default as NoNetworkIcon} from './NoNetworkIcon';
export {default as OrganizationsIcon} from './OrganizationsIcon';
export {default as PaperAirplaneIcon} from './PaperAirplaneIcon';
export {default as PaperclipIcon} from './PaperclipIcon';
export {default as PencilIcon} from './PencilIcon';
export {default as PhotoAlbumIllustrationIcon} from './PhotoAlbumIllustrationIcon';
export {default as PinIcon} from './PinIcon';
export {default as PlayCircleIcon} from './PlayCircleIcon';
export {default as PlusIcon} from './PlusIcon';
export {default as ProfileIcon} from './ProfileIcon';
export {default as PuzzleIcon} from './PuzzleIcon';
export {default as RefreshIcon} from './RefreshIcon';
export {default as SearchIcon} from './SearchIcon';
export {default as ServerErrorIcon} from './ServerErrorIcon';
export {default as SettingsIcon} from './SettingsIcon';
export {default as ShareIcon} from './ShareIcon';
export {default as ShieldCheckIcon} from './ShieldCheckIcon';
export {default as SilverMedalIcon} from './SilverMedalIcon';
export {default as SparklesIcon} from './SparklesIcon';
export {default as StarIcon} from './StarIcon';
export {default as TrainingIcon} from './TrainingIcon';
export {default as TrendingUpIcon} from './TrendingUpIcon';
export {default as TrophyIcon} from './TrophyIcon';
export {default as UserCircleIcon} from './UserCircleIcon';
export {default as UserGroupIcon} from './UserGroupIcon';
export {default as UserIcon} from './UserIcon';
export {default as VerifiedIcon} from './VerifiedIcon';
export {default as XIcon} from './XIcon';

```


### frontend/src/components/ui/icons/types.ts
```
import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
}

```


### frontend/src/features/achievements/components/AchievementDetailModal.tsx
```
import React from 'react';
import type {Achievement} from '../../../lib/types';
import {LockClosedIcon} from '../../../components/ui/icons';

const AchievementDetailModal: React.FC<{
  achievement: Achievement | null;
  onClose: () => void;
  onNavigateWithFilter: (category: string) => void;
}> = ({achievement, onClose, onNavigateWithFilter}) => {
  if (!achievement) return null;

  const progressPercentage = (achievement.progress !== undefined && achievement.target)
    ? (achievement.progress / achievement.target) * 100
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-t-2xl shadow-xl p-6 w-full max-w-lg text-center flex flex-col items-center space-y-4 transition-transform duration-300 translate-y-0"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>

        {/* Unlocked State */}
        {achievement.unlocked ? (
          <>
            <div
              className="w-32 h-32 rounded-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex items-center justify-center shadow-lg -mt-20 mb-2 animate-pop-in">
              <achievement.Icon className="w-20 h-20 text-white"/>
            </div>
            <h2 className="text-2xl font-bold text-[#0C0D0E]">{achievement.name}</h2>
            <p className="text-[rgb(12,13,14,0.52)] max-w-sm">{achievement.description}</p>
            <p className="text-sm text-[rgb(12,13,14,0.52)]">Получено: {achievement.unlockedDate}</p>
            <button
              className="w-full bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-colors mt-2">
              Поделиться достижением
            </button>
          </>
        ) : (
          /* Locked State */
          <>
            <div
              className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center -mt-20 mb-2 animate-pop-in">
              <LockClosedIcon className="w-20 h-20 text-gray-400"/>
            </div>
            <h2 className="text-2xl font-bold text-[rgb(12,13,14,0.52)]">{achievement.name}</h2>
            <p className="text-[#0C0D0E] font-medium max-w-sm">{achievement.description}</p>

            {achievement.progress !== undefined && achievement.target !== undefined && (
              <div className="w-full max-w-xs pt-2">
                <p
                  className="text-sm text-[rgb(12,13,14,0.52)] mb-1">Прогресс: {achievement.progress} из {achievement.target}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#007AFF] h-2 rounded-full" style={{width: `${progressPercentage}%`}}></div>
                </div>
              </div>
            )}

            <button
              onClick={() => onNavigateWithFilter(achievement.filterCategory || 'Все')}
              className="w-full bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-colors mt-2"
            >
              {achievement.cta || "К цели!"}
            </button>
          </>
        )}
      </div>
      <style>{`
                @keyframes pop-in { 
                    0% { transform: scale(0.8); opacity: 0; } 
                    100% { transform: scale(1); opacity: 1; } 
                }
                .animate-pop-in { animation: pop-in 0.3s ease-out; }
            `}</style>
    </div>
  );
};

export default AchievementDetailModal;


```


### frontend/src/features/challenges/components/WeeklyChallengeWidget.tsx
```
import React from 'react';
import {CheckCircleIcon} from '../../../components/ui/icons';

interface WeeklyChallengeWidgetProps {
  challenge: {
    title: string;
    description: string;
    reward: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    progress: number;
    target: number;
    filterCategory: string;
  };
  isCompleted: boolean;
  onCtaClick: (category: string) => void;
}

const WeeklyChallengeWidget: React.FC<WeeklyChallengeWidgetProps> = ({challenge, isCompleted, onCtaClick}) => {
  const progressPercentage = (challenge.progress / challenge.target) * 100;

  if (isCompleted) {
    return (
      <div
        className="w-full bg-[linear-gradient(158deg,#14E1D5_6.15%,#03C722_85.68%)] rounded-2xl p-4 flex items-center text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8">
          <challenge.Icon className="w-32 h-32 opacity-20 transform rotate-12"/>
        </div>
        <div className="flex-shrink-0 mr-4 z-10">
          <CheckCircleIcon className="w-16 h-16 text-white"/>
        </div>
        <div className="flex-1 z-10">
          <h3 className="font-bold text-lg">Челлендж выполнен!</h3>
          <p className="text-sm opacity-90">{challenge.reward}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-[linear-gradient(155deg,#BF97FF_6.6%,#526EFF_84.12%)] rounded-2xl p-4 flex items-center text-white shadow-lg relative overflow-hidden text-left">
      <div className="absolute -right-8 -bottom-8">
        <challenge.Icon className="w-32 h-32 opacity-20 transform -rotate-12"/>
      </div>
      {/* Element 1: Icon */}
      <div className="flex-shrink-0 mr-4 z-10">
        <challenge.Icon className="w-16 h-16 opacity-80"/>
      </div>
      <div className="flex-1 space-y-2 z-10">
        {/* Element 2: Text */}
        <div>
          <p className="font-bold text-sm opacity-80">{challenge.title}</p>
          <h3 className="font-bold text-lg leading-tight">{challenge.description}</h3>
          <p className="text-xs opacity-90 mt-1">{challenge.reward}</p>
        </div>
        {/* Element 3: Progress Bar */}
        <div className="flex items-center space-x-2">
          <div className="w-full bg-white/30 rounded-full h-1.5 flex-1">
            <div className="bg-yellow-300 h-1.5 rounded-full" style={{width: `${progressPercentage}%`}}></div>
          </div>
          <span className="text-xs font-mono">{challenge.progress}/{challenge.target}</span>
        </div>
      </div>
      {/* Element 4: CTA Button */}
      <div className="flex-shrink-0 z-10 self-center ml-3">
        <button
          onClick={() => onCtaClick(challenge.filterCategory)}
          className="bg-white/30 hover:bg-white/40 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-colors"
        >
          К цели
        </button>
      </div>
    </div>
  );
};
export default WeeklyChallengeWidget;

```


### frontend/src/features/invites/components/InviteFriendModal.tsx
```
import React, {useEffect, useMemo, useState} from 'react';
import type {AppEvent} from '../../../lib/types';
import {mockFriends} from '../../../lib/mockData';
import {CalendarIcon, ListIcon, SearchIcon, XIcon} from '../../../components/ui/icons';

const CheckboxIcon: React.FC<{ checked: boolean }> = ({checked}) => {
  if (checked) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
           className="w-7 h-7 text-[#007AFF]">
        <path fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"/>
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
         className="w-7 h-7 text-gray-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  );
};


const InviteFriendModal: React.FC<{
  isOpen: boolean;
  event: AppEvent;
  onClose: () => void;
  onSend: () => void;
}> = ({isOpen, event, onClose, onSend}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  const filteredFriends = useMemo(() => {
    if (!searchQuery) return mockFriends;
    return mockFriends.filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const toggleFriend = (id: number) => {
    setSelectedFriends(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    if (selectedFriends.length > 0) {
      onSend();
    }
  };

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      // Add a small delay to allow animation to finish before clearing
      setTimeout(() => {
        setSearchQuery('');
        setSelectedFriends([]);
      }, 300);
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-friend-title"
    >
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{height: '85vh'}}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="w-12"></div>
          {/* Spacer */}
          <div className="text-center">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <h2 id="invite-friend-title" className="text-xl font-bold text-[#0C0D0E]">Пригласить друзей</h2>
          </div>
          <button onClick={onClose}
                  className="w-12 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800"
                  aria-label="Закрыть">
            <XIcon className="w-6 h-6"/>
          </button>
        </header>

        <div className="p-6 pb-2 flex-shrink-0">
          {/* Event Preview */}
          <div className="bg-gray-50 p-3 rounded-xl mb-4">
            <div className="flex items-center space-x-3">
              <ListIcon className="w-5 h-5 text-gray-500 flex-shrink-0"/>
              <span className="font-semibold text-sm text-[#0C0D0E] truncate">{event.title}</span>
            </div>
            <div className="flex items-center space-x-3 mt-1.5">
              <CalendarIcon className="w-5 h-5 text-gray-500 flex-shrink-0"/>
              <span className="text-sm text-gray-700">{event.date}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-gray-400"/>
                        </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти друга по имени"
              className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Friends List */}
        <main className="flex-grow overflow-y-auto px-6">
          <div className="divide-y divide-gray-100">
            {filteredFriends.map(friend => (
              <button
                key={friend.id}
                onClick={() => toggleFriend(friend.id)}
                className="w-full flex items-center py-3 text-left"
              >
                <img loading="lazy" src={friend.avatarUrl} alt={friend.name} className="w-12 h-12 rounded-full"/>
                <span className="flex-1 ml-4 font-semibold text-[#0C0D0E]">{friend.name}</span>
                <CheckboxIcon checked={selectedFriends.includes(friend.id)}/>
              </button>
            ))}
          </div>
        </main>

        {/* Sticky Footer */}
        <footer className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
          <button
            onClick={handleSend}
            disabled={selectedFriends.length === 0}
            className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#007AFF] hover:bg-blue-600"
          >
            {selectedFriends.length > 0 ? `Отправить (${selectedFriends.length})` : 'Отправить'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default InviteFriendModal;

```


### frontend/src/features/organization/components/EventManagementCard.tsx
```
import React from 'react';
import type {OrganizationEvent} from '../../../lib/types';
import {DotsHorizontalIcon, PencilIcon, UserGroupIcon} from '../../../components/ui/icons';

interface EventManagementCardProps {
  event: OrganizationEvent;
  onSelect: () => void;
  onEdit: () => void;
  onMore: (id: number) => void;
}

const EventManagementCard: React.FC<EventManagementCardProps> = ({event, onSelect, onEdit, onMore}) => {
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:bg-gray-50 transition-colors"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-[#0C0D0E]">{event.title}</h3>
          <p className="text-sm text-[rgb(12,13,14,0.52)] mt-1">{event.date}</p>
        </div>
        {event.status === 'draft' && (
          <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">Черновик</span>
        )}
      </div>

      {event.status !== 'draft' && (
        <div className="flex items-center space-x-2 text-sm text-[rgb(12,13,14,0.52)] mb-4">
          <UserGroupIcon className="w-5 h-5"/>
          <span className="font-semibold text-[#0C0D0E]">{event.participantCount} / {event.capacity}</span>
          <span>участников</span>
          {event.newApplications > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                <span className="font-semibold text-yellow-600">{event.newApplications} новых</span>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 border-t border-gray-100 pt-3 mt-3">
        <button
          onClick={(e) => handleButtonClick(e, () => onMore(event.id))}
          className="p-2 rounded-lg hover:bg-gray-200"
        >
          <DotsHorizontalIcon className="w-6 h-6 text-gray-600"/>
        </button>
        <button
          onClick={(e) => handleButtonClick(e, onEdit)}
          className="flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
        >
          <PencilIcon className="w-5 h-5"/>
          <span>{event.status === 'draft' ? 'Завершить' : 'Редактировать'}</span>
        </button>
      </div>
    </button>
  );
};

export default EventManagementCard;

```


### frontend/src/features/reviews/components/ReviewModal.tsx
```
import React, {useEffect, useState} from 'react';
import type {HistoryEvent} from '../../../lib/types';
import {StarIcon, XIcon} from '../../../components/ui/icons';

const quickTags = ["👍 Отличная организация", "🤝 Дружелюбная атмосфера", "😊 Было весело", "👎 Было скучно", "🤔 Непонятные задачи"];

const ReviewModal: React.FC<{
  isOpen: boolean;
  event: HistoryEvent | null;
  onClose: () => void;
  onSubmit: () => void;
}> = ({isOpen, event, onClose, onSubmit}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating > 0) {
      // In a real app, you would send the rating, comment, and tags to a server
      onSubmit();
    }
  };

  // Reset state on close to ensure it's fresh for the next review
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setRating(0);
        setComment('');
        setSelectedTags([]);
      }, 300); // delay to allow closing animation
    }
  }, [isOpen]);

  if (!isOpen || !event) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-title"
    >
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{height: '80vh', maxHeight: '700px'}}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="w-12"></div>
          {/* Spacer */}
          <div className="text-center">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <h2 id="review-title" className="text-xl font-bold text-[#0C0D0E]">Как все прошло?</h2>
          </div>
          <button onClick={onClose}
                  className="w-12 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800"
                  aria-label="Закрыть">
            <XIcon className="w-6 h-6"/>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          {/* Rating Block */}
          <section className="text-center">
            <h3 className="font-semibold text-gray-700 mb-3">Ваша общая оценка</h3>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => handleRating(star)}
                        className="transform transition-transform active:scale-90">
                  <StarIcon
                    className={`w-12 h-12 transition-colors ${rating >= star ? 'text-[#FF9315]' : 'text-gray-300'}`}/>
                </button>
              ))}
            </div>
          </section>

          {/* Quick Tags Block */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-3 text-center">Что вам понравилось?</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {quickTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedTags.includes(tag) ? 'bg-[#007AFF] text-white border-transparent' : 'bg-white text-[#007AFF] border-[#007AFF]/50'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* Comment Field */}
          <section>
            <label htmlFor="comment" className="font-semibold text-gray-700 mb-3 block text-center">Ваш
              комментарий</label>
            <div className="relative">
                            <textarea
                              id="comment"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Расскажите подробнее (необязательно)"
                              rows={5}
                              maxLength={500}
                              className="w-full p-4 bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                            />
              <span className="absolute bottom-2 right-3 text-xs text-gray-400">{comment.length}/500</span>
            </div>
          </section>
        </div>

        {/* Sticky Footer */}
        <footer className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#007AFF] hover:bg-blue-600"
          >
            Отправить отзыв
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ReviewModal;

```


### frontend/src/lib/api.ts
```
import {
  activityHistoryEvents,
  allAchievements,
  allCourses,
  allEvents,
  allOrganizationsData,
  allRewards,
  allStories,
  leaderboardsData,
  mockOrganizationEvents,
  mockParticipants,
  myChatsData
} from './mockData';
import type {
  Achievement,
  AppEvent,
  Course,
  EventParticipant,
  HistoryEvent,
  LeaderboardUser,
  MyChatItem,
  Organization,
  OrganizationEvent,
  RewardItem,
  Story
} from './types';

const SIMULATED_DELAY = 500; // ms

// --- Helper Functions ---

const deepCopy = (inObject: any) => {
  let outObject: any, value: any, key: any;

  if (typeof inObject !== "object" || inObject === null) {
    return inObject; // Return the value if inObject is not an object (this includes functions)
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    value = inObject[key];

    // Recursively deep copy nested objects and arrays
    outObject[key] = deepCopy(value);
  }

  return outObject;
};


const simulateRequest = <T>(data: T, failRate = 0): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error("Simulated API Error"));
      } else {
        resolve(deepCopy(data)); // Deep copy to prevent mutation, preserving functions
      }
    }, SIMULATED_DELAY + Math.random() * 300);
  });
};

// --- API Functions ---

// Events
export const fetchAllEvents = (): Promise<AppEvent[]> => {
  return simulateRequest(allEvents);
};

export const fetchEventById = (id: number): Promise<AppEvent | HistoryEvent | undefined> => {
  const event = [...allEvents, ...activityHistoryEvents].find(e => e.id === id);
  return simulateRequest(event);
};

// Courses
export const fetchAllCourses = (): Promise<Course[]> => {
  return simulateRequest(allCourses);
};

export const fetchCourseById = (id: number): Promise<Course | undefined> => {
  const course = allCourses.find(c => c.id === id);
  return simulateRequest(course);
};

// Organizations
let cachedOrgs: Organization[] | null = null;

export const fetchAllOrganizations = (): Promise<Organization[]> => {
  if (cachedOrgs) {
    return simulateRequest(cachedOrgs);
  }
  // Add a random subscription status for simulation only on the first load
  const orgsWithSubscription = allOrganizationsData.map(org => ({
    ...org,
    isSubscribed: Math.random() > 0.7
  }));
  cachedOrgs = orgsWithSubscription;
  return simulateRequest(orgsWithSubscription);
};

export const updateOrganizationSubscription = (organizationId: number, isSubscribed: boolean): Promise<Organization | undefined> => {
  return new Promise((resolve, reject) => {
    const updateCache = () => {
      if (!cachedOrgs) {
        reject(new Error("Organization cache is not initialized."));
        return;
      }
      const orgIndex = cachedOrgs.findIndex(o => o.id === organizationId);
      if (orgIndex > -1) {
        cachedOrgs[orgIndex].isSubscribed = isSubscribed;
        resolve(deepCopy(cachedOrgs[orgIndex]));
      } else {
        reject(new Error("Organization not found."));
      }
    }

    if (!cachedOrgs) {
      // This case should ideally not happen if fetchAllOrganizations is called first on app load.
      fetchAllOrganizations().then(updateCache).catch(reject);
    } else {
      updateCache();
    }
  });
}


export const fetchOrganizationById = async (id: number): Promise<Organization | undefined> => {
  if (!cachedOrgs) {
    // Ensure cache is populated before trying to find an org
    await fetchAllOrganizations();
  }
  // Non-null assertion is safe because we just populated it.
  const org = cachedOrgs!.find(o => o.id === id);
  return simulateRequest(org);
};

export const fetchOrganizationEvents = (): Promise<OrganizationEvent[]> => {
  return simulateRequest(mockOrganizationEvents);
};

export const fetchEventParticipants = (eventId: number): Promise<EventParticipant[]> => {
  // NOTE: eventId is not used, returning the same mock list for any event for now.
  return simulateRequest(mockParticipants);
};

// Profile data (excluding user, which is now in auth)
export const fetchActivityHistoryEvents = (): Promise<HistoryEvent[]> => {
  return simulateRequest(activityHistoryEvents);
};

export const fetchLeaderboardData = (period: 'week' | 'month' | 'allTime'): Promise<LeaderboardUser[]> => {
  return simulateRequest(leaderboardsData[period]);
};

export const fetchAllAchievements = (): Promise<Achievement[]> => {
  return simulateRequest(allAchievements);
};

export const fetchMyChats = (): Promise<MyChatItem[]> => {
  return simulateRequest(myChatsData);
};

// Stories
export const fetchAllStories = (): Promise<Story[]> => {
  return simulateRequest(allStories);
};

export const fetchStoryById = (id: number): Promise<Story | undefined> => {
  const story = allStories.find(s => s.id === id);
  return simulateRequest(story);
};

// Rewards
export const fetchRewards = (): Promise<RewardItem[]> => {
  return simulateRequest(allRewards);
};

```


### frontend/src/lib/auth.ts
```
import {defaultUserData} from './mockData';
import type {User} from './types';

const JWT_KEY = 'authToken';
const ONBOARDING_KEY = 'onboardingComplete';

// Helper functions to base64 encode/decode UTF-8 strings
const base64Encode = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
  return btoa(binString);
};

const base64Decode = (str: string): string => {
  const binString = atob(str);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
};

// In a real app, this would be a real, signed JWT from the server.
const createMockToken = (user: User): string => {
  const header = base64Encode(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
  const payload = base64Encode(JSON.stringify({userId: 1, firstName: user.firstName, exp: Date.now() + 24 * 60 * 60 * 1000})); // 24-hour expiry
  const signature = 'mock-signature-string-that-is-not-secure'; // Not a real signature
  return `${header}.${payload}.${signature}`;
};

const SIMULATED_DELAY = 500;

export const login = (email: string, password: string): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate validation: any valid email and non-empty password will work for the mock
      if (email && password && /^\S+@\S+\.\S+$/.test(email)) {
        const user = {...defaultUserData};
        const token = createMockToken(user);
        localStorage.setItem(JWT_KEY, token);
        resolve({user, token});
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, SIMULATED_DELAY);
  });
};

export const register = (data: { firstName: string, lastName: string, email: string }): Promise<{
  user: User;
  token: string
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {...defaultUserData, firstName: data.firstName, lastName: data.lastName};
      const token = createMockToken(user);
      localStorage.setItem(JWT_KEY, token);
      resolve({user, token});
    }, SIMULATED_DELAY);
  });
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    resolve();
  });
};

export const getCurrentSession = (): Promise<{ user: User; token: string } | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = localStorage.getItem(JWT_KEY);
      if (token) {
        // In a real app, you'd decode and validate the token.
        // Here we just parse the mock payload to get user info.
        try {
          const payload = JSON.parse(base64Decode(token.split('.')[1]));
          // check expiry
          if (payload.exp > Date.now()) {
            const user = {...defaultUserData, firstName: payload.firstName};
            resolve({user, token});
          } else {
            // Token expired
            localStorage.removeItem(JWT_KEY);
            resolve(null);
          }
        } catch (e) {
          // Invalid token
          localStorage.removeItem(JWT_KEY);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, SIMULATED_DELAY / 2); // Faster check on startup
  });
};

export const isOnboardingComplete = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

export const setOnboardingComplete = (): void => {
  localStorage.setItem(ONBOARDING_KEY, 'true');
};


```


### frontend/src/lib/mockData.ts
```
import {
  AcademicCapIcon,
  AnimalFriendIcon,
  ArtVolunteerIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ElderlyHelperIcon,
  HeartHandIcon,
  ListIcon,
  NatureProtectorIcon,
  OrganizationsIcon,
  StarIcon,
  TrainingIcon,
  TrophyIcon
} from '../components/ui/icons';

import type {
  Achievement,
  AppEvent,
  Comment,
  Course,
  EventParticipant,
  Filters,
  Friend,
  HistoryEvent,
  LeaderboardUser,
  MyChatItem,
  Organization,
  OrganizationEvent,
  OrganizationFilters,
  RewardItem,
  Story,
  User
} from './types';

// --- Mock Data ---
export const allEvents: AppEvent[] = [
  {
    id: 1,
    organizationId: 2,
    organizationName: "Гринпис России",
    title: 'Уборка парка "Сокольники"',
    category: 'Экология',
    date: '25 июля, 11:00',
    location: 'Москва, Парк Сокольники',
    Icon: NatureProtectorIcon,
    pos: {top: '30%', left: '25%'},
    requirements: ['Удобная одежда и обувь', 'Хорошее настроение', 'Возраст 18+']
  },
  {
    id: 2,
    organizationId: 4,
    organizationName: "Приют \"Верный друг\"",
    title: 'Помощь в приюте "Верный друг"',
    category: 'Животные',
    date: '26 июля, 13:00',
    location: 'Москва, ул. Лесная, 5',
    Icon: AnimalFriendIcon,
    pos: {top: '45%', left: '60%'},
    requirements: ['Любовь к животным', 'Готовность к физической работе']
  },
  {
    id: 3,
    organizationId: 3,
    organizationName: "Фонд \"Старость в радость\"",
    title: 'Доставка продуктов пенсионерам',
    category: 'Помощь старшим',
    date: '28 июля, 09:00',
    location: 'Район "Марьино"',
    Icon: ElderlyHelperIcon,
    pos: {top: '65%', left: '35%'},
    requirements: ['Наличие автомобиля желательно', 'Стрессоустойчивость']
  },
  {
    id: 4,
    organizationId: 1,
    organizationName: "Фонд \"Подари жизнь\"",
    title: 'Организация арт-выставки',
    category: 'Арт',
    date: '30 июля, 18:00',
    location: 'Арт-пространство "Винзавод"',
    Icon: ArtVolunteerIcon,
    pos: {top: '55%', left: '15%'},
    requirements: ['Креативность', 'Опыт в организации мероприятий приветствуется']
  },
  {
    id: 5,
    organizationId: 7,
    organizationName: "ЛизаАлерт",
    title: 'Онлайн-урок по программированию',
    category: 'Онлайн',
    date: '1 августа, 15:00',
    location: 'Онлайн',
    Icon: TrainingIcon,
    pos: {top: '20%', left: '75%'},
    requirements: ['Базовые знания HTML/CSS', 'Стабильный интернет']
  },
  {
    id: 6,
    organizationId: 6,
    organizationName: "WWF России",
    title: 'Субботник на набережной',
    category: 'Экология',
    date: '3 августа, 10:00',
    location: 'Москва, Набережная',
    Icon: NatureProtectorIcon,
    pos: {top: '80%', left: '50%'},
    requirements: ['Перчатки и мешки для мусора (предоставляются)', 'Желание сделать город чище']
  },
];

export const activityHistoryEvents: HistoryEvent[] = [
  // Upcoming
  {
    id: 101,
    organizationId: 1,
    organizationName: "Организатор",
    title: 'Волонтер на марафоне',
    category: 'Спорт',
    date: '5 августа, 08:00',
    location: 'Лужники',
    status: 'upcoming',
    Icon: TrophyIcon,
    pos: {top: '0%', left: '0%'},
    requirements: ['Спортивная форма', 'Бутылка воды'],
    role: 'Помощник на трассе'
  },
  {
    id: 102,
    organizationId: 1,
    organizationName: "Организатор",
    title: 'Помощь в организации концерта',
    category: 'Арт',
    date: '12 августа, 16:00',
    location: 'Парк Горького',
    status: 'upcoming',
    Icon: ArtVolunteerIcon,
    pos: {top: '0%', left: '0%'},
    requirements: ['Ответственность', 'Коммуникабельность'],
    role: 'Координатор'
  },
  // Past
  {...allEvents[0], status: 'past', rewards: {hours: 3, karma: 50}, role: 'Волонтер по уборке'},
  {...allEvents[1], status: 'past', rewards: {hours: 4, karma: 75}, role: 'Помощник по уходу'},
  {...allEvents[2], status: 'past', rewards: {hours: 2, karma: 40}, role: 'Водитель-волонтер'},
];


export const allCategories = ['Экология', 'Животные', 'Помощь старшим', 'Арт', 'Онлайн', 'Спорт', 'Культура', 'Дети'];

export const defaultFilters: Filters = {
  format: 'Все',
  categories: [],
  date: 'Любая',
  distance: 10,
};


export const allCourses: Course[] = [
  {
    id: 1, title: "Основы первой помощи", description: "Научитесь оказывать первую помощь в экстренных ситуациях.",
    duration: "60 минут", hasCertificate: true, category: "Первая помощь", Icon: ElderlyHelperIcon,
    status: 'completed', progress: 100, level: 'Для новичков',
    program: [
      {title: 'Введение в первую помощь', type: 'lesson', status: 'completed'},
      {title: 'Оценка состояния пострадавшего', type: 'lesson', status: 'completed'},
      {title: 'Тест: Базовые знания', type: 'test', status: 'completed'},
      {title: 'Сердечно-легочная реанимация', type: 'lesson', status: 'completed'},
      {title: 'Итоговый экзамен', type: 'test', status: 'completed'},
    ]
  },
  {
    id: 2, title: "Эко-волонтерство: С чего начать?", description: "Узнайте, как ваш вклад может помочь планете.",
    duration: "30 минут", hasCertificate: true, category: "Экология", Icon: NatureProtectorIcon,
    status: 'in-progress', progress: 45, level: 'Для новичков',
    program: [
      {title: 'Что такое эко-волонтерство?', type: 'lesson', status: 'completed'},
      {title: 'Виды помощи природе', type: 'lesson', status: 'completed'},
      {
        title: 'Практическое задание', type: 'test', status: 'current',
        contentTitle: 'Сортировка отходов',
        content: `Правильная сортировка отходов — один из самых простых и эффективных способов помочь планете. Вот основные правила:\n\n- **Пластик:** Ищите маркировку (цифры в треугольнике). Обычно принимают типы 1 (PET) и 2 (HDPE). Бутылки нужно сполоснуть и смять.\n- **Стекло:** Банки и бутылки. Мыть не обязательно, но желательно. Пробки и крышки нужно снять.\n- **Бумага:** Газеты, картон, журналы. Нельзя сдавать чеки, салфетки и ламинированную бумагу.\n\nЗапомнили? Теперь давайте проверим!`,
        quiz: [
          {
            id: 'q1',
            question: 'Какой тип пластика обычно принимают на переработку?',
            type: 'single',
            options: ['Тип 3 (PVC)', 'Тип 1 (PET)', 'Тип 6 (PS)'],
            correctAnswer: 'Тип 1 (PET)'
          },
          {
            id: 'q2',
            question: 'Что из перечисленного НЕЛЬЗЯ сдавать в макулатуру?',
            type: 'multiple',
            options: ['Старая газета', 'Картонная коробка', 'Бумажный чек из магазина', 'Салфетки'],
            correctAnswers: ['Бумажный чек из магазина', 'Салфетки']
          }
        ]
      },
      {title: 'Как организовать свою акцию', type: 'lesson', status: 'locked'},
    ]
  },
  {
    id: 3, title: "Работа с животными в приютах", description: "Базовые навыки для помощи бездомным животным.",
    duration: "45 минут", hasCertificate: false, category: "Животные", Icon: AnimalFriendIcon,
    status: 'not-started', progress: 0, level: 'Средний',
    program: [
      {title: 'Психология бездомных животных', type: 'lesson', status: 'locked'},
      {title: 'Техника безопасности в приюте', type: 'lesson', status: 'locked'},
      {title: 'Основы ухода и кормления', type: 'lesson', status: 'locked'},
    ]
  },
  {
    id: 4,
    title: "Введение в социальное волонтерство",
    description: "Как эффективно помогать людям, оказавшимся в беде.",
    duration: "90 минут",
    hasCertificate: true,
    category: "Для новичков",
    Icon: HeartHandIcon,
    status: 'completed',
    progress: 100,
    level: 'Для новичков',
    program: [
      {title: 'Кто такой социальный волонтер?', type: 'lesson', status: 'locked'},
      {title: 'Этика и границы в общении', type: 'lesson', status: 'locked'},
      {title: 'Практические кейсы', type: 'test', status: 'locked'},
    ]
  },
  {
    id: 5,
    title: "Организация мероприятий: от идеи до реализации",
    description: "Полный гид по созданию успешного волонтерского ивента.",
    duration: "120 минут",
    hasCertificate: true,
    category: "Для новичков",
    Icon: ArtVolunteerIcon,
    status: 'not-started',
    progress: 0,
    level: 'Продвинутый',
    program: [
      {title: 'Планирование и бюджет', type: 'lesson', status: 'locked'},
      {title: 'Работа с командой', type: 'lesson', status: 'locked'},
      {title: 'Привлечение участников', type: 'lesson', status: 'locked'},
      {title: 'Финальный проект', type: 'test', status: 'locked'},
    ]
  },
];
export const courseCategories = ["Все", "Первая помощь", "Экология", "Для новичков", "Животные"];

export const allOrganizationsData: (Omit<Organization, 'isSubscribed'>)[] = [
  {
    id: 1,
    name: 'Фонд "Подари жизнь"',
    description: 'Помощь детям с онко-заболеваниями',
    category: 'Дети',
    logoUrl: 'https://i.pravatar.cc/64?img=11',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/1/600/400`,
    rating: 4.9,
    subscribers: 12500,
    websiteUrl: '#',
    fullDescription: '«Подари жизнь» — негосударственный благотворительный фонд, помогающий детям и молодым взрослым до 25 лет с онкологическими и тяжелыми гематологическими заболеваниями. Мы верим, что вместе можем сделать больше.'
  },
  {
    id: 2,
    name: 'Гринпис России',
    description: 'Защита природы и экологии',
    category: 'Экология',
    logoUrl: 'https://i.pravatar.cc/64?img=12',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/2/600/400`,
    rating: 4.8,
    subscribers: 8400,
    websiteUrl: '#',
    fullDescription: 'Гринпис — это международная независимая неправительственная экологическая организация, созданная с целью сохранить природу и мир на планете. Мы существуем на пожертвования неравнодушных людей и не принимаем финансовую помощь от государственных и коммерческих структур.'
  },
  {
    id: 3,
    name: 'Фонд "Старость в радость"',
    description: 'Помощь пожилым людям и инвалидам',
    category: 'Помощь пожилым',
    logoUrl: 'https://i.pravatar.cc/64?img=13',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/3/600/400`,
    rating: 5.0,
    subscribers: 9800,
    websiteUrl: '#',
    fullDescription: 'Мы помогаем пожилым людям и инвалидам в домах престарелых и психоневрологических интернатах. Наша цель — дать им почувствовать, что они не одиноки, что о них помнят и заботятся.'
  },
  {
    id: 4,
    name: 'Приют "Верный друг"',
    description: 'Помощь бездомным животным',
    category: 'Животные',
    logoUrl: 'https://i.pravatar.cc/64?img=14',
    isVerified: false,
    coverImageUrl: `https://picsum.photos/seed/4/600/400`,
    rating: 4.6,
    subscribers: 3200,
    websiteUrl: '#',
    fullDescription: '«Верный друг» — это частный приют для бездомных собак и кошек. Мы лечим, стерилизуем и находим новый дом для наших подопечных. Приюту всегда нужна помощь волонтеров и финансовая поддержка.'
  },
  {
    id: 5,
    name: 'Ночлежка',
    description: 'Помощь бездомным людям',
    category: 'Помощь людям',
    logoUrl: 'https://i.pravatar.cc/64?img=15',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/5/600/400`,
    rating: 4.9,
    subscribers: 6100,
    websiteUrl: '#',
    fullDescription: 'Старейшая благотворительная организация, помогающая бездомным людям в Санкт-Петербурге и Москве. Мы кормим, обогреваем, помогаем с документами, работой, лечением и возвращением домой.'
  },
  {
    id: 6,
    name: 'WWF России',
    description: 'Всемирный фонд дикой природы',
    category: 'Экология',
    logoUrl: 'https://i.pravatar.cc/64?img=16',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/6/600/400`,
    rating: 4.8,
    subscribers: 15300,
    websiteUrl: '#',
    fullDescription: 'Наша миссия — в сохранении биологического разнообразия Земли. Мы работаем в более чем 100 странах и поддерживаем около 1300 природоохранных проектов по всему миру.'
  },
  {
    id: 7,
    name: 'ЛизаАлерт',
    description: 'Поисково-спасательный отряд',
    category: 'Дети',
    logoUrl: 'https://i.pravatar.cc/64?img=17',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/7/600/400`,
    rating: 5.0,
    subscribers: 25000,
    websiteUrl: '#',
    fullDescription: 'Добровольческий поисково-спасательный отряд, занимающийся поиском пропавших людей. Мы не принимаем денежную помощь, но всегда нуждаемся в волонтерах и оборудовании.'
  },
  {
    id: 8,
    name: 'Фонд Хабенского',
    description: 'Помощь детям с заболеваниями мозга',
    category: 'Дети',
    logoUrl: 'https://i.pravatar.cc/64?img=18',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/8/600/400`,
    rating: 4.9,
    subscribers: 11200,
    websiteUrl: '#',
    fullDescription: 'Благотворительный Фонд Константина Хабенского с 2008 года помогает детям и молодым взрослым с опухолями головного и спинного мозга вовремя получать всю необходимую медицинскую помощь и возвращаться к полноценной жизни.'
  },
];
export const organizationCategories = ['Дети', 'Экология', 'Помощь пожилым', 'Животные', 'Помощь людям'];
export const defaultOrganizationFilters: OrganizationFilters = {
  city: 'Москва',
  categories: [],
  verifiedOnly: true,
};

export const allAchievements: Achievement[] = [
  // Unlocked
  {
    id: 1,
    name: 'Первый шаг',
    description: 'Выдается за завершение вашего первого волонтерского события.',
    Icon: HeartHandIcon,
    unlocked: true,
    unlockedDate: '15.06.2024'
  },
  {
    id: 2,
    name: 'Друг животных',
    description: 'Выдается за участие в 3 событиях по помощи животным.',
    Icon: AnimalFriendIcon,
    unlocked: true,
    unlockedDate: '28.06.2024'
  },
  {
    id: 3,
    name: 'Эко-воин',
    description: 'Выдается за участие в 5 экологических акциях.',
    Icon: NatureProtectorIcon,
    unlocked: true,
    unlockedDate: '12.07.2024'
  },
  {
    id: 4,
    name: 'Душа компании',
    description: 'Выдается за подписку на 5 организаций.',
    Icon: OrganizationsIcon,
    unlocked: true,
    unlockedDate: '14.07.2024'
  },
  {
    id: 5,
    name: 'Мастер помощи',
    description: 'Выдается за 3-х кратную помощь пожилым людям.',
    Icon: ElderlyHelperIcon,
    unlocked: true,
    unlockedDate: '22.07.2024'
  },
  {
    id: 6,
    name: 'Марафонец добра',
    description: 'Выдается за накопление 20 часов волонтерства.',
    Icon: TrophyIcon,
    unlocked: true,
    unlockedDate: '25.07.2024'
  },
  {
    id: 7,
    name: 'Всезнайка',
    description: 'Выдается за прохождение 3 обучающих курсов.',
    Icon: AcademicCapIcon,
    unlocked: true,
    unlockedDate: '29.07.2024'
  },
  {
    id: 8,
    name: 'Лидер мнений',
    description: 'Выдается за приглашение 3 друзей в приложение.',
    Icon: StarIcon,
    unlocked: true,
    unlockedDate: '01.08.2024'
  },

  // Locked
  {
    id: 9,
    name: 'Ветеран',
    description: 'Примите участие в 25 событиях, чтобы разблокировать.',
    Icon: TrophyIcon,
    unlocked: false,
    progress: 18,
    target: 25,
    cta: 'Найти новое событие',
    filterCategory: 'Все'
  },
  {
    id: 10,
    name: 'Арт-эксперт',
    description: 'Помогите в организации 5 культурных мероприятий.',
    Icon: ArtVolunteerIcon,
    unlocked: false,
    progress: 2,
    target: 5,
    cta: 'Найти арт-событие',
    filterCategory: 'Арт'
  },
  {
    id: 11,
    name: 'Хранитель времени',
    description: 'Накопите 100 часов волонтерства.',
    Icon: ClockIcon,
    unlocked: false,
    progress: 78,
    target: 100,
    cta: 'Продолжить помогать',
    filterCategory: 'Все'
  },
  {
    id: 12,
    name: 'Специалист',
    description: 'Пройдите курсы из 5 разных категорий.',
    Icon: AcademicCapIcon,
    unlocked: false,
    progress: 3,
    target: 5,
    cta: 'Начать новый курс',
    filterCategory: 'Обучение'
  }, // Special category for navigation
  {
    id: 13,
    name: 'Суперзвезда',
    description: 'Получите 5000 очков кармы.',
    Icon: StarIcon,
    unlocked: false,
    progress: 3250,
    target: 5000,
    cta: 'Заработать карму',
    filterCategory: 'Все'
  },
  {
    id: 14,
    name: 'Организатор',
    description: 'Организуйте собственное событие.',
    Icon: ListIcon,
    unlocked: false,
    progress: 0,
    target: 1,
    cta: 'Создать событие',
    filterCategory: 'Организация'
  }, // Special category
  {
    id: 15,
    name: 'Меценат',
    description: 'Поддержите 10 разных организаций.',
    Icon: HeartHandIcon,
    unlocked: false,
    progress: 6,
    target: 10,
    cta: 'Найти организацию',
    filterCategory: 'Организации'
  }, // Special category
];

export const mockOrganizationEvents: OrganizationEvent[] = [
  {
    id: 1,
    title: 'Субботник на набережной',
    date: '3 августа, 10:00',
    status: 'active',
    participantCount: 18,
    capacity: 25,
    newApplications: 3
  },
  {
    id: 2,
    title: 'Волонтер на марафоне',
    date: '5 августа, 08:00',
    status: 'active',
    participantCount: 45,
    capacity: 50,
    newApplications: 0
  },
  {
    id: 3,
    title: 'Помощь в организации концерта',
    date: '12 августа, 16:00',
    status: 'active',
    participantCount: 8,
    capacity: 10,
    newApplications: 1
  },
  {
    id: 4,
    title: 'Уборка парка "Сокольники"',
    date: '25 июля, 11:00',
    status: 'past',
    participantCount: 30,
    capacity: 30,
    newApplications: 0
  },
  {
    id: 5,
    title: 'Помощь в приюте "Верный друг"',
    date: '26 июля, 13:00',
    status: 'past',
    participantCount: 15,
    capacity: 15,
    newApplications: 0
  },
  {
    id: 6,
    title: 'Осенний фестиваль',
    date: 'Планируется',
    status: 'draft',
    participantCount: 0,
    capacity: 50,
    newApplications: 0
  },
];

export const mockParticipants: EventParticipant[] = [
  // New
  {id: 1, name: 'Александр Смирнов', avatarUrl: 'https://i.pravatar.cc/48?img=21', rating: 4.9, status: 'new'},
  {id: 2, name: 'Мария Иванова', avatarUrl: 'https://i.pravatar.cc/48?img=22', rating: 4.8, status: 'new'},
  {id: 3, name: 'Дмитрий Кузнецов', avatarUrl: 'https://i.pravatar.cc/48?img=23', rating: 4.7, status: 'new'},
  // Confirmed
  {id: 4, name: 'Анна Попова', avatarUrl: 'https://i.pravatar.cc/48?img=24', rating: 5.0, status: 'confirmed'},
  {id: 5, name: 'Сергей Васильев', avatarUrl: 'https://i.pravatar.cc/48?img=25', rating: 4.9, status: 'confirmed'},
  {id: 6, name: 'Екатерина Петрова', avatarUrl: 'https://i.pravatar.cc/48?img=26', rating: 4.9, status: 'confirmed'},
  {id: 7, name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/48?img=27', rating: 4.8, status: 'confirmed'},
  {id: 8, name: 'Ольга Михайлова', avatarUrl: 'https://i.pravatar.cc/48?img=28', rating: 4.8, status: 'confirmed'},
  {id: 9, name: 'Алексей Новиков', avatarUrl: 'https://i.pravatar.cc/48?img=29', rating: 4.7, status: 'confirmed'},
  {id: 10, name: 'Наталья Фёдорова', avatarUrl: 'https://i.pravatar.cc/48?img=30', rating: 4.6, status: 'confirmed'},
  {id: 11, name: 'Иван Петров', avatarUrl: 'https://i.pravatar.cc/48?img=31', rating: 4.5, status: 'confirmed'},
  // Rejected
  {id: 12, name: 'Олег Сидоров', avatarUrl: 'https://i.pravatar.cc/48?img=32', rating: 4.2, status: 'rejected'},
];

export const defaultUserData: User = {
  firstName: "Елена",
  lastName: "Иванова",
  avatarUrl: "https://i.pravatar.cc/150?img=1",
  about: "Люблю помогать животным и участвовать в экологических акциях. В свободное время занимаюсь фотографией.",
  level: "Герой-новичок",
  progress: 65,
  nextLevel: "Опытный помощник",
  stats: [
    {id: 'hours', value: '128', label: 'часов добра', Icon: ClockIcon},
    {id: 'karma', value: '15,200', label: 'баллов кармы', Icon: StarIcon},
    {id: 'events', value: '24', label: 'события', Icon: CalendarIcon},
    {id: 'achievements', value: '8', label: 'ачивок', Icon: TrophyIcon},
  ],
  achievements: [
    {id: 1, name: 'Первый шаг', Icon: HeartHandIcon},
    {id: 2, name: 'Друг животных', Icon: AnimalFriendIcon},
    {id: 3, name: 'Эко-воин', Icon: NatureProtectorIcon},
    {id: 4, name: 'Душа компании', Icon: OrganizationsIcon},
    {id: 5, name: 'Мастер помощи', Icon: ElderlyHelperIcon},
  ],
  navigation: [
    {id: 'activityHistory', label: 'История активностей', Icon: ListIcon},
    {id: 'calendar', label: 'Мой календарь', Icon: CalendarIcon},
    {id: 'myChats', label: 'Мои чаты', Icon: ChatBubbleLeftRightIcon},
    {id: 'myCertificates', label: 'Мои сертификаты', Icon: AcademicCapIcon},
    {id: 'leaderboards', label: 'Лидерборды', Icon: TrophyIcon},
    {id: 'rewardsStore', label: 'Магазин наград', Icon: StarIcon},
    {id: 'switchToOrganization', label: 'Режим организатора', Icon: BriefcaseIcon},
  ],
};

// --- Leaderboard Data ---
const firstNames = ["Александр", "Мария", "Дмитрий", "Анна", "Сергей", "Екатерина", "Андрей", "Ольга", "Алексей", "Наталья"];
const lastNames = ["Смирнов", "Иванова", "Кузнецов", "Попова", "Васильев", "Петрова", "Соколов", "Михайлова", "Новиков", "Фёдорова"];

const generateLeaderboard = (period: 'week' | 'month' | 'allTime'): LeaderboardUser[] => {
  const periodMultiplier = {week: 0.25, month: 0.7, allTime: 1.5}[period];
  const userCount = 150;

  let users = Array.from({length: userCount}, (_, i) => {
    const id = i + 2; // Keep ID 1 for current user
    return {
      id: id,
      name: `${firstNames[id % firstNames.length]} ${lastNames[id % lastNames.length].slice(0, 1)}.`,
      avatarUrl: `https://i.pravatar.cc/48?img=${id + 20}`, // Shift image index
      // Use a deterministic but varied karma calculation
      karma: Math.floor(
        ((userCount - i) * 100 + Math.sin(id) * 500) * periodMultiplier
      ),
    };
  });

  // Add current user
  const currentUser = {
    id: 1,
    name: `${defaultUserData.firstName} ${defaultUserData.lastName}`,
    avatarUrl: defaultUserData.avatarUrl,
    karma: Math.floor(15200 * periodMultiplier * (period === 'week' ? 0.5 : 1)), // Lower weekly karma to test sticky footer
  };

  users.push(currentUser);

  return users
    .sort((a, b) => b.karma - a.karma)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
};

export const leaderboardsData = {
  week: generateLeaderboard('week'),
  month: generateLeaderboard('month'),
  allTime: generateLeaderboard('allTime'),
};
export const CURRENT_USER_ID = 1;

// --- Mock Friends Data for Invite Modal ---
export const mockFriends: Friend[] = [
  {id: 1, name: 'Александр Смирнов', avatarUrl: 'https://i.pravatar.cc/48?img=21'},
  {id: 2, name: 'Мария Иванова', avatarUrl: 'https://i.pravatar.cc/48?img=22'},
  {id: 3, name: 'Дмитрий Кузнецов', avatarUrl: 'https://i.pravatar.cc/48?img=23'},
  {id: 4, name: 'Анна Попова', avatarUrl: 'https://i.pravatar.cc/48?img=24'},
  {id: 5, name: 'Сергей Васильев', avatarUrl: 'https://i.pravatar.cc/48?img=25'},
  {id: 6, name: 'Екатерина Петрова', avatarUrl: 'https://i.pravatar.cc/48?img=26'},
  {id: 7, name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/48?img=27'},
  {id: 8, name: 'Ольга Михайлова', avatarUrl: 'https://i.pravatar.cc/48?img=28'},
  {id: 9, name: 'Алексей Новиков', avatarUrl: 'https://i.pravatar.cc/48?img=29'},
  {id: 10, name: 'Наталья Фёдорова', avatarUrl: 'https://i.pravatar.cc/48?img=30'},
  {id: 11, name: 'Иван Петров', avatarUrl: 'https://i.pravatar.cc/48?img=31'},
  {id: 12, name: 'Олег Сидоров', avatarUrl: 'https://i.pravatar.cc/48?img=32'},
];

const mockComments: Comment[] = [
  {
    id: 1,
    author: {name: 'Сергей Васильев', avatarUrl: 'https://i.pravatar.cc/48?img=25'},
    timestamp: '1 час назад',
    text: 'Отличная работа! Так держать! 💪'
  },
  {
    id: 2,
    author: {name: 'Анна Попова', avatarUrl: 'https://i.pravatar.cc/48?img=24'},
    timestamp: '45 минут назад',
    text: 'Какие вы молодцы! В следующий раз я с вами.'
  },
  {
    id: 3,
    author: {name: 'Елена Иванова', avatarUrl: 'https://i.pravatar.cc/150?img=1'},
    timestamp: '10 минут назад',
    text: 'Очень вдохновляет! Спасибо, что поделились.'
  },
];

export const allStories: Story[] = [
  {
    id: 1,
    author: {
      name: "Мария Петрова",
      avatarUrl: 'https://i.pravatar.cc/48?img=2'
    },
    timestamp: "2 часа назад",
    event: {
      id: 1,
      name: 'Уборка парка "Сокольники"'
    },
    text: "Отлично провели время на субботнике! Сделали парк чище и познакомились с замечательными людьми. Природа сказала нам спасибо! 🌳💚",
    imageUrl: "https://picsum.photos/seed/story1/600/400",
    likes: 124,
    comments: 3,
    commentsData: mockComments,
  },
  {
    id: 2,
    author: {
      name: "Алексей Новиков",
      avatarUrl: 'https://i.pravatar.cc/48?img=9'
    },
    timestamp: "Вчера в 18:30",
    event: {
      id: 2,
      name: 'Помощь в приюте "Верный друг"'
    },
    text: "Провели день с пушистыми друзьями в приюте. Эти глаза не могут врать, им очень нужна наша забота. Каждый может помочь! 🐾",
    imageUrl: "https://picsum.photos/seed/story2/600/600",
    likes: 256,
    comments: 2,
    commentsData: [
      {
        id: 4,
        author: {name: 'Дмитрий Кузнецов', avatarUrl: 'https://i.pravatar.cc/48?img=23'},
        timestamp: 'Вчера в 20:10',
        text: 'Какая прелесть! Обязательно посещу этот приют.'
      },
      {
        id: 5,
        author: {name: 'Ольга Михайлова', avatarUrl: 'https://i.pravatar.cc/48?img=28'},
        timestamp: 'Вчера в 19:00',
        text: 'Очень трогательно. Вы делаете большое дело!'
      },
    ],
  },
  {
    id: 3,
    author: {
      name: "Екатерина Васильева",
      avatarUrl: 'https://i.pravatar.cc/48?img=6'
    },
    timestamp: "25 июля",
    event: {
      id: 4,
      name: 'Организация арт-выставки'
    },
    text: "Помогли организовать выставку для фонда \"Подари жизнь\". Творчество и доброта - невероятная сила! Спасибо всем, кто пришел.",
    imageUrl: "https://picsum.photos/seed/story3/600/800",
    likes: 98,
    comments: 1,
    commentsData: [
      {
        id: 6,
        author: {name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/48?img=27'},
        timestamp: '25 июля',
        text: 'Круто! Искусство и доброта спасут мир.'
      },
    ],
  }
];

export const myChatsData: MyChatItem[] = [
  {
    id: 1,
    eventId: 1,
    eventTitle: 'Уборка парка "Сокольники"',
    Icon: NatureProtectorIcon,
    lastMessage: 'Анна П.: Если кто-то поедет от метро Сокольники, можем встретиться!',
    timestamp: '14:31',
    unreadCount: 3,
    isArchived: false,
  },
  {
    id: 2,
    eventId: 101,
    eventTitle: 'Волонтер на марафоне',
    Icon: TrophyIcon,
    lastMessage: 'Организатор: Не забудьте взять с собой воду и головные уборы.',
    timestamp: '09:15',
    unreadCount: 0,
    isArchived: false,
  },
  {
    id: 3,
    eventId: 2,
    eventTitle: 'Помощь в приюте "Верный друг"',
    Icon: AnimalFriendIcon,
    lastMessage: 'Вы: Отличная идея!',
    timestamp: 'Вчера',
    unreadCount: 0,
    isArchived: true,
  },
  {
    id: 4,
    eventId: 4,
    eventTitle: 'Организация арт-выставки',
    Icon: ArtVolunteerIcon,
    lastMessage: 'Сергей В.: Все готово к открытию!',
    timestamp: '2 дн. назад',
    unreadCount: 0,
    isArchived: true,
  }
];

// --- Rewards Mock Data ---
export const allRewards: RewardItem[] = [
  {
    id: 1,
    name: 'Значок "Эко-воин"',
    category: 'Значки',
    price: 500,
    imageUrl: 'https://picsum.photos/seed/badge1/200',
    isPurchased: true
  },
  {
    id: 2,
    name: 'Значок "Друг животных"',
    category: 'Значки',
    price: 500,
    imageUrl: 'https://picsum.photos/seed/badge2/200',
    isPurchased: false
  },
  {
    id: 3,
    name: 'Тема "Космос"',
    category: 'Темы оформления',
    price: 1500,
    imageUrl: 'https://picsum.photos/seed/theme1/200',
    isPurchased: false
  },
  {
    id: 4,
    name: 'Значок "Лидер"',
    category: 'Значки',
    price: 1000,
    imageUrl: 'https://picsum.photos/seed/badge3/200',
    isPurchased: true
  },
  {
    id: 5,
    name: 'Тема "Природа"',
    category: 'Темы оформления',
    price: 1500,
    imageUrl: 'https://picsum.photos/seed/theme2/200',
    isPurchased: true
  },
  {
    id: 6,
    name: 'Значок "Первооткрыватель"',
    category: 'Значки',
    price: 250,
    imageUrl: 'https://picsum.photos/seed/badge4/200',
    isPurchased: false
  },
];

```


### frontend/src/lib/types.ts
```
import React from 'react';

// --- Types ---
export type AppEvent = {
  id: number;
  organizationId: number;
  organizationName: string;
  title: string;
  category: string;
  date: string;
  location: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  pos: { top: string; left: string; };
  requirements?: string[];
};

export type HistoryEvent = AppEvent & {
  status: 'upcoming' | 'past';
  rewards?: { hours: number; karma: number };
  role?: string;
};

export type FilterFormat = 'Все' | 'Офлайн' | 'Онлайн';
export type FilterDate = 'Любая' | 'Сегодня' | 'На неделе';

export interface Filters {
  format: FilterFormat;
  categories: string[];
  date: FilterDate;
  distance: number;
}

export type QuizQuestion = {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
}
export type CourseLesson = {
  title: string;
  type: 'lesson' | 'test';
  status: 'completed' | 'current' | 'locked';
  contentTitle?: string;
  content?: string;
  quiz?: QuizQuestion[];
}

export type Course = {
  id: number;
  title: string;
  description: string;
  duration: string;
  hasCertificate: boolean;
  category: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  status: 'completed' | 'in-progress' | 'not-started';
  progress: number;
  level: 'Для новичков' | 'Средний' | 'Продвинутый';
  program: CourseLesson[];
};

export type Tab = 'home' | 'training' | 'organizations' | 'stories' | 'profile';
export type ProfileSubScreen =
  'activityHistory'
  | 'allAchievements'
  | 'calendar'
  | 'leaderboards'
  | 'settings'
  | 'editProfile'
  | 'myCertificates'
  | 'myChats'
  | 'rewardsStore';

export interface OrganizationFilters {
  city: string;
  categories: string[];
  verifiedOnly: boolean;
}

export type Organization = {
  id: number;
  name: string;
  description: string;
  category: string;
  logoUrl: string;
  isVerified: boolean;
  coverImageUrl: string;
  rating: number;
  subscribers: number;
  websiteUrl: string;
  fullDescription: string;
  isSubscribed: boolean;
};

export type OrganizationEvent = {
  id: number;
  title: string;
  date: string;
  status: 'active' | 'past' | 'draft';
  participantCount: number;
  capacity: number;
  newApplications: number;
};

export type EventParticipant = {
  id: number;
  name: string;
  avatarUrl: string;
  rating: number;
  status: 'new' | 'confirmed' | 'rejected';
};

export type Achievement = {
  id: number;
  name: string;
  description: string; // How to unlock for locked, what for for unlocked
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  target?: number;
  cta?: string;
  filterCategory?: string;
};

export type LeaderboardUser = {
  id: number;
  name: string;
  avatarUrl: string;
  karma: number;
  rank: number;
};

export type User = {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  about: string;
  level: string;
  progress: number;
  nextLevel: string;
  stats: { id: string; value: string; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>>; }[];
  achievements: { id: number; name: string; Icon: React.FC<React.SVGProps<SVGSVGElement>>; }[];
  navigation: { id: string; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>>; }[];
}

export type Friend = {
  id: number;
  name: string;
  avatarUrl: string;
};

export type Comment = {
  id: number;
  author: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;
  text: string;
};

export type Story = {
  id: number;
  author: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;
  event: {
    id: number;
    name: string;
  };
  text: string;
  imageUrl: string;
  likes: number;
  comments: number;
  commentsData: Comment[];
};

export type ChatMessage = {
  id: number;
  sender: 'user' | 'assistant';
  type: 'text' | 'event-card' | 'suggestion-chips' | 'loading';
  text?: string;
  event?: AppEvent;
  suggestions?: string[];
};

export type EventChatMessage = {
  id: number;
  author: {
    id: number;
    name: string;
    avatarUrl: string;
  };
  text: string;
  timestamp: string;
};

export type MyChatItem = {
  id: number;
  eventId: number;
  eventTitle: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isArchived: boolean;
};

export type RewardItem = {
  id: number;
  name: string;
  category: 'Значки' | 'Темы оформления';
  price: number;
  imageUrl: string;
  isPurchased: boolean;
};

```


### frontend/tsconfig.json
```
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}

```


### frontend/vite.config.ts
```
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});


```


