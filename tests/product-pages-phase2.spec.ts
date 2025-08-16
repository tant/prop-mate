import { test, expect } from '@playwright/test';

// Mock data cho template
const mockTemplates = [
  {
    id: 'modern-apartment-01',
    name: 'Căn hộ hiện đại',
    description: 'Template cho căn hộ hiện đại, phù hợp gia đình trẻ.',
    thumbnail: '/templates/modern-apartment-01.png', // Đường dẫn public
  },
  {
    id: 'investor-focused-01',
    name: 'Dành cho nhà đầu tư',
    description: 'Template tập trung vào thông số tài chính và tiềm năng sinh lời.',
    thumbnail: '/templates/investor-focused-01.png',
  },
];

// Mock data cho trang sản phẩm được tạo thành công (kết quả từ API)
const mockCreatedProductPage = {
  id: 'test-page-id-123',
  propertyId: 'test-property-id-456',
  templateId: 'modern-apartment-01',
  slug: 'trang-test-mock',
  status: 'draft',
  audience: 'Gia đình trẻ có con nhỏ',
  title: 'Căn hộ lý tưởng cho gia đình trẻ',
  usp: 'Không gian xanh, tiện ích nội khu đẳng cấp',
  content: {
    hero: {
      title: 'Tiêu đề Hero do AI tạo',
      subtitle: 'Mô tả ngắn do AI tạo',
      image: '', // URL ảnh sẽ được gán sau khi upload hoặc chọn
    },
  },
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

// Mock data cho trang sản phẩm chi tiết (cho trang edit)
const mockDetailedProductPage = {
  ...mockCreatedProductPage,
  title: 'Căn hộ lý tưởng cho gia đình trẻ - CHI TIẾT',
  usp: 'Không gian xanh, tiện ích nội khu đẳng cấp - CHI TIẾT',
  content: {
    hero: {
      title: 'Tiêu đề Hero do AI tạo - CHI TIẾT',
      subtitle: 'Mô tả ngắn do AI tạo - CHI TIẾT',
      image: 'https://example.com/hero-image.jpg',
    },
    features: {
      items: ['Tiện ích 1', 'Tiện ích 2', 'Tiện ích 3']
    },
    description: {
      content: 'Mô tả chi tiết do AI tạo.'
    }
  }
};

// Mock data cho danh sách trang sản phẩm của user
const mockUserProductPages = [
  {
    id: 'page-001',
    title: 'Căn hộ view sông',
    property: 'Căn hộ cao cấp The Metropole',
    status: 'published',
    slug: 'can-ho-view-song',
    createdAt: '2024-01-15',
  },
  {
    id: 'page-002',
    title: 'Đầu tư sinh lời',
    property: 'Penthouse Sky Villa',
    status: 'draft',
    slug: 'dau-tu-sinh-loi',
    createdAt: '2024-02-20',
  },
];

// Mock data cho danh sách trang sản phẩm của một property cụ thể
const mockPropertyProductPages = [
  {
    id: 'page-001',
    title: 'Căn hộ view sông',
    status: 'published',
    slug: 'can-ho-view-song',
    createdAt: '2024-01-15',
  },
];

// Mock data cho trang sản phẩm public
const mockPublicProductPage = {
  id: 'page-001',
  userId: 'user123',
  propertyId: 'prop456',
  templateId: 'modern-apartment-01',
  slug: 'can-ho-dep-o-thu-duc',
  status: 'published',
  audience: 'Gia đình trẻ có con nhỏ, tìm kiếm căn hộ hiện đại gần trung tâm...',
  title: 'Căn hộ hiện đại cho gia đình trẻ',
  usp: 'Không gian sống tiện nghi, tiện ích nội khu đẳng cấp',
  content: {
    hero: {
      title: 'Căn hộ hiện đại cho gia đình trẻ',
      subtitle: 'Không gian sống tiện nghi, tiện ích nội khu đẳng cấp',
      image: 'https://placehold.co/1200x600/e2e8f0/64748b?text=Hero+Image',
    },
    features: {
      items: [
        'Hồ bơi tràn bờ',
        'Khu vui chơi trẻ em',
        'Phòng gym hiện đại',
        'Khu vườn trên cao',
      ],
    },
    description: {
      content: 'Căn hộ cao cấp tại vị trí đắc địa, thiết kế hiện đại với không gian mở, đầy đủ tiện nghi. Tiện ích nội khu phong phú, đảm bảo cuộc sống tiện lợi và thoải mái cho mọi thành viên trong gia đình.',
    },
  },
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-20T00:00:00.000Z',
};

test.describe('Phase 2 - Giai đoạn 1: Tạo trang sản phẩm nhanh (Super-Fast Creation)', () => {
  test('Người dùng có thể chọn template, nhập audience và được chuyển đến trang edit sau khi tạo', async ({ page }) => {
    // --- Setup: Mock API trả về danh sách template ---
    await page.route('**/api/trpc/productPage.getTemplates', async route => {
      await route.fulfill({ json: { result: { data: mockTemplates } } });
    });

    // --- Setup: Mock API tạo trang sản phẩm ---
    await page.route('**/api/trpc/productPage.create', async route => {
      // Giả lập phản hồi thành công từ API tạo trang
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          result: {
            data: {
              id: mockCreatedProductPage.id,
              // ... các field khác nếu cần kiểm tra
            }
          }
        }
      });
    });

    // --- Action: Điều hướng trực tiếp đến trang tạo ---
    await page.goto('/property-pages/add');

    // --- Assertion: Kiểm tra trang đã load ---
    await expect(page).toHaveTitle(/Tạo trang sản phẩm/); // Giả định tiêu đề trang
    await expect(page.getByText('Chọn Template & Nhập Audience')).toBeVisible();

    // --- Action: Chọn template ---
    // Giả định mỗi template được hiển thị trong một card có chứa tên template
    const templateCard = page.getByRole('button', { name: mockTemplates[0].name });
    await templateCard.click();

    // --- Assertion: Kiểm tra template đã được chọn (nếu có UI phản hồi) ---
    // Có thể kiểm tra class, border, hoặc text thay đổi để xác nhận chọn
    // await expect(templateCard).toHaveClass(/selected/); // Ví dụ nếu có class 'selected'

    // --- Action: Nhập audience ---
    const audienceInput = page.getByLabel('Audience (càng chi tiết càng tốt)'); // Label thực tế
    await audienceInput.fill(mockCreatedProductPage.audience);

    // --- Action: Click nút tạo ---
    const createButton = page.getByRole('button', { name: 'Tạo nhanh với AI' }); // Tên nút thực tế
    await createButton.click();

    // --- Assertion: Kiểm tra chuyển hướng đến trang edit ---
    // Chờ URL thay đổi. URL dự kiến sẽ là /property-pages/[id]/edit
    await page.waitForURL(`/property-pages/${mockCreatedProductPage.id}/edit`);

    // Kiểm tra URL hiện tại
    await expect(page).toHaveURL(`/property-pages/${mockCreatedProductPage.id}/edit`);

    // --- Assertion (Tùy chọn): Kiểm tra một phần nội dung đã được load ---
    // Có thể kiểm tra title hoặc USP đã được điền (nếu frontend tự động load dữ liệu mới tạo)
    // await expect(page.getByLabel('Tiêu đề')).toHaveValue(mockCreatedProductPage.title);
    // await expect(page.getByLabel('USP')).toHaveValue(mockCreatedProductPage.usp);
  });

  test('Người dùng phải chọn template trước khi có thể nhập audience và tạo', async ({ page }) => {
    // --- Setup: Mock API trả về danh sách template ---
    await page.route('**/api/trpc/productPage.getTemplates', async route => {
      await route.fulfill({ json: { result: { data: mockTemplates } } });
    });

    // --- Action: Điều hướng đến trang tạo từ sidebar ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();
    const createNewButton = page.getByRole('link', { name: 'Tạo Trang Mới' });
    await createNewButton.click();

    // --- Assertion: Kiểm tra audience input và nút tạo bị disable ban đầu ---
    const audienceInput = page.getByLabel('Audience (càng chi tiết càng tốt)');
    const createButton = page.getByRole('button', { name: 'Tạo nhanh với AI' });

    // --- Action & Assertion: Thử tạo mà không chọn template ---
    await audienceInput.fill('Test audience');
    await createButton.click();

    // Kiểm tra URL không thay đổi
    await expect(page).toHaveURL('/property-pages/add'); // URL không đổi

    // --- Action: Chọn template ---
    const templateCard = page.getByRole('button', { name: mockTemplates[0].name });
    await templateCard.click();
  });

  test('Thông báo lỗi được hiển thị nếu API tạo trang trả về lỗi', async ({ page }) => {
    // --- Setup: Mock API trả về danh sách template ---
    await page.route('**/api/trpc/productPage.getTemplates', async route => {
      await route.fulfill({ json: { result: { data: mockTemplates } } });
    });

    // --- Setup: Mock API tạo trang trả về lỗi ---
    await page.route('**/api/trpc/productPage.create', async route => {
      await route.fulfill({
        status: 400, // Bad Request
        contentType: 'application/json',
        json: {
          error: {
            message: 'Dữ liệu đầu vào không hợp lệ', // Message lỗi từ server
          }
        }
      });
    });

    // --- Action: Điều hướng đến trang tạo từ sidebar ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();
    const createNewButton = page.getByRole('link', { name: 'Tạo Trang Mới' });
    await createNewButton.click();

    // --- Action: Chọn template ---
    const templateCard = page.getByRole('button', { name: mockTemplates[0].name });
    await templateCard.click();

    // --- Action: Nhập audience ---
    const audienceInput = page.getByLabel('Audience (càng chi tiết càng tốt)');
    await audienceInput.fill('Test audience');

    // --- Action: Click nút tạo ---
    const createButton = page.getByRole('button', { name: 'Tạo nhanh với AI' });
    await createButton.click();

    // --- Assertion: Kiểm tra thông báo lỗi được hiển thị ---
    await expect(page.getByText('Dữ liệu đầu vào không hợp lệ')).toBeVisible(); // Kiểm tra text lỗi cụ thể

    // --- Assertion: Kiểm tra không chuyển hướng ---
    await expect(page).toHaveURL('/property-pages/add'); // URL không đổi
  });
  
  test('Người dùng có thể quay lại từ trang tạo mới', async ({ page }) => {
    // --- Setup: Mock API trả về danh sách template ---
    await page.route('**/api/trpc/productPage.getTemplates', async route => {
      await route.fulfill({ json: { result: { data: mockTemplates } } });
    });

    // --- Action: Điều hướng đến trang tạo từ sidebar ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();
    const createNewButton = page.getByRole('link', { name: 'Tạo Trang Mới' });
    await createNewButton.click();

    // --- Action: Click nút "Quay lại" ---
    const backButton = page.getByRole('link', { name: 'Quay lại' });
    await backButton.click();

    // --- Assertion: Kiểm tra chuyển hướng đến dashboard ---
    await expect(page).toHaveURL('/property-pages');
  });
});

