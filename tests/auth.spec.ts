import 'dotenv/config';
import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { test, expect } from '@playwright/test';
import { testUsers } from './test-data';
import type { Page } from '@playwright/test';

// Khởi tạo firebase-admin nếu chưa có
if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const UI_FEEDBACK_SELECTOR = '.text-destructive.text-sm.text-center';
const UI_UPDATE_TIMEOUT = 800;
const REDIRECT_TIMEOUT = 10000;
const FEEDBACK_TIMEOUT = 5000;

async function cleanupUserByEmail(email: string) {
  const usersRef = admin.firestore().collection('users');
  const snapshot = await usersRef.where('email', '==', email).get();
  if (snapshot.empty) return;
  const doc = snapshot.docs[0];
  const uid = doc.get('uid') || doc.id;
  await usersRef.doc(uid).delete();
  try {
    await admin.auth().deleteUser(uid);
  } catch {}
}

async function getUIFeedback(page: Page) {
  try {
    const feedback = await page.waitForSelector(UI_FEEDBACK_SELECTOR, { timeout: FEEDBACK_TIMEOUT });
    return (await feedback.textContent())?.trim() || '';
  } catch {
    return '';
  }
}

test.describe.serial('Authentication', () => {
  test.describe('Register with valid users', () => {
    const user = testUsers[0];
    test(`should allow user to register: ${user.email}`, async ({ page }) => {
      await page.goto('/register');
      await expect(page.getByRole('heading', { name: 'Tạo tài khoản mới' })).toBeVisible();
      await page.getByLabel('Email').fill(user.email);
      await page.locator('#password').fill(user.password);
      await page.locator('#confirmPassword').fill(user.password);
      await page.getByLabel('Tên').fill(user.firstName);
      await page.waitForTimeout(500);
      const submitButton = page.getByRole('button', { name: 'Đăng ký' }).first();
      await expect(submitButton).toBeEnabled();
      await submitButton.click();
      await page.waitForTimeout(UI_UPDATE_TIMEOUT);
      const feedbackText = await getUIFeedback(page);
      if (feedbackText) throw new Error(`[UI ERROR] ${feedbackText}`);
      await page.waitForURL('**/dashboard', { timeout: REDIRECT_TIMEOUT });
      expect(page.url()).toContain('/dashboard');
      const usersRef = admin.firestore().collection('users');
      const snapshot = await usersRef.where('email', '==', user.email).get();
      const uid = !snapshot.empty ? (snapshot.docs[0].get('uid') || snapshot.docs[0].id) : null;
      expect(uid, `[FIRESTORE ERROR] Không tìm thấy user với email ${user.email} trong Firestore sau khi đăng ký`).toBeTruthy();
      await cleanupUserByEmail(user.email);
    });
  });
});