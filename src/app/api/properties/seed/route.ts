import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { callGemini } from '@/lib/gemini';
import type { Property } from '@/types/property';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const { description, count } = await req.json();
  if (!description || typeof count !== 'number' || count < 1) {
    return NextResponse.json({ error: 'Thiếu mô tả hoặc số lượng không hợp lệ.' }, { status: 400 });
  }
  // Prompt động: count=1 trả về object, count>1 trả về mảng
  let prompt = '';
  if (count === 1) {
    prompt = `Hãy tạo ra 1 bất động sản phù hợp mô tả: "${description}".\nTrả về DUY NHẤT 1 object JSON với đầy đủ các trường sau (và giá trị hợp lý, thực tế, không cần trường id):\n- contactEmail: phải là email hợp lệ, có dạng tên thật, không dùng email giả hoặc chuỗi ngẫu nhiên.\n- Nếu có trường nào là email (ví dụ: contactEmail, ownerEmail, agentEmail, ...) đều phải là email hợp lệ, đúng định dạng, không dùng email giả hoặc chuỗi ngẫu nhiên.\n...\nChỉ trả về object JSON, không giải thích gì thêm.`;
  } else {
    prompt = `Hãy tạo ra đúng ${count} bất động sản phù hợp mô tả: "${description}".\nTrả về DUY NHẤT 1 mảng JSON gồm đúng ${count} object, mỗi object có đầy đủ các trường sau (và giá trị hợp lý, thực tế, không cần trường id):\n- contactEmail: phải là email hợp lệ, có dạng tên thật, không dùng email giả hoặc chuỗi ngẫu nhiên.\n- Nếu có trường nào là email (ví dụ: contactEmail, ownerEmail, agentEmail, ...) đều phải là email hợp lệ, đúng định dạng, không dùng email giả hoặc chuỗi ngẫu nhiên.\n...\nChỉ trả về mảng JSON, không giải thích gì thêm.`;
  }
  try {
    const result = await callGemini(prompt, apiKey);
    // Xử lý kết quả trả về từ Gemini
    let cleanResult = result.trim();
    if (cleanResult.startsWith('```json')) {
      cleanResult = cleanResult.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanResult.startsWith('```')) {
      cleanResult = cleanResult.replace(/^```/, '').replace(/```$/, '').trim();
    }
    let rawProperties: unknown;
    try {
      rawProperties = JSON.parse(cleanResult);
    } catch {
      return NextResponse.json({ error: 'Kết quả AI trả về không phải JSON hợp lệ.' }, { status: 500 });
    }
    // Đảm bảo luôn là mảng
    const arr = Array.isArray(rawProperties) ? rawProperties : [rawProperties];
    if (arr.length !== count) {
      return NextResponse.json({ error: `AI trả về ${arr.length} property, không khớp số lượng yêu cầu (${count}).` }, { status: 500 });
    }
    // Map sang schema property chuẩn
    const emailRegex = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]+)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
    const properties: Omit<Property, 'id' | 'agentId' | 'createdAt' | 'updatedAt'>[] = arr.map((item) => ({
      memorableName: typeof item.title === 'string' ? item.title : '',
      propertyType: 'HOUSE',
      listingType: 'sale',
      status: 'AVAILABLE',
      location: {
        city: 'TP.HCM',
        district: 'Quận 3',
        ward: '',
        street: '',
        fullAddress: typeof item.address === 'string' ? item.address : '',
        gps: { lat: 0, lng: 0 },
      },
      area: typeof item.area === 'number' ? item.area : 0,
      frontage: 0,
      direction: '',
      floor: 0,
      bedrooms: typeof item.bedroom === 'number' ? item.bedroom : 0,
      bathrooms: typeof item.bathroom === 'number' ? item.bathroom : 0,
      interiorStatus: 'FURNISHED',
      amenities: [],
      totalFloors: 0,
      unitsPerFloor: 0,
      handoverDate: undefined,
      currentStatus: 'VACANT',
      price: { value: typeof item.price === 'number' ? item.price : 0, pricePerSqm: typeof item.price_per_sqm === 'number' ? item.price_per_sqm : 0 },
      commission: {},
      serviceFee: 0,
      legalStatus: 'PINK_BOOK',
      legalNote: typeof item.legal === 'string' ? item.legal : '',
      documents: [],
      imageUrls: [],
      images360: '',
      videoUrl: '',
      contactName: typeof item.contact_name === 'string' ? item.contact_name : '',
      contactPhone: typeof item.contact_phone === 'string' ? item.contact_phone : '',
      // contactEmail không truyền nữa
      contactRole: undefined,
      ownershipType: undefined,
      notes: [],
      postedAt: undefined,
      expiredAt: undefined,
      listingDuration: undefined,
      // createdAt, updatedAt, agentId, id sẽ được thêm khi lưu
    }));
    // Trả về cho client xem trước, chưa lưu
    return NextResponse.json({ preview: properties });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Lưu danh sách property xuống Firestore
  const { properties } = await req.json();
  console.log('API PUT /api/properties/seed nhận được:', properties);
  if (!Array.isArray(properties) || properties.length === 0) {
    return NextResponse.json({ error: 'Thiếu dữ liệu property.' }, { status: 400 });
  }
  try {
    // Import Firestore adminDb
    const { adminDb } = await import('@/lib/firebase/admin');
    console.log('Bắt đầu lưu properties:', properties);
    const batch = adminDb.batch();
    properties.forEach((property) => {
      const ref = adminDb.collection('properties').doc();
      const now = new Date();
      batch.set(ref, {
        ...property,
        createdAt: now,
        updatedAt: now,
        agentId: 'seed-script', // hoặc lấy từ auth nếu cần
      });
    });
    await batch.commit();
    console.log('Đã lưu thành công', properties.length, 'property vào Firestore');
    return NextResponse.json({ success: true, count: properties.length });
  } catch (error) {
    console.error('Lỗi khi lưu property:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
