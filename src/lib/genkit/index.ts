import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', { temperature: 0.8 }),
});

// Recipe generator using Genkit's generate content pattern (no Zod schema)
export async function generateRecipe({ ingredient, dietaryRestrictions }: { ingredient: string; dietaryRestrictions?: string }) {
  const prompt = `Create a recipe with the following requirements:\nMain ingredient: ${ingredient}\nDietary restrictions: ${dietaryRestrictions || 'none'}`;
  const { output } = await ai.generate({
    prompt,
    // Optionally, you can add output: { format: 'json' } if you want structured output
  });
  if (!output) throw new Error('Failed to generate recipe');
  return output;
}

/**
 * Hướng dẫn sử dụng Genkit generate content:
 *
 * 1. Import Genkit instance và hàm generateRecipe:
 *    import { ai, generateRecipe } from '@/lib/genkit';
 *
 * 2. Gọi hàm generateRecipe trong backend:
 *    const result = await generateRecipe({ ingredient: 'avocado', dietaryRestrictions: 'vegetarian' });
 *    console.log(result);
 *
 * 3. Chạy Developer UI để test flow:
 *    npm run genkit:ui
 *    // hoặc: genkit start -- npx tsx --watch src/index.ts
 *    // UI mặc định: http://localhost:4000
 *
 * 4. Lưu ý:
 *    - Đảm bảo đã set biến môi trường GEMINI_API_KEY (hoặc key provider khác nếu dùng model khác).
 *    - Không import file này ở phía client, chỉ dùng cho backend/server-side.
 *    - Có thể mở rộng helper này để export thêm hàm generate khác, model, plugin tuỳ ý.
 */
