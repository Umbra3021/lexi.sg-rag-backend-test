import { pipeline } from "@xenova/transformers";
let em = null;

async function loadEm() {

    if (!em) {
        em = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return em;
}

export async function getEm(txt) {

    try {
        const model = await loadEm();
        const result = await model(txt, {
            pooling: 'mean',
            normalize: true
        });

        const vector = Array.from(result.data);

        if (!Array.isArray(vector)) {
            throw new Error('Output is not Vector');
        }

        return { embedding: vector };
    }
    catch (err) {
        console.log(err.message);
        return;
    }
}

