import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import multer from "multer";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors()); // Allow requests from your mobile app

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);

    // Send to OpenAI Whisper model
    const transcription = await openai.audio.transcriptions.create({
      file: fileStream,
      model: "gpt-4o-mini-transcribe", // newer, faster alternative to whisper-1
    });

    // Clean up temp file
    fs.unlinkSync(filePath);

    res.json({ text: transcription.text });
  } catch (error) {
    console.error("Transcription Error:", error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
