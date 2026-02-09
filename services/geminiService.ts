import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Category, ContentType } from "../types";

// ใน Vite ต้องใช้ import.meta.env แทน process.env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

interface AnalysisResult {
  summary: string;
  contentType: ContentType;
  category: Category;
  isHighlight: boolean;
}

export const analyzeNewsContent = async (
  text: string, 
  currentMonthTheme: string
): Promise<AnalysisResult> => {
  if (!apiKey) {
    console.error("❌ API Key not found! Please check VITE_GEMINI_API_KEY in Vercel/Env");
    // ส่งค่าเริ่มต้นกลับไปเพื่อให้แอปไม่พัง
    return {
      summary: "API Key missing. Please config environment variables.",
      contentType: "PR Press",
      category: "MOC Update",
      isHighlight: false
    };
  }

  // ใช้รุ่น 1.5 Flash (เสถียรและเร็วที่สุดสำหรับงานสรุปความ)
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          summary: { type: SchemaType.STRING },
          contentType: { 
            type: SchemaType.STRING, 
            enum: ['Video', 'Banner', 'PR Press', 'Photo Album'] 
          },
          category: { 
            type: SchemaType.STRING, 
            enum: ['Trust & Impact', 'MOC Update', 'Policy to People'] 
          },
          isHighlight: { type: SchemaType.BOOLEAN }
        },
        required: ["summary", "contentType", "category", "isHighlight"]
      }
    }
  });

  const prompt = `
    Analyze the following news text for the Ministry of Commerce (MOC) content strategy.
    
    1. Summarize the content concisely in Thai.
    2. Determine the most suitable content format from: 'Video', 'Banner', 'PR Press', or 'Photo Album'.
    3. Categorize it into one of these three pillars: 'Trust & Impact', 'MOC Update', or 'Policy to People'.
    4. Check if the content relates to the current monthly theme: "${currentMonthTheme}". If it matches strictly or loosely, set isHighlight to true.

    News Content:
    "${text}"
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonStr = response.text();
    return JSON.parse(jsonStr) as AnalysisResult;

  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    return {
      summary: "เกิดข้อผิดพลาดในการวิเคราะห์เนื้อหา โปรดตรวจสอบข้อมูลด้วยตนเอง",
      contentType: "PR Press",
      category: "MOC Update",
      isHighlight: false
    };
  }
};
