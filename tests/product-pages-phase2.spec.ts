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

    // --- Action: Điều hướng đến trang tạo ---
    await page.goto('/property-pages/add');

    // --- Assertion: Kiểm tra trang đã load ---
    await expect(page).toHaveTitle(/Tạo trang sản phẩm/); // Giả định tiêu đề trang
    await expect(page.getByText('Chọn một template')).toBeVisible();

    // --- Action: Chọn template ---
    // Giả định mỗi template được hiển thị trong một card có chứa tên template
    const templateCard = page.getByRole('button', { name: mockTemplates[0].name });
    await templateCard.click();

    // --- Assertion: Kiểm tra template đã được chọn (nếu có UI phản hồi) ---
    // Có thể kiểm tra class, border, hoặc text thay đổi để xác nhận chọn
    // await expect(templateCard).toHaveClass(/selected/); // Ví dụ nếu có class 'selected'

    // --- Action: Nhập audience ---
    const audienceInput = page.getByLabel('Đối tượng khách hàng'); // Giả định có label này
    await audienceInput.fill(mockCreatedProductPage.audience);

    // --- Action: Click nút tạo ---
    const createButton = page.getByRole('button', { name: 'Tạo nhanh với AI' }); // Giả định tên nút
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

    // --- Action: Điều hướng đến trang tạo ---
    await page.goto('/property-pages/add');

    // --- Assertion: Kiểm tra audience input và nút tạo bị disable ban đầu ---
    const audienceInput = page.getByLabel('Đối tượng khách hàng');
    const createButton = page.getByRole('button', { name: 'Tạo nhanh với AI' });

    // Giả định audience input và nút tạo bị disable khi chưa chọn template
    // Nếu không disable, thì có thể kiểm tra bằng cách click thử và đợi lỗi validation
    // Ví dụ đơn giản: kiểm tra audience input không thể fill khi chưa chọn template
    // Tuy nhiên, cách phổ biến hơn là disable các element.
    // Nếu frontend không disable, có thể bỏ qua hoặc test validation message.

    // Ví dụ kiểm tra disable (cần đảm bảo element có attribute disabled)
    // await expect(audienceInput).toBeDisabled();
    // await expect(createButton).toBeDisabled();

    // --- Action & Assertion: Thử tạo mà không chọn template ---
    // Giả sử không disable, thì nhập audience và click tạo
    await audienceInput.fill('Test audience');
    await createButton.click();

    // Kiểm tra có message lỗi không (nếu frontend có validate)
    // await expect(page.getByText('Vui lòng chọn một template')).toBeVisible(); // Ví dụ

    // Hoặc kiểm tra URL không thay đổi
    await expect(page).toHaveURL('/property-pages/add'); // URL không đổi

    // --- Action: Chọn template ---
    const templateCard = page.getByRole('button', { name: mockTemplates[0].name });
    await templateCard.click();

    // --- Assertion: Kiểm tra audience input và nút tạo đã enabled ---
    // await expect(audienceInput).toBeEnabled();
    // await expect(createButton).toBeEnabled();
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
            // ... các field lỗi khác
          }
        }
      });
    });

    // --- Action: Điều hướng đến trang tạo ---
    await page.goto('/property-pages/add');

    // --- Action: Chọn template ---
    const templateCard = page.getByRole('button', { name: mockTemplates[0].name });
    await templateCard.click();

    // --- Action: Nhập audience ---
    const audienceInput = page.getByLabel('Đối tượng khách hàng');
    await audienceInput.fill('Test audience');

    // --- Action: Click nút tạo ---
    const createButton = page.getByRole('button', { name: 'Tạo nhanh với AI' });
    await createButton.click();

    // --- Assertion: Kiểm tra thông báo lỗi được hiển thị ---
    // Giả định có một element hiển thị lỗi, ví dụ: div có role="alert" hoặc class="error-message"
    // await expect(page.getByRole('alert')).toBeVisible(); // Nếu dùng role
    await expect(page.getByText('Dữ liệu đầu vào không hợp lệ')).toBeVisible(); // Kiểm tra text lỗi cụ thể

    // --- Assertion: Kiểm tra không chuyển hướng ---
    await expect(page).toHaveURL('/property-pages/add'); // URL không đổi
  });
});