import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../client/public');
const targetDir = path.join(__dirname, 'public/images');

if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'));
}

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
}

fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error('Error reading source directory', err);
        return;
    }

    files.forEach(file => {
        if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.mp4')) {
            const sourcePath = path.join(sourceDir, file);
            const targetPath = path.join(targetDir, file);
            
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Copied ${file}`);
        }
    });
    console.log('Finished copying images');
});
