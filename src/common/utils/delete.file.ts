import fs from 'fs/promises';

async function deleteFile(filePath: string) {
  try {
    await fs.access(filePath).catch(() => {
      console.log(`File does not exist, skipping: ${filePath}`);
      throw null;
    });
    await fs.unlink(filePath);
    console.log(`File deleted: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
}

export default deleteFile;
