import { z } from 'zod';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function callGemini(prompt: string, apiKey: string) {
  if (!prompt || prompt.trim().length < 20) {
    throw new Error('Prompt is too short or empty. Not processing request.');
  }
  if (!apiKey) {
    throw new Error('Missing Gemini API key');
  }
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch from Gemini.');
  }
}

/**
 * Hướng dẫn sử dụng:
 *
 * Gemini API hoạt động hiệu quả nhất khi bạn cung cấp cả "System Prompt" và "User Prompt".
 *
 * 1.  **System Prompt (Lời nhắc hệ thống):**
 *     -   Đây là những chỉ dẫn, quy tắc, hoặc bối cảnh bạn muốn AI (Gemini) tuân theo trong suốt cuộc hội thoại.
 *     -   Nó giúp định hình "tính cách", vai trò, và cách phản hồi của AI.
 *     -   Ví dụ: "Bạn là một chuyên gia marketing với 10 năm kinh nghiệm trong lĩnh vực bất động sản. Hãy luôn trả lời một cách chuyên nghiệp, súc tích và tập trung vào việc thu hút khách hàng tiềm năng."
 *
 * 2.  **User Prompt (Lời nhắc người dùng):**
 *     -   Đây là câu hỏi, yêu cầu, hoặc dữ liệu cụ thể bạn muốn AI xử lý.
 *     -   Ví dụ: "Hãy viết một bài đăng trên mạng xã hội để quảng cáo một căn hộ 2 phòng ngủ với view biển."
 *
 * Bằng cách kết hợp cả hai, bạn sẽ nhận được kết quả chính xác và phù hợp với ngữ cảnh hơn.
 *
 * Dưới đây là phiên bản nâng cấp của hàm `callGemini` để hỗ trợ rõ ràng hai loại prompt này.
 */

/**
 * Calls the Gemini API with a structured prompt containing a system prompt and a user prompt.
 * @param systemPrompt - Instructions for the AI model (e.g., "You are a helpful assistant.").
 * @param userPrompt - The user's specific query or request.
 * @param apiKey - Your Gemini API key.
 * @returns The response text from Gemini.
 */
export async function callGeminiWithSystemPrompt(systemPrompt: string, userPrompt: string, apiKey: string) {
  if (!userPrompt || userPrompt.trim().length < 10) {
    throw new Error('User prompt is too short or empty. Not processing request.');
  }
  if (!apiKey) {
    throw new Error('Missing Gemini API key');
  }

  // Combine system and user prompts into a single prompt for the API
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] }),
    });
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch from Gemini.');
  }
}

/**
 * Gọi Gemini API và yêu cầu trả về kết quả dưới dạng JSON có cấu trúc.
 * @param systemPrompt - Lời nhắc hệ thống, nên bao gồm hướng dẫn về cấu trúc JSON.
 * @param userPrompt - Lời nhắc người dùng.
 * @param apiKey - API key của Gemini.
 * @param schema - Schema Zod để validate kết quả JSON.
 * @returns Dữ liệu JSON đã được parse và validate.
 */
export async function callGeminiStructured<T extends z.ZodTypeAny>(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  schema: T
): Promise<z.infer<T>> {
  // Bổ sung hướng dẫn về JSON vào systemPrompt nếu chưa có
  const jsonSystemPrompt = `${systemPrompt}

Bạn phải trả về kết quả dưới dạng một chuỗi JSON hợp lệ. Không bao gồm bất kỳ văn bản giải thích hay markdown (như \`\`\`json) nào khác. Chỉ trả về JSON.`;

  const responseText = await callGeminiWithSystemPrompt(jsonSystemPrompt, userPrompt, apiKey);

  try {
    // Loại bỏ các ký tự markdown nếu có (phòng trường hợp AI vẫn trả về)
    const jsonString = responseText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1').trim();
    const jsonData = JSON.parse(jsonString);

    // Validate với Zod schema
    const result = schema.parse(jsonData);
    return result;
  } catch (error) {
    console.error("Lỗi khi parse hoặc validate JSON từ Gemini:", error);
    console.error("Response text nhận được:", responseText);
    throw new Error(`Dữ liệu JSON từ AI không hợp lệ hoặc không đúng cấu trúc: ${error instanceof Error ? error.message : String(error)}`);
  }
}
