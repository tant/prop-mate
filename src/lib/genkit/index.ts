import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
// Bạn có thể import thêm các plugin khác nếu cần

// Khởi tạo Genkit instance với plugin Google AI Gemini
export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', { temperature: 0.8 }),
});

// Ví dụ định nghĩa schema với Zod (nên cài zod nếu chưa có)
import { z } from 'zod';

export const RecipeInputSchema = z.object({
  ingredient: z.string().describe('Main ingredient or cuisine type'),
  dietaryRestrictions: z.string().optional().describe('Any dietary restrictions'),
});

export const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  servings: z.number(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  tips: z.array(z.string()).optional(),
});

// Định nghĩa một flow mẫu
export const recipeGeneratorFlow = ai.defineFlow(
  {
    name: 'recipeGeneratorFlow',
    inputSchema: RecipeInputSchema,
    outputSchema: RecipeSchema,
  },
  async (input) => {
    const prompt = `Create a recipe with the following requirements:\nMain ingredient: ${input.ingredient}\nDietary restrictions: ${input.dietaryRestrictions || 'none'}`;
    const { output } = await ai.generate({
      prompt,
      output: { schema: RecipeSchema },
    });
    if (!output) throw new Error('Failed to generate recipe');
    return output;
  }
);

/**
 * Hướng dẫn sử dụng Genkit Helper:
 *
 * 1. Import Genkit instance và các flow/schema:
 *    import { ai, recipeGeneratorFlow, RecipeInputSchema, RecipeSchema } from '@/lib/genkit';
 *
 * 2. Gọi flow trực tiếp trong backend:
 *    const result = await recipeGeneratorFlow({ ingredient: 'avocado', dietaryRestrictions: 'vegetarian' });
 *    console.log(result);
 *
 * 3. Tạo flow mới:
 *    const myFlow = ai.defineFlow({ ... }, async (input) => { ... });
 *
 * 4. Chạy Developer UI để test flow:
 *    npm run genkit:ui
 *    // hoặc: genkit start -- npx tsx --watch src/index.ts
 *    // UI mặc định: http://localhost:4000
 *
 * 5. Lưu ý:
 *    - Đảm bảo đã set biến môi trường GEMINI_API_KEY (hoặc key provider khác nếu dùng model khác).
 *    - Không import file này ở phía client, chỉ dùng cho backend/server-side.
 *    - Có thể mở rộng helper này để export thêm flow, schema, model, plugin tuỳ ý.
 */
