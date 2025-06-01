import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { generateSHA256 } from "@/utils/hash";

export async function uploadTaskImageAndSaveSubmission({
  userId,
  questId,
  taskId,
  file,
  points,
}: {
  userId: string;
  questId: string;
  taskId: string;
  file: File;
  points: number;
}): Promise<string> {
  // Generate unique doc ID (hash)
  const docId = await generateSHA256(`${userId}-${questId}-${taskId}`);

  // Storage path (organized by user/quest/task)
  const storagePath = `taskSubmissions/${userId}/${questId}/${taskId}`;
  const storageRef = ref(storage, storagePath);

  // Upload to Storage
  await uploadBytes(storageRef, file);

  // Get the downloadable URL
  const imageUrl = await getDownloadURL(storageRef);

  // Save to Firestore
  const docRef = doc(db, "taskSubmissions", docId);
  await setDoc(docRef, {
    userId,
    questId,
    taskId,
    imageUrl,
    points,
    status: "pending",
    timestamps: {
      submittedAt: serverTimestamp(),
      approvedAt: null,
      rejectedAt: null,
    },
  });

  return imageUrl;
}
