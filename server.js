import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEm } from './utils/embedded.js';
import { query } from './DB/pinecone.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", async (req, res) => {
    console.log("here");
    res.send("Here right now");
})

app.post('/query', async (req, res) => {
    try {
        const { query: userQuery } = req.body;

        if (!userQuery) {
            return res.status(400).json({ error: 'Query not found!' });
        }

        const { embedding } = await getEm(userQuery);
        const result = await query(embedding, 5);

        const citations = result.map((r, i) => ({
            index: i + 1,
            text: r.metadata?.text,
            source: r.metadata?.fileName,
            score: r.score,
        }));


        return res.json({ citations });
    }

    catch (err) {
        console.log(err);
        res.status(500);

    }
})


const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server is Up and running on ${PORT}`);

})