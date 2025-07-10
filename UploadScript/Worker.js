import { parentPort, workerData } from 'worker_threads';
import path from 'path';
import dotenv from 'dotenv';

import { readPdf, readDoc } from '../utils/ReadFile.js';
import { chuckText } from '../utils/chunks.js';
import { getEm } from '../utils/embedded.js';
import { pushVector } from '../DB/pinecone.js';
import { Pinecone } from '@pinecone-database/pinecone';
import fs from 'fs';

dotenv.config();

const pine = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pine.index(process.env.PINECONE_INDEX);


async function CheckDuplicate(chunkID) {
    const exists = await index.fetch([chunkID]);
    return exists.records?.[chunkID] !== undefined;
}


async function upload(fullPath, file) {

    try {

        const extension = path.extname(file).toLowerCase();
        let txt = '';

        if (extension === '.pdf') {
            txt = await readPdf(fullPath);
        }
        else if (extension === '.docx') {
            txt = await readDoc(fullPath);
        }
        else {
            parentPort.postMessage(`Unsupported file type : ${file}`);
            return;
        }

        const chunks = chuckText(txt, 300);

        for (let i = 0; i < chunks.length; i++) {

            const chunkID = `${file}-chunk-${i}`;
            const check = await CheckDuplicate(chunkID);

            if (check) {
                parentPort.postMessage(`Skipping ${chunkID} as it is already present`);
                continue;

            }

            const { embedding: vector } = await getEm(chunks[i]);

            await pushVector(chunkID, vector, { text: chunks[i], file });
        }

    } catch (error) {
        parentPort.postMessage(`Error in ${file} : ${error.message}`);
    }
}



const { fullPath, file } = workerData;
upload(fullPath, file);


