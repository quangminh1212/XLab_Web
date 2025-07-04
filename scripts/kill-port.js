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
  
  // Don't automatically kill all Node.js processes after each port kill
  // This will be done explicitly when requested
}

function killAllNodeProcesses() {
  console.log('> Killing all Node.js processes...');
  
  if (process.platform === 'win32') {
    try {
      // First try with PowerShell for more reliable results
      console.log('> Using PowerShell to kill all node processes...');
      const powershellCommand = `
        $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue;
        if ($nodeProcesses) {
          foreach ($process in $nodeProcesses) { 
            Write-Host "Killing Node process: $($process.Id)";
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue;
          }
          Write-Host "All Node.js processes terminated";
        } else {
          Write-Host "No Node.js processes found";
        }
      `;
      
      execSync(`powershell -Command "${powershellCommand}"`, { stdio: 'inherit' });
      
      // Fallback to taskkill
      execSync('taskkill /F /IM node.exe', { stdio: 'inherit' });
    } catch (error) {
      console.log('No Node.js processes to kill or they are protected');
    }
    
    // Additional cleanup - kill any processes related to Next.js
    try {
      // Look for any Next.js related processes
      const powershellNextCommand = `
        $nextProcesses = Get-Process | Where-Object { $_.CommandLine -like "*next*" -or $_.CommandLine -like "*.next*" } -ErrorAction SilentlyContinue;
        if ($nextProcesses) {
          foreach ($process in $nextProcesses) { 
            Write-Host "Killing Next.js related process: $($process.Id)";
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue;
          }
        }
      `;
      
      execSync(`powershell -Command "${powershellNextCommand}"`, { stdio: 'inherit' });
    } catch (error) {
      // Ignore errors here as it's just an additional cleanup
    }
    
    // Add a small delay to ensure processes are fully terminated
    execSync('timeout /t 2 > NUL', { stdio: 'inherit' });
  } else {
    try {
      // Kill all node processes on Unix-based systems
      execSync('pkill -9 -f node || true', { stdio: 'inherit' });
      execSync('pkill -9 -f next || true', { stdio: 'inherit' });
      // Add a small delay
      execSync('sleep 2', { stdio: 'inherit' });
    } catch (error) {
      console.log('No Node.js processes to kill or they are protected');
    }
  }
}

// Get port from command line arguments
const port = process.argv[2] || 3000;

// If a specific kill-all flag is passed
if (process.argv.includes('--kill-all')) {
  killAllNodeProcesses();
} else {
  killPort(port);
  
  // Optionally kill all Node.js processes if a second argument is passed
  if (process.argv[3] === '--with-all') {
    killAllNodeProcesses();
  }
}

// Export the functions for use in other scripts
module.exports = {
  killPort,
  killAllNodeProcesses
}; 