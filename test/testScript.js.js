import { readPdf, readDoc } from './utils/ReadFile.js';
import { chuckText } from './utils/chunks.js';
import { getEm } from './utils/embedded.js';
import { pushVector, query } from './DB/pinecone.js';


async function main() {
    const pdf = await readPdf('./pdf.PDF');
    const doc = await readDoc('./DOC.docx');
    const chunks = chuckText(doc, 300);

    const embedded = [];

    // for (let i = 0; i < chunks.length; i++) {
    //     const { embedding: vector } = await getEm(chunks[i]);

    //     const chunk = {
    //         id: `doc-${i}`,
    //         text: chunks[i],
    //         vector,
    //         fileName: 'DOC.docx'
    //     };

    //     console.log(`🔍 vector for chunk ${i}:`, typeof chunk.vector, Array.isArray(chunk.vector), chunk.vector?.slice?.(0, 5));


    //     await pushVector(chunk.id, chunk.vector, {
    //         text: chunk.text, fileName: chunk.fileName,
    //     });

    //     embedded.push(chunk);
    //     console.log(`Embedded & uploaded ${i}`);
    // }




    console.log('Total chunks:', embedded.length);


    const userQuery = "Is an insurance company liable to pay if a vehicle lacks a valid permit?";
    const userVec = await getEm(userQuery);

    const results = await query(userVec.embedding, 5);

    // Step 5: Log citations
    const citations = results.map((r, i) => ({
        index: i + 1,
        text: r.metadata?.text,
        source: r.metadata?.fileName,
        score: r.score,
    }));

    console.log('📚 Top citations:\n', citations);


}


main();