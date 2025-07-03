const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

/**
 * Kills processes using a specified port
 * @param {number} port - The port to free
 */
function killPort(port) {
  console.log(`Attempting to kill processes using port ${port}...`);
  
  if (process.platform === 'win32') {
    // Windows implementation
    console.log('> Using PowerShell to kill processes on port ' + port + '...');
    
    try {
      // Improved PowerShell command to find and kill processes using the port
      const powershellCommand = `
        $processes = Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | 
        Select-Object -ExpandProperty OwningProcess;
        if ($processes) {
          foreach ($process in $processes) { 
            $p = Get-Process -Id $process -ErrorAction SilentlyContinue;
            if ($p) {
              Write-Host "Killing process: $($p.Id) - $($p.ProcessName)";
              Stop-Process -Id $process -Force;
            }
          }
        } else {
          Write-Host "No processes found using port ${port}";
        }
      `;
      
      execSync(`powershell -Command "${powershellCommand}"`, { stdio: 'inherit' });
    } catch (error) {
      console.error('Failed to kill processes on port ' + port + ' using PowerShell');
    }
    
    // Fallback to netstat and taskkill
    try {
      console.log('> Killing processes on port ' + port + '...');
      
      // Find process IDs using the port
      const findCmd = `FOR /F "tokens=5" %a in ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') do @echo %a`;
      console.log('> ' + findCmd);
      
      // Execute the find command
      let pids = [];
      try {
        const stdout = execSync(findCmd, { shell: true }).toString().trim();
        if (stdout) {
          pids = [...new Set(stdout.split(/\s+/))]; // Remove duplicates
          console.log(`Found PIDs using port ${port}: ${pids.join(', ')}`);
        }
      } catch (error) {
        console.log(`No processes found listening on port ${port}`);
      }
      
      // Kill each process
      for (const pid of pids) {
        try {
          const killCmd = `taskkill /F /PID ${pid}`;
          console.log('> ' + killCmd);
          execSync(killCmd, { stdio: 'inherit' });
          console.log(`Successfully killed process with PID ${pid}`);
        } catch (error) {
          console.error(`Failed to kill process ${pid}: ${error}`);
        }
      }
    } catch (error) {
      console.error(`Failed to kill process using port ${port}: ${error}`);
    }
  } else {
    // Unix-based systems (Linux, macOS)
    try {
      const command = `lsof -i :${port} -t | xargs -r kill -9`;
      console.log('> ' + command);
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      console.log(`No processes found using port ${port}`);
    }
  }
  
  // Kill all Node.js processes as a fallback
  killAllNodeProcesses();
}

function killAllNodeProcesses() {
  console.log('> Killing all Node.js processes...');
  
  if (process.platform === 'win32') {
    try {
      execSync('taskkill /F /IM node.exe', { stdio: 'inherit' });
    } catch (error) {
      console.log('No Node.js processes to kill or they are protected');
    }
  } else {
    try {
      execSync('pkill -f node', { stdio: 'inherit' });
    } catch (error) {
      console.log('No Node.js processes to kill or they are protected');
    }
  }
}

// Get port from command line arguments
const port = process.argv[2] || 3000;
killPort(port);

// Export the functions for use in other scripts
module.exports = {
  killPort,
  killAllNodeProcesses
}; 