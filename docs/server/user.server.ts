import { adminDb } from '../../src/lib/firebase/admin';
import type { User } from '../../src/types/user';
import { Timestamp } from 'firebase/firestore';

const usersCollection = adminDb.collection('users');

export const userService = {
  /**
   * Tạo mới user. Nếu đã tồn tại uid sẽ throw Error.
   */
  async createUser(data: User) {
    console.log('[userService.createUser] data:', data);
    const doc = await usersCollection.doc(data.uid).get();
    if (doc.exists) {
      console.log('[userService.createUser] User already exists:', data.uid);
      throw new Error('User already exists');
    }
    await usersCollection.doc(data.uid).set({ ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
    console.log('[userService.createUser] User created:', data.uid);
    return { uid: data.uid };
  },

  /**
   * Lấy thông tin user theo uid. Nếu không tìm thấy sẽ throw Error.
   */
  async getUserById(uid: string): Promise<User> {
    const doc = await usersCollection.doc(uid).get();
    if (!doc.exists) throw new Error('Not found');
    return doc.data() as User;
  },

  /**
   * Cập nhật thông tin user. Trả về user mới sau khi cập nhật.
   */
  async updateUser(uid: string, data: Partial<User>): Promise<User> {
    await usersCollection.doc(uid).update({ ...data, updatedAt: Timestamp.now() });
    const updated = await usersCollection.doc(uid).get();
    return updated.data() as User;
  },

  /**
   * Xóa mềm user (soft delete): chỉ cập nhật deletedAt.
   */
  async softDeleteUser(uid: string) {
    await usersCollection.doc(uid).update({ deletedAt: Timestamp.now(), updatedAt: Timestamp.now() });
  },

  /**
   * Lấy danh sách user (có thể bổ sung filter/pagination nếu cần).
   */
  async listUsers(): Promise<User[]> {
    const snap = await usersCollection.get();
    return snap.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => doc.data() as User);
  },

  // Có thể bổ sung các hàm như: restoreUser, addDeviceToken, removeDeviceToken, ...
};
