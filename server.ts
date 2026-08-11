import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // Initialize Gemini safely on first request or at startup with validation
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing in the security context. Enable it in Settings > Secrets.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // 1. Chatbot endpoint for Multi-turn conversation with custom system instructions
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history, systemInstruction, modelName } = req.body;
      const ai = getGeminiClient();

      // Resolve preferred model: default to flash, use pro for complex requests
      const selectedModel = modelName || "gemini-3.5-flash";

      // Reconstruct full content array for conversational context
      // Input: messages: [{ role: 'user' | 'model', text: string }]
      const contents = (history || []).map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      // Append latest message
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction: systemInstruction || "You are the Aetherium Intelligence Protocol, an elite guidance AI for Project Emergence.",
          temperature: 0.7,
        },
      });

      res.json({
        success: true,
        text: response.text || "Connection completed without text payload.",
      });
    } catch (error: any) {
      console.error("Chatbot API Encountered Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Unknown error during AI communication.",
      });
    }
  });

  // 2. High-thinking intelligence analyzer endpoint
  app.post("/api/gemini/intel", async (req, res) => {
    try {
      const { prompt, useHighThinking, systemInstruction } = req.body;
      const ai = getGeminiClient();

      // Use target model gemini-3.1-pro-preview for complex reasoning tasks
      const model = "gemini-3.1-pro-preview";
      
      const config: any = {
        systemInstruction: systemInstruction || "You are an advanced Aetherium Logic Core. Perform high-intelligence structured telemetry analysis and philosophical decomposition.",
        temperature: useHighThinking ? 0.3 : 0.7, // Low temperature for deep rigorous thinking
      };

      if (useHighThinking) {
        config.thinkingConfig = {
          thinkingLevel: "HIGH",
        };
        // Per guidelines, do NOT set maxOutputTokens for HIGH thinkingLevel
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      res.json({
        success: true,
        text: response.text || "No insights processed.",
      });
    } catch (error: any) {
      console.error("Aetherium Logic Core Error:", error);
      res.status(550).json({
        success: false,
        error: error.message || "Intelligence dispatch failed.",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Vessel Core] Full-Stack Server active on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server startup crash:", err);
});
