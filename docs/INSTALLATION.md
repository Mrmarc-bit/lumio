# Installation Guide - ZenSearch

Follow this guide to get ZenSearch up and running on your local machine.

---

## Prerequisites

Before starting, ensure you have the following software installed:

- **Docker Desktop** (Required for Docker compose or running SearXNG container)
- **Node.js** v18.0.0 or higher (If running the frontend manually)
- **npm** or **yarn** / **pnpm** (If running the frontend manually)

---

## Method 1: Docker Compose Setup (Recommended)

This is the easiest way to run the entire ZenSearch ecosystem, including the **SearXNG API backend** and the **Next.js frontend** inside isolated container networks.

### Step 1: Clone the Repository
Open a terminal and navigate to the project directory:
```bash
cd /Users/macbookair/Documents/Lumio
```

### Step 2: Start the Containers
Run Docker Compose to pull the official SearXNG image, build the local Next.js frontend image, and spawn the containers in detached mode:
```bash
docker compose up -d
```

### Step 3: Verify the Services
To ensure the services are running correctly:
```bash
docker ps
```
You should see two active containers:
1. `searxng-backend` running on port `8080`
2. `lumio-frontend` running on port `3000`

- **Frontend URL**: [http://localhost:3000](http://localhost:3000)
- **SearXNG Backend URL**: [http://localhost:8080](http://localhost:8080)

---

## Method 2: Manual Local Development

If you wish to make live modifications to the Next.js frontend codebase with hot-reloading outside of Docker, follow this hybrid setup.

### Step 1: Run the SearXNG Backend
We still need SearXNG running. Start it in Docker:
```bash
docker run --name searxng-backend -d -p 8080:8080 -v $(pwd)/searxng:/etc/searxng searxng/searxng:latest
```

### Step 2: Configure Local Environment
Create a `.env` file in the root directory (or copy `.env.example`):
```env
NEXT_PUBLIC_SEARXNG_URL=http://localhost:8080
```

### Step 3: Install Frontend Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Troubleshooting

### SearXNG Output Format Error
If you query and receive an error, ensure that `./searxng/settings.yml` has the JSON format enabled:
```yaml
search:
  formats:
    - html
    - json
```
Restart the SearXNG container to apply changes:
```bash
docker restart searxng-backend
```

### Docker Daemon Connection Issue
If you get `dial unix /var/run/docker.sock: connect: no such file or directory`, make sure **Docker Desktop** is open and active on your Mac.
