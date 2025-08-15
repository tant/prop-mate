import { z } from 'zod';
import { getProductPageTemplateById } from '@/constants/product-templates';
import { callGeminiStructured } from '@/lib/gemini';
// Truy cập trực tiếp process.env thay vì import từ '@/env'

// --- Schema tạm thời cho content ---
// Trong tương lai, có thể tạo schema này một cách động dựa trên template schema.
// Hiện tại, ta dùng một schema tổng quát để AI có thể trả về bất kỳ cấu trúc nào
// phù hợp với template, và ta sẽ validate nó ở mức độ tối thiểu.
const genericContentSchema = z.record(z.string(), z.any());

// --- Hàm tạo prompt ---
function buildPrompts(templateId: string, audience: string) {
  const template = getProductPageTemplateById(templateId);
  if (!template) {
    throw new Error(`Template với ID '${templateId}' không tồn tại.`);
  }

  // 1. Xây dựng System Prompt
  const systemPrompt = `
    Bạn là một chuyên gia marketing bất động sản AI. Nhiệm vụ của bạn là tạo nội dung hấp dẫn cho một trang sản phẩm dựa trên template được cung cấp và đối tượng khách hàng mục tiêu.

    Template ID: ${template.id}
    Template Name: ${template.name}
    Template Description: ${template.description}

    Template Sections and Fields:
    ${JSON.stringify(template.sections, null, 2)}

    Hãy tạo nội dung cho từng section và field như mô tả trong template. Nội dung phải hấp dẫn, phù hợp với đối tượng khách hàng "${audience}".
    
    Yêu cầu quan trọng:
    - Trả về kết quả dưới dạng một object JSON hợp lệ.
    - Object JSON phải có các key tương ứng với 'id' của các section.
    - Mỗi section object phải chứa các key tương ứng với 'key' của các field trong section đó.
    - Không bao gồm bất kỳ văn bản giải thích hay markdown nào khác. Chỉ trả về JSON.
    Ví dụ về cấu trúc trả về:
    {
      "hero": {
        "title": "Tiêu đề do AI tạo",
        "subtitle": "Mô tả ngắn do AI tạo"
      },
      "features": {
        "items": ["Tiện ích 1", "Tiện ích 2"]
      }
    }
  `;

  // 2. Xây dựng User Prompt
  const userPrompt = `
    Đối tượng khách hàng mục tiêu: ${audience}
    Hãy tạo nội dung cho trang sản phẩm theo template "${template.name}" và đối tượng khách hàng trên. 
    Trả về một object JSON hợp lệ với cấu trúc như đã hướng dẫn trong system prompt.
  `;

  return { systemPrompt, userPrompt };
}

// --- Hàm chính ---
export async function generateProductPageContent(templateId: string, audience: string) {
  const { systemPrompt, userPrompt } = buildPrompts(templateId, audience);

  // 3. Gọi AI service
  // Kiểm tra biến môi trường
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY chưa được cấu hình trong biến môi trường.");
  }

  let contentData: z.infer<typeof genericContentSchema>;
  try {
    contentData = await callGeminiStructured(
      systemPrompt,
      userPrompt,
      apiKey, // Lấy từ process.env
      genericContentSchema
    );
  } catch (error) {
    console.error("Lỗi khi gọi AI để tạo nội dung trang sản phẩm:", error);
    throw new Error(`Không thể tạo nội dung trang sản phẩm: ${error instanceof Error ? error.message : String(error)}`);
  }

  // 4. Xử lý title và usp từ content
  // Giả định: title và usp được lấy từ section 'hero' nếu có
  let title = "Tiêu đề do AI tạo";
  let usp = "USP do AI tạo";

  if (contentData.hero && typeof contentData.hero === 'object') {
    if (contentData.hero.title && typeof contentData.hero.title === 'string') {
      title = contentData.hero.title;
    }
    if (contentData.hero.subtitle && typeof contentData.hero.subtitle === 'string') {
      usp = contentData.hero.subtitle; // Có thể dùng subtitle làm USP tạm thời
    }
  }

  // Nếu không có trong hero, có thể có logic phức tạp hơn để trích xuất từ các section khác
  // hoặc yêu cầu AI trả về title và usp riêng biệt trong một bước gọi khác.

  return {
    title,
    usp,
    content: contentData
  };
}