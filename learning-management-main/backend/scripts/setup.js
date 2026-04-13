const fs = require('fs').promises;
const path = require('path');

async function setupDirectories() {
  try {
    const tempDir = path.join(__dirname, '..', 'temp');
    
    // Create temp directory if it doesn't exist
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
      console.log('✅ Created temp directory');
    }

    // Create .gitkeep to track empty directory
    const gitkeepPath = path.join(tempDir, '.gitkeep');
    await fs.writeFile(gitkeepPath, '');
    
    console.log('✅ Setup completed successfully');
  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  }
}

setupDirectories();