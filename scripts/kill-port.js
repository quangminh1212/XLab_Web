const { execSync } = require('child_process');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Kills processes using a specified port
 * @param {number} port - The port to free
 */
async function killPort(port) {
  try {
    console.log(`Attempting to kill processes using port ${port}...`);
    
    // Different command based on platform
    if (process.platform === 'win32') {
      // First try to use more reliable PowerShell approach
      try {
        console.log(`> Using PowerShell to kill processes on port ${port}...`);
        const psCommand = `
          $connections = Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue;
          if ($connections) {
            $processes = $connections | ForEach-Object { Get-Process -Id $_.OwningProcess };
            $processes | ForEach-Object { Write-Host "Killing process $($_.Id) ($($_.ProcessName))"; Stop-Process -Id $_.Id -Force };
            Write-Host "Successfully freed port ${port}";
          } else {
            Write-Host "No processes found using port ${port}";
          }
        `;
        const powershellCommand = `powershell -Command "${psCommand.replace(/"/g, '\\"')}"`;
        execSync(powershellCommand, { stdio: 'inherit' });
      } catch (psError) {
        console.log(`PowerShell approach failed: ${psError.message}`);
        
        // Fall back to the traditional approach
        try {
          // First try to kill by port
          console.log(`> Falling back to netstat to find processes on port ${port}...`);
          
          // Find the PID using the port
          const findPidCommand = `FOR /F "tokens=5" %a in ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') do @echo %a`;
          console.log(`> ${findPidCommand}`);
          const findPidResult = execSync(findPidCommand, { shell: 'cmd.exe', encoding: 'utf8' }).trim();
          
          if (findPidResult) {
            const pids = findPidResult.split(/\r?\n/).filter(pid => /^\d+$/.test(pid.trim()));
            
            if (pids.length > 0) {
              console.log(`Found PIDs using port ${port}: ${pids.join(', ')}`);
              
              for (const pid of pids) {
                try {
                  const killCommand = `taskkill /F /PID ${pid}`;
                  console.log(`> ${killCommand}`);
                  execSync(killCommand, { encoding: 'utf8' });
                  console.log(`Successfully killed process with PID ${pid}`);
                } catch (killError) {
                  console.error(`Failed to kill process ${pid}:`, killError.message);
                }
              }
            }
          }
        } catch (error) {
          console.log(`No specific processes found for port ${port}. Trying alternative method...`);
        }
      }
      
      // As a backup, try to kill all Node.js processes
      try {
        console.log('> Killing all Node.js processes...');
        execSync('taskkill /F /IM node.exe', { stdio: 'inherit' });
      } catch (error) {
        console.log('No Node.js processes were found or some could not be killed.');
      }

      // Verify the port is actually free
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit for processes to terminate
      
      try {
        console.log(`> Verifying port ${port} is free...`);
        execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, { encoding: 'utf8' });
        console.log(`WARNING: Port ${port} is still in use despite kill attempts!`);
      } catch (error) {
        // If command fails, it means no process is listening on the port, which is good
        console.log(`Port ${port} is now free.`);
      }
      
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
  killPort(Number(port)).catch(console.error);
}

module.exports = { killPort }; 