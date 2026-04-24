import fs from 'fs';
import path from 'path';

const destDir = path.join(process.cwd(), 'public/stickers');

const subDirs = ['diary_objects', 'mood_markers'];

subDirs.forEach(subDir => {
  const dirPath = path.join(destDir, subDir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (fs.lstatSync(path.join(dirPath, file)).isFile()) {
        fs.renameSync(path.join(dirPath, file), path.join(destDir, file));
      }
    }
    fs.rmdirSync(dirPath);
  }
});
console.log('Moved files successfully');
