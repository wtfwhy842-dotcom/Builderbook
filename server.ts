import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse large json bodies for base64 images
  app.use(express.json({ limit: '50mb' }));

  // AI OCR Route
  app.post("/api/ocr", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `You are a receipt parsing assistant for a UK construction worker's bookkeeping app.
Extract the following details from this receipt and return ONLY a valid JSON object:
- supplier (string) - name of the store/merchant
- date (string) - ISO string or YYYY-MM-DD
- amount (number) - Total amount
- vat (number) - VAT amount (if not explicitly shown but there is a VAT number and total, assume 20% standard rate, calculate appropriately. If no VAT shown or it says 0, put 0)
- category (string) - one of: "Materials", "Fuel", "Tools", "Subcontractors", "Meals", "Other"

If a field cannot be found, make your best guess based on the context, or leave it blank/0 if impossible.

JSON Output format:
{
  "supplier": "Store Name",
  "date": "2023-10-25",
  "amount": 100.00,
  "vat": 20.00,
  "category": "Materials"
}
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: imageBase64.split(',')[1] || imageBase64,
                  mimeType: mimeType || 'image/jpeg'
                }
              },
              {
                text: prompt
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty response from Gemini");
      }
      
      const parsedData = JSON.parse(resultText);
      res.json(parsedData);
      
    } catch (error: any) {
      console.error("OCR Error:", error);
      res.status(500).json({ error: error.message || "Failed to process receipt" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
