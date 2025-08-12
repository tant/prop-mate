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
  // Prompt động: luôn yêu cầu có trường title (memorableName) thật đẹp, gợi nhớ, hấp dẫn
  const prompt = `Generate exactly ${count} real estate properties that match the following description: "${description}".\nReturn EXACTLY 1 JSON array with ${count} objects, each object must have all of the following fields (with reasonable, realistic values, no id field needed):\n- title: a beautiful, catchy, memorable name for the property, in Vietnamese, that helps people remember it easily (e.g. \"Nhà phố Hoa Sữa, Góc Xanh Bình Yên\", \"Biệt thự Ánh Dương, Gần Công Viên\", ...).\n- gps: an object with lat and lng, both must be valid coordinates within Ho Chi Minh City (lat between 10.7 and 10.9, lng between 106.6 and 106.85).\n- contactEmail: must be a valid email, looks like a real person's name, do not use fake or random strings.\n- If there are any other email fields (e.g. contactEmail, ownerEmail, agentEmail, ...), all must be valid, real-looking emails, not fake or random.\n...\nIMPORTANT: All data (including title, address, etc.) must be generated in Vietnamese.\nReturn only the JSON array, no explanation.`;
  try {
    const result = await callGemini(prompt, apiKey);
    // eslint-disable-next-line no-console
    // console.log('[SEED] Gemini raw output:', result);
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
    // Hàm lấy lat/lng từ Nominatim

    // Map và cập nhật gps cho từng property
    const properties: Omit<Property, 'id' | 'agentId' | 'createdAt' | 'updatedAt'>[] = [];
    for (const item of arr) {
      const fullAddress = typeof item.address === 'string' ? item.address : '';
      const gps = (typeof item.gps === 'object' && item.gps)
        ? { lat: Number(item.gps.lat) || 0, lng: Number(item.gps.lng) || 0 }
        : { lat: 0, lng: 0 };
      const city = '';
      const district = '';
      const ward = '';
      const street = '';
      properties.push({
        memorableName: typeof item.title === 'string' ? item.title : '',
        propertyType: 'HOUSE',
        listingType: 'sale',
        status: 'AVAILABLE',
        location: {
          city,
          district,
          ward,
          street,
          fullAddress,
          gps,
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
      });
    }
    // Trả về cho client xem trước, chưa lưu
    return NextResponse.json({ preview: properties });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Lưu danh sách property xuống Firestore
  const { properties } = await req.json();
  // console.log('API PUT /api/properties/seed nhận được:', properties);
  if (!Array.isArray(properties) || properties.length === 0) {
    return NextResponse.json({ error: 'Thiếu dữ liệu property.' }, { status: 400 });
  }
  try {
    // Import Firestore adminDb
    const { adminDb } = await import('@/lib/firebase/admin');
    // console.log('Bắt đầu lưu properties:', properties);
    const batch = adminDb.batch();
    properties.forEach((property) => {
      const ref = adminDb.collection('properties').doc();
      const now = new Date();
      batch.set(ref, {
        ...property,
        createdAt: now,
        updatedAt: now,
      });
    });
    await batch.commit();
    // console.log('Đã lưu thành công', properties.length, 'property vào Firestore');
    return NextResponse.json({ success: true, count: properties.length });
  } catch (error) {
    console.error('Lỗi khi lưu property:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
