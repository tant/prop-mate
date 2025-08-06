import admin from "firebase-admin";
import path from "path";

// Đường dẫn tới file service account key (bạn cần thay đổi cho phù hợp)
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.resolve(__dirname, "../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
  });
}

const db = admin.firestore();

async function deleteCollection(collectionPath: string) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();
  const batchSize = snapshot.size;
  if (batchSize === 0) return;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}

async function resetFirestore() {
  const collections = await db.listCollections();
  for (const col of collections) {
    console.log(`Deleting collection: ${col.id}`);
    await deleteCollection(col.id);
  }
  console.log("Firestore reset completed.");
  process.exit(0);
}

resetFirestore().catch((err) => {
  console.error("Error resetting Firestore:", err);
  process.exit(1);
});
