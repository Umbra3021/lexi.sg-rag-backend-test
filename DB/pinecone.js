import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const index = pc.index(process.env.PINECONE_INDEX);

export async function pushVector(id, values, metadata) {
    return await index.upsert([
        {
            id: String(id),
            values,
            metadata
        }
    ]);
}

export async function query(vector, topK) {
    const result = await index.query({
        topK,
        vector,
        includeMetadata: true
    });

    return result.matches;
}