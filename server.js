import express from "express";
import cors from "cors";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const DEFAULT_MODELS = {
  anthropic: "claude-3-5-sonnet-20241022",
  openai: "gpt-4o-mini",
  google: "gemini-1.5-flash",
  deepseek: "deepseek-chat"
};

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "LLM API Template",
    description: "A unified API interface for multiple LLM providers",
    supported_platforms: Object.keys(DEFAULT_MODELS),
    endpoints: {
      "/:platform/:model": "Main LLM interaction endpoint",
      "/health": "Health check endpoint"
    },
    documentation: "See README.md for detailed usage instructions"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/:platform/:model?", async (req, res) => {
  if (!req.query.message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const message = req.query.message;
  const { platform } = req.params;
  const model = req.params.model || DEFAULT_MODELS[platform];

  if (!model) {
    return res
      .status(400)
      .json({ error: "Invalid platform or model not specified" });
  }

  switch (platform) {
    case "anthropic": {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      try {
        const result = await anthropic.messages.create({
          model: model,
          max_tokens: 1024,
          messages: [{ role: "user", content: message }]
        });

        res.json({
          model: model,
          timestamp: new Date().toISOString(),
          response: result.content[0].text
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
      }
      break;
    }

    case "openai": {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });

        const result = await openai.chat.completions.create({
          model: model,
          messages: [{ role: "user", content: message }]
        });

        res.json({
          model: model,
          timestamp: new Date().toISOString(),
          response: result.choices[0].message.content
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
      }
      break;
    }

    case "google": {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

      try {
        const googleModel = genAI.getGenerativeModel({ model: model });
        const result = await googleModel.generateContent(message);

        res.json({
          model: model,
          timestamp: new Date().toISOString(),
          response: result.response.text()
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
      }
      break;
    }

    case "deepseek": {
      try {
        const deepseek = new OpenAI({
          baseURL: "https://api.deepseek.com",
          apiKey: process.env.DEEPSEEK_API_KEY
        });

        const result = await deepseek.chat.completions.create({
          model: model || DEFAULT_MODELS.deepseek,
          messages: [{ role: "user", content: message }]
        });

        res.json(result);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
      }
      break;
    }

    default:
      res.status(400).json({ error: "Invalid platform" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