test.describe('Phase 2 - Giai đoạn 2: Quản lý trang sản phẩm', () => {
  test('Người dùng có thể xem danh sách trang sản phẩm trong dashboard', async ({ page }) => {
    // --- Setup: Mock API trả về danh sách trang sản phẩm của user ---
    await page.route('**/api/trpc/productPage.getByUser', async route => {
      await route.fulfill({ json: { result: { data: mockUserProductPages } } });
    });

    // --- Action: Điều hướng đến dashboard từ sidebar ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();

    // --- Assertion: Kiểm tra tiêu đề trang ---
    await expect(page).toHaveTitle(/Các trang sản phẩm của bạn/);

    // --- Assertion: Kiểm tra danh sách trang sản phẩm được hiển thị ---
    for (const pageItem of mockUserProductPages) {
      await expect(page.getByText(pageItem.title)).toBeVisible();
      await expect(page.getByText(pageItem.property)).toBeVisible();
      const statusText = pageItem.status === 'published' ? 'Đã xuất bản' : pageItem.status === 'draft' ? 'Bản nháp' : 'Không công khai';
      await expect(page.getByText(statusText)).toBeVisible();
    }
  });

  test('Người dùng có thể xem danh sách trang sản phẩm trong tab của trang chi tiết BĐS', async ({ page }) => {
    const propertyId = 'test-property-id-456';
    
    // --- Setup: Mock API trả về danh sách trang sản phẩm của property ---
    await page.route(`**/api/trpc/productPage.getByProperty?input=*propertyId*${propertyId}*`, async route => {
      await route.fulfill({ json: { result: { data: mockPropertyProductPages } } });
    });

    // --- Action: Điều hướng đến trang chi tiết BĐS (giả định có link từ trang danh sách BĐS) ---
    // Để đơn giản, ta sẽ giả lập điều hướng từ trang chủ đến trang chi tiết BĐS
    await page.goto('/');
    // Giả định có một cách để đến trang chi tiết BĐS, ví dụ qua danh sách BĐS
    // Ở đây ta sẽ dùng goto để đến trang chi tiết BĐS, vì test case này tập trung vào tab "Trang sản phẩm"
    // Một test case riêng có thể test việc điều hướng từ danh sách BĐS đến chi tiết BĐS.
    await page.goto(`/properties/${propertyId}`);

    // --- Action: Chuyển sang tab "Trang sản phẩm" ---
    await page.getByRole('tab', { name: 'Trang sản phẩm' }).click();

    // --- Assertion: Kiểm tra danh sách trang sản phẩm được hiển thị ---
    for (const pageItem of mockPropertyProductPages) {
      await expect(page.getByText(pageItem.title)).toBeVisible();
      const statusText = pageItem.status === 'published' ? 'Đã xuất bản' : pageItem.status === 'draft' ? 'Bản nháp' : 'Không công khai';
      await expect(page.getByText(statusText)).toBeVisible();
    }
  });

  test('Người dùng có thể điều hướng từ danh sách trang đến trang chỉnh sửa', async ({ page }) => {
    // --- Setup: Mock API trả về danh sách trang sản phẩm của user ---
    await page.route('**/api/trpc/productPage.getByUser', async route => {
      await route.fulfill({ json: { result: { data: mockUserProductPages } } });
    });

    // --- Action: Điều hướng đến dashboard từ sidebar ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();

    // --- Action: Click nút "Chỉnh sửa" cho trang đầu tiên ---
    const firstPage = mockUserProductPages[0];
    await page.getByRole('link', { name: 'Chỉnh sửa' }).first().click();

    // --- Assertion: Kiểm tra chuyển hướng đến trang edit ---
    await expect(page).toHaveURL(`/property-pages/${firstPage.id}/edit`);
  });

  test('Người dùng có thể điều hướng từ danh sách trang đến trang tạo mới', async ({ page }) => {
    // --- Setup: Mock API trả về danh sách trang sản phẩm của user ---
    await page.route('**/api/trpc/productPage.getByUser', async route => {
      await route.fulfill({ json: { result: { data: mockUserProductPages } } });
    });

    // --- Action: Điều hướng đến dashboard từ sidebar ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();

    // --- Action: Click nút "Tạo Trang Mới" ---
    await page.getByRole('link', { name: 'Tạo Trang Mới' }).click();

    // --- Assertion: Kiểm tra chuyển hướng đến trang tạo ---
    await expect(page).toHaveURL('/property-pages/add');
  });
});

