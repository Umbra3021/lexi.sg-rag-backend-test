🚀 Project Setup & Instructions
This project uses Pinecone for vector storage and retrieval of legal case data. The setup involves uploading files to Pinecone and then running a query server to fetch relevant citations.

📦 Prerequisites
Node.js (v18+)

Pinecone account
Sign up at https://www.pinecone.io

Two .env files

One for UploadScript/

One for the main project root

The contents of both env files:
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=your_index_name

Step 2: Upload to Pinecone
In your terminal:

cd UploadScript
node main.js 

🌐 Step 3: Start the Server
node server.js
Send a POST request to /query using Postman or curl:

Step 4: Query the Server
Send a POST request to /query using Postman or curl:

🔸 Request
POST http://localhost:9000/query

Body (JSON):
{
  "query": "Is an insurance company liable if a vehicle has no permit?"
}

How it works?
When you run the upload script (main.js inside UploadScript/):

Each file is read using pdf-parse or mammoth (for Word files).

The text is chunked into smaller pieces (around 300 words) for better context retrieval.

Each chunk is embedded into a vector using OpenAI’s embedding API (getEm()).

Each vector (with metadata like file name and chunk text) is pushed to Pinecone.

A check is performed to avoid uploading duplicate chunks using Pinecone's fetch().

🧠 2. Embedding and Indexing
Vectors represent meaning of the text in high-dimensional space.

Pinecone stores each chunk's vector in a vector database index for fast similarity search.

Metadata stored along with vectors helps identify the source file and chunk later.



