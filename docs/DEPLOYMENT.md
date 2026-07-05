# Deployment Guide - ZenSearch

This guide outlines deployment strategies for moving ZenSearch from local development to production.

---

## Production Deployment using Docker (Multi-Container)

To host ZenSearch on a virtual private server (VPS) like DigitalOcean, Linode, AWS, or GCP:

### 1. Prerequisites
- A Linux server with Docker and Docker Compose installed.
- Domain names pointed to your server IP (e.g. `search.example.com` and `api.example.com`).

### 2. Deployment configuration
1. Copy your codebase to the production server.
2. In production, configure `.env` to connect to the public URLs or utilize Docker's private bridge network aliases:
   ```env
   NEXT_PUBLIC_SEARXNG_URL=http://searxng:8080
   ```
3. Run the container cluster:
   ```bash
   docker compose -f docker-compose.yml up --build -d
   ```

### 3. Nginx Reverse Proxy & SSL Setup
To map public domain names and secure traffic via Let's Encrypt HTTPS, deploy Nginx on the host server:

**Frontend block (`/etc/nginx/sites-available/zensearch`)**:
```nginx
server {
    listen 80;
    server_name search.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**SearXNG Backend block (`/etc/nginx/sites-available/searxng`)**:
```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the configurations and reload Nginx:
```bash
ln -s /etc/nginx/sites-available/zensearch /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/searxng /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

Obtain SSL certificates using Certbot:
```bash
certbot --nginx -d search.example.com -d api.example.com
```

---

## Serverless Frontend Deployment (Vercel / Netlify / Cloudflare Pages)

The ZenSearch frontend can be hosted independently on serverless platforms, while proxying queries to a self-hosted SearXNG instance.

### Step 1: Deploy SearXNG
Ensure you have a publicly accessible SearXNG instance running on your own infrastructure (e.g. `https://api.example.com`).

### Step 2: Push to GitHub
Create a private or public GitHub repository and push the Next.js frontend code.

### Step 3: Deploy on Vercel
1. Import your repository into the Vercel dashboard.
2. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SEARXNG_URL` = `https://api.example.com`
3. Click **Deploy**. Vercel will automatically build the Next.js static pages and host your API routes on edge serverless functions.