test.describe('Phase 2 - Giai đoạn 2: Chỉnh sửa trang sản phẩm', () => {
  test('Người dùng có thể xem nội dung trang trong trang chỉnh sửa', async ({ page }) => {
    const pageId = mockDetailedProductPage.id;
    
    // --- Setup: Mock API trả về thông tin chi tiết trang sản phẩm ---
    await page.route(`**/api/trpc/productPage.getById?input=*id*${pageId}*`, async route => {
      await route.fulfill({ json: { result: { data: mockDetailedProductPage } } });
    });

    // --- Action: Điều hướng đến trang edit từ dashboard ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();
    // Giả định trang đầu tiên trong danh sách là trang cần edit
    await page.getByRole('link', { name: 'Chỉnh sửa' }).first().click();

    // --- Assertion: Kiểm tra tiêu đề trang ---
    await expect(page).toHaveTitle(/Chỉnh Sửa Trang Sản Phẩm/);

    // --- Assertion: Kiểm tra các field được điền đúng ---
    await expect(page.getByLabel('Tiêu đề')).toHaveValue(mockDetailedProductPage.title);
    await expect(page.getByLabel('USP')).toHaveValue(mockDetailedProductPage.usp);
    
    // Kiểm tra nội dung section Hero
    await expect(page.getByLabel('Tiêu đề chính')).toHaveValue(mockDetailedProductPage.content.hero.title);
    await expect(page.getByLabel('Mô tả ngắn')).toHaveValue(mockDetailedProductPage.content.hero.subtitle);
    
    // Kiểm tra nội dung section Features
    const featureItems = mockDetailedProductPage.content.features.items;
    for (let i = 0; i < featureItems.length; i++) {
      await expect(page.getByPlaceholder('Nhập danh sách tiện ích').nth(i)).toHaveValue(featureItems[i]);
    }
    
    // Kiểm tra nội dung section Description
    await expect(page.getByLabel('Nội dung mô tả')).toHaveValue(mockDetailedProductPage.content.description.content);
  });

  test('Người dùng có thể cập nhật tiêu đề và USP', async ({ page }) => {
    const pageId = mockDetailedProductPage.id;
    const updatedTitle = 'Tiêu đề mới';
    const updatedUSP = 'USP mới';
    
    // --- Setup: Mock API trả về thông tin chi tiết trang sản phẩm ---
    await page.route(`**/api/trpc/productPage.getById?input=*id*${pageId}*`, async route => {
      await route.fulfill({ json: { result: { data: mockDetailedProductPage } } });
    });
    
    // --- Setup: Mock API cập nhật trang sản phẩm ---
    await page.route('**/api/trpc/productPage.update', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          result: {
            data: {
              success: true
            }
          }
        }
      });
    });

    // --- Action: Điều hướng đến trang edit từ dashboard ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();
    await page.getByRole('link', { name: 'Chỉnh sửa' }).first().click();

    // --- Action: Cập nhật tiêu đề và USP ---
    await page.getByLabel('Tiêu đề').fill(updatedTitle);
    await page.getByLabel('USP').fill(updatedUSP);

    // --- Action: Click nút "Lưu bản nháp" ---
    const saveButton = page.getByRole('button', { name: 'Lưu bản nháp' });
    await saveButton.click();

    // --- Assertion: Kiểm tra toast message thành công ---
    await expect(page.getByText('Trang đã được cập nhật')).toBeVisible();
  });

  test('Người dùng có thể cập nhật nội dung section', async ({ page }) => {
    const pageId = mockDetailedProductPage.id;
    const updatedHeroTitle = 'Tiêu đề Hero mới';
    const updatedFeature = 'Tiện ích mới';
    
    // --- Setup: Mock API trả về thông tin chi tiết trang sản phẩm ---
    await page.route(`**/api/trpc/productPage.getById?input=*id*${pageId}*`, async route => {
      await route.fulfill({ json: { result: { data: mockDetailedProductPage } } });
    });
    
    // --- Setup: Mock API cập nhật trang sản phẩm ---
    await page.route('**/api/trpc/productPage.update', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          result: {
            data: {
              success: true
            }
          }
        }
      });
    });

    // --- Action: Điều hướng đến trang edit từ dashboard ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();
    await page.getByRole('link', { name: 'Chỉnh sửa' }).first().click();

    // --- Action: Cập nhật nội dung section Hero ---
    await page.getByLabel('Tiêu đề chính').fill(updatedHeroTitle);

    // --- Action: Cập nhật nội dung section Features ---
    await page.getByPlaceholder('Nhập danh sách tiện ích').first().fill(updatedFeature);

    // --- Action: Click nút "Lưu bản nháp" ---
    const saveButton = page.getByRole('button', { name: 'Lưu bản nháp' });
    await saveButton.click();

    // --- Assertion: Kiểm tra toast message thành công ---
    await expect(page.getByText('Trang đã được cập nhật')).toBeVisible();
  });

  test('Người dùng có thể Publish trang', async ({ page }) => {
    const pageId = mockDetailedProductPage.id;
    const publishedPage = { ...mockDetailedProductPage, status: 'published' };
    
    // --- Setup: Mock API trả về thông tin chi tiết trang sản phẩm (trạng thái draft) ---
    await page.route(`**/api/trpc/productPage.getById?input=*id*${pageId}*`, async route => {
      await route.fulfill({ json: { result: { data: mockDetailedProductPage } } });
    });
    
    // --- Setup: Mock API cập nhật trang sản phẩm ---
    await page.route('**/api/trpc/productPage.update', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          result: {
            data: {
              success: true
            }
          }
        }
      });
    });
    
    // Mock lại API get sau khi update để trả về trạng thái mới
    let isPublished = false;
    await page.route(`**/api/trpc/productPage.getById?input=*id*${pageId}*`, async route => {
      const data = isPublished ? publishedPage : mockDetailedProductPage;
      await route.fulfill({ json: { result: { data } } });
    });

    // --- Action: Điều hướng đến trang edit từ dashboard ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();
    await page.getByRole('link', { name: 'Chỉnh sửa' }).first().click();

    // --- Action: Click nút "Publish" ---
    const publishButton = page.getByRole('button', { name: 'Publish' });
    await publishButton.click();
    
    // Đánh dấu là đã publish để mock API trả về đúng data
    isPublished = true;

    // --- Assertion: Kiểm tra toast message thành công ---
    await expect(page.getByText('Trang đã được cập nhật')).toBeVisible();
    
    // --- Assertion: Kiểm tra nút chuyển thành "Unpublish" ---
    await expect(page.getByRole('button', { name: 'Unpublish' })).toBeVisible();
    
    // --- Assertion: Kiểm tra badge status ---
    await expect(page.getByText('Đã xuất bản')).toBeVisible();
  });

  test('Người dùng có thể Unpublish trang', async ({ page }) => {
    const pageId = mockDetailedProductPage.id;
    const draftPage = { ...mockDetailedProductPage, status: 'draft' };
    const publishedPage = { ...mockDetailedProductPage, status: 'published' };
    
    // --- Setup: Mock API trả về thông tin chi tiết trang sản phẩm (trạng thái published) ---
    await page.route(`**/api/trpc/productPage.getById?input=*id*${pageId}*`, async route => {
      await route.fulfill({ json: { result: { data: publishedPage } } });
    });
    
    // --- Setup: Mock API cập nhật trang sản phẩm ---
    await page.route('**/api/trpc/productPage.update', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          result: {
            data: {
              success: true
            }
          }
        }
      });
    });
    
    // Mock lại API get sau khi update để trả về trạng thái mới
    let isDraft = false;
    await page.route(`**/api/trpc/productPage.getById?input=*id*${pageId}*`, async route => {
      const data = isDraft ? draftPage : publishedPage;
      await route.fulfill({ json: { result: { data } } });
    });

    // --- Action: Điều hướng đến trang edit từ dashboard ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();
    await page.getByRole('link', { name: 'Chỉnh sửa' }).first().click();

    // --- Action: Click nút "Unpublish" ---
    const unpublishButton = page.getByRole('button', { name: 'Unpublish' });
    await unpublishButton.click();
    
    // Đánh dấu là đã draft để mock API trả về đúng data
    isDraft = true;

    // --- Assertion: Kiểm tra toast message thành công ---
    await expect(page.getByText('Trang đã được cập nhật')).toBeVisible();
    
    // --- Assertion: Kiểm tra nút chuyển thành "Publish" ---
    await expect(page.getByRole('button', { name: 'Publish' })).toBeVisible();
    
    // --- Assertion: Kiểm tra badge status ---
    await expect(page.getByText('Bản nháp')).toBeVisible();
  });

  test('Người dùng có thể Preview trang', async ({ page }) => {
    const pageId = mockDetailedProductPage.id;
    
    // --- Setup: Mock API trả về thông tin chi tiết trang sản phẩm ---
    await page.route(`**/api/trpc/productPage.getById?input=*id*${pageId}*`, async route => {
      await route.fulfill({ json: { result: { data: mockDetailedProductPage } } });
    });

    // --- Action: Điều hướng đến trang edit từ dashboard ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();
    await page.getByRole('link', { name: 'Chỉnh sửa' }).first().click();

    // --- Action: Click nút "Preview" ---
    const previewButton = page.getByRole('link', { name: 'Preview' });
    const previewPagePromise = page.waitForEvent('popup');
    await previewButton.click();
    const previewPage = await previewPagePromise;

    // --- Assertion: Kiểm tra URL của trang preview ---
    await expect(previewPage).toHaveURL(`/products/${mockDetailedProductPage.slug}`);
    
    // --- Assertion: Kiểm tra tiêu đề trang preview ---
    await expect(previewPage).toHaveTitle(mockDetailedProductPage.title);
  });
  
  test('Người dùng có thể Copy link trang', async ({ page }) => {
    const pageId = mockDetailedProductPage.id;
    
    // --- Setup: Mock API trả về thông tin chi tiết trang sản phẩm ---
    await page.route(`**/api/trpc/productPage.getById?input=*id*${pageId}*`, async route => {
      await route.fulfill({ json: { result: { data: mockDetailedProductPage } } });
    });
    
    // Mock clipboard
    await page.addInitScript(() => {
      (navigator as any).clipboard = {
        writeText: (text: string) => {
          (window as any).clipboardData = text;
          return Promise.resolve();
        }
      };
    });

    // --- Action: Điều hướng đến trang edit từ dashboard ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();
    await page.getByRole('link', { name: 'Chỉnh sửa' }).first().click();

    // --- Action: Click nút "Copy link" ---
    const copyLinkButton = page.getByRole('button', { name: 'Copy link' });
    await copyLinkButton.click();

    // --- Assertion: Kiểm tra toast message thành công ---
    await expect(page.getByText('Đã copy link vào clipboard')).toBeVisible();
  });
  
  test('Người dùng có thể quay lại từ trang edit', async ({ page }) => {
    const pageId = mockDetailedProductPage.id;
    
    // --- Setup: Mock API trả về thông tin chi tiết trang sản phẩm ---
    await page.route(`**/api/trpc/productPage.getById?input=*id*${pageId}*`, async route => {
      await route.fulfill({ json: { result: { data: mockDetailedProductPage } } });
    });

    // --- Action: Điều hướng đến trang edit từ dashboard ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();
    await page.getByRole('link', { name: 'Chỉnh sửa' }).first().click();

    // --- Action: Click nút "Quay lại" ---
    const backButton = page.getByRole('link', { name: 'Quay lại' });
    await backButton.click();

    // --- Assertion: Kiểm tra chuyển hướng đến dashboard ---
    await expect(page).toHaveURL('/property-pages');
  });
});

