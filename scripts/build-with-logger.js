const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function timestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

(async () => {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

    const logFile = path.join(logsDir, `build-${timestamp()}.log`);
    const outStream = fs.createWriteStream(logFile, { flags: 'a' });

    console.log(`📄 Writing build log to: ${logFile}`);

    // Force production build
    const env = { ...process.env, NODE_ENV: 'production' };

    const npmCmd = process.platform === 'win32' ? 'cmd.exe' : 'npm';
    const npmArgs = process.platform === 'win32' ? ['/c', 'npm', 'run', 'build'] : ['run', 'build'];
    const child = spawn(npmCmd, npmArgs, {
      env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.on('data', (data) => {
      const text = data.toString();
      process.stdout.write(text);
      outStream.write(text);
    });

    child.stderr.on('data', (data) => {
      const text = data.toString();
      process.stderr.write(text);
      outStream.write(text);
    });

    child.on('close', (code) => {
      outStream.end();
      console.log(`\n✅ Build process exited with code: ${code}`);
      console.log(`📌 Log saved at: ${logFile}`);
      process.exit(code);
    });
  } catch (err) {
    console.error('Failed to start build with logger:', err);
    process.exit(1);
  }
})();
