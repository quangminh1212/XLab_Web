const { execSync } = require('child_process');

/**
 * Kills processes using a specified port
 * @param {number} port - The port to free
 */
function killPort(port) {
  try {
    console.log(`Attempting to kill processes using port ${port}...`);
    
    // Different command based on platform
    if (process.platform === 'win32') {
      // First kill by process ID on Windows
      try {
        // First try to kill by port
        console.log(`> Killing processes on port ${port}...`);
        
        // Find the PID using the port
        const findPidCommand = `FOR /F "tokens=5" %a in ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') do @echo %a`;
        console.log(`> ${findPidCommand}`);
        const findPidResult = execSync(findPidCommand, { shell: 'cmd.exe', encoding: 'utf8' }).trim();
        
        if (findPidResult) {
          const pids = findPidResult.split(/\r?\n/).filter(pid => /^\d+$/.test(pid.trim()));
          
          if (pids.length > 0) {
            console.log(`Found PIDs using port ${port}: ${pids.join(', ')}`);
            
            pids.forEach(pid => {
              try {
                const killCommand = `taskkill /F /PID ${pid}`;
                console.log(`> ${killCommand}`);
                execSync(killCommand, { encoding: 'utf8' });
                console.log(`Successfully killed process with PID ${pid}`);
              } catch (killError) {
                console.error(`Failed to kill process ${pid}:`, killError.message);
              }
            });
          }
        }
      } catch (error) {
        console.log(`No specific processes found for port ${port}. Trying alternative method...`);
      }
      
      // As a backup, try to kill all Node.js processes
      try {
        console.log('> Killing all Node.js processes...');
        execSync('taskkill /F /IM node.exe', { stdio: 'inherit' });
      } catch (error) {
        console.log('No Node.js processes were found or some could not be killed.');
      }
      
      console.log(`Port ${port} should be free now.`);
      return true;
    } else {
      // Unix-like systems (Linux, macOS)
      try {
        const killCommand = `lsof -i :${port} -t | xargs kill -9`;
        console.log(`> ${killCommand}`);
        execSync(killCommand, { stdio: 'inherit' });
        console.log(`Successfully freed port ${port}`);
        return true;
      } catch (error) {
        console.log(`No process found using port ${port}.`);
        return false;
      }
    }
  } catch (error) {
    console.error(`Error while trying to free port ${port}:`, error);
    return false;
  }
}

// If script is run directly
if (require.main === module) {
  const port = process.argv[2] || 3000;
  killPort(Number(port));
}

module.exports = { killPort }; 