test.describe('Phase 3 - Giai đoạn 3: Trang sản phẩm public', () => {
  test('Trang sản phẩm public được render đúng với nội dung từ template', async ({ page }) => {
    const slug = mockPublicProductPage.slug;

    // --- Action: Điều hướng đến trang public từ trang edit ---
    // Giả định người dùng mở trang public bằng cách click Preview từ trang edit
    // Tuy nhiên, để test độc lập, ta sẽ dùng goto. 
    // Một cách tốt hơn là test điều hướng từ một trang có link (ví dụ trang edit, dashboard)
    // Ở đây ta sẽ test độc lập.
    await page.goto(`/products/${slug}`);

    // --- Assertion: Kiểm tra tiêu đề và USP ---
    await expect(page.getByRole('heading', { name: mockPublicProductPage.title })).toBeVisible();
    await expect(page.getByText(mockPublicProductPage.usp)).toBeVisible();

    // --- Assertion: Kiểm tra nội dung các section ---
    // Hero Section
    await expect(page.getByRole('heading', { name: mockPublicProductPage.content.hero.title! })).toBeVisible();
    await expect(page.getByText(mockPublicProductPage.content.hero.subtitle!)).toBeVisible();
    const heroImage = page.getByRole('img', { name: mockPublicProductPage.content.hero.title });
    await expect(heroImage).toBeVisible();
    await expect(heroImage).toHaveAttribute('src', mockPublicProductPage.content.hero.image);

    // Features Section
    await expect(page.getByRole('heading', { name: 'Tiện ích nổi bật' })).toBeVisible();
    for (const item of mockPublicProductPage.content.features.items) {
      await expect(page.getByText(item)).toBeVisible();
    }

    // Description Section
    await expect(page.getByRole('heading', { name: 'Mô tả chi tiết' })).toBeVisible();
    await expect(page.getByText(mockPublicProductPage.content.description.content)).toBeVisible();
    
    // --- Assertion: Kiểm tra điều hướng trong header ---
    await expect(page.getByRole('link', { name: 'Trang chủ' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Bất động sản' })).toBeVisible();
  });

  test('Trang 404 được hiển thị nếu slug không tồn tại', async ({ page }) => {
    const nonExistentSlug = 'trang-khong-ton-tai';
    await page.goto(`/products/${nonExistentSlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/404/);
  });
  
  test('Trang public không được hiển thị nếu trang ở trạng thái draft', async ({ page }) => {
    const draftSlug = 'trang-draft-khong-ton-tai';
    await page.goto(`/products/${draftSlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/404/);
  });
});

test.describe('Phase 4 - Giai đoạn 4: Xử lý Edge Cases & Hoàn thiện', () => {
  test('Người dùng có thể copy link từ danh sách trang trong dashboard', async ({ page }) => {
    // --- Setup: Mock API trả về danh sách trang sản phẩm của user ---
    await page.route('**/api/trpc/productPage.getByUser', async route => {
      await route.fulfill({ json: { result: { data: mockUserProductPages } } });
    });
    
    // Mock clipboard
    await page.addInitScript(() => {
      (navigator as any).clipboard = {
        writeText: (text: string) => {
          (window as any).clipboardData = text;
          return Promise.resolve();
        }
      };
    });

    // --- Action: Điều hướng đến dashboard từ sidebar ---
    await page.goto('/');
    const sidebarTrigger = page.getByRole('button', { name: 'Open sidebar' });
    await sidebarTrigger.click();
    const productPagesLink = page.getByRole('link', { name: 'Trang sản phẩm' });
    await productPagesLink.click();

    // --- Action: Click nút "Copy link" cho trang đầu tiên ---
    const firstPage = mockUserProductPages[0];
    await page.getByRole('button', { name: 'Copy link' }).first().click();

    // --- Assertion: Kiểm tra toast message thành công ---
    await expect(page.getByText('Đã copy link vào clipboard')).toBeVisible();
  });
  
  test('Người dùng có thể copy link từ danh sách trang trong tab property', async ({ page }) => {
    const propertyId = 'test-property-id-456';
    
    // --- Setup: Mock API trả về danh sách trang sản phẩm của property ---
    await page.route(`**/api/trpc/productPage.getByProperty?input=*propertyId*${propertyId}*`, async route => {
      await route.fulfill({ json: { result: { data: mockPropertyProductPages } } });
    });
    
    // Mock clipboard
    await page.addInitScript(() => {
      (navigator as any).clipboard = {
        writeText: (text: string) => {
          (window as any).clipboardData = text;
          return Promise.resolve();
        }
      };
    });

    // --- Action: Điều hướng đến trang chi tiết BĐS ---
    await page.goto(`/properties/${propertyId}`);

    // --- Action: Chuyển sang tab "Trang sản phẩm" ---
    await page.getByRole('tab', { name: 'Trang sản phẩm' }).click();

    // --- Action: Click nút "Copy link" cho trang đầu tiên ---
    const firstPage = mockPropertyProductPages[0];
    await page.getByRole('button', { name: 'Copy link' }).first().click();

    // --- Assertion: Kiểm tra toast message thành công ---
    await expect(page.getByText('Đã copy link vào clipboard')).toBeVisible();
  });
});

test.describe('Phase 5 - Giai đoạn 5: Xóa trang sản phẩm', () => {
  test('Người dùng có thể xóa trang sản phẩm từ danh sách trong dashboard', async ({ page }) => {
    const pageToDelete = mockUserProductPages[0];
    
    // --- Setup: Mock API trả về danh sách trang sản phẩm của user ---
    await page.route('**/api/trpc/productPage.getByUser', async route => {
      await route.fulfill({ json: { result: { data: mockUserProductPages } } });
    });
    
    // --- Setup: Mock API xóa trang sản phẩm ---
    await page.route('**/api/trpc/productPage.delete', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          result: {
            data: {
              success: true
            }
          }
        }
      });
    });
    
    // Mock dialog confirm để trả về true (người dùng click OK)
    await page.addInitScript(() => {
      window.confirm = () => true;
    });

    // --- Action: Điều hướng trực tiếp đến trang danh sách (/property-pages) ---
    // Giả định sidebar luôn mở hoặc đã mở sẵn trên route này
    await page.goto('/property-pages');

    // --- Action: Click nút "Xóa" cho trang đầu tiên ---
    // Nút "Xóa" có aria-label="Xóa"
    await page.getByLabel('Xóa').first().click();

    // --- Assertion: Kiểm tra toast message thành công ---
    await expect(page.getByText('Trang đã được xóa')).toBeVisible();
    
    // --- Assertion: Kiểm tra trang đã bị xóa khỏi danh sách ---
    // Cần đợi một chút để UI cập nhật sau khi xóa
    // await page.waitForTimeout(500); // Có thể cần nếu UI không reactive hoàn toàn
    await expect(page.getByText(pageToDelete.title)).not.toBeVisible();
  });
  
  test('Người dùng có thể hủy thao tác xóa trang sản phẩm', async ({ page }) => {
    // --- Setup: Mock API trả về danh sách trang sản phẩm của user ---
    await page.route('**/api/trpc/productPage.getByUser', async route => {
      await route.fulfill({ json: { result: { data: mockUserProductPages } } });
    });
    
    // Mock dialog confirm để trả về false (người dùng click Cancel)
    await page.addInitScript(() => {
      window.confirm = () => false;
    });

    // --- Action: Điều hướng trực tiếp đến trang danh sách (/property-pages) ---
    // Giả định sidebar luôn mở hoặc đã mở sẵn trên route này
    await page.goto('/property-pages');

    // --- Action: Click nút "Xóa" cho trang đầu tiên ---
    await page.getByRole('button', { name: 'Xóa' }).first().click();

    // --- Assertion: Kiểm tra trang vẫn còn trong danh sách ---
    const firstPage = mockUserProductPages[0];
    await expect(page.getByText(firstPage.title)).toBeVisible();
    
    // --- Assertion: Kiểm tra không có toast message "xóa thành công" ---
    await expect(page.getByText(/đã được xóa/i)).not.toBeVisible();
  });
});