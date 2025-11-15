# MAX Добро

**MAX Добро** — это платформа в формате mini app для волонтеров и некоммерческих организаций. Наша цель — сделать волонтерство доступным, геймифицированным и социальным, объединяя людей, готовых помогать, с теми, кому нужна помощь.

## 🚀 Демо и доступ

Вы можете протестировать приложение, не запуская его локально:

*   **Веб-версия (фронтенд):** [**https://max-dobro.vercel.app/**](https://max-dobro.vercel.app/)
*   **Mini App в MAX:** Найдите бота **`@t23_hakaton_bot`** в мессенджере MAX и запустите приложение.
*   **API-сервер (бэкенд):** [**https://max-dobro-backend.vercel.app/api/docs**](https://max-dobro-backend.vercel.app/api/docs) (Swagger-документация)

## 🛠️ Технологический стек

*   **Бэкенд:** NestJS, TypeScript, Prisma, PostgreSQL
*   **Фронтенд:** React, TypeScript, Vite, Tailwind CSS, React Leaflet
*   **Инструменты и DevOps:** Docker, Docker Compose, GitHub Actions
*   **Аутентификация:** JWT (для входа через MAX) + Supabase (для email/password)

## ⚙️ Локальный запуск проекта (Docker)

Этот способ запускает все части приложения (базу данных, бэкенд, фронтенд) в изолированных Docker-контейнерах. Это самый простой и надежный метод для полного развертывания.

**Требования:**
*   [Git](https://git-scm.com/)
*   [Docker](https://www.docker.com/products/docker-desktop/) и Docker Compose

### Шаг 1: Клонирование репозитория

```bash
git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ>
cd <НАЗВАНИЕ_ПАПКИ_РЕПОЗИТОРИЯ>
```

### Шаг 2: Создание файлов конфигурации `.env`

Вам нужно создать два файла `.env` — один для бэкенда и один для фронтенда.

1.  **Для бэкенда (`backend/.env`):**
    ```env
    # URL для подключения к базе данных из Docker-контейнера
    DATABASE_URL="postgresql://testuser:testpassword@db:5432/testdb?schema=public"
    
    # URL для прямого подключения Prisma (нужен для миграций с локальной машины)
    DIRECT_URL="postgresql://testuser:testpassword@localhost:5432/testdb?schema=public"

    # Сгенерируйте секретный ключ командой: openssl rand -base64 32
    JWT_INTERNAL_SECRET="ВАШ_СГЕНЕРИРОВАННЫЙ_КЛЮЧ"

    # Токен вашего бота из платформы MAX (для проверки входа через MAX)
    MAX_BOT_TOKEN="ВАШ_ТОКЕН_БОТА_ИЗ_MAX"
    ```

2.  **Для фронтенда (`frontend/.env`):**
    ```env
    # URL, по которому Docker откроет доступ к бэкенду
    VITE_API_BASE_URL=http://localhost:3000

    # Режим работы API. Оставьте 'real' для работы с локальным бэкендом.
    VITE_API_MODE=real
    
    # Эти переменные можно оставить пустыми
    VITE_SUPABASE_URL=""
    VITE_SUPABASE_ANON_KEY=""
    ```

### Шаг 3: Сборка и запуск контейнеров

Выполните одну команду из **корневой папки** проекта. Она соберет образы и запустит все сервисы в фоновом режиме.

```bash
docker-compose up --build -d
```

### Шаг 4: Подготовка базы данных

Откройте терминал и выполните следующие команды из корневой папки проекта:

1.  **Применение миграций:**
    ```bash
    docker-compose exec backend npx prisma migrate deploy
    ```
2.  **Наполнение базы тестовыми данными:**
    ```bash
    docker-compose exec backend npx prisma db seed
    ```

### Шаг 5: Готово!

Приложение доступно в вашем браузере по адресу: **[http://localhost:8080](http://localhost:8080)**

Чтобы остановить все сервисы, выполните команду: `docker-compose down`.

## 📊 Архитектура взаимодействия

```mermaid
sequenceDiagram
    participant User as 👤 Пользователь (Mini App)
    participant Nginx as 🌐 Frontend (React)
    participant Backend as 🤖 Backend (NestJS)
    participant DB as 💾 PostgreSQL
    participant MAX as 📱 MAX Client
    
    User->>MAX: Открывает Mini App
    MAX->>Nginx: Загружает статические файлы (HTML, JS, CSS)
    Nginx-->>User: Отображает интерфейс
    
    Note over User,Backend: Аутентификация через MAX
    User->>Backend: POST /auth/max-login с initData
    Backend->>Backend: Проверяет хеш initData
    Backend->>DB: Находит или создает пользователя
    Backend-->>User: Возвращает внутренний JWT

    Note over User,Backend: Запрос данных
    User->>Backend: GET /events (с JWT в заголовке)
    Backend->>DB: Запрашивает события
    DB-->>Backend: Возвращает данные
    Backend-->>User: Отправляет JSON с событиями
```

## 📞 Контакты

Если у вас возникли вопросы при запуске или тестировании проекта, вы можете связаться с нами:

*   **[Имя участника 1]** - [Роль в команде] - [Контакт, например, Telegram @username]
*   **[Имя участника 2]** - [Роль в команде] - [Контакт, например, Telegram @username]