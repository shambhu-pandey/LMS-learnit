



const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const executeCode = async (req, res) => {
  const { code, language } = req.body;
  const timestamp = Date.now();
  const userId = req.user._id;
  const tempDir = path.join(__dirname, '..', 'temp');

  try {
  
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
    }

    let output;
    switch(language) {
      case 'python':
        output = await executePython(code, timestamp, userId, tempDir);
        break;
      case 'javascript':
        output = await executeJavaScript(code, timestamp, userId, tempDir);
        break;
      case 'java':
        output = await executeJava(code, timestamp, userId, tempDir);
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Unsupported language' 
        });
    }
    
    res.json({ success: true, output });
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      output: error.stderr || error.message
    });
  }
};
const executePython = async (code, timestamp, userId, tempDir) => {
    try {
      // Ensure temp directory exists
      try {
        await fs.access(tempDir);
      } catch {
        await fs.mkdir(tempDir, { recursive: true });
      }
  
      const filename = path.join(tempDir, `${userId}_${timestamp}.py`);
      await fs.writeFile(filename, code);
  
      return new Promise((resolve, reject) => {
        const pythonPath = 'C:\\Python313\\python.exe'; 
        
        exec(`"${pythonPath}" "${filename}"`, async (error, stdout, stderr) => {
          // Clean up file after execution
          try {
            await fs.unlink(filename);
          } catch (err) {
            console.error('File cleanup error:', err);
          }
  
          if (error) {
            console.error('Python execution error:', error);
            reject({
              message: 'Python execution failed',
              stderr: stderr || error.message
            });
          } else {
            resolve(stdout);
          }
        });
      });
    } catch (error) {
      console.error('Error in executePython:', error);
      throw new Error(`Failed to execute Python code: ${error.message}`);
    }
  };
  
const executeJavaScript = async (code, timestamp, userId, tempDir) => {
  const filename = path.join(tempDir, `${userId}_${timestamp}.js`);
  
  try {
    await fs.writeFile(filename, code);
    return new Promise((resolve, reject) => {
      exec(`node "${filename}"`, async (error, stdout, stderr) => {
        try {
          await fs.unlink(filename);
        } catch (err) {
          console.error('File cleanup error:', err);
        }
        
        if (error) {
          reject({ message: 'JavaScript execution failed', stderr });
        } else {
          resolve(stdout);
        }
      });
    });
  } catch (error) {
    throw new Error(`Failed to execute JavaScript code: ${error.message}`);
  }
};

const executeJava = async (code, timestamp, userId, tempDir) => {
  // Extract class name from the code
  const classNameMatch = code.match(/public\s+class\s+(\w+)/);
  if (!classNameMatch) {
    throw new Error('Could not find public class name in Java code');
  }
  const className = classNameMatch[1];
  
  // Create a unique directory for this execution
  const execDir = path.join(tempDir, `${userId}_${timestamp}`);
  const javaFilename = path.join(execDir, `${className}.java`);
  
  try {
    // Create execution directory
    await fs.mkdir(execDir, { recursive: true });
    
    // Write the Java file
    await fs.writeFile(javaFilename, code);
    
    return new Promise((resolve, reject) => {
      // Compile and execute with correct paths
      exec(`cd "${execDir}" && javac "${className}.java" && java ${className}`, 
        async (error, stdout, stderr) => {
          try {
            // Clean up directory and all files
            await fs.rm(execDir, { recursive: true, force: true });
          } catch (err) {
            console.error('Cleanup error:', err);
          }
          
          if (error) {
            reject({ 
              message: 'Java execution failed', 
              stderr: stderr || error.message 
            });
          } else {
            resolve(stdout);
          }
      });
    });
  } catch (error) {
    // Ensure cleanup on error
    try {
      await fs.rm(execDir, { recursive: true, force: true });
    } catch {}
    throw new Error(`Failed to execute Java code: ${error.message}`);
  }
};

module.exports = { executeCode };