import fs from 'fs';
import path from 'path';
import { Worker } from 'worker_threads';
import dotenv from 'dotenv';
dotenv.config();




const folderPath = '../Uploads';
const files = fs.readdirSync(folderPath)


for (const file of files) {
    const fullPath = path.join(folderPath, file);

    if (!fs.lstatSync(fullPath).isFile()) continue;

    const worker = new Worker('./Worker.js', {
        workerData: {
            fullPath: fullPath,
            file: file
        }
    });

    worker.on('message', (msg) => {
        console.log(`[Worker] file -> ${msg}}`);
    });

    worker.on('error', (err) => {
        console.error(`[Worker Error] ${file}:`, err.message);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`[Worker] ${file} exited with code ${code}`);
        } else {
            console.log(`[Worker] ${file} finished successfully`);
        }
    });

}










