const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Simple .env parser to read environment variables without external library dependencies
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    // Remove comments
    const cleanLine = line.split('#')[0].trim();
    if (!cleanLine) return;
    
    const parts = cleanLine.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      // Strip outer quotes if any
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  });
  return env;
}

const env = loadEnv();
const token = env.CLOUDFLARE_TUNNEL_TOKEN;

if (!token) {
  console.error('\x1b[31m[Tunnel Error] CLOUDFLARE_TUNNEL_TOKEN is missing in your local .env file!\x1b[0m');
  console.error('\x1b[33mPlease add: CLOUDFLARE_TUNNEL_TOKEN=your-token-here to .env\x1b[0m');
  process.exit(1);
}

const child = spawn('cloudflared', ['tunnel', 'run', '--token', token], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  process.exit(code || 0);
});
