import fs from 'fs';

/**
 * Create a directory recursively if it doesn't exist
 */
export async function createDirectory(dirPath: string): Promise<void> {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating directory:', error);
    throw new Error(`Failed to create directory: ${dirPath}`);
  }
} 