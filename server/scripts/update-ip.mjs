import { networkInterfaces } from 'os';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Detecting local IP address...');

function getLocalIP() {
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  
  return '127.0.0.1';
}

const localIP = getLocalIP();
console.log(`✅ Detected IP: ${localIP}`);

// Update config or environment file if needed
const configPath = join(__dirname, '..', '.env.local');
try {
  writeFileSync(configPath, `LOCAL_IP=${localIP}\n`, { flag: 'w' });
  console.log(`📝 Updated ${configPath}`);
} catch (error) {
  console.log('ℹ️ Could not write config file (this may be ok)');
}