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


