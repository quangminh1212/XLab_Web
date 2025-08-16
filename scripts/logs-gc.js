const fs = require('fs');
const path = require('path');

(function main() {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) return;

    const files = fs.readdirSync(logsDir)
      .filter(f => f.startsWith('build-') && f.endsWith('.log'))
      .map(name => ({ name, time: fs.statSync(path.join(logsDir, name)).mtime.getTime() }))
      .sort((a, b) => b.time - a.time);

    const toDelete = files.slice(5); // keep newest 5
    toDelete.forEach(({ name }) => {
      const fp = path.join(logsDir, name);
      try {
        fs.unlinkSync(fp);
        console.log('Deleted old log:', name);
      } catch (e) {
        console.warn('Failed to delete log:', name, e.message);
      }
    });

    console.log(`Kept ${files.length - toDelete.length} build logs, deleted ${toDelete.length}.`);
  } catch (e) {
    console.error('logs-gc error:', e.message);
    process.exit(1);
  }
})();
