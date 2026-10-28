
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const INPUT_FILE = path.join(
    __dirname,
    "../knowledge/extractedDocuments.json"
);

const OUTPUT_FILE = path.join(
    __dirname,
    "../knowledge/knowledgeIndex.json"
);

const EMBEDDING_MODEL =
    process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";

function createChunks(text, source) {
    const cleanText = text.replace(/\s+/g, " ").trim();

    const chunkSize = 1200;
    const overlap = 200;
    const chunks = [];

    let start = 0;

    while (start < cleanText.length) {
        const end = Math.min(start + chunkSize, cleanText.length);
        const chunkText = cleanText.slice(start, end).trim();

        if (chunkText.length > 0) {
            chunks.push({
                source,
                text: chunkText,
            });
        }

        if (end === cleanText.length) break;

        start = end - overlap;
    }

    return chunks;
}

async function generateEmbeddings(texts) {
    const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: texts,
        config: {
            taskType: "RETRIEVAL_DOCUMENT",
            outputDimensionality: 768,
        },
    });

    if (
        !response.embeddings ||
        response.embeddings.length !== texts.length
    ) {
        throw new Error("Embedding response is incomplete.");
    }

    return response.embeddings.map((item) => item.values);
}

async function buildKnowledgeIndex() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY missing in .env");
        }

        if (!fs.existsSync(INPUT_FILE)) {
            throw new Error(
                "extractedDocuments.json nahi mili. Pehle PDF extraction script run karo."
            );
        }

        const documents = JSON.parse(
            fs.readFileSync(INPUT_FILE, "utf8")
        );

        const chunks = [];

        for (const document of documents) {
            if (!document.text || !document.text.trim()) {
                console.warn(`Skipping empty document: ${document.source}`);
                continue;
            }

            chunks.push(
                ...createChunks(document.text, document.source)
            );
        }

        if (chunks.length === 0) {
            throw new Error("Koi searchable text chunks nahi mile.");
        }

        console.log(`Total chunks created: ${chunks.length}`);

        const indexedChunks = [];
        const batchSize = 16;

        const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));
        
for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    console.log(
        `Generating embeddings: ${i + 1}-${i + batch.length} of ${chunks.length}`
    );

    // Temporary rate limit se bachne ke liye retry
    let embeddings;
    let attempts = 0;

    while (true) {
        try {
            embeddings = await generateEmbeddings(
                batch.map((chunk) => chunk.text)
            );
            break;
        } catch (error) {
            attempts++;

            if (attempts >= 4) {
                throw error;
            }

            const waitTime = 65000 * attempts;

            console.log(
                `API limit/error. Waiting ${waitTime / 1000} seconds before retry ${attempts}/3...`
            );

            await sleep(waitTime);
        }
    }

    batch.forEach((chunk, index) => {
        indexedChunks.push({
            source: chunk.source,
            text: chunk.text,
            embedding: embeddings[index],
        });
    });

    // Har batch ke baad thoda gap
    if (i + batchSize < chunks.length) {
        await sleep(5000);
    }
}


        fs.writeFileSync(
            OUTPUT_FILE,
            JSON.stringify(indexedChunks),
            "utf8"
        );

        console.log("\nRAG index created successfully!");
        console.log(`Indexed chunks: ${indexedChunks.length}`);
        console.log(`Output: ${OUTPUT_FILE}`);
    } catch (error) {
        console.error("Index creation failed:", error.message);
        process.exitCode = 1;
    }
}

buildKnowledgeIndex();
