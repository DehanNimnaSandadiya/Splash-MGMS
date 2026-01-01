import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

export const createZipArchive = async (imageFiles) => {
  return new Promise((resolve, reject) => {
    const tempDir = 'temp';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const zipPath = path.join(tempDir, `images-${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      resolve(zipPath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    const addFilePromises = imageFiles.map((file) => {
      return new Promise((resolveFile) => {
        if (file.isCloudinary && file.url) {
          const url = new URL(file.url);
          const client = url.protocol === 'https:' ? https : http;
          const ext = path.extname(url.pathname) || '.jpg';
          const fileName = `${file.name}${ext}`;

          client.get(file.url, (response) => {
            if (response.statusCode === 200) {
              archive.append(response, { name: fileName });
            }
            resolveFile();
          }).on('error', () => {
            resolveFile();
          });
        } else if (file.path && fs.existsSync(file.path)) {
          const ext = path.extname(file.path);
          archive.file(file.path, { name: `${file.name}${ext}` });
          resolveFile();
        } else {
          resolveFile();
        }
      });
    });

    Promise.all(addFilePromises).then(() => {
      archive.finalize();
    });
  });
};

