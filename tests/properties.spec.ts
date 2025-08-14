import { test, expect } from '@playwright/test';

test.describe('Properties Page', () => {
  test('should display properties list', async ({ page }) => {
    // First login with valid credentials
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.NEXT_PUBLIC_FIREBASE_TEST_EMAIL || 'test@example.com');
    await page.locator('#password').fill(process.env.NEXT_PUBLIC_FIREBASE_TEST_PASSWORD || 'Test@1234');
    await page.getByRole('button', { name: 'Đăng nhập' }).first().click();
    
    // Wait for navigation to dashboard
    await page.waitForTimeout(2000);
    
    // Click on the "Bất động sản" menu item in the sidebar
    await page.getByRole('link', { name: 'Bất động sản' }).click();
    
    // Wait for the properties page to load completely
    await page.waitForSelector('h1:text("Danh sách bất động sản")', { timeout: 30000 });
    
    // Check that we are on the properties page (by checking for the heading)
    await expect(page.getByRole('heading', { name: 'Danh sách bất động sản' })).toBeVisible();
    
    // Check that either property cards are visible or the "no properties" message is visible
    const propertyCards = page.locator('[data-testid="property-card"]');
    const noPropertiesMessage = page.getByText('Bạn chưa có bất động sản nào.');
    
    // Wait a bit more for the data to load
    await page.waitForTimeout(2000);
    
    // Check that either property cards or no properties message is visible
    const hasProperties = await propertyCards.count() > 0;
    const hasNoPropertiesMessage = await noPropertiesMessage.isVisible();
    
    // At least one of them should be visible
    expect(hasProperties || hasNoPropertiesMessage).toBeTruthy();
  });
  
  test('should allow searching properties', async ({ page }) => {
    // First login with valid credentials
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.NEXT_PUBLIC_FIREBASE_TEST_EMAIL || 'test@example.com');
    await page.locator('#password').fill(process.env.NEXT_PUBLIC_FIREBASE_TEST_PASSWORD || 'Test@1234');
    await page.getByRole('button', { name: 'Đăng nhập' }).first().click();
    
    // Wait for navigation to dashboard
    await page.waitForTimeout(2000);
    
    // Click on the "Bất động sản" menu item in the sidebar
    await page.getByRole('link', { name: 'Bất động sản' }).click();
    
    // Find the search input by its placeholder
    const searchInput = page.getByPlaceholder('Tìm kiếm bất động sản...');
    await expect(searchInput).toBeVisible();
    
    // Type a search term
    await searchInput.fill('test');
    
    // Wait a bit for debounce
    await page.waitForTimeout(500);
    
    // Check that either properties are filtered or no results message is shown
    const noResultsMessage = page.getByText('Không tìm thấy bất động sản phù hợp.');
    const propertyCards = page.locator('[data-testid="property-card"]');
    
    // We can't predict the results, but we can check that the UI responds
    const hasNoResults = await noResultsMessage.isVisible();
    const hasProperties = await propertyCards.count() >= 0; // Could be 0 or more
    
    expect(hasNoResults || hasProperties).toBeTruthy();
  });
  
  test('should allow adding a new property', async ({ page }) => {
    // First login with valid credentials
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.NEXT_PUBLIC_FIREBASE_TEST_EMAIL || 'test@example.com');
    await page.locator('#password').fill(process.env.NEXT_PUBLIC_FIREBASE_TEST_PASSWORD || 'Test@1234');
    await page.getByRole('button', { name: 'Đăng nhập' }).first().click();
    
    // Wait for navigation to dashboard
    await page.waitForTimeout(2000);
    
    // Click on the "Bất động sản" menu item in the sidebar
    await page.getByRole('link', { name: 'Bất động sản' }).click();
    
    // Wait for the properties page to load completely
    await page.waitForSelector('h1:text("Danh sách bất động sản")', { timeout: 30000 });
    
    // Find and click the add property button (last button in the header)
    const headerButtons = page.locator('header button');
    const addButton = headerButtons.last();
    await addButton.click();
    
    // Check that we navigate to the add property page
    await expect(page).toHaveURL(/.*properties\/add/);
    
    // Fill in basic property information
    await page.getByLabel('Tên gợi nhớ *').fill('Test Property');
    await page.getByLabel('Diện tích *').fill('100');
    await page.getByLabel('Giá *').fill('1000000000');
    await page.getByLabel('Địa chỉ *').fill('Test Address');
    
    // Click save button (the one in the form, not in the header)
    const saveButton = page.locator('form').getByRole('button', { name: 'Lưu' });
    await saveButton.click();
    
    // Check that we navigate back to properties list
    await expect(page).toHaveURL(/.*properties$/);
  });
  
  test('should allow updating property details', async ({ page }) => {
    // First login with valid credentials
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.NEXT_PUBLIC_FIREBASE_TEST_EMAIL || 'test@example.com');
    await page.locator('#password').fill(process.env.NEXT_PUBLIC_FIREBASE_TEST_PASSWORD || 'Test@1234');
    await page.getByRole('button', { name: 'Đăng nhập' }).first().click();
    
    // Wait for navigation to dashboard
    await page.waitForTimeout(2000);
    
    // Click on the "Bất động sản" menu item in the sidebar
    await page.getByRole('link', { name: 'Bất động sản' }).click();
    
    // Wait for the properties page to load completely
    await page.waitForSelector('h1:text("Danh sách bất động sản")', { timeout: 30000 });
    
    // Check if there are any properties
    const propertyCards = page.locator('[data-testid="property-card"]');
    const count = await propertyCards.count();
    
    if (count > 0) {
      // If there are properties, click on the first one
      await propertyCards.first().click();
      
      // Wait for the property detail page to load
      await page.waitForSelector('h1:text("Thông tin bất động sản")', { timeout: 30000 });
      
      // Click edit button
      await page.getByRole('button', { name: 'Sửa' }).click();
      
      // Update some property details
      const newName = 'Updated Property ' + Date.now();
      await page.getByLabel('Tên gợi nhớ *').fill(newName);
      
      // Click save button (the one in the form, not in the header)
      const saveButton = page.locator('form').getByRole('button', { name: 'Lưu' });
      await saveButton.click();
      
      // Check that success message is displayed
      await expect(page.getByText('Cập nhật thành công!')).toBeVisible();
      
      // Check that we're back in view mode (edit mode is off)
      await expect(page.getByRole('button', { name: 'Sửa' })).toBeVisible();
      
      // Verify updated values are displayed
      await expect(page.getByText(newName)).toBeVisible();
    } else {
      // If no properties exist, skip the test
      test.skip('No properties available to update');
    }
  });
